import { Clock, PhoneCall, ShieldCheck, FileCheck2 } from 'lucide-react'
import { Container, Section } from '@/components/shared/section'
import { QuoteForm } from '@/components/forms/quote-form'
import { TrackedLink } from '@/components/shared/tracked-link'
import { SectionNumber } from '@/components/shared/technical'
import { toTelHref } from '@/lib/utils'

/**
 * SECTION 12 — TEKLİF FORMU (conversion)
 *
 * Bu bölüm bilinçli olarak sayfanın en SAKİN alanıdır: dekoratif motif yok,
 * dikkat dağıtan hareket yok. Amaç göz almak değil, güven vermek.
 * Sol tarafta süreç ve güvence, sağda beyaz panel içinde form.
 */
export function QuoteSection({
  services,
  turnstileSiteKey,
  whatsapp,
  phone,
}: {
  services: { value: string; label: string }[]
  turnstileSiteKey: string
  whatsapp: string
  phone: string
}) {
  return (
    <Section
      tone="brand"
      spacing="md"
      id="teklif"
      className="scroll-mt-28 border-y border-line"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-10 lg:sticky lg:top-32 lg:self-start">
            <div>
              <SectionNumber number="08" label="TEKLİF" />
              <h2 className="mt-6 text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-ink">
                Binanız için keşif talebi oluşturun
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
                Birkaç soruya vereceğiniz yanıtlar, size doğru ve gerçekçi bir teklif hazırlamamızı
                sağlar.
              </p>
            </div>

            <ul className="flex flex-col">
              <Assurance icon={<ShieldCheck className="size-4" aria-hidden />}>
                Bilgileriniz yalnızca talebinizi değerlendirmek için kullanılır.
              </Assurance>
              <Assurance icon={<FileCheck2 className="size-4" aria-hidden />}>
                Otomatik fiyat verilmez; teklif keşif sonrasında hazırlanır.
              </Assurance>
              <Assurance icon={<Clock className="size-4" aria-hidden />}>
                Talebiniz iletildikten sonra ekibimiz sizinle iletişime geçer.
              </Assurance>
              <Assurance icon={<PhoneCall className="size-4" aria-hidden />}>
                Formu doldurmak istemiyorsanız arayabilirsiniz:{' '}
                <TrackedLink
                  href={`tel:${toTelHref(phone)}`}
                  event="phone_click"
                  eventParams={{ location: 'quote_section' }}
                  className="font-medium text-brand-600 underline underline-offset-2"
                >
                  {phone}
                </TrackedLink>
              </Assurance>
            </ul>
          </div>

          <div className="rounded-lg border border-line bg-surface p-6 md:p-9">
            <QuoteForm
              services={services}
              turnstileSiteKey={turnstileSiteKey}
              whatsapp={whatsapp}
              phone={phone}
              compact
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}

function Assurance({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3.5 border-t border-line py-4 text-sm leading-relaxed text-ink-muted last:border-b">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm bg-brand-50 text-brand-600">
        {icon}
      </span>
      <span>{children}</span>
    </li>
  )
}
