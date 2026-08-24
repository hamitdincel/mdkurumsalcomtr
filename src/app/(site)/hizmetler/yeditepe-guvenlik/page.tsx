import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section, SectionHeader } from '@/components/shared/section'
import { Reveal, RevealItem } from '@/components/shared/reveal'
import { FaqAccordion } from '@/components/shared/faq-accordion'
import { Icon } from '@/components/shared/icon'
import { MediaImage } from '@/components/shared/media-image'
import { BlueprintBackground, RadialLight } from '@/components/shared/technical'
import { Button } from '@/components/ui/button'
import { yeditepeSecurity } from '@/config/content'
import { securityServices } from '@/config/security'
import { securityImages } from '@/config/images'
import { siteConfig } from '@/config/site'
import { toTelHref } from '@/lib/utils'

/**
 * YEDİTEPE ÖZEL GÜVENLİK — GİRİŞ SAYFASI
 * /hizmetler/yeditepe-guvenlik
 *
 * NEDEN [slug] ŞABLONU DEĞİL, AYRI BİR ROUTE:
 * `/hizmetler/[slug]` şablonu yüzey temizliğine göre kurulmuş — "uygun
 * yüzeyler", "öncesi ve sonrası" bölümleri var ve teklif formu temizlik
 * hizmetlerine bağlı. Güvenlik bu alanlara oturmuyor; üstelik AYRI BİR TÜZEL
 * KİŞİLİK tarafından, kendi telefon numarasıyla veriliyor.
 *
 * Bu sayfa yalnızca GİRİŞ noktasıdır: şirket kimliği, dört başlığın özeti,
 * ortak süreç, sözleşme koşulları ve SSS. Her başlığın kendi içeriği kendi
 * alt sayfasındadır (bkz. [slug]/page.tsx) — önce dördü de burada tek sayfada
 * toplanıyordu ve hangi karta tıklanırsa tıklansın aynı sayfa açılıyordu.
 *
 * İÇERİK KURALI: personel sayısı, lokasyon adedi, deneyim yılı, SLA veya
 * sertifika iddiası YOK. Sayılar dizilerden üretilir; her ifade tanıtım
 * dokümanlarında yazılı olana dayanır (bkz. src/config/security.ts).
 */

const security = siteConfig.groupCompanies[0]

const crumbs = [
  { label: 'Hizmetler', href: '/hizmetler' },
  { label: security.brand, href: '/hizmetler/yeditepe-guvenlik' },
]

const totalItems = securityServices.reduce(
  (sum, service) =>
    sum + service.sections.reduce((count, section) => count + (section.items?.length ?? 0), 0),
  0,
)

const faqs = yeditepeSecurity.faqs.map((faq, index) => ({ ...faq, id: `yeditepe-${index}` }))

const description =
  'Özel güvenlik, organizasyon ve özel koruma, elektronik güvenlik sistemleri ile bina ve tesis güvenliği; 5188 sayılı kanun kapsamında, grup bünyesindeki Yeditepe Koruma ve Güvenlik Hizmetleri Ltd. Şti. tarafından veriliyor.'

export const metadata: Metadata = buildMetadata({
  title: 'Yeditepe Özel Güvenlik — Özel Güvenlik ve Elektronik Güvenlik Hizmetleri',
  description,
  path: '/hizmetler/yeditepe-guvenlik',
})

export default function YeditepeSecurityPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          serviceSchema({
            name: `${security.brand} — Özel Güvenlik Hizmetleri`,
            description,
            slug: 'yeditepe-guvenlik',
            image: securityImages.stadium,
          }),
          faqSchema(faqs),
        ].filter((item) => item !== null)}
      />

      {/*
        Hero görseli müşterinin sağladığı marka tanıtım fotoğrafı. Tamamlanmış
        bir işin belgesi olarak sunulmaz (bkz. securityImages).
      */}
      <PageHero
        variant="media"
        image={securityImages.stadium}
        eyebrow="Grup Hizmeti"
        title={security.brand}
        description={`${security.tagline}. ${security.scope}.`}
        crumbs={crumbs}
        meta={[
          { label: 'Hizmet Başlığı', value: `${securityServices.length} grup` },
          { label: 'Kapsam', value: `${totalItems} hizmet kalemi` },
          { label: 'Mevzuat', value: '5188 sayılı kanun' },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="inverse">
            <a href={`tel:${toTelHref(security.phone)}`}>
              <Phone className="size-4" aria-hidden />
              {security.phone}
            </a>
          </Button>
          <Button asChild size="lg" variant="outlineInverse">
            <Link href="#kapsam">Hizmet Kapsamını İncele</Link>
          </Button>
        </div>
      </PageHero>

      {/* --- Tüzel kişilik --- */}
      <Section spacing="md" tone="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <SectionHeader
              eyebrow="Kurumsal"
              title="Güvenlik hizmetleri ayrı bir şirket tarafından veriliyor"
              description="Drone destekli yüzey temizliği MD Kurumsal'ın uzmanlık alanı. Güvenlik ise 5188 sayılı kanun kapsamında faaliyet gösteren ayrı bir tüzel kişilik gerektirir; bu hizmetler grup bünyesindeki Yeditepe tarafından, kendi ekibi ve kendi iletişim hattıyla yürütülür. Şirket ayrıca İstanbul ve İzmir'de özel güvenlik eğitim kurumu işletiyor."
            />

            <div className="panel flex flex-col gap-5 rounded-md p-6 lg:p-7">
              <div className="flex items-center gap-4">
                {/* Açık levha: logonun koyu gövdesi koyu temada zemine karışıyor. */}
                <span className="bg-paper flex size-14 shrink-0 items-center justify-center rounded-sm p-1.5">
                  <Image
                    src={security.logo}
                    alt={`${security.brand} logosu`}
                    width={56}
                    height={56}
                    className="size-full object-contain"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-ink text-base font-semibold">{security.brand}</p>
                  <p className="text-ink-subtle text-sm leading-snug">{security.name}</p>
                </div>
              </div>

              <dl className="border-line flex flex-col gap-4 border-t pt-5">
                <div className="flex items-start gap-3">
                  <Phone className="text-brand-600 mt-0.5 size-4 shrink-0" aria-hidden />
                  <div>
                    <dt className="tech-label text-ink-subtle">Telefon</dt>
                    <dd>
                      <a
                        href={`tel:${toTelHref(security.phone)}`}
                        className="text-ink hover:text-brand-600 text-sm font-medium underline-offset-4 transition-colors hover:underline"
                      >
                        {security.phone}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-brand-600 mt-0.5 size-4 shrink-0" aria-hidden />
                  <div className="min-w-0">
                    <dt className="tech-label text-ink-subtle">E-posta</dt>
                    <dd>
                      <a
                        href={`mailto:${security.email}`}
                        className="text-ink hover:text-brand-600 text-sm font-medium break-all underline-offset-4 transition-colors hover:underline"
                      >
                        {security.email}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-brand-600 mt-0.5 size-4 shrink-0" aria-hidden />
                  <div>
                    <dt className="tech-label text-ink-subtle">Adres</dt>
                    <dd className="text-ink-muted text-sm leading-relaxed">{security.address}</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- Dört başlık --- */}
      <Section spacing="md" id="kapsam" tone="raised" className="scroll-mt-24">
        <Container>
          <SectionHeader
            eyebrow="Kapsam"
            title="Dört başlık altında güvenlik hizmetleri"
            description="Hangi başlığın gerekli olduğu, tesisin yapısı ve risk değerlendirmesi sonrasında belirlenir. Başlıklar birlikte de alınabilir."
          />

          <Reveal stagger className="mt-14">
            <ul className="grid gap-6 sm:grid-cols-2">
              {securityServices.map((service, index) => (
                <RevealItem as="li" key={service.slug}>
                  <article className="group panel hover:border-line-strong relative flex h-full flex-col overflow-hidden rounded-md transition-colors duration-300">
                    <div className="bg-surface-sunken relative aspect-[16/10] overflow-hidden">
                      <MediaImage
                        src={service.image}
                        alt={service.title}
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      />
                      <span className="bg-paper text-brand-600 absolute bottom-4 left-4 flex size-12 items-center justify-center rounded-sm shadow-md">
                        <Icon name={service.icon} className="size-6" />
                      </span>
                      <span className="tech-label bg-scrim/70 absolute top-4 right-4 rounded-xs px-2 py-1 text-white backdrop-blur-sm">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
                      <h2 className="text-ink text-xl leading-snug font-semibold">
                        <Link
                          href={`/hizmetler/yeditepe-guvenlik/${service.slug}`}
                          className="after:absolute after:inset-0"
                        >
                          {service.title}
                        </Link>
                      </h2>
                      <p className="text-ink-muted text-base leading-relaxed">
                        {service.shortDescription}
                      </p>

                      {/*
                        Kalem listesi yerine BÖLÜM BAŞLIKLARI gösterilir: dört
                        kartın tamamı kalemleriyle basılınca sayfa bir liste
                        yığınına dönüyor ve alt sayfaların varlık sebebi
                        kalmıyordu.
                      */}
                      <p className="text-ink-subtle text-sm leading-relaxed">
                        {service.sections.map((section) => section.title).join(' · ')}
                      </p>

                      <span className="text-brand-600 mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium">
                        Detayları Gör
                        <ArrowUpRight
                          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </article>
                </RevealItem>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* --- Süreç --- */}
      <Section spacing="md" tone="dark" className="relative isolate overflow-hidden">
        <BlueprintBackground opacity="opacity-50" />
        <RadialLight position="15% 0%" color="rgba(17,85,240,0.18)" />

        <Container className="relative">
          <SectionHeader eyebrow="Süreç" title="Bir güvenlik hizmeti nasıl kuruluyor?" dark />
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {yeditepeSecurity.process.map((step, index) => (
              <li
                key={step.title}
                className="border-line-inverse hover:border-signal flex flex-col gap-3 border-t-2 pt-5 transition-colors"
              >
                <span className="font-display text-brand-600 text-sm font-bold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-ink-inverse text-base font-semibold">{step.title}</h3>
                <p className="text-ink-inverse-muted text-sm leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* --- Sözleşme tarafı --- */}
      <Section spacing="md" tone="raised">
        <Container>
          <SectionHeader
            eyebrow="Sözleşme"
            title="Hizmeti satın alan tarafın yükümlülüğü nerede biter?"
            description="Aşağıdakiler pazarlama vaadi değil, hizmet sözleşmesinin konusudur."
          />

          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {yeditepeSecurity.advantages.map((item, index) => (
              <li
                key={item.title}
                className="border-line hover:border-brand-500 flex flex-col gap-3 border-t-2 pt-5 transition-colors"
              >
                <span className="font-display text-brand-600 text-sm font-bold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-ink text-base font-semibold">{item.title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{item.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* --- SSS --- */}
      <Section spacing="md" tone="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeader
              eyebrow="SSS"
              title="Sık sorulan sorular"
              className="lg:sticky lg:top-28 lg:self-start"
            />
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      {/* --- CTA --- */}
      <Section spacing="md" tone="brand">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="İletişim"
            title="Tesisiniz için güvenlik planı çıkaralım"
            description="Keşif ve risk değerlendirmesi sonrasında hangi başlıkların gerektiğini birlikte belirliyoruz."
          />

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href={`tel:${toTelHref(security.phone)}`}>
                <Phone className="size-4" aria-hidden />
                {security.phone}
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/iletisim">
                İletişim Formu
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
