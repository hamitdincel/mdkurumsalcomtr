import { siteConfig, absoluteUrl, hasAddress } from '@/config/site'
import { siteImages } from '@/config/images'

/**
 * JSON-LD üretimi.
 *
 * KURAL: Schema içinde uydurma veri bulunmaz.
 *  - aggregateRating / review ASLA üretilmez (gerçek, doğrulanabilir veri yoksa).
 *  - adres, telefon, kuruluş yılı yalnızca site config'te doldurulmuşsa eklenir.
 *  - LocalBusiness yerine yalnızca gerçek fiziksel adres varsa LocalBusiness,
 *    yoksa Organization kullanılır.
 */

type JsonLdObject = Record<string, unknown>

/**
 * `areaServed` üretir.
 * Şehir listesi doluysa o kullanılır (dar kapsam); boşsa ülke geneli yazılır.
 * İkisi de yoksa alan hiç eklenmez — boş bir areaServed yanlış sinyal verir.
 */
function areaServed(): JsonLdObject[] | JsonLdObject | undefined {
  if (siteConfig.serviceAreas.length > 0) {
    return siteConfig.serviceAreas.map((city) => ({ '@type': 'City', name: city }))
  }
  if (siteConfig.serviceCountry) {
    return { '@type': 'Country', name: siteConfig.serviceCountry }
  }
  return undefined
}

export function organizationSchema(): JsonLdObject {
  const address = siteConfig.contact.address
  const isLocalBusiness = hasAddress()

  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': isLocalBusiness ? 'LocalBusiness' : 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    image: absoluteUrl(siteConfig.ogImage),
    logo: absoluteUrl(siteImages.logo),
  }

  if (siteConfig.legalName && !siteConfig.legalName.startsWith('TODO')) {
    schema.legalName = siteConfig.legalName
  }

  if (siteConfig.contact.phoneRaw && !siteConfig.contact.phoneRaw.includes('0000000')) {
    schema.telephone = siteConfig.contact.phoneRaw
  }

  if (siteConfig.contact.email && !siteConfig.contact.email.includes('example.com')) {
    schema.email = siteConfig.contact.email
  }

  if (isLocalBusiness) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.district || address.city,
      addressRegion: address.city,
      postalCode: address.postalCode || undefined,
      addressCountry: address.country,
    }
  }

  if (siteConfig.company.foundedYear) {
    schema.foundingDate = siteConfig.company.foundedYear
  }

  if (siteConfig.social.length > 0) {
    schema.sameAs = siteConfig.social.map((s) => s.href)
  }

  const area = areaServed()
  if (area) schema.areaServed = area

  return schema
}

export function websiteSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: 'tr-TR',
    publisher: { '@id': `${siteConfig.url}/#organization` },
  }
}

export function breadcrumbSchema(items: { label: string; href: string }[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: absoluteUrl('/'),
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: absoluteUrl(item.href),
      })),
    ],
  }
}

export function serviceSchema(input: {
  name: string
  description: string
  slug: string
  image?: string | null
}): JsonLdObject {
  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: absoluteUrl(`/hizmetler/${input.slug}`),
    serviceType: input.name,
    provider: { '@id': `${siteConfig.url}/#organization` },
  }

  if (input.image) schema.image = input.image

  const area = areaServed()
  if (area) schema.areaServed = area

  return schema
}

export function faqSchema(items: { question: string; answer: string }[]): JsonLdObject | null {
  if (items.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function articleSchema(input: {
  title: string
  description: string
  slug: string
  image?: string | null
  publishedAt?: Date | string | null
  updatedAt?: Date | string | null
  authorName?: string | null
}): JsonLdObject {
  const url = absoluteUrl(`/blog/${input.slug}`)

  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    publisher: { '@id': `${siteConfig.url}/#organization` },
    inLanguage: 'tr-TR',
  }

  if (input.image) schema.image = input.image
  if (input.publishedAt) schema.datePublished = new Date(input.publishedAt).toISOString()
  if (input.updatedAt) schema.dateModified = new Date(input.updatedAt).toISOString()
  if (input.authorName) schema.author = { '@type': 'Person', name: input.authorName }

  return schema
}

/**
 * Vaka çalışmaları için. Review/Rating içermez — yalnızca yapılan işin tanımı.
 */
export function caseStudySchema(input: {
  title: string
  description: string
  slug: string
  image?: string | null
  city?: string | null
  completionDate?: Date | string | null
}): JsonLdObject {
  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.title,
    description: input.description,
    url: absoluteUrl(`/projeler/${input.slug}`),
    creator: { '@id': `${siteConfig.url}/#organization` },
    inLanguage: 'tr-TR',
  }

  if (input.image) schema.image = input.image
  if (input.city) schema.locationCreated = { '@type': 'Place', name: input.city }
  if (input.completionDate) schema.dateCreated = new Date(input.completionDate).toISOString()

  return schema
}

export function contactPageSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: absoluteUrl('/iletisim'),
    name: `İletişim | ${siteConfig.name}`,
    mainEntity: { '@id': `${siteConfig.url}/#organization` },
  }
}
