import 'server-only'
import {
  listActiveServices,
  getServiceBySlug,
  listAllServiceSlugs,
  serviceOptions,
} from '@/repositories/service-repository'
import {
  listActiveSectors,
  getSectorBySlug,
  listAllSectorSlugs,
} from '@/repositories/sector-repository'
import { listActiveFaqs } from '@/repositories/content-repository'
import { staticServices, staticSectors, staticFaqs } from '@/config/content'
import { serviceImages, sectorImages } from '@/config/images'
import { toItemArray, toStringArray } from '@/lib/utils'

/**
 * İÇERİK SERVİSİ
 * ---------------------------------------------------------------------------
 * Veritabanı doldurulduğunda DB içeriği kullanılır; boşsa statik fallback
 * içerik gösterilir. Böylece site, admin paneli doldurulmadan da tutarlı
 * çalışır ve "boş sayfa" durumu oluşmaz.
 *
 * Bu katman UI'ın tek veri kaynağıdır — sayfalar repository'yi doğrudan
 * çağırmaz.
 */

export type ServiceSummary = {
  id: string
  title: string
  slug: string
  shortDescription: string
  icon: string | null
  heroImage: string | null
  /** Kayıt veritabanından mı geliyor? (admin uyarıları için) */
  fromDatabase: boolean
}

export type ServiceDetail = ServiceSummary & {
  intro: string
  content: string | null
  problems: string[]
  advantages: { title: string; description: string }[]
  surfaces: string[]
  processSteps: { title: string; description: string }[]
  seoTitle: string | null
  metaDescription: string | null
  ogImage: string | null
  faqs: { id: string; question: string; answer: string }[]
  relatedSectors: { title: string; slug: string; icon: string | null }[]
  projects: {
    id: string
    title: string
    slug: string
    city: string
    summary: string
    coverImage: string | null
    surfaceType: string | null
  }[]
  beforeAfterSets: {
    id: string
    title: string
    beforeImage: string
    afterImage: string
    beforeAlt: string | null
    afterAlt: string | null
    city: string | null
    buildingType: string | null
    surfaceType: string | null
  }[]
}

export async function getServices(): Promise<ServiceSummary[]> {
  const dbServices = await listActiveServices()

  if (dbServices.length > 0) {
    return dbServices.map((service) => ({
      id: service.id,
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription,
      icon: service.icon,
      heroImage: service.heroImage ?? serviceImages[service.slug] ?? null,
      fromDatabase: true,
    }))
  }

  return staticServices.map((service) => ({
    id: service.slug,
    title: service.title,
    slug: service.slug,
    shortDescription: service.shortDescription,
    icon: service.icon,
    heroImage: serviceImages[service.slug] ?? null,
    fromDatabase: false,
  }))
}

export async function getServiceDetail(slug: string): Promise<ServiceDetail | null> {
  const dbService = await getServiceBySlug(slug)

  if (dbService) {
    return {
      id: dbService.id,
      title: dbService.title,
      slug: dbService.slug,
      shortDescription: dbService.shortDescription,
      icon: dbService.icon,
      heroImage: dbService.heroImage ?? serviceImages[dbService.slug] ?? null,
      fromDatabase: true,
      intro: dbService.intro ?? dbService.shortDescription,
      content: dbService.content,
      problems: toStringArray(dbService.problems),
      advantages: toItemArray(dbService.advantages),
      surfaces: toStringArray(dbService.surfaces),
      processSteps: toItemArray(dbService.processSteps),
      seoTitle: dbService.seoTitle,
      metaDescription: dbService.metaDescription,
      ogImage: dbService.ogImage,
      faqs: dbService.faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
      relatedSectors: dbService.sectors.map((s) => ({
        title: s.sector.title,
        slug: s.sector.slug,
        icon: s.sector.icon,
      })),
      projects: dbService.projects,
      beforeAfterSets: dbService.beforeAfterSets.map((set) => ({
        id: set.id,
        title: set.title,
        beforeImage: set.beforeImage,
        afterImage: set.afterImage,
        beforeAlt: set.beforeAlt,
        afterAlt: set.afterAlt,
        city: set.city,
        buildingType: set.buildingType,
        surfaceType: set.surfaceType,
      })),
    }
  }

  const fallback = staticServices.find((service) => service.slug === slug)
  if (!fallback) return null

  return {
    id: fallback.slug,
    title: fallback.title,
    slug: fallback.slug,
    shortDescription: fallback.shortDescription,
    icon: fallback.icon,
    heroImage: serviceImages[fallback.slug] ?? null,
    fromDatabase: false,
    intro: fallback.intro,
    content: null,
    problems: [...fallback.problems],
    advantages: fallback.advantages.map((a) => ({ ...a })),
    surfaces: [...fallback.surfaces],
    processSteps: fallback.process.map((p) => ({ ...p })),
    seoTitle: fallback.seoTitle,
    metaDescription: fallback.metaDescription,
    ogImage: null,
    faqs: [],
    relatedSectors: [],
    projects: [],
    beforeAfterSets: [],
  }
}

export async function getServiceSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  const dbSlugs = await listAllServiceSlugs()
  if (dbSlugs.length > 0) return dbSlugs
  return staticServices.map((s) => ({ slug: s.slug, updatedAt: new Date() }))
}

/** Teklif formu hizmet seçeneği listesi. */
export async function getServiceOptions(): Promise<{ value: string; label: string }[]> {
  const dbOptions = await serviceOptions()
  const options =
    dbOptions.length > 0
      ? dbOptions.map((o) => ({ value: o.slug, label: o.title }))
      : staticServices.map((s) => ({ value: s.slug, label: s.title }))

  return [...options, { value: 'diger', label: 'Diğer / Emin değilim' }]
}

// ---------------------------------------------------------------------------
// SEKTÖRLER
// ---------------------------------------------------------------------------

export type SectorSummary = {
  id: string
  title: string
  slug: string
  shortDescription: string
  icon: string | null
  heroImage: string | null
  fromDatabase: boolean
}

export type SectorDetail = SectorSummary & {
  intro: string
  content: string | null
  needs: string[]
  approach: string[]
  seoTitle: string | null
  metaDescription: string | null
  ogImage: string | null
  relatedServices: { title: string; slug: string; icon: string | null; shortDescription: string }[]
  projects: {
    id: string
    title: string
    slug: string
    city: string
    summary: string
    coverImage: string | null
    surfaceType: string | null
  }[]
}

export async function getSectors(): Promise<SectorSummary[]> {
  const dbSectors = await listActiveSectors()

  if (dbSectors.length > 0) {
    return dbSectors.map((sector) => ({
      id: sector.id,
      title: sector.title,
      slug: sector.slug,
      shortDescription: sector.shortDescription,
      icon: sector.icon,
      heroImage: sector.heroImage ?? sectorImages[sector.slug] ?? null,
      fromDatabase: true,
    }))
  }

  return staticSectors.map((sector) => ({
    id: sector.slug,
    title: sector.title,
    slug: sector.slug,
    shortDescription: sector.shortDescription,
    icon: sector.icon,
    heroImage: sectorImages[sector.slug] ?? null,
    fromDatabase: false,
  }))
}

export async function getSectorDetail(slug: string): Promise<SectorDetail | null> {
  const dbSector = await getSectorBySlug(slug)

  if (dbSector) {
    return {
      id: dbSector.id,
      title: dbSector.title,
      slug: dbSector.slug,
      shortDescription: dbSector.shortDescription,
      icon: dbSector.icon,
      heroImage: dbSector.heroImage ?? sectorImages[dbSector.slug] ?? null,
      fromDatabase: true,
      intro: dbSector.intro ?? dbSector.shortDescription,
      content: dbSector.content,
      needs: toStringArray(dbSector.needs),
      approach: toStringArray(dbSector.approach),
      seoTitle: dbSector.seoTitle,
      metaDescription: dbSector.metaDescription,
      ogImage: dbSector.ogImage,
      relatedServices: dbSector.services.map((s) => ({
        title: s.service.title,
        slug: s.service.slug,
        icon: s.service.icon,
        shortDescription: s.service.shortDescription,
      })),
      projects: dbSector.projects,
    }
  }

  const fallback = staticSectors.find((sector) => sector.slug === slug)
  if (!fallback) return null

  return {
    id: fallback.slug,
    title: fallback.title,
    slug: fallback.slug,
    shortDescription: fallback.shortDescription,
    icon: fallback.icon,
    heroImage: sectorImages[fallback.slug] ?? null,
    fromDatabase: false,
    intro: fallback.intro,
    content: null,
    needs: [...fallback.needs],
    approach: [...fallback.approach],
    seoTitle: fallback.seoTitle,
    metaDescription: fallback.metaDescription,
    ogImage: null,
    relatedServices: staticServices.slice(0, 3).map((s) => ({
      title: s.title,
      slug: s.slug,
      icon: s.icon,
      shortDescription: s.shortDescription,
    })),
    projects: [],
  }
}

export async function getSectorSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  const dbSlugs = await listAllSectorSlugs()
  if (dbSlugs.length > 0) return dbSlugs
  return staticSectors.map((s) => ({ slug: s.slug, updatedAt: new Date() }))
}

// ---------------------------------------------------------------------------
// SSS
// ---------------------------------------------------------------------------

export type FaqItem = { id: string; question: string; answer: string }

export async function getGeneralFaqs(limit?: number): Promise<FaqItem[]> {
  const dbFaqs = await listActiveFaqs({ serviceId: null, limit })
  if (dbFaqs.length > 0) return dbFaqs

  const items = staticFaqs.map((faq, index) => ({
    id: `static-${index}`,
    question: faq.question,
    answer: faq.answer,
  }))

  return limit ? items.slice(0, limit) : items
}
