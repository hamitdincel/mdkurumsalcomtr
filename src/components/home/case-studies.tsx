import Link from 'next/link'
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react'
import { Container, Section } from '@/components/shared/section'
import { Reveal } from '@/components/shared/reveal'
import { MediaImage } from '@/components/shared/media-image'
import { SectionNumber } from '@/components/shared/technical'
import { Button } from '@/components/ui/button'
import type { ProjectCardData } from '@/repositories/project-repository'
import { formatNumber } from '@/lib/utils'

/**
 * SECTION 10 — VAKA ÇALIŞMALARI (editorial showcase)
 *
 * Üç eşit kart yerine asimetrik düzen: ilk proje büyük ve sinematik,
 * diğerleri sağda yatay satırlar hâlinde yığılır.
 *
 * Gerçek proje kaydı yoksa bölüm hiç render edilmez; sahte vaka üretilmez.
 */
export function CaseStudies({ projects }: { projects: ProjectCardData[] }) {
  if (projects.length === 0) return null

  const [featured, ...rest] = projects
  if (!featured) return null

  const clientLabel = featured.anonymized
    ? (featured.sector?.title ?? 'Kurumsal müşteri')
    : featured.clientName

  return (
    <Section spacing="md" tone="light">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-2xl">
            <SectionNumber number="06" label="PROJELER" />
            <h2 className="mt-6 text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-ink">
              Tamamlanan işlerden örnekler
            </h2>
          </div>

          <Button asChild variant="secondary" className="shrink-0">
            <Link href="/projeler">
              Tüm Projeler
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <Reveal className="mt-14">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* --- Öne çıkan proje --- */}
            <article className="group relative isolate flex min-h-[28rem] overflow-hidden rounded-md bg-onyx">
              <MediaImage
                src={featured.coverImage}
                alt={featured.title}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                placeholderLabel="Proje görseli"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/80 via-45% to-scrim/10"
              />
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-signal transition-transform duration-500 group-hover:scale-x-100"
              />

              <div className="relative mt-auto flex flex-col gap-4 p-7 md:p-9">
                <p className="tech-label flex flex-wrap items-center gap-x-3 gap-y-1 text-signal">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" aria-hidden />
                    {featured.city}
                  </span>
                  {clientLabel && <span className="text-white/60">{clientLabel}</span>}
                  {featured.service?.title && (
                    <span className="text-white/60">{featured.service.title}</span>
                  )}
                </p>

                <h3 className="max-w-xl text-2xl leading-snug font-semibold text-white md:text-3xl">
                  <Link href={`/projeler/${featured.slug}`} className="after:absolute after:inset-0">
                    {featured.title}
                  </Link>
                </h3>

                <p className="max-w-lg text-base leading-relaxed text-ink-on-dark-muted">
                  {featured.summary}
                </p>

                <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-white">
                  Projeyi İncele
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </article>

            {/* --- Diğer projeler: yatay satırlar --- */}
            {rest.length > 0 && (
              <ul className="flex flex-col gap-6">
                {rest.slice(0, 3).map((project) => (
                  <li key={project.id} className="flex-1">
                    <Link
                      href={`/projeler/${project.slug}`}
                      className="group flex h-full gap-5 rounded-md border border-line bg-surface-raised p-4 transition-colors hover:border-line-strong"
                    >
                      <span className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-sm bg-surface-sunken">
                        <MediaImage
                          src={project.coverImage}
                          alt=""
                          sizes="120px"
                          className="transition-transform duration-500 group-hover:scale-[1.05]"
                          placeholderLabel=""
                        />
                      </span>

                      <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
                        <span className="tech-label text-ink-subtle">
                          {[project.city, project.service?.title].filter(Boolean).join(' · ')}
                        </span>
                        <span className="text-base leading-snug font-semibold text-ink transition-colors group-hover:text-brand-700">
                          {project.title}
                        </span>
                        {project.area ? (
                          <span className="text-sm text-ink-muted">
                            {formatNumber(project.area)} m²
                          </span>
                        ) : null}
                      </span>

                      <ArrowUpRight
                        aria-hidden
                        className="size-4 shrink-0 self-center text-ink-subtle transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
