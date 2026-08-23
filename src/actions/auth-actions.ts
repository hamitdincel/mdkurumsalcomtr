'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma, databaseConfigured } from '@/lib/db/prisma'
import { verifyPassword, hashPassword, validatePasswordStrength } from '@/lib/auth/password'
import { clearSessionCookie, getSession, setSessionCookie } from '@/lib/auth/session'
import {
  peekRateLimit,
  recordAttempt,
  resetRateLimit,
  rateLimits,
} from '@/lib/security/rate-limit'
import { hashIp } from '@/lib/security/hash'
import { toFieldErrors, type ActionState } from '@/lib/validation/common'

/**
 * Giriş tanımlayıcısı: e-posta VEYA kullanıcı adı.
 *
 * Önce yalnızca e-posta kabul ediliyordu. Kısa bir kullanıcı adıyla ("admin")
 * giriş yapılabilmesi istendiği için gevşetildi. User.email alanı, e-posta
 * gönderimi için değil YALNIZCA oturum açma tanımlayıcısı olarak kullanılır;
 * bu yüzden düz bir kullanıcı adı tutması sorun değildir.
 */
const identifierSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Kullanıcı adı veya e-posta giriniz.')
  .max(160)
  .refine(
    (value) => /^[a-z0-9._-]+$/.test(value) || z.string().email().safeParse(value).success,
    'Geçerli bir kullanıcı adı veya e-posta adresi giriniz.',
  )

const loginSchema = z.object({
  email: identifierSchema,
  password: z.string().min(1, 'Parola zorunludur.'),
  redirectTo: z.string().optional(),
})

async function getClientIp(): Promise<string | null> {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? null
  return headerList.get('x-real-ip')
}

/**
 * ADMIN GİRİŞİ
 *
 * Güvenlik notları:
 *  - IP başına hız sınırı uygulanır (brute-force koruması).
 *  - Kullanıcı bulunamadığında da parola doğrulama maliyeti ödenir; böylece
 *    yanıt süresinden hesap varlığı çıkarımı (user enumeration) zorlaşır.
 *  - Hata mesajı, hangi alanın yanlış olduğunu ele vermez.
 *  - Başarılı/başarısız denemeler audit log'a yazılır.
 */
export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!databaseConfigured) {
    return {
      status: 'error',
      message: 'Veritabanı yapılandırılmamış. Yönetim paneli kullanılamıyor.',
    }
  }

  const ip = await getClientIp()
  const limitKey = `login:${ip ?? 'unknown'}`

  // Sayaç yalnızca BAŞARISIZ denemelerle artar; başarılı girişte sıfırlanır.
  // Bu, brute-force korumasını zayıflatmadan meşru kullanıcının kilitlenmesini
  // önler (OWASP: failed login attempts).
  const limit = await peekRateLimit(limitKey, rateLimits.adminLogin)

  if (!limit.success) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60)
    return {
      status: 'error',
      message: `Çok fazla başarısız deneme. Lütfen ${minutes} dakika sonra tekrar deneyin.`,
    }
  }

  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Lütfen bilgilerinizi kontrol edin.',
      fieldErrors: toFieldErrors(parsed.error),
    }
  }

  const { email, password, redirectTo } = parsed.data

  /*
   * Veritabanına ULAŞILAMAMA durumu, "kimlik bilgisi yanlış" durumundan ayrı
   * ele alınır. `databaseConfigured` yalnızca DATABASE_URL'in tanımlı olup
   * olmadığına bakar; sunucu ayakta değilse bu sorgu yine de hata fırlatır ve
   * eskiden yakalanmadığı için kullanıcı giriş ekranında ham hata sınırını
   * görüyordu.
   *
   * Burada bilinçli olarak "e-posta veya parola hatalı" DENMEZ: yöneticiyi
   * parolasını yanlış hatırladığına inandırmak, gerçek arızayı gizler.
   */
  let user: Awaited<ReturnType<typeof prisma.user.findUnique>>
  try {
    user = await prisma.user.findUnique({ where: { email } })
  } catch (error) {
    console.error('[auth:login] Veritabanına ulaşılamadı:', error)
    return {
      status: 'error',
      message:
        'Veritabanına şu anda ulaşılamıyor. Bağlantı sağlandığında tekrar deneyin.',
    }
  }

  const genericError: ActionState = {
    status: 'error',
    message: 'E-posta veya parola hatalı.',
  }

  if (!user || !user.active) {
    // Zamanlama saldırısına karşı sahte doğrulama maliyeti.
    await verifyPassword(
      '$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHR2YWx1ZQ$0000000000000000000000000000000000000000000',
      password,
    )
    await recordAttempt(limitKey, rateLimits.adminLogin)
    return genericError
  }

  const valid = await verifyPassword(user.passwordHash, password)

  if (!valid) {
    await recordAttempt(limitKey, rateLimits.adminLogin)

    await prisma.auditLog
      .create({
        data: {
          userId: user.id,
          action: 'LOGIN_FAILED',
          entity: 'User',
          entityId: user.id,
          ipHash: hashIp(ip),
        },
      })
      .catch(() => undefined)

    return genericError
  }

  // Başarılı giriş: bu IP'nin başarısız deneme sayacı temizlenir.
  await resetRateLimit(limitKey)

  await setSessionCookie({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  await Promise.all([
    prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
    prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        ipHash: hashIp(ip),
      },
    }),
  ]).catch(() => undefined)

  const target =
    redirectTo && redirectTo.startsWith('/admin') ? redirectTo : '/admin/dashboard'
  redirect(target)
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie()
  redirect('/admin/login')
}

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mevcut parolanızı giriniz.'),
    newPassword: z.string().min(10, 'Yeni parola en az 10 karakter olmalıdır.'),
    confirmPassword: z.string().min(1, 'Parolayı tekrar giriniz.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Parolalar eşleşmiyor.',
    path: ['confirmPassword'],
  })

export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getSession()
  if (!session) return { status: 'error', message: 'Oturum bulunamadı.' }

  const parsed = passwordChangeSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Lütfen alanları kontrol edin.',
      fieldErrors: toFieldErrors(parsed.error),
    }
  }

  const strengthError = validatePasswordStrength(parsed.data.newPassword)
  if (strengthError) {
    return { status: 'error', message: strengthError, fieldErrors: { newPassword: strengthError } }
  }

  const user = await prisma.user.findUnique({ where: { id: session.id } })
  if (!user) return { status: 'error', message: 'Kullanıcı bulunamadı.' }

  const valid = await verifyPassword(user.passwordHash, parsed.data.currentPassword)
  if (!valid) {
    return {
      status: 'error',
      message: 'Mevcut parolanız hatalı.',
      fieldErrors: { currentPassword: 'Mevcut parolanız hatalı.' },
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  })

  return { status: 'success', message: 'Parolanız güncellendi.' }
}
