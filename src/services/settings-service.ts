import 'server-only'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { safeQuery } from '@/lib/db/safe'
import { siteConfig, type SocialLink } from '@/config/site'
import { siteImages } from '@/config/images'
import type { SiteSettingsValues } from '@/lib/validation/content'

export const SETTINGS_CACHE_TAG = 'site-settings'
const SETTINGS_KEY = 'general'

export type ResolvedSettings = {
  brandName: string
  tagline: string
  logoLight: string | null
  logoDark: string | null
  favicon: string | null
  phone: string
  whatsapp: string
  email: string
  salesEmail: string
  address: { street: string; district: string; city: string; postalCode: string; country: string }
  mapEmbedUrl: string
  workingHours: string
  social: SocialLink[]
  defaultSeoTitle: string
  defaultMetaDescription: string
  defaultOgImage: string
  analytics: { gaMeasurementId: string; gtmId: string; metaPixelId: string }
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    image: string | null
    videoUrl: string | null
    posterUrl: string | null
  }
  serviceAreas: string[]
  /** Yalnızca gerçek veri girildiyse dolu gelir. Boşsa istatistik bölümü gizlenir. */
  stats: { label: string; value: number; suffix?: string }[]
  /** Adres bloğu / harita gösterilsin mi? */
  hasAddress: boolean
}

/**
 * Panelde boşaltılan alanlar boş string olarak kaydedilebilir. `??` operatörü
 * boş string'i geçerli bir değer saydığı için, görsel/metin alanları burada
 * normalize edilir: boş veya yalnızca boşluk içeren değerler null olur.
 */
function clean(value: string | undefined | null): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

const HERO_DEFAULTS = {
  eyebrow: 'Yeni Nesil Yüksek Yapı Temizliği',
  title: 'Yükseklerde temizlik artık daha güvenli.',
  subtitle:
    'Drone destekli sistemlerle dış cephe, cam ve erişimi zor yüzeylerde hızlı, kontrollü ve profesyonel temizlik çözümleri.',
} as const

function readRaw(): Promise<SiteSettingsValues | null> {
  return safeQuery(
    async () => {
      const row = await prisma.siteSetting.findUnique({ where: { key: SETTINGS_KEY } })
      return (row?.value as SiteSettingsValues | undefined) ?? null
    },
    null,
    'settings:read',
  )
}

/** Ham ayar kaydı — admin formu için (cache'siz). */
export async function getRawSettings(): Promise<SiteSettingsValues> {
  const saved: SiteSettingsValues = (await readRaw()) ?? {}
  return saved
}

const loadSettings = unstable_cache(
  async (): Promise<ResolvedSettings> => {
    const saved: SiteSettingsValues = (await readRaw()) ?? {}

    const social: SocialLink[] = []
    if (saved.linkedin) social.push({ platform: 'linkedin', label: 'LinkedIn', href: saved.linkedin })
    if (saved.instagram) social.push({ platform: 'instagram', label: 'Instagram', href: saved.instagram })
    if (saved.youtube) social.push({ platform: 'youtube', label: 'YouTube', href: saved.youtube })
    if (saved.facebook) social.push({ platform: 'facebook', label: 'Facebook', href: saved.facebook })
    if (saved.x) social.push({ platform: 'x', label: 'X', href: saved.x })

    const address = {
      street: saved.addressStreet ?? siteConfig.contact.address.street,
      district: saved.addressDistrict ?? siteConfig.contact.address.district,
      city: saved.addressCity ?? siteConfig.contact.address.city,
      postalCode: saved.addressPostalCode ?? siteConfig.contact.address.postalCode,
      country: 'TR',
    }

    // İstatistikler: yalnızca girilmiş (undefined olmayan) değerler gösterilir.
    const stats: ResolvedSettings['stats'] = []
    if (saved.statProjects !== undefined)
      stats.push({ label: 'Tamamlanan Proje', value: saved.statProjects })
    if (saved.statSquareMeters !== undefined)
      stats.push({ label: 'Temizlenen Yüzey', value: saved.statSquareMeters, suffix: 'm²' })
    if (saved.statClients !== undefined)
      stats.push({ label: 'Kurumsal Müşteri', value: saved.statClients })
    if (saved.statCities !== undefined) stats.push({ label: 'Hizmet Verilen Şehir', value: saved.statCities })
    if (saved.statOperationHours !== undefined)
      stats.push({ label: 'Operasyon Saati', value: saved.statOperationHours })

    return {
      brandName: saved.brandName || siteConfig.name,
      tagline: saved.tagline || siteConfig.tagline,
      logoLight: clean(saved.logoLight),
      logoDark: clean(saved.logoDark),
      favicon: clean(saved.favicon),
      phone: saved.phone || siteConfig.contact.phone,
      whatsapp: saved.whatsapp || siteConfig.contact.whatsapp,
      email: saved.email || siteConfig.contact.email,
      salesEmail: saved.salesEmail || siteConfig.contact.salesEmail,
      address,
      mapEmbedUrl: clean(saved.mapEmbedUrl) ?? siteConfig.contact.mapEmbedUrl,
      workingHours: saved.workingHours || siteConfig.contact.workingHours,
      social: social.length > 0 ? social : [...siteConfig.social],
      defaultSeoTitle: saved.defaultSeoTitle || siteConfig.name,
      defaultMetaDescription: saved.defaultMetaDescription || siteConfig.description,
      defaultOgImage: saved.defaultOgImage || siteConfig.ogImage,
      analytics: {
        gaMeasurementId: saved.gaMeasurementId ?? '',
        gtmId: saved.gtmId ?? '',
        metaPixelId: saved.metaPixelId ?? '',
      },
      hero: {
        eyebrow: saved.heroEyebrow || HERO_DEFAULTS.eyebrow,
        title: saved.heroTitle || HERO_DEFAULTS.title,
        subtitle: saved.heroSubtitle || HERO_DEFAULTS.subtitle,
        // Panelden görsel yüklenmediyse projedeki varsayılan hero görseli kullanılır.
        image: clean(saved.heroImage) ?? siteImages.hero,
        videoUrl: clean(saved.heroVideoUrl),
        posterUrl: clean(saved.heroPosterUrl),
      },
      serviceAreas: saved.serviceAreas ?? [...siteConfig.serviceAreas],
      stats,
      hasAddress: Boolean(address.street && address.city),
    }
  },
  ['site-settings'],
  { tags: [SETTINGS_CACHE_TAG], revalidate: 300 },
)

export function getSettings(): Promise<ResolvedSettings> {
  return loadSettings()
}

export async function saveSettings(values: SiteSettingsValues): Promise<void> {
  const current = await getRawSettings()
  const merged = { ...current, ...values }

  await prisma.siteSetting.upsert({
    where: { key: SETTINGS_KEY },
    create: { key: SETTINGS_KEY, value: merged },
    update: { value: merged },
  })
}
