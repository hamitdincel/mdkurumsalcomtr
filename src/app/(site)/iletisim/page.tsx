import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { getSettings } from '@/services/settings-service'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema, contactPageSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section } from '@/components/shared/section'
import { ContactForm } from '@/components/forms/contact-form'
import { TrackedLink } from '@/components/shared/tracked-link'
import { Button } from '@/components/ui/button'
import { publicEnv } from '@/config/env'
import { whatsappUrl } from '@/config/site'
import { toTelHref } from '@/lib/utils'
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon'

export const revalidate = 900

const crumbs = [{ label: 'İletişim', href: '/iletisim' }]

export const metadata: Metadata = buildMetadata({
  title: 'İletişim',
  description:
    'Sorularınız ve talepleriniz için bize ulaşın. Telefon, WhatsApp ve e-posta üzerinden iletişime geçebilirsiniz.',
  path: '/iletisim',
})

export default async function ContactPage() {
  const settings = await getSettings()
  const address = settings.address

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), contactPageSchema()]} />

      <PageHero
        eyebrow="İletişim"
        title="Konuşalım."
        description="Teklif talebi için formu doldurabilir; kısa sorularınız için doğrudan telefon veya WhatsApp'ı tercih edebilirsiniz."
        crumbs={crumbs}
      />

      <Section spacing="md" tone="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* İletişim bilgileri */}
            <div className="flex flex-col gap-8">
              <ul className="flex flex-col gap-4">
                <ContactRow icon={<Phone className="size-5" aria-hidden />} label="Telefon">
                  <TrackedLink
                    href={`tel:${toTelHref(settings.phone)}`}
                    event="phone_click"
                    eventParams={{ location: 'contact_page' }}
                    className="text-ink hover:text-brand-600 text-base font-medium"
                  >
                    {settings.phone}
                  </TrackedLink>
                </ContactRow>

                <ContactRow icon={<WhatsAppIcon className="size-5" />} label="WhatsApp">
                  <TrackedLink
                    href={whatsappUrl(undefined, settings.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    event="whatsapp_click"
                    eventParams={{ location: 'contact_page' }}
                    className="text-ink hover:text-brand-600 text-base font-medium"
                  >
                    Mesaj gönder
                  </TrackedLink>
                </ContactRow>

                <ContactRow icon={<Mail className="size-5" aria-hidden />} label="E-posta">
                  <TrackedLink
                    href={`mailto:${settings.email}`}
                    event="email_click"
                    eventParams={{ location: 'contact_page' }}
                    className="text-ink hover:text-brand-600 text-base font-medium break-all"
                  >
                    {settings.email}
                  </TrackedLink>
                </ContactRow>

                {settings.hasAddress && (
                  <ContactRow icon={<MapPin className="size-5" aria-hidden />} label="Adres">
                    <address className="text-ink text-base leading-relaxed font-medium not-italic">
                      {address.street}
                      <br />
                      {[address.postalCode, address.district, address.city]
                        .filter(Boolean)
                        .join(' ')}
                    </address>
                  </ContactRow>
                )}

                {settings.workingHours && (
                  <ContactRow
                    icon={<Clock className="size-5" aria-hidden />}
                    label="Çalışma Saatleri"
                  >
                    <span className="text-ink text-base font-medium">{settings.workingHours}</span>
                  </ContactRow>
                )}
              </ul>

              {/*
                Hizmet bölgeleri.
                Panelden şehir girilmemişse ülke geneli hizmet veriliyor
                demektir ve tek satırlık bir ifade gösterilir; şehir girilirse
                kapsam daraltılmış sayılır ve liste basılır. Aynı ayrım
                schema.org `areaServed` alanında da yapılır (bkz. schema.ts).
              */}
              {settings.serviceAreas.length === 0 && siteConfig.serviceCountry && (
                <div className="border-line rounded-lg border p-6">
                  <h2 className="text-ink text-sm font-semibold">Hizmet verdiğimiz bölgeler</h2>
                  <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                    {siteConfig.serviceCountry} genelinde hizmet veriyoruz. Yapınızın bulunduğu
                    lokasyon için keşif ve uygulama planını talebiniz sonrasında birlikte
                    belirliyoruz.
                  </p>
                </div>
              )}

              {settings.serviceAreas.length > 0 && (
                <div className="border-line rounded-lg border p-6">
                  <h2 className="text-ink text-sm font-semibold">Hizmet verdiğimiz bölgeler</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {settings.serviceAreas.map((city) => (
                      <li
                        key={city}
                        className="bg-surface-sunken text-ink-muted rounded-xs px-2.5 py-1 text-sm"
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                  <p className="text-ink-subtle mt-4 text-xs leading-relaxed">
                    Listede olmayan bir lokasyon için talebinizi iletebilirsiniz; uygunluk
                    değerlendirilerek dönüş yapılır.
                  </p>
                </div>
              )}

              <div className="border-line bg-surface-raised rounded-lg border p-6">
                <h2 className="text-ink text-base font-semibold">Teklif almak mı istiyorsunuz?</h2>
                <p className="text-ink-muted mt-2 text-sm leading-relaxed">
                  Daha hızlı ve doğru bir teklif için teklif formunu kullanmanızı öneririz.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/teklif-al">Teklif Formuna Git</Link>
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="border-line bg-surface-raised rounded-lg border p-6 md:p-8">
              <h2 className="text-ink text-xl font-semibold">Mesaj gönderin</h2>
              <p className="text-ink-muted mt-2 mb-6 text-sm">
                Formu doldurduğunuzda mesajınız ilgili ekibe iletilir.
              </p>
              <ContactForm turnstileSiteKey={publicEnv.turnstileSiteKey} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Harita — yalnızca gerçek adres ve harita bağlantısı tanımlıysa */}
      {settings.hasAddress && settings.mapEmbedUrl && (
        <Section spacing="none" className="border-line border-t">
          <iframe
            src={settings.mapEmbedUrl}
            title="Ofis konumu haritası"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-96 w-full border-0"
          />
        </Section>
      )}
    </>
  )
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <li className="border-line bg-surface-raised flex items-start gap-4 rounded-md border p-5">
      <span className="bg-brand-50 text-brand-600 flex size-11 shrink-0 items-center justify-center rounded-sm">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-ink-subtle text-xs tracking-wide uppercase">{label}</span>
        {children}
      </div>
    </li>
  )
}
