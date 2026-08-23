import 'server-only'
import { prisma } from '@/lib/db/prisma'
import { assertDatabase } from '@/lib/db/safe'
import { env } from '@/config/env'
import { sendMail } from '@/lib/mail/client'
import { adminLeadNotification, customerConfirmation } from '@/lib/mail/templates'
import { uploadFile } from '@/lib/storage'
import { validateUpload, MAX_UPLOAD_COUNT } from '@/lib/security/upload'
import { sanitizeMultiline, sanitizeText } from '@/lib/security/sanitize'
import type { QuoteFormParsed } from '@/lib/validation/lead'
import type { DirtLevel, Timeframe } from '@prisma/client'

export type CreateLeadContext = {
  ipHash: string | null
  userAgent: string | null
  files: File[]
}

export type CreateLeadResult = {
  leadId: string
  referenceNo: string
  mailDelivered: boolean
}

/**
 * TEKLİF TALEBİ OLUŞTURMA
 * ---------------------------------------------------------------------------
 * Akış:
 *  1) Lead + ekler tek transaction içinde yazılır.
 *  2) Transaction başarıyla tamamlandıktan SONRA e-posta gönderilir.
 *
 * KRİTİK: E-posta gönderimi transaction'ın İÇİNDE yapılmaz. Mail servisi
 * hata verse veya yavaş olsa dahi lead kaydı kaybolmaz — talep her koşulda
 * veritabanına yazılır (kabul kriteri).
 */
export async function createLead(
  input: QuoteFormParsed,
  context: CreateLeadContext,
): Promise<CreateLeadResult> {
  assertDatabase()

  // Hizmet slug'ını DB kaydına bağla; eşleşme yoksa serbest metin olarak sakla.
  const service = input.serviceSlug
    ? await prisma.service.findUnique({
        where: { slug: input.serviceSlug },
        select: { id: true, title: true },
      })
    : null

  // Dosyalar transaction dışında yüklenir (uzun süren I/O transaction'ı kilitlemez).
  const uploaded = await uploadAttachments(context.files)

  const lead = await prisma.$transaction(async (tx) => {
    const created = await tx.lead.create({
      data: {
        fullName: sanitizeText(input.fullName),
        companyName: input.companyName ? sanitizeText(input.companyName) : null,
        phone: sanitizeText(input.phone),
        email: input.email ?? null,
        city: sanitizeText(input.city),
        serviceId: service?.id ?? null,
        serviceLabel: service?.title ?? (input.serviceSlug === 'diger' ? 'Diğer / Emin değil' : input.serviceSlug),
        buildingType: input.buildingType ? sanitizeText(input.buildingType) : null,
        estimatedArea: input.estimatedArea ?? null,
        estimatedHeight: input.estimatedHeight ?? null,
        floorCount: input.floorCount ?? null,
        surfaceType: input.surfaceType ? sanitizeText(input.surfaceType) : null,
        dirtLevel: input.dirtLevel ? (input.dirtLevel as DirtLevel) : null,
        timeframe: input.timeframe ? (input.timeframe as Timeframe) : null,
        message: input.message ? sanitizeMultiline(input.message) : null,
        kvkkConsent: true,
        kvkkConsentAt: new Date(),
        marketingOptIn: input.marketingOptIn,
        source: 'website',
        utmSource: input.utmSource ?? null,
        utmMedium: input.utmMedium ?? null,
        utmCampaign: input.utmCampaign ?? null,
        utmTerm: input.utmTerm ?? null,
        utmContent: input.utmContent ?? null,
        referrer: input.referrer ?? null,
        landingPage: input.landingPage ?? null,
        ipHash: context.ipHash,
        userAgent: context.userAgent?.slice(0, 500) ?? null,
      },
    })

    if (uploaded.length > 0) {
      await tx.leadAttachment.createMany({
        data: uploaded.map((file) => ({
          leadId: created.id,
          url: file.url,
          filename: file.filename,
          mimeType: file.mimeType,
          size: file.size,
        })),
      })
    }

    return created
  })

  // --- Transaction tamamlandı. Bundan sonrası "best effort".
  const mailDelivered = await notifyLead(lead.id, {
    id: lead.id,
    fullName: lead.fullName,
    companyName: lead.companyName,
    phone: lead.phone,
    email: lead.email,
    city: lead.city,
    serviceLabel: lead.serviceLabel,
    buildingType: lead.buildingType,
    estimatedArea: lead.estimatedArea,
    estimatedHeight: lead.estimatedHeight,
    floorCount: lead.floorCount,
    surfaceType: lead.surfaceType,
    dirtLevel: lead.dirtLevel,
    timeframe: lead.timeframe,
    message: lead.message,
    attachmentCount: uploaded.length,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    referrer: lead.referrer,
    createdAt: lead.createdAt,
  })

  return {
    leadId: lead.id,
    referenceNo: lead.id.slice(0, 8).toUpperCase(),
    mailDelivered,
  }
}

async function uploadAttachments(files: File[]) {
  const valid = files.filter((file) => file.size > 0).slice(0, MAX_UPLOAD_COUNT)
  const results = []

  for (const file of valid) {
    const error = validateUpload(file)
    if (error) {
      console.warn('[lead] Ek dosya reddedildi:', error.message)
      continue
    }

    try {
      results.push(await uploadFile(file, 'lead-ekleri'))
    } catch (uploadError) {
      // Dosya yüklenemezse talep yine de kaydedilir.
      console.error('[lead] Ek dosya yüklenemedi:', uploadError)
    }
  }

  return results
}

async function notifyLead(
  leadId: string,
  data: Parameters<typeof adminLeadNotification>[0],
): Promise<boolean> {
  const adminTo = env.MAIL_TO_ADMIN
  let delivered = true

  if (adminTo) {
    const mail = adminLeadNotification(data)
    const result = await sendMail({
      to: adminTo,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: data.email ?? undefined,
    })
    if (!result.sent) {
      delivered = false
      console.error(`[lead] Yönetici bildirimi gönderilemedi (lead: ${leadId}):`, result.error)
    }
  } else {
    console.warn('[lead] MAIL_TO_ADMIN tanımlı değil; yönetici bildirimi gönderilmedi.')
    delivered = false
  }

  if (data.email) {
    const mail = customerConfirmation({ id: data.id, fullName: data.fullName })
    const result = await sendMail({
      to: data.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    })
    if (!result.sent) {
      console.error(`[lead] Müşteri onay maili gönderilemedi (lead: ${leadId}):`, result.error)
    }
  }

  return delivered
}

/** Basit sezgisel spam skoru — otomatik SPAM işaretleme için değil, sıralama için. */
export function calculateSpamScore(input: {
  message?: string
  fullName: string
  filledHoneypot: boolean
}): number {
  let score = 0
  if (input.filledHoneypot) score += 100

  const message = input.message ?? ''
  if (/https?:\/\//i.test(message)) score += 25
  if (/\b(seo|backlink|crypto|casino|loan|bitcoin)\b/i.test(message)) score += 30
  if (message.length > 0 && !/[a-zçğıöşü]/i.test(message)) score += 15
  if (!/\s/.test(input.fullName.trim()) && input.fullName.length < 3) score += 10

  return Math.min(100, score)
}

/** CSV export — Excel'in Türkçe karakterleri doğru okuması için BOM eklenir. */
export function leadsToCsv(
  leads: {
    id: string
    createdAt: Date
    fullName: string
    companyName: string | null
    phone: string
    email: string | null
    city: string
    serviceLabel: string | null
    service: { title: string } | null
    buildingType: string | null
    estimatedArea: number | null
    surfaceType: string | null
    status: string
    assignedUser: { name: string } | null
    message: string | null
  }[],
): string {
  const headers = [
    'Talep No',
    'Tarih',
    'Ad Soyad',
    'Firma',
    'Telefon',
    'E-posta',
    'Şehir',
    'Hizmet',
    'Yapı Türü',
    'Alan (m²)',
    'Yüzey',
    'Durum',
    'Sorumlu',
    'Açıklama',
  ]

  const escape = (value: unknown): string => {
    const str = value === null || value === undefined ? '' : String(value)
    return `"${str.replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`
  }

  const rows = leads.map((lead) =>
    [
      lead.id.slice(0, 8).toUpperCase(),
      lead.createdAt.toISOString(),
      lead.fullName,
      lead.companyName,
      lead.phone,
      lead.email,
      lead.city,
      lead.service?.title ?? lead.serviceLabel,
      lead.buildingType,
      lead.estimatedArea,
      lead.surfaceType,
      lead.status,
      lead.assignedUser?.name,
      lead.message,
    ]
      .map(escape)
      .join(';'),
  )

  return `﻿${headers.map(escape).join(';')}\n${rows.join('\n')}`
}
