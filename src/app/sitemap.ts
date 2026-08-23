import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/config/site'
import { getServiceSlugs, getSectorSlugs } from '@/services/content-service'
import { listAllProjectSlugs } from '@/repositories/project-repository'
import { listAllPostSlugs, listCategories } from '@/repositories/post-repository'

export const revalidate = 3600

/**
 * sitemap.xml
 * - Yalnızca indekslenmesi istenen sayfalar yer alır.
 * - Teşekkür/admin sayfaları hariç tutulur.
 * - Öncelik değerleri dönüşüm ve içerik hiyerarşisine göre belirlenmiştir.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/hizmetler'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/sektorler'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/projeler'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/once-sonra'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl('/blog'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl('/hakkimizda'), lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: absoluteUrl('/sss'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/teklif-al'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/iletisim'), lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: absoluteUrl('/kvkk'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/aydinlatma-metni'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/cerez-politikasi'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/gizlilik-politikasi'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const [services, sectors, projects, posts, categories] = await Promise.all([
    getServiceSlugs(),
    getSectorSlugs(),
    listAllProjectSlugs(),
    listAllPostSlugs(),
    listCategories(),
  ])

  return [
    ...staticRoutes,
    ...services.map((item) => ({
      url: absoluteUrl(`/hizmetler/${item.slug}`),
      lastModified: item.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...sectors.map((item) => ({
      url: absoluteUrl(`/sektorler/${item.slug}`),
      lastModified: item.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...projects.map((item) => ({
      url: absoluteUrl(`/projeler/${item.slug}`),
      lastModified: item.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...posts.map((item) => ({
      url: absoluteUrl(`/blog/${item.slug}`),
      lastModified: item.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...categories
      .filter((category) => category._count.posts > 0)
      .map((category) => ({
        url: absoluteUrl(`/blog?kategori=${category.slug}`),
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.4,
      })),
  ]
}
