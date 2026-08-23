import { z } from 'zod'
import {
  checkboxSchema,
  optionalEmailSchema,
  optionalPositiveInt,
  optionalText,
  phoneSchema,
} from './common'

export const dirtLevelEnum = z.enum(['LIGHT', 'MEDIUM', 'HEAVY', 'UNKNOWN'])
export const timeframeEnum = z.enum(['URGENT', 'WITHIN_MONTH', 'WITHIN_QUARTER', 'PLANNING'])

/**
 * Teklif formu şeması.
 * Client tarafında React Hook Form ile, server tarafında Server Action içinde
 * AYNI şema tekrar çalıştırılır (client doğrulaması güvenlik sınırı değildir).
 */
export const quoteFormSchema = z.object({
  // --- Adım 1: Proje bilgileri
  city: z.string().trim().min(2, 'Şehir zorunludur.').max(60),
  serviceSlug: z.string().trim().min(1, 'Hizmet türü seçiniz.').max(120),
  buildingType: optionalText(80),
  estimatedArea: optionalPositiveInt(2_000_000, 'Yüzey alanı'),
  estimatedHeight: optionalPositiveInt(1000, 'Bina yüksekliği'),
  floorCount: optionalPositiveInt(200, 'Kat sayısı'),
  surfaceType: optionalText(80),
  dirtLevel: z.union([dirtLevelEnum, z.literal('')]).optional(),
  timeframe: z.union([timeframeEnum, z.literal('')]).optional(),

  // --- Adım 2: İletişim
  fullName: z
    .string()
    .trim()
    .min(2, 'Ad soyad zorunludur.')
    .max(120, 'Ad soyad en fazla 120 karakter olabilir.'),
  companyName: optionalText(160),
  phone: phoneSchema,
  email: optionalEmailSchema,

  // --- Adım 3: Not
  message: optionalText(4000),

  // --- Onaylar
  kvkkConsent: checkboxSchema.refine((value) => value === true, {
    message: 'Devam edebilmek için aydınlatma metnini onaylamanız gerekmektedir.',
  }),
  /** Zorunlu DEĞİL ve hizmet talebine bağlanamaz (KVKK gerekliliği). */
  marketingOptIn: checkboxSchema,

  // --- Spam koruması
  /** Honeypot: gerçek kullanıcı bu alanı görmez, dolduran bot demektir. */
  website: z.string().max(0, 'Geçersiz istek.').optional(),
  turnstileToken: z.string().optional(),

  // --- Kaynak takibi (gizli alanlar)
  utmSource: optionalText(120),
  utmMedium: optionalText(120),
  utmCampaign: optionalText(160),
  utmTerm: optionalText(160),
  utmContent: optionalText(160),
  referrer: optionalText(500),
  landingPage: optionalText(500),
})

export type QuoteFormValues = z.input<typeof quoteFormSchema>
export type QuoteFormParsed = z.output<typeof quoteFormSchema>

/** Multi-step formda adım bazlı doğrulama için alan grupları. */
export const quoteFormSteps = [
  {
    id: 'project',
    title: 'Proje Bilgileri',
    description: 'Yapı ve yüzey hakkında bildiklerinizi paylaşın.',
    fields: [
      'city',
      'serviceSlug',
      'buildingType',
      'estimatedArea',
      'estimatedHeight',
      'floorCount',
      'surfaceType',
      'dirtLevel',
      'timeframe',
    ],
  },
  {
    id: 'contact',
    title: 'İletişim',
    description: 'Size nasıl ulaşalım?',
    fields: ['fullName', 'companyName', 'phone', 'email'],
  },
  {
    id: 'details',
    title: 'Fotoğraf ve Not',
    description: 'Varsa görsel ekleyin, eklemek istediklerinizi yazın.',
    fields: ['message', 'kvkkConsent', 'marketingOptIn'],
  },
] as const satisfies ReadonlyArray<{
  id: string
  title: string
  description: string
  fields: readonly (keyof QuoteFormValues)[]
}>

/** İletişim sayfası formu — daha kısa. */
export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Ad soyad zorunludur.').max(120),
  email: z.string().trim().toLowerCase().email('Geçerli bir e-posta adresi giriniz.'),
  phone: optionalText(30),
  subject: optionalText(160),
  message: z
    .string()
    .trim()
    .min(10, 'Mesajınız en az 10 karakter olmalıdır.')
    .max(4000, 'Mesajınız en fazla 4000 karakter olabilir.'),
  kvkkConsent: checkboxSchema.refine((value) => value === true, {
    message: 'Devam edebilmek için aydınlatma metnini onaylamanız gerekmektedir.',
  }),
  website: z.string().max(0, 'Geçersiz istek.').optional(),
  turnstileToken: z.string().optional(),
})

export type ContactFormValues = z.input<typeof contactFormSchema>

/** Admin: lead durumu güncelleme */
export const leadStatusSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum([
    'NEW',
    'CONTACTED',
    'DISCOVERY_SCHEDULED',
    'OFFER_SENT',
    'WON',
    'LOST',
    'SPAM',
  ]),
})

export const leadNoteSchema = z.object({
  leadId: z.string().min(1),
  body: z.string().trim().min(1, 'Not boş olamaz.').max(4000),
})

export const leadAssignSchema = z.object({
  leadId: z.string().min(1),
  userId: z.string().nullable(),
})
