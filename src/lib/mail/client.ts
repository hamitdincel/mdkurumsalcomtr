import 'server-only'
import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { env } from '@/config/env'

export type MailMessage = {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

export type MailResult = { sent: boolean; error?: string }

let resendClient: Resend | null = null
let smtpTransport: nodemailer.Transporter | null = null

/**
 * E-posta gönderimi.
 *
 * ÖNEMLİ: Bu fonksiyon ASLA throw etmez. Mail gönderimi başarısız olsa dahi
 * lead kaydı kaybolmamalıdır (bkz. src/services/lead-service.ts).
 * Hata durumu çağırana `{ sent: false }` olarak bildirilir ve log'lanır.
 */
export async function sendMail(message: MailMessage): Promise<MailResult> {
  try {
    switch (env.MAIL_DRIVER) {
      case 'resend': {
        if (!env.RESEND_API_KEY) {
          return { sent: false, error: 'RESEND_API_KEY tanımlı değil.' }
        }
        resendClient ??= new Resend(env.RESEND_API_KEY)

        const { error } = await resendClient.emails.send({
          from: env.MAIL_FROM,
          to: Array.isArray(message.to) ? message.to : [message.to],
          subject: message.subject,
          html: message.html,
          text: message.text,
          replyTo: message.replyTo,
        })

        if (error) {
          console.error('[mail] Resend hatası:', error)
          return { sent: false, error: error.message }
        }
        return { sent: true }
      }

      case 'smtp': {
        if (!env.SMTP_HOST) return { sent: false, error: 'SMTP_HOST tanımlı değil.' }

        smtpTransport ??= nodemailer.createTransport({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT ?? 587,
          secure: env.SMTP_SECURE,
          auth:
            env.SMTP_USER && env.SMTP_PASSWORD
              ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
              : undefined,
        })

        await smtpTransport.sendMail({
          from: env.MAIL_FROM,
          to: message.to,
          subject: message.subject,
          html: message.html,
          text: message.text,
          replyTo: message.replyTo,
        })
        return { sent: true }
      }

      case 'console':
      default: {
        console.info(
          `\n[mail:console] → ${Array.isArray(message.to) ? message.to.join(', ') : message.to}\n` +
            `Konu: ${message.subject}\n${message.text}\n`,
        )
        return { sent: true }
      }
    }
  } catch (error) {
    console.error('[mail] Gönderim hatası:', error)
    return { sent: false, error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
  }
}
