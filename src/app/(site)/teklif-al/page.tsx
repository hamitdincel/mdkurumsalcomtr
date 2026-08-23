import type { Metadata } from 'next'
import { Clock, PhoneCall, ShieldCheck, FileCheck2 } from 'lucide-react'
import { getServiceOptions } from '@/services/content-service'
import { getSettings } from '@/services/settings-service'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { Container, Section } from '@/components/shared/section'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { QuoteForm } from '@/components/forms/quote-form'
import { TrackedLink } from '@/components/shared/tracked-link'
import { publicEnv } from '@/config/env'
import { toTelHref } from '@/lib/utils'

export const revalidate = 900

const crumbs = [{ label: 'Teklif Al', href: '/teklif-al' }]

export const metadata: Metadata = buildMetadata({
  title: 'Ücretsiz Keşif ve Teklif Talebi',
  description:
    'Binanız için keşif talebi oluşturun. Yüzey, alan ve erişim bilgilerinizi paylaşın; ekibimiz değerlendirip size dönüş yapsın.',
  path: '/teklif-al',
})

type SearchParams = Promise<{ hizmet?: string }>

export default async function QuotePage({ searchParams }: { searchParams: SearchParams }) {
  const { hizmet } = await searchParams
  const [services, settings] = await Promise.all([getServiceOptions(), getSettings()])

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <Section spacing="md" tone="raised" className="border-b border-line">
        <Container>
          <Breadcrumb items={crumbs} className="mb-6" />
          <p className="eyebrow mb-4">Teklif Al</p>
          <h1 className="max-w-3xl text-3xl font-bold text-ink md:text-4xl">
            Binanız için ücretsiz keşif talebi oluşturun
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Aşağıdaki üç adımlık formu doldurun. Paylaştığınız bilgiler, size gerçekçi bir teklif
            hazırlamamızı sağlar. Bu form üzerinden otomatik fiyat verilmez.
          </p>
        </Container>
      </Section>

      <Section spacing="md" tone="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div className="order-2 rounded-lg border border-line bg-surface-raised p-6 md:p-9 lg:order-1">
              <QuoteForm
                services={services}
                turnstileSiteKey={publicEnv.turnstileSiteKey}
                whatsapp={settings.whatsapp}
                phone={settings.phone}
                defaultService={hizmet}
              />
            </div>

            <aside className="order-1 flex flex-col gap-8 lg:order-2 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-line p-7">
                <h2 className="text-lg font-semibold text-ink">Süreç nasıl işliyor?</h2>
                <ol className="mt-5 flex flex-col gap-5">
                  <Step number="1" title="Talebinizi iletiyorsunuz">
                    Formu doldurmanız yaklaşık 2 dakika sürer.
                  </Step>
                  <Step number="2" title="Ekibimiz sizi arıyor">
                    Eksik bilgileri tamamlayıp uygunluk değerlendirmesi yapıyoruz.
                  </Step>
                  <Step number="3" title="Keşif planlanıyor">
                    Gerekiyorsa cepheyi yerinde inceliyoruz.
                  </Step>
                  <Step number="4" title="Teklif iletiliyor">
                    Kapsam ve süre açıkça belirtilmiş bir teklif hazırlıyoruz.
                  </Step>
                </ol>
              </div>

              <ul className="flex flex-col gap-4">
                <Assurance icon={<ShieldCheck className="size-4" aria-hidden />}>
                  Bilgileriniz yalnızca talebinizi değerlendirmek amacıyla işlenir.
                </Assurance>
                <Assurance icon={<FileCheck2 className="size-4" aria-hidden />}>
                  Otomatik fiyat verilmez; teklif keşif sonrası hazırlanır.
                </Assurance>
                <Assurance icon={<Clock className="size-4" aria-hidden />}>
                  Talebiniz iletildikten sonra ekibimiz sizinle iletişime geçer.
                </Assurance>
                <Assurance icon={<PhoneCall className="size-4" aria-hidden />}>
                  Formu doldurmak istemiyorsanız arayabilirsiniz:{' '}
                  <TrackedLink
                    href={`tel:${toTelHref(settings.phone)}`}
                    event="phone_click"
                    eventParams={{ location: 'quote_page' }}
                    className="font-medium text-brand-600 underline underline-offset-2"
                  >
                    {settings.phone}
                  </TrackedLink>
                </Assurance>
              </ul>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  )
}

function Step({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-4">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-surface">
        {number}
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-ink">{title}</span>
        <span className="text-sm leading-relaxed text-ink-muted">{children}</span>
      </div>
    </li>
  )
}

function Assurance({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm bg-brand-50 text-brand-600">
        {icon}
      </span>
      <span>{children}</span>
    </li>
  )
}
