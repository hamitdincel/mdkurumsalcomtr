import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowUpRight, Check, Phone } from 'lucide-react'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema, serviceSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section, SectionHeader } from '@/components/shared/section'
import { Reveal, RevealItem } from '@/components/shared/reveal'
import { Icon } from '@/components/shared/icon'
import { MediaImage } from '@/components/shared/media-image'
import { Button } from '@/components/ui/button'
import { findSecurityService, securityServices } from '@/config/security'
import { siteConfig } from '@/config/site'
import { toTelHref } from '@/lib/utils'

/**
 * TEK BİR GÜVENLİK HİZMETİNİN DETAYI
 * /hizmetler/yeditepe-guvenlik/<slug>
 *
 * Önce dört hizmet tek sayfada, yalnızca çapa (#id) ile ayrılıyordu; hangi
 * karta tıklanırsa tıklansın aynı sayfa açıldığı için her hizmet diğer üçünün
 * içeriğiyle birlikte görünüyordu. Artık her hizmetin kendi sayfası var ve
 * yalnızca kendi bölümlerini gösteriyor.
 *
 * İçerik src/config/security.ts içinde; tamamı tanıtım dokümanlarına dayanır.
 */

const security = siteConfig.groupCompanies[0]

export function generateStaticParams() {
  return securityServices.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = findSecurityService(slug)
  if (!service) return {}

  return buildMetadata({
    title: `${service.title} — ${security.brand}`,
    description: service.metaDescription,
    path: `/hizmetler/yeditepe-guvenlik/${service.slug}`,
  })
}

export default async function SecurityServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = findSecurityService(slug)
  if (!service) notFound()

  const others = securityServices.filter((item) => item.slug !== service.slug)

  const crumbs = [
    { label: 'Hizmetler', href: '/hizmetler' },
    { label: security.brand, href: '/hizmetler/yeditepe-guvenlik' },
    { label: service.title, href: `/hizmetler/yeditepe-guvenlik/${service.slug}` },
  ]

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          serviceSchema({
            name: `${service.title} — ${security.brand}`,
            description: service.metaDescription,
            slug: `yeditepe-guvenlik/${service.slug}`,
            image: service.image,
          }),
        ]}
      />

      <PageHero
        variant="media"
        image={service.image}
        eyebrow={security.brand}
        title={service.title}
        description={service.shortDescription}
        crumbs={crumbs}
        meta={[{ label: 'Başlık', value: `${service.sections.length} bölüm` }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="inverse">
            <a href={`tel:${toTelHref(security.phone)}`}>
              <Phone className="size-4" aria-hidden />
              {security.phone}
            </a>
          </Button>
          <Button asChild size="lg" variant="outlineInverse">
            <Link href="/hizmetler/yeditepe-guvenlik">Tüm Güvenlik Hizmetleri</Link>
          </Button>
        </div>
      </PageHero>

      {/* --- Tanım --- */}
      <Section spacing="md" tone="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeader
              eyebrow="Tanım"
              title={`${service.title} nedir?`}
              className="lg:sticky lg:top-28 lg:self-start"
            />
            <p className="text-ink-muted text-lg leading-relaxed">{service.intro}</p>
          </div>
        </Container>
      </Section>

      {/* --- Kapsam bölümleri --- */}
      <Section spacing="md" tone="raised">
        <Container>
          <SectionHeader eyebrow="Kapsam" title="Hizmetin içeriği" />

          <Reveal stagger className="mt-14">
            <ul className="grid gap-6 lg:grid-cols-2">
              {service.sections.map((section, index) => (
                <RevealItem as="li" key={section.title}>
                  <article className="panel flex h-full flex-col gap-5 rounded-md p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-ink text-xl leading-snug font-semibold">
                        {section.title}
                      </h2>
                      <span className="tech-label text-ink-subtle shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {section.description && (
                      <p className="text-ink-muted text-base leading-relaxed">
                        {section.description}
                      </p>
                    )}

                    {section.items && (
                      <ul className="border-line mt-auto grid gap-2.5 border-t pt-5">
                        {section.items.map((item) => (
                          <li key={item} className="text-ink-muted flex items-start gap-2 text-sm">
                            <Check
                              className="text-brand-600 mt-0.5 size-3.5 shrink-0"
                              aria-hidden
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </RevealItem>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* --- Diğer güvenlik hizmetleri --- */}
      <Section spacing="md" tone="light">
        <Container>
          <SectionHeader eyebrow="Diğer Başlıklar" title="Güvenlik hizmetlerinin tamamı" />

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <li key={item.slug}>
                <article className="group panel hover:border-line-strong relative flex h-full flex-col overflow-hidden rounded-md transition-colors duration-300">
                  <div className="bg-surface-sunken relative aspect-[16/10] overflow-hidden">
                    <MediaImage
                      src={item.image}
                      alt={item.title}
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                    <span className="bg-paper text-brand-600 absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-sm shadow-md">
                      <Icon name={item.icon} className="size-5" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="text-ink text-base leading-snug font-semibold">
                      <Link
                        href={`/hizmetler/yeditepe-guvenlik/${item.slug}`}
                        className="after:absolute after:inset-0"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-ink-muted line-clamp-3 text-sm leading-relaxed">
                      {item.shortDescription}
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
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* --- CTA --- */}
      <Section spacing="md" tone="brand">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="İletişim"
            title={`${service.title} için planlama yapalım`}
            description="Keşif ve risk değerlendirmesi sonrasında kapsamı birlikte belirliyoruz."
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
