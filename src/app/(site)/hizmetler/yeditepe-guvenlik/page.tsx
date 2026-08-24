import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, Mail, MapPin, Phone } from 'lucide-react'
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
import { otherServiceGroups, yeditepeSecurity } from '@/config/content'
import { securityImages } from '@/config/images'
import { siteConfig } from '@/config/site'
import { toTelHref } from '@/lib/utils'

/**
 * YEDİTEPE ÖZEL GÜVENLİK — /hizmetler/yeditepe-guvenlik
 *
 * NEDEN [slug] ŞABLONU DEĞİL, AYRI BİR ROUTE:
 * `/hizmetler/[slug]` şablonu yüzey temizliğine göre kurulmuş — "uygun
 * yüzeyler", "öncesi ve sonrası", "bu hizmeti hangi yapılarda veriyoruz"
 * bölümleri var ve teklif formu temizlik hizmetlerine bağlı. Güvenlik bu
 * alanların hiçbirine oturmuyor; üstelik AYRI BİR TÜZEL KİŞİLİK tarafından,
 * kendi telefon numarasıyla veriliyor. Şablona zorlamak, boş kalan alanları
 * uydurma içerikle doldurmayı gerektirirdi.
 *
 * Next.js'te sabit segment dinamik segmentten önce eşleşir; bu dosya
 * `[slug]/page.tsx` ile çakışmaz, onu bu yol için geçersiz kılar.
 *
 * İÇERİK KURALI: personel sayısı, lokasyon adedi, deneyim yılı, SLA veya
 * sertifika iddiası YOK. Sayfadaki her sayı `otherServiceGroups` dizisinden
 * sayılarak üretilir; her mevzuat ifadesi 5188 sayılı kanuna dayanır.
 */

const security = siteConfig.groupCompanies[0]

const crumbs = [
  { label: 'Hizmetler', href: '/hizmetler' },
  { label: security.brand, href: '/hizmetler/yeditepe-guvenlik' },
]

const totalItems = otherServiceGroups.reduce((sum, group) => sum + group.items.length, 0)

const faqs = yeditepeSecurity.faqs.map((faq, index) => ({ ...faq, id: `yeditepe-${index}` }))

const description =
  'Özel güvenlik, organizasyon güvenliği, elektronik güvenlik sistemleri ve tesis yönetimi hizmetleri; 5188 sayılı kanun kapsamında, grup bünyesindeki Yeditepe Koruma ve Güvenlik Hizmetleri Ltd. Şti. tarafından veriliyor.'

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
          }),
          faqSchema(faqs),
        ].filter((item) => item !== null)}
      />

      {/*
        Hero görseli müşterinin sağladığı marka tanıtım fotoğrafı. Stok bir
        güvenlik görseli kullanılmaz; tamamlanmış bir işin belgesi olarak da
        sunulmaz (bkz. securityImages).
      */}
      <PageHero
        variant="media"
        image={securityImages.stadium}
        eyebrow="Grup Hizmeti"
        title={security.brand}
        description={`${security.tagline}. ${security.scope}.`}
        crumbs={crumbs}
        meta={[
          { label: 'Hizmet Başlığı', value: `${otherServiceGroups.length} grup` },
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
                {/*
                  Açık levha: logonun koyu gövdesi koyu temada zemine karışıyor.
                */}
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

      {/* --- Hizmet kapsamı --- */}
      <Section spacing="md" id="kapsam" tone="raised" className="scroll-mt-24">
        <Container>
          <SectionHeader
            eyebrow="Kapsam"
            title="Dört başlık altında güvenlik hizmetleri"
            description="Hangi başlığın gerekli olduğu, tesisin yapısı ve risk değerlendirmesi sonrasında belirlenir. Başlıklar birlikte de alınabilir."
          />

          <Reveal stagger className="mt-14">
            <ul className="grid gap-6 lg:grid-cols-2">
              {otherServiceGroups.map((group, index) => (
                /*
                  `id` + scroll-mt: "Diğer hizmetlerimiz" kartları buraya derin
                  bağlantı verir; sabit header'ın altında kalmaması için üstten
                  boşluk bırakılır.
                */
                <RevealItem as="li" key={group.id}>
                  <article
                    id={group.id}
                    className="panel flex h-full scroll-mt-28 flex-col overflow-hidden rounded-md"
                  >
                    <div className="bg-surface-sunken relative aspect-[16/10]">
                      <MediaImage
                        src={group.image}
                        alt={group.title}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <span className="bg-paper text-brand-600 absolute bottom-4 left-4 flex size-12 items-center justify-center rounded-sm shadow-md">
                        <Icon name={group.icon} className="size-6" />
                      </span>
                      <span className="tech-label bg-scrim/70 absolute top-4 right-4 rounded-xs px-2 py-1 text-white backdrop-blur-sm">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-5 p-6 md:p-8">
                      <div className="flex flex-col gap-2.5">
                        <h3 className="text-ink text-xl leading-snug font-semibold">
                          {group.title}
                        </h3>
                        <p className="text-ink-muted text-base leading-relaxed">
                          {group.description}
                        </p>
                      </div>

                      <ul className="border-line mt-auto grid gap-2.5 border-t pt-5 sm:grid-cols-2">
                        {group.items.map((item) => (
                          <li key={item} className="text-ink-muted flex items-start gap-2 text-sm">
                            <Check
                              className="text-brand-600 mt-0.5 size-3.5 shrink-0"
                              aria-hidden
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </RevealItem>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* --- K9 ve organizasyon ekipmanı --- */}
      <Section spacing="md" tone="light">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <article className="panel flex flex-col overflow-hidden rounded-md">
              <div className="bg-surface-sunken relative aspect-[16/10]">
                <MediaImage
                  src={securityImages.k9}
                  alt="K9 arama köpeği ve görevlisi"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
                <h2 className="text-ink text-xl leading-snug font-semibold">K9 hizmetleri</h2>
                <p className="text-ink-muted text-base leading-relaxed">
                  Bomba ve tanıtılan maddeye duyarlı, Kanada ve Amerika K-9 programlarına göre
                  eğitilmiş köpekler ve ilgili branşlarda görev yapmış uzman kadro ile çalışılır.
                </p>
                <ul className="border-line mt-auto grid gap-2.5 border-t pt-5 sm:grid-cols-2">
                  {yeditepeSecurity.k9Areas.map((area) => (
                    <li key={area} className="text-ink-muted flex items-start gap-2 text-sm">
                      <Check className="text-brand-600 mt-0.5 size-3.5 shrink-0" aria-hidden />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="panel flex flex-col overflow-hidden rounded-md">
              <div className="bg-surface-sunken relative aspect-[16/10]">
                <MediaImage
                  src={securityImages.xray}
                  alt="X-Ray kontrol cihazı ve operatörü"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
                <h2 className="text-ink text-xl leading-snug font-semibold">
                  Organizasyon ekipmanları
                </h2>
                <p className="text-ink-muted text-base leading-relaxed">
                  Organizasyonun ihtiyacına göre, fiziki güvenliği tamamlayan ekipman ve teçhizatla
                  ek tedbirler alınır.
                </p>
                <ul className="border-line mt-auto grid gap-2.5 border-t pt-5 sm:grid-cols-2">
                  {yeditepeSecurity.eventEquipment.map((item) => (
                    <li key={item} className="text-ink-muted flex items-start gap-2 text-sm">
                      <Check className="text-brand-600 mt-0.5 size-3.5 shrink-0" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
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

      {/* --- Avantajlar (sözleşme tarafı) --- */}
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
