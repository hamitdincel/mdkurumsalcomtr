import type { Metadata, Viewport } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'
import { siteConfig } from '@/config/site'
import { publicEnv } from '@/config/env'
import { getSettings } from '@/services/settings-service'
import { ConsentProvider } from '@/components/analytics/consent-provider'
import {
  AnalyticsScripts,
  ConsentModeDefaults,
} from '@/components/analytics/analytics-scripts'
import { CookieConsent } from '@/components/analytics/cookie-consent'
import { ThemeScript } from '@/components/theme/theme-script'
import { ThemeSync } from '@/components/theme/theme-sync'
import './globals.css'

/**
 * Fontlar next/font ile self-host edilir:
 *  - üçüncü taraf isteği yok (performans + KVKK)
 *  - latin-ext subset Türkçe karakterleri kapsar
 *  - display: swap ile FOIT önlenir
 */
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

/**
 * Başlık fontu. Manrope'un yerine geçti: Manrope'un yuvarlak, yumuşak
 * karakteri kurumsal B2B tonundan çok tüketici ürünlerine yakın duruyordu.
 * Inter Tight, gövde fontuyla AYNI ailedendir; başlıklarda daha dar harf
 * aralığı ve daha sıkı bir ritim verir, gövdeyle karakter çatışması yaratmaz.
 */
const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter-tight',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  formatDetection: { telephone: true, address: false, email: false },
  ...(publicEnv.googleSiteVerification
    ? { verification: { google: publicEnv.googleSiteVerification } }
    : {}),
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e9edf3' },
    { media: '(prefers-color-scheme: dark)', color: '#0c1014' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  // Analytics ID'leri: admin panelindeki değer önceliklidir, yoksa env.
  const analyticsIds = {
    gaMeasurementId: settings.analytics.gaMeasurementId || publicEnv.gaMeasurementId,
    gtmId: settings.analytics.gtmId || publicEnv.gtmId,
    metaPixelId: settings.analytics.metaPixelId || publicEnv.metaPixelId,
  }

  const hasAnalytics = Boolean(
    analyticsIds.gaMeasurementId || analyticsIds.gtmId || analyticsIds.metaPixelId,
  )

  return (
    <html
      lang="tr"
      // Rota geçişlerinde smooth scroll davranışını Next.js'in yönetmesi için gerekli
      data-scroll-behavior="smooth"
      // Tema script'i ilk boyadan önce data-theme yazar; sunucu HTML'i ile
      // istemci arasındaki bu bilinçli farkı React'in uyarmaması için gerekli.
      suppressHydrationWarning
      className={`${inter.variable} ${interTight.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh antialiased">
        {hasAnalytics && <ConsentModeDefaults />}
        <ConsentProvider>
          {/* Site ↔ panel arası istemci geçişlerinde doğru temayı uygular */}
          <ThemeSync />
          {children}
          {hasAnalytics && <AnalyticsScripts ids={analyticsIds} />}
          {hasAnalytics && <CookieConsent />}
        </ConsentProvider>
      </body>
    </html>
  )
}
