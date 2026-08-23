import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { FloatingContact } from '@/components/layout/floating-contact'
import { JsonLd } from '@/components/shared/json-ld'
import { getSettings } from '@/services/settings-service'
import { getServices, getSectors } from '@/services/content-service'
import { organizationSchema, websiteSchema } from '@/lib/seo/schema'
import { siteConfig } from '@/config/site'
import { publicEnv } from '@/config/env'

/** Public site kabuğu. Tüm veri sunucuda çözülür; Header yalnızca etkileşim için client. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services, sectors] = await Promise.all([
    getSettings(),
    getServices(),
    getSectors(),
  ])

  const hasAnalytics = Boolean(
    settings.analytics.gaMeasurementId ||
      settings.analytics.gtmId ||
      settings.analytics.metaPixelId ||
      publicEnv.gaMeasurementId ||
      publicEnv.gtmId ||
      publicEnv.metaPixelId,
  )

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd data={[organizationSchema(), websiteSchema()]} />

      <Header
        brandName={settings.brandName}
        logo={settings.logoLight}
        logoDark={settings.logoDark}
        phone={settings.phone}
        sectors={sectors.map((s) => ({ title: s.title, slug: s.slug }))}
      />

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <Footer
        settings={settings}
        services={services.map((s) => ({ title: s.title, slug: s.slug }))}
        hasAnalytics={hasAnalytics}
      />

      <FloatingContact
        phone={settings.phone}
        whatsapp={settings.whatsapp}
        defaultMessage={siteConfig.whatsappDefaultMessage}
      />
    </div>
  )
}
