'use server'

import { headers } from 'next/headers'
import { quoteFormSchema, contactFormSchema } from '@/lib/validation/lead'
import { toFieldErrors, type ActionState } from '@/lib/validation/common'
import { rateLimit, rateLimits } from '@/lib/security/rate-limit'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { hashIp } from '@/lib/security/hash'
import { createLead } from '@/services/lead-service'
import { sendMail } from '@/lib/mail/client'
import { contactNotification } from '@/lib/mail/templates'
import { env } from '@/config/env'
import { MAX_UPLOAD_COUNT } from '@/lib/security/upload'

export type QuoteSuccess = { leadId: string; referenceNo: string }

/** Proxy arkasındaki gerçek istemci IP'si. */
async function getClientIp(): Promise<string | null> {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? null
  return headerList.get('x-real-ip')
}

/**
 * TEKLİF FORMU — SERVER ACTION
 *
 * Akış (master prompt'taki sıra):
 *  1. Client validation (RHF + Zod — bu fonksiyondan önce)
 *  2. Server Action
 *  3. Turnstile doğrulama
 *  4. Rate limit
 *  5. Zod server parse
 *  6. Transaction ile Lead + Attachment
 *  7. Bildirim e-postaları
 *  8. Analytics success event (client tarafında)
 *  9. Success state
 */
export async function submitQuoteAction(
  _prevState: ActionState<QuoteSuccess>,
  formData: FormData,
): Promise<ActionState<QuoteSuccess>> {
  const ip = await getClientIp()
  const headerList = await headers()
  const userAgent = headerList.get('user-agent')

  // --- 3) Bot koruması: honeypot (erken çıkış, kaynak harcamadan)
  const honeypot = formData.get('website')
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    // Bot'a başarı görüntüsü verilir; kayıt oluşturulmaz.
    return {
      status: 'success',
      message: 'Talebiniz alındı.',
      data: { leadId: 'blocked', referenceNo: '--------' },
    }
  }

  // --- 4) Rate limit
  const limit = await rateLimit(`quote:${ip ?? 'unknown'}`, rateLimits.quoteForm)
  if (!limit.success) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60)
    return {
      status: 'error',
      message: `Çok fazla talep gönderildi. Lütfen ${minutes} dakika sonra tekrar deneyin veya bizi telefonla arayın.`,
    }
  }

  // --- 3) Turnstile
  const turnstileToken = formData.get('turnstileToken')
  const turnstile = await verifyTurnstile(
    typeof turnstileToken === 'string' ? turnstileToken : null,
    ip,
  )
  if (!turnstile.success) {
    return { status: 'error', message: turnstile.reason ?? 'Güvenlik doğrulaması başarısız.' }
  }

  // --- 5) Server-side Zod doğrulaması (client doğrulaması güvenlik sınırı değildir)
  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => key !== 'files'),
  )
  const parsed = quoteFormSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Lütfen işaretli alanları kontrol edin.',
      fieldErrors: toFieldErrors(parsed.error),
    }
  }

  // --- 6/7) Kayıt + bildirim
  const files = formData.getAll('files').filter((f): f is File => f instanceof File)

  if (files.length > MAX_UPLOAD_COUNT) {
    return {
      status: 'error',
      message: `En fazla ${MAX_UPLOAD_COUNT} dosya yükleyebilirsiniz.`,
    }
  }

  try {
    const result = await createLead(parsed.data, {
      ipHash: hashIp(ip),
      userAgent,
      files,
    })

    return {
      status: 'success',
      message: 'Talebiniz bize ulaştı.',
      data: { leadId: result.leadId, referenceNo: result.referenceNo },
    }
  } catch (error) {
    console.error('[quote] Talep kaydedilemedi:', error)
    return {
      status: 'error',
      message:
        'Talebiniz kaydedilirken beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin veya bizi telefonla arayın.',
    }
  }
}

/** İletişim sayfası formu — lead oluşturmaz, yalnızca bildirim gönderir. */
export async function submitContactAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ip = await getClientIp()

  const honeypot = formData.get('website')
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { status: 'success', message: 'Mesajınız alındı.' }
  }

  const limit = await rateLimit(`contact:${ip ?? 'unknown'}`, rateLimits.contactForm)
  if (!limit.success) {
    return {
      status: 'error',
      message: 'Çok fazla mesaj gönderildi. Lütfen bir süre sonra tekrar deneyin.',
    }
  }

  const turnstileToken = formData.get('turnstileToken')
  const turnstile = await verifyTurnstile(
    typeof turnstileToken === 'string' ? turnstileToken : null,
    ip,
  )
  if (!turnstile.success) {
    return { status: 'error', message: turnstile.reason ?? 'Güvenlik doğrulaması başarısız.' }
  }

  const parsed = contactFormSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Lütfen işaretli alanları kontrol edin.',
      fieldErrors: toFieldErrors(parsed.error),
    }
  }

  const mail = contactNotification({
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    subject: parsed.data.subject ?? null,
    message: parsed.data.message,
    createdAt: new Date(),
  })

  const recipient = env.MAIL_TO_ADMIN
  if (!recipient) {
    console.error('[contact] MAIL_TO_ADMIN tanımlı değil; mesaj iletilemedi.')
    return {
      status: 'error',
      message: 'Mesaj şu anda iletilemiyor. Lütfen bizi telefonla arayın.',
    }
  }

  const result = await sendMail({
    to: recipient,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: parsed.data.email,
  })

  if (!result.sent) {
    return {
      status: 'error',
      message: 'Mesajınız gönderilemedi. Lütfen tekrar deneyin veya bizi telefonla arayın.',
    }
  }

  return { status: 'success', message: 'Mesajınız bize ulaştı. En kısa sürede dönüş yapacağız.' }
}
