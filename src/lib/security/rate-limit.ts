import { prisma, databaseConfigured } from '@/lib/db/prisma'
import { hashKey } from './hash'

export type RateLimitResult = {
  success: boolean
  remaining: number
  /** Limit dolduysa kaç saniye sonra tekrar denenebilir */
  retryAfterSeconds: number
}

type RateLimitOptions = {
  /** Pencere içinde izin verilen istek sayısı */
  limit: number
  /** Pencere uzunluğu (saniye) */
  windowSeconds: number
}

/**
 * Basit, veritabanı destekli sabit pencere rate limiter.
 *
 * Neden DB: Tek instance / küçük-orta ölçekli kurumsal site için ek altyapı
 * gerektirmez ve serverless ortamda in-memory sayaçların kaybolması sorununu
 * çözer. Yüksek trafikte Upstash Redis gibi bir limiter'a geçilmelidir
 * (aynı arayüz korunarak).
 *
 * DB yoksa (geliştirme) in-memory fallback kullanılır.
 */
const memoryStore = new Map<string, number[]>()

export async function rateLimit(
  identifier: string,
  { limit, windowSeconds }: RateLimitOptions,
): Promise<RateLimitResult> {
  const key = hashKey(identifier)
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const expiresAt = new Date(now + windowMs)

  if (!databaseConfigured) {
    const hits = (memoryStore.get(key) ?? []).filter((t) => t > now - windowMs)
    if (hits.length >= limit) {
      const oldest = hits[0] ?? now
      return {
        success: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
      }
    }
    hits.push(now)
    memoryStore.set(key, hits)
    return { success: true, remaining: limit - hits.length, retryAfterSeconds: 0 }
  }

  try {
    // Süresi geçmiş kayıtları temizle (fırsatçı temizlik).
    await prisma.rateLimitEntry.deleteMany({ where: { expiresAt: { lt: new Date(now) } } })

    const count = await prisma.rateLimitEntry.count({
      where: { key, expiresAt: { gt: new Date(now) } },
    })

    if (count >= limit) {
      const oldest = await prisma.rateLimitEntry.findFirst({
        where: { key, expiresAt: { gt: new Date(now) } },
        orderBy: { expiresAt: 'asc' },
        select: { expiresAt: true },
      })
      const retryAfterSeconds = oldest
        ? Math.max(1, Math.ceil((oldest.expiresAt.getTime() - now) / 1000))
        : windowSeconds

      return { success: false, remaining: 0, retryAfterSeconds }
    }

    await prisma.rateLimitEntry.create({ data: { key, expiresAt } })
    return { success: true, remaining: limit - count - 1, retryAfterSeconds: 0 }
  } catch (error) {
    // Limiter arızası kullanıcıyı engellememelidir (fail-open),
    // ancak log'lanır.
    console.error('[rate-limit] Sayaç güncellenemedi:', error)
    return { success: true, remaining: limit, retryAfterSeconds: 0 }
  }
}

/**
 * Kayıt EKLEMEDEN mevcut durumu okur.
 * Giriş akışında önce bu kontrol edilir; sayaç yalnızca başarısız denemede
 * artırılır (bkz. recordAttempt). Böylece meşru kullanıcıların başarılı
 * girişleri limiti tüketmez.
 */
export async function peekRateLimit(
  identifier: string,
  { limit, windowSeconds }: RateLimitOptions,
): Promise<RateLimitResult> {
  const key = hashKey(identifier)
  const now = Date.now()
  const windowMs = windowSeconds * 1000

  if (!databaseConfigured) {
    const hits = (memoryStore.get(key) ?? []).filter((t) => t > now - windowMs)
    if (hits.length >= limit) {
      const oldest = hits[0] ?? now
      return {
        success: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
      }
    }
    return { success: true, remaining: limit - hits.length, retryAfterSeconds: 0 }
  }

  try {
    const count = await prisma.rateLimitEntry.count({
      where: { key, expiresAt: { gt: new Date(now) } },
    })

    if (count < limit) {
      return { success: true, remaining: limit - count, retryAfterSeconds: 0 }
    }

    const oldest = await prisma.rateLimitEntry.findFirst({
      where: { key, expiresAt: { gt: new Date(now) } },
      orderBy: { expiresAt: 'asc' },
      select: { expiresAt: true },
    })

    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: oldest
        ? Math.max(1, Math.ceil((oldest.expiresAt.getTime() - now) / 1000))
        : windowSeconds,
    }
  } catch (error) {
    console.error('[rate-limit] Sayaç okunamadı:', error)
    return { success: true, remaining: limit, retryAfterSeconds: 0 }
  }
}

/** Başarısız denemeyi kaydeder (sayacı artırır). */
export async function recordAttempt(
  identifier: string,
  { windowSeconds }: RateLimitOptions,
): Promise<void> {
  const key = hashKey(identifier)
  const expiresAt = new Date(Date.now() + windowSeconds * 1000)

  if (!databaseConfigured) {
    const hits = memoryStore.get(key) ?? []
    hits.push(Date.now())
    memoryStore.set(key, hits)
    return
  }

  await prisma.rateLimitEntry.create({ data: { key, expiresAt } }).catch((error) => {
    console.error('[rate-limit] Deneme kaydedilemedi:', error)
  })
}

/** Başarılı işlemden sonra sayacı sıfırlar. */
export async function resetRateLimit(identifier: string): Promise<void> {
  const key = hashKey(identifier)

  if (!databaseConfigured) {
    memoryStore.delete(key)
    return
  }

  await prisma.rateLimitEntry.deleteMany({ where: { key } }).catch(() => undefined)
}

/** Ön tanımlı limit profilleri. */
export const rateLimits = {
  /** Teklif formu — IP başına */
  quoteForm: { limit: 5, windowSeconds: 60 * 60 },
  /** İletişim formu */
  contactForm: { limit: 8, windowSeconds: 60 * 60 },
  /** Admin giriş denemesi */
  adminLogin: { limit: 8, windowSeconds: 15 * 60 },
  /** Dosya yükleme */
  upload: { limit: 20, windowSeconds: 60 * 60 },
} as const
