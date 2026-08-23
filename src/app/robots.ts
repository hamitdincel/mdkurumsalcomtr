import type { MetadataRoute } from 'next'
import { absoluteUrl, siteConfig } from '@/config/site'

/**
 * robots.txt
 *
 * NOT: Yayın öncesi staging ortamında tüm site kapatılmalıdır. Bu, canonical
 * host dışındaki bir host'ta çalışıldığında otomatik olarak yapılır.
 */
export default function robots(): MetadataRoute.Robots {
  const isProductionHost =
    process.env.NODE_ENV === 'production' && !siteConfig.url.includes('localhost')

  if (!isProductionHost) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/teklif-al/tesekkurler'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteConfig.url,
  }
}
