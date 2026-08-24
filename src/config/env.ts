import { z } from 'zod'

/**
 * Server-side environment değişkenleri.
 * Eksik/yanlış env değerleri uygulamayı sessizce bozmak yerine burada yakalanır.
 * Build sırasında DB/servis bağlantısı zorunlu değildir; runtime'da eksikse ilgili
 * özellik güvenli biçimde devre dışı kalır.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().optional(),

  AUTH_SECRET: z.string().min(16).optional(),
  AUTH_SESSION_MAX_AGE: z.coerce.number().int().positive().default(28800),

  MAIL_DRIVER: z.enum(['resend', 'smtp', 'console']).default('console'),
  MAIL_FROM: z.string().default('Drone Temizlik <no-reply@localhost>'),
  MAIL_TO_ADMIN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().optional(),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  TURNSTILE_SECRET_KEY: z.string().optional(),

  STORAGE_DRIVER: z.enum(['s3', 'local']).default('local'),
  // STORAGE_DRIVER=local: yüklemelerin yazılacağı dizin. public/ ALTINDA
  // OLMAMALI (bkz. src/lib/storage/local.ts). Boşsa <proje>/data/uploads.
  LOCAL_STORAGE_DIR: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default('auto'),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_PUBLIC_BASE_URL: z.string().optional(),

  SEED_ADMIN_EMAIL: z.string().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
  SEED_ADMIN_NAME: z.string().optional(),
})

const parsed = serverSchema.safeParse(process.env)

if (!parsed.success && process.env.NODE_ENV === 'production') {
  console.error('[env] Geçersiz environment yapılandırması:', z.treeifyError(parsed.error))
}

export const env = parsed.success ? parsed.data : serverSchema.parse({})

/** Public (client'a gönderilen) değişkenler — Next.js inline eder, dinamik okuma yapılamaz. */
export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '',
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
} as const

export const isProduction = env.NODE_ENV === 'production'
export const hasDatabase = Boolean(env.DATABASE_URL)
export const hasTurnstile = Boolean(env.TURNSTILE_SECRET_KEY && publicEnv.turnstileSiteKey)
