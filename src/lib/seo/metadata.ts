import type { Metadata } from 'next'
import { siteConfig, absoluteUrl } from '@/config/site'
import { publicEnv } from '@/config/env'
import { truncate } from '@/lib/utils'

type BuildMetadataInput = {
  title: string
  description: string
  /** Site köküne göre yol: "/hizmetler/cam-cephe-temizligi" */
  path: string
  ogImage?: string | null
  /** Blog yazıları için */
  type?: 'website' | 'article'
  publishedTime?: Date | string | null
  modifiedTime?: Date | string | null
  authorName?: string | null
  /** Arama sonuçlarında görünmemesi gereken sayfalar (teşekkür, admin vb.) */
  noIndex?: boolean
  /** Admin panelinden girilen canonical override */
  canonicalOverride?: string | null
}

/**
 * Tüm sayfalarda tek noktadan metadata üretimi.
 * Kurallar:
 *  - her sayfa unique title + unique description
 *  - canonical daima mutlak ve tek host üzerinden
 *  - OG/Twitter kartları eksiksiz
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  type = 'website',
  publishedTime,
  modifiedTime,
  authorName,
  noIndex,
  canonicalOverride,
}: BuildMetadataInput): Metadata {
  const canonical = canonicalOverride ?? absoluteUrl(path)
  const image = ogImage ? toAbsolute(ogImage) : absoluteUrl(siteConfig.ogImage)
  const cleanDescription = truncate(description.replace(/\s+/g, ' ').trim(), 158)

  return {
    title,
    description: cleanDescription,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      url: canonical,
      title,
      description: cleanDescription,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(type === 'article'
        ? {
            publishedTime: publishedTime ? new Date(publishedTime).toISOString() : undefined,
            modifiedTime: modifiedTime ? new Date(modifiedTime).toISOString() : undefined,
            authors: authorName ? [authorName] : undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: cleanDescription,
      images: [image],
    },
    ...(publicEnv.googleSiteVerification
      ? { verification: { google: publicEnv.googleSiteVerification } }
      : {}),
  }
}

function toAbsolute(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return absoluteUrl(url)
}

/** Title şablonu: "Sayfa Başlığı | Marka" */
export function pageTitle(title: string): string {
  return `${title} | ${siteConfig.name}`
}
