import type { Metadata } from 'next'
import Link from 'next/link'
import { getServices, getSectors } from '@/services/content-service'
import {
  listPublishedProjects,
  countPublishedProjects,
} from '@/repositories/project-repository'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section } from '@/components/shared/section'
import { ProjectCard } from '@/components/cards/project-card'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'

export const revalidate = 900

const crumbs = [{ label: 'Projeler', href: '/projeler' }]
const PAGE_SIZE = 9

export const metadata: Metadata = buildMetadata({
  title: 'Projeler ve Vaka Çalışmaları',
  description:
    'Tamamladığımız dış cephe, cam yüzey ve panel temizliği projeleri. Her vaka çalışmasında problem, planlama, uygulama ve sonuç adımları paylaşılır.',
  path: '/projeler',
})

type SearchParams = Promise<{ hizmet?: string; sektor?: string; sayfa?: string }>

export default async function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  const { hizmet, sektor, sayfa } = await searchParams
  const page = Math.max(1, Number(sayfa) || 1)

  const [projects, total, services, sectors] = await Promise.all([
    listPublishedProjects({
      serviceSlug: hizmet,
      sectorSlug: sektor,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    countPublishedProjects({ serviceSlug: hizmet, sectorSlug: sektor }),
    getServices(),
    getSectors(),
  ])

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const buildHref = (next: { hizmet?: string; sektor?: string; sayfa?: number }) => {
    const params = new URLSearchParams()
    const service = next.hizmet ?? hizmet
    const sector = next.sektor ?? sektor
    if (service) params.set('hizmet', service)
    if (sector) params.set('sektor', sector)
    if (next.sayfa && next.sayfa > 1) params.set('sayfa', String(next.sayfa))
    const query = params.toString()
    return query ? `/projeler?${query}` : '/projeler'
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="05 / Projeler"
        title="Tamamlanan işler ve vaka çalışmaları"
        description="Her projede karşılaşılan problemi, hazırladığımız planı ve uyguladığımız yöntemi kayıt altına alıyoruz."
        crumbs={crumbs}
      />

      <Section spacing="md" tone="light">
        <Container>
          {/* Filtreler */}
          {(services.length > 0 || sectors.length > 0) && total > 0 && (
            <div className="mb-10 flex flex-col gap-4">
              <FilterRow label="Hizmet">
                <FilterChip href={buildHref({ hizmet: '', sayfa: 1 })} active={!hizmet}>
                  Tümü
                </FilterChip>
                {services.map((service) => (
                  <FilterChip
                    key={service.slug}
                    href={buildHref({ hizmet: service.slug, sayfa: 1 })}
                    active={hizmet === service.slug}
                  >
                    {service.title}
                  </FilterChip>
                ))}
              </FilterRow>
            </div>
          )}

          {projects.length === 0 ? (
            <EmptyState
              title="Henüz yayınlanmış proje bulunmuyor"
              description="Tamamlanan işler yönetim panelinden eklendiğinde bu sayfada listelenecek. Bu arada teklif talebinizi iletebilirsiniz."
              actionLabel="Teklif Al"
              actionHref="/teklif-al"
            />
          ) : (
            <>
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <li key={project.id}>
                    <ProjectCard
                      title={project.title}
                      slug={project.slug}
                      city={project.city}
                      summary={project.summary}
                      coverImage={project.coverImage}
                      surfaceType={project.surfaceType}
                      buildingType={project.buildingType}
                      area={project.area}
                      serviceTitle={project.service?.title}
                      sectorTitle={project.sector?.title}
                      clientName={project.clientName}
                      anonymized={project.anonymized}
                      className="h-full"
                    />
                  </li>
                ))}
              </ul>

              {pageCount > 1 && (
                <nav aria-label="Sayfalama" className="mt-12 flex justify-center gap-2">
                  {Array.from({ length: pageCount }).map((_, index) => {
                    const target = index + 1
                    return (
                      <Link
                        key={target}
                        href={buildHref({ sayfa: target })}
                        aria-current={target === page ? 'page' : undefined}
                        className={cn(
                          'flex size-11 items-center justify-center rounded-sm border text-sm font-medium transition-colors',
                          target === page
                            ? 'border-ink bg-ink text-surface'
                            : 'border-line bg-surface-raised text-ink-muted hover:border-line-strong',
                        )}
                      >
                        {target}
                      </Link>
                    )
                  })}
                </nav>
              )}
            </>
          )}
        </Container>
      </Section>

    </>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
        {label}
      </span>
      {children}
    </div>
  )
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-sm border px-3.5 py-2 text-sm transition-colors',
        active
          ? 'border-ink bg-ink text-surface'
          : 'border-line bg-surface-raised text-ink-muted hover:border-line-strong hover:text-ink',
      )}
    >
      {children}
    </Link>
  )
}
