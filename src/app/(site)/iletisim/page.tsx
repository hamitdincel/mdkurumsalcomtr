import type { Metadata } from 'next'
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
                    className="text-base font-medium text-ink hover:text-brand-600"
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
                    className="text-base font-medium text-ink hover:text-brand-600"
                  >
                    Mesaj gönder
                  </TrackedLink>
                </ContactRow>

                <ContactRow icon={<Mail className="size-5" aria-hidden />} label="E-posta">
                  <TrackedLink
                    href={`mailto:${settings.email}`}
                    event="email_click"
                    eventParams={{ location: 'contact_page' }}
                    className="text-base font-medium break-all text-ink hover:text-brand-600"
                  >
                    {settings.email}
                  </TrackedLink>
                </ContactRow>

                {settings.hasAddress && (
                  <ContactRow icon={<MapPin className="size-5" aria-hidden />} label="Adres">
                    <address className="text-base leading-relaxed font-medium text-ink not-italic">
                      {address.street}
                      <br />
                      {[address.postalCode, address.district, address.city]
                        .filter(Boolean)
                        .join(' ')}
                    </address>
                  </ContactRow>
                )}

                {settings.workingHours && (
                  <ContactRow icon={<Clock className="size-5" aria-hidden />} label="Çalışma Saatleri">
                    <span className="text-base font-medium text-ink">{settings.workingHours}</span>
                  </ContactRow>
                )}
              </ul>

              {/* Hizmet bölgeleri — yalnızca gerçek operasyon lokasyonları */}
              {settings.serviceAreas.length > 0 && (
                <div className="rounded-lg border border-line p-6">
                  <h2 className="text-sm font-semibold text-ink">Hizmet verdiğimiz bölgeler</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {settings.serviceAreas.map((city) => (
                      <li
                        key={city}
                        className="rounded-xs bg-surface-sunken px-2.5 py-1 text-sm text-ink-muted"
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
                    Listede olmayan bir lokasyon için talebinizi iletebilirsiniz; uygunluk
                    değerlendirilerek dönüş yapılır.
                  </p>
                </div>
              )}

              <div className="rounded-lg border border-line bg-surface-raised p-6">
                <h2 className="text-base font-semibold text-ink">Teklif almak mı istiyorsunuz?</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Daha hızlı ve doğru bir teklif için teklif formunu kullanmanızı öneririz.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/teklif-al">Teklif Formuna Git</Link>
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-lg border border-line bg-surface-raised p-6 md:p-8">
              <h2 className="text-xl font-semibold text-ink">Mesaj gönderin</h2>
              <p className="mt-2 mb-6 text-sm text-ink-muted">
                Formu doldurduğunuzda mesajınız ilgili ekibe iletilir.
              </p>
              <ContactForm turnstileSiteKey={publicEnv.turnstileSiteKey} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Harita — yalnızca gerçek adres ve harita bağlantısı tanımlıysa */}
      {settings.hasAddress && settings.mapEmbedUrl && (
        <Section spacing="none" className="border-t border-line">
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
    <li className="flex items-start gap-4 rounded-md border border-line bg-surface-raised p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-brand-50 text-brand-600">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-xs tracking-wide text-ink-subtle uppercase">{label}</span>
        {children}
      </div>
    </li>
  )
}
