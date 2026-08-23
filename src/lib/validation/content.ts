import { z } from 'zod'
import { optionalText, slugSchema } from './common'

/** Admin CRUD şemaları. Tüm içerik girdileri server-side burada doğrulanır. */

const seoFields = {
  seoTitle: optionalText(70),
  metaDescription: optionalText(180),
  ogImage: optionalText(500),
}

const itemListSchema = z
  .array(z.object({ title: z.string().trim().min(1).max(160), description: z.string().trim().max(600) }))
  .max(20)
  .optional()

const stringListSchema = z.array(z.string().trim().min(1).max(160)).max(30).optional()

export const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, 'Başlık zorunludur.').max(160),
  slug: slugSchema,
  shortDescription: z
    .string()
    .trim()
    .min(20, 'Kısa açıklama en az 20 karakter olmalıdır.')
    .max(400),
  intro: optionalText(2000),
  content: optionalText(20000),
  heroImage: optionalText(500),
  icon: optionalText(60),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  problems: stringListSchema,
  surfaces: stringListSchema,
  advantages: itemListSchema,
  processSteps: itemListSchema,
  ...seoFields,
})

export const sectorSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, 'Başlık zorunludur.').max(160),
  slug: slugSchema,
  shortDescription: z.string().trim().min(20, 'Kısa açıklama en az 20 karakter olmalıdır.').max(400),
  intro: optionalText(2000),
  content: optionalText(20000),
  heroImage: optionalText(500),
  icon: optionalText(60),
  active: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  needs: stringListSchema,
  approach: stringListSchema,
  serviceIds: z.array(z.string()).max(20).optional(),
  ...seoFields,
})

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, 'Başlık zorunludur.').max(200),
  slug: slugSchema,
  clientName: optionalText(160),
  anonymized: z.boolean().default(false),
  city: z.string().trim().min(2, 'Şehir zorunludur.').max(60),
  serviceId: optionalText(40),
  sectorId: optionalText(40),
  buildingType: optionalText(80),
  surfaceType: optionalText(80),
  area: z.coerce.number().int().min(0).max(2_000_000).optional(),
  height: z.coerce.number().int().min(0).max(1000).optional(),
  duration: optionalText(60),
  summary: z.string().trim().min(20, 'Özet en az 20 karakter olmalıdır.').max(600),
  challenge: optionalText(4000),
  solution: optionalText(4000),
  result: optionalText(4000),
  coverImage: optionalText(500),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  completionDate: z
    .union([z.literal(''), z.coerce.date()])
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  ...seoFields,
})

export const beforeAfterSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, 'Başlık zorunludur.').max(200),
  description: optionalText(600),
  beforeImage: z.string().trim().min(1, 'Öncesi görseli zorunludur.').max(500),
  afterImage: z.string().trim().min(1, 'Sonrası görseli zorunludur.').max(500),
  beforeAlt: optionalText(200),
  afterAlt: optionalText(200),
  buildingType: optionalText(80),
  surfaceType: optionalText(80),
  city: optionalText(60),
  projectId: optionalText(40),
  serviceId: optionalText(40),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
})

export const referenceSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, 'Firma adı zorunludur.').max(160),
  logo: z.string().trim().min(1, 'Logo görseli zorunludur.').max(500),
  website: optionalText(300),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  active: z.boolean().default(true),
})

export const testimonialSchema = z.object({
  id: z.string().optional(),
  personName: z.string().trim().min(2, 'Kişi adı zorunludur.').max(120),
  company: z.string().trim().min(2, 'Firma adı zorunludur.').max(160),
  jobTitle: optionalText(120),
  text: z.string().trim().min(20, 'Yorum en az 20 karakter olmalıdır.').max(1200),
  avatar: optionalText(500),
  logo: optionalText(500),
  projectId: optionalText(40),
  active: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
})

export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().trim().min(5, 'Soru zorunludur.').max(300),
  answer: z.string().trim().min(10, 'Cevap en az 10 karakter olmalıdır.').max(4000),
  serviceId: optionalText(40),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  active: z.boolean().default(true),
})

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(5, 'Başlık zorunludur.').max(200),
  slug: slugSchema,
  excerpt: z.string().trim().min(20, 'Özet en az 20 karakter olmalıdır.').max(400),
  contentHtml: z.string().max(200_000).optional(),
  contentJson: z.unknown().optional(),
  featuredImage: optionalText(500),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  publishedAt: z
    .union([z.literal(''), z.coerce.date()])
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  categoryId: optionalText(40),
  tagNames: z.array(z.string().trim().min(1).max(60)).max(12).optional(),
  canonical: optionalText(500),
  ...seoFields,
})

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, 'Kategori adı zorunludur.').max(120),
  slug: slugSchema,
  description: optionalText(400),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
})

export const redirectSchema = z.object({
  id: z.string().optional(),
  oldPath: z
    .string()
    .trim()
    .min(1, 'Eski yol zorunludur.')
    .max(500)
    .regex(/^\//, 'Yol "/" ile başlamalıdır.'),
  newPath: z.string().trim().min(1, 'Yeni yol zorunludur.').max(500),
  statusCode: z.coerce.number().int().refine((v) => v === 301 || v === 302, {
    message: 'Yalnızca 301 veya 302 kullanılabilir.',
  }),
  active: z.boolean().default(true),
})

/**
 * Site ayarları.
 * NOT: İstatistik alanları opsiyoneldir. Doldurulmadıkları sürece ana sayfadaki
 * "Sayılarla Şirket" bölümü GÖSTERİLMEZ — sahte sayaç üretilmez.
 */
export const siteSettingsSchema = z.object({
  brandName: optionalText(120),
  tagline: optionalText(200),
  logoLight: optionalText(500),
  logoDark: optionalText(500),
  favicon: optionalText(500),
  phone: optionalText(40),
  whatsapp: optionalText(40),
  email: optionalText(160),
  salesEmail: optionalText(160),
  addressStreet: optionalText(200),
  addressDistrict: optionalText(80),
  addressCity: optionalText(80),
  addressPostalCode: optionalText(20),
  mapEmbedUrl: optionalText(1000),
  workingHours: optionalText(200),
  linkedin: optionalText(300),
  instagram: optionalText(300),
  youtube: optionalText(300),
  facebook: optionalText(300),
  x: optionalText(300),
  defaultSeoTitle: optionalText(70),
  defaultMetaDescription: optionalText(180),
  defaultOgImage: optionalText(500),
  gaMeasurementId: optionalText(40),
  gtmId: optionalText(40),
  metaPixelId: optionalText(40),
  heroEyebrow: optionalText(120),
  heroTitle: optionalText(200),
  heroSubtitle: optionalText(400),
  heroImage: optionalText(500),
  heroVideoUrl: optionalText(500),
  heroPosterUrl: optionalText(500),
  serviceAreas: z.array(z.string().trim().min(1).max(60)).max(60).optional(),
  // İstatistikler — yalnızca gerçek veriler
  statProjects: z.coerce.number().int().min(0).max(1_000_000).optional(),
  statSquareMeters: z.coerce.number().int().min(0).max(1_000_000_000).optional(),
  statClients: z.coerce.number().int().min(0).max(1_000_000).optional(),
  statCities: z.coerce.number().int().min(0).max(100).optional(),
  statOperationHours: z.coerce.number().int().min(0).max(10_000_000).optional(),
})

/** Tüm alanlar opsiyonel: ayarlar kısmi olarak kaydedilebilir. */
export type SiteSettingsValues = Partial<z.infer<typeof siteSettingsSchema>>
export type ServiceInput = z.infer<typeof serviceSchema>
export type SectorInput = z.infer<typeof sectorSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type PostInput = z.infer<typeof postSchema>
