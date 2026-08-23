import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, CheckCircle2, Target } from 'lucide-react'
import { getSectorDetail, getSectorSlugs } from '@/services/content-service'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section, SectionHeader } from '@/components/shared/section'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/icon'
import { ProjectCard } from '@/components/cards/project-card'

export const revalidate = 900
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getSectorSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const sector = await getSectorDetail(slug)

  if (!sector) {
    return buildMetadata({
      title: 'Çalışma alanı bulunamadı',
      description: 'Aradığınız sayfa bulunamadı.',
      path: `/sektorler/${slug}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: sector.seoTitle ?? sector.title,
    description: sector.metaDescription ?? sector.shortDescription,
    path: `/sektorler/${sector.slug}`,
    ogImage: sector.ogImage ?? sector.heroImage,
  })
}

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const sector = await getSectorDetail(slug)

  if (!sector) notFound()


  const crumbs = [
    { label: 'Çalışma Alanları', href: '/sektorler' },
    { label: sector.title, href: `/sektorler/${sector.slug}` },
  ]



  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        variant="media"
        eyebrow="Çalışma Alanı"
        title={sector.title}
        description={sector.shortDescription}
        crumbs={crumbs}
        image={sector.heroImage}
      >
        <Button asChild size="lg">
          <Link href="/teklif-al">
            Keşif Talep Et
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </PageHero>

      <Section spacing="md" tone="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div className="flex flex-col gap-6">
              <SectionHeader eyebrow="Genel Bakış" title={`${sector.title} için yaklaşımımız`} />
              <div className="prose-site">
                <p>{sector.intro}</p>
                {sector.content && <div dangerouslySetInnerHTML={{ __html: sector.content }} />}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {sector.needs.length > 0 && (
                <div className="rounded-lg border border-line bg-surface-raised p-7">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                    <Target className="size-5 text-brand-600" aria-hidden />
                    Öne çıkan ihtiyaçlar
                  </h2>
                  <ul className="mt-5 flex flex-col gap-3">
                    {sector.needs.map((need) => (
                      <li key={need} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />
                        {need}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sector.approach.length > 0 && (
                <div className="rounded-lg border border-line p-7">
                  <h2 className="text-lg font-semibold text-ink">Planlama yaklaşımımız</h2>
                  <ul className="mt-5 flex flex-col gap-3">
                    {sector.approach.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {sector.relatedServices.length > 0 && (
        <Section spacing="md" tone="light">
          <Container>
            <SectionHeader eyebrow="Hizmetler" title="Bu alanda sunduğumuz hizmetler" />
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {sector.relatedServices.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/hizmetler/${service.slug}`}
                    className="group flex h-full flex-col gap-3 rounded-md border border-line bg-surface p-6 transition-colors hover:border-brand-500"
                  >
                    <span className="flex size-10 items-center justify-center rounded-sm bg-brand-50 text-brand-600">
                      <Icon name={service.icon} className="size-5" />
                    </span>
                    <h3 className="text-base font-semibold text-ink">{service.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      {service.shortDescription}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {sector.projects.length > 0 && (
        <Section spacing="md" tone="light">
          <Container>
            <SectionHeader eyebrow="Projeler" title="Bu alanda tamamlanan işler" />
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sector.projects.map((project) => (
                <li key={project.id}>
                  <ProjectCard
                    title={project.title}
                    slug={project.slug}
                    city={project.city}
                    summary={project.summary}
                    coverImage={project.coverImage}
                    surfaceType={project.surfaceType}
                    className="h-full"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

    </>
  )
}
