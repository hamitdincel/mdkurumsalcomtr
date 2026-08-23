import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getProjectBySlug, listAllProjectSlugs } from '@/repositories/project-repository'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema, caseStudySchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section, SectionHeader } from '@/components/shared/section'
import { Button } from '@/components/ui/button'
import { MediaImage } from '@/components/shared/media-image'
import { BeforeAfterSlider } from '@/components/shared/before-after-slider'
import { TestimonialCard } from '@/components/cards/testimonial-card'
import { ProjectViewTracker } from '@/components/shared/view-tracker'
import { formatDate, formatNumber } from '@/lib/utils'

export const revalidate = 900
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await listAllProjectSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return buildMetadata({
      title: 'Proje bulunamadı',
      description: 'Aradığınız proje sayfası bulunamadı.',
      path: `/projeler/${slug}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: project.seoTitle ?? project.title,
    description: project.metaDescription ?? project.summary,
    path: `/projeler/${project.slug}`,
    ogImage: project.ogImage ?? project.coverImage,
  })
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()


  const crumbs = [
    { label: 'Projeler', href: '/projeler' },
    { label: project.title, href: `/projeler/${project.slug}` },
  ]



  // Müşteri adı gizliyse sektör adı gösterilir; uydurma isim kullanılmaz.
  const clientLabel = project.anonymized
    ? (project.sector?.title ?? 'Kurumsal müşteri')
    : project.clientName

  const gallery = project.media.filter((m) => m.type === 'IMAGE')
  // Yalnızca gerçekten girilmiş künye bilgileri gösterilir.
  const facts = [
    { label: 'Lokasyon', value: project.city },
    { label: 'Tamamlanma', value: formatDate(project.completionDate) },
    { label: 'Yüzey alanı', value: project.area ? `${formatNumber(project.area)} m²` : '' },
    { label: 'Yükseklik', value: project.height ? `${project.height} m` : '' },
    { label: 'Proje süresi', value: project.duration ?? '' },
  ].filter((fact) => Boolean(fact.value))

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          caseStudySchema({
            title: project.title,
            description: project.summary,
            slug: project.slug,
            image: project.coverImage,
            city: project.city,
            completionDate: project.completionDate,
          }),
        ]}
      />
      <ProjectViewTracker slug={project.slug} title={project.title} />

      <PageHero
        variant="media"
        eyebrow="Vaka Çalışması"
        title={project.title}
        description={project.summary}
        crumbs={crumbs}
        image={project.coverImage}
        meta={[
          ...(clientLabel ? [{ label: 'Müşteri', value: clientLabel }] : []),
          ...facts.map((fact) => ({ label: fact.label, value: fact.value })),
          ...(project.service ? [{ label: 'Hizmet', value: project.service.title }] : []),
          ...(project.surfaceType ? [{ label: 'Yüzey', value: project.surfaceType }] : []),
        ]}
      />

      {/* Problem / Planlama / Uygulama / Sonuç */}
      <Section spacing="md" tone="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr] lg:gap-20">
            <SectionHeader
              eyebrow="Süreç"
              title="Projede ne yapıldı?"
              className="lg:sticky lg:top-28 lg:self-start"
            />

            <div className="flex flex-col gap-10">
              {project.challenge && (
                <ProjectBlock title="Problem" body={project.challenge} />
              )}
              {project.solution && <ProjectBlock title="Planlama ve Uygulama" body={project.solution} />}
              {project.result && <ProjectBlock title="Sonuç" body={project.result} />}
            </div>
          </div>
        </Container>
      </Section>

      {/* Öncesi / Sonrası */}
      {project.beforeAfterSets.length > 0 && (
        <Section spacing="md" tone="light">
          <Container>
            <SectionHeader eyebrow="Karşılaştırma" title="Öncesi ve sonrası" />
            <ul className="mt-10 grid gap-8 md:grid-cols-2">
              {project.beforeAfterSets.map((set) => (
                <li key={set.id} className="flex flex-col gap-3">
                  <BeforeAfterSlider
                    beforeImage={set.beforeImage}
                    afterImage={set.afterImage}
                    beforeAlt={set.beforeAlt}
                    afterAlt={set.afterAlt}
                    title={set.title}
                  />
                  <h3 className="text-base font-semibold text-ink">{set.title}</h3>
                  {set.description && (
                    <p className="text-sm leading-relaxed text-ink-muted">{set.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Galeri */}
      {gallery.length > 0 && (
        <Section spacing="md" tone="light">
          <Container>
            <SectionHeader eyebrow="Galeri" title="Uygulamadan kareler" />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((media) => (
                <li key={media.id} className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-sunken">
                  <MediaImage src={media.url} alt={media.alt ?? project.title} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Müşteri yorumu — yalnızca gerçek kayıt varsa */}
      {project.testimonial && project.testimonial.active && (
        <Section spacing="md" tone="light">
          <Container className="max-w-3xl">
            <TestimonialCard
              personName={project.testimonial.personName}
              company={project.testimonial.company}
              jobTitle={project.testimonial.jobTitle}
              text={project.testimonial.text}
              avatar={project.testimonial.avatar}
              logo={project.testimonial.logo}
            />
          </Container>
        </Section>
      )}

      {/* İlgili hizmet CTA */}
      {project.service && (
        <Section spacing="md" tone="light">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-line bg-surface-raised p-8 md:flex-row md:items-center">
              <div>
                <p className="text-xs tracking-wide text-ink-subtle uppercase">Bu projede uygulanan hizmet</p>
                <h2 className="mt-2 text-xl font-semibold text-ink">{project.service.title}</h2>
              </div>
              <Button asChild>
                <Link href={`/hizmetler/${project.service.slug}`}>
                  Hizmeti İncele
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </Container>
        </Section>
      )}

    </>
  )
}

function ProjectBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-3 border-l-2 border-brand-500 pl-6">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="text-base leading-relaxed whitespace-pre-line text-ink-muted">{body}</p>
    </div>
  )
}
