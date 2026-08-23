import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, CheckCircle2, Layers } from 'lucide-react'
import { getServiceDetail, getServiceSlugs, getServices } from '@/services/content-service'
import { getSettings } from '@/services/settings-service'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section, SectionHeader } from '@/components/shared/section'
import { BlueprintBackground, RadialLight } from '@/components/shared/technical'
import { Reveal, RevealItem } from '@/components/shared/reveal'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/icon'
import { Badge } from '@/components/ui/badge'
import { FaqAccordion } from '@/components/shared/faq-accordion'
import { BeforeAfterSlider } from '@/components/shared/before-after-slider'
import { ProjectCard } from '@/components/cards/project-card'
import { ServiceViewTracker } from '@/components/shared/view-tracker'
import { QuoteForm } from '@/components/forms/quote-form'
import { getServiceOptions } from '@/services/content-service'
import { listPublishedPosts } from '@/repositories/post-repository'
import { BlogCard } from '@/components/cards/blog-card'
import { publicEnv } from '@/config/env'

export const revalidate = 900
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getServiceSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceDetail(slug)

  if (!service) {
    return buildMetadata({
      title: 'Hizmet bulunamadı',
      description: 'Aradığınız hizmet sayfası bulunamadı.',
      path: `/hizmetler/${slug}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: service.seoTitle ?? service.title,
    description: service.metaDescription ?? service.shortDescription,
    path: `/hizmetler/${service.slug}`,
    ogImage: service.ogImage ?? service.heroImage,
  })
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = await getServiceDetail(slug)

  if (!service) notFound()

  const [settings, allServices, serviceOptions, posts] = await Promise.all([
    getSettings(),
    getServices(),
    getServiceOptions(),
    listPublishedPosts({ take: 3 }),
  ])

  const crumbs = [
    { label: 'Hizmetler', href: '/hizmetler' },
    { label: service.title, href: `/hizmetler/${service.slug}` },
  ]

  const otherServices = allServices.filter((item) => item.slug !== service.slug).slice(0, 3)
  const faqLd = faqSchema(service.faqs.map((f) => ({ question: f.question, answer: f.answer })))


  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          serviceSchema({
            name: service.title,
            description: service.shortDescription,
            slug: service.slug,
            image: service.heroImage,
          }),
          ...(faqLd ? [faqLd] : []),
        ]}
      />
      <ServiceViewTracker slug={service.slug} title={service.title} />

      {/* 1-2. Breadcrumb + Hero */}
      <PageHero
        variant="media"
        eyebrow="Hizmet"
        title={service.title}
        description={service.shortDescription}
        crumbs={crumbs}
        image={service.heroImage}
        meta={[
          ...(service.surfaces.length > 0
            ? [{ label: 'Uygun Yüzey', value: `${service.surfaces.length} tür` }]
            : []),
          ...(service.processSteps.length > 0
            ? [{ label: 'Süreç', value: `${service.processSteps.length} adım` }]
            : []),
          ...(service.relatedSectors.length > 0
            ? [{ label: 'Çalışma Alanı', value: `${service.relatedSectors.length} sektör` }]
            : []),
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={`/teklif-al?hizmet=${service.slug}`}>
              Bu Hizmet İçin Teklif Al
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outlineInverse">
            <Link href="#surec">Uygulama Sürecini İncele</Link>
          </Button>
        </div>
      </PageHero>

      {/* 3-4. Hizmet nedir + hangi sorunları çözer */}
      <Section spacing="md" tone="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div className="flex flex-col gap-6">
              <SectionHeader eyebrow="Tanım" title={`${service.title} nedir?`} />
              <div className="prose-site">
                <p>{service.intro}</p>
                {service.content && <div dangerouslySetInnerHTML={{ __html: service.content }} />}
              </div>
            </div>

            {service.problems.length > 0 && (
              <aside className="h-fit rounded-lg border border-line bg-surface-raised p-7">
                <h2 className="text-lg font-semibold text-ink">Hangi sorunları çözer?</h2>
                <ul className="mt-5 flex flex-col gap-4">
                  {service.problems.map((problem) => (
                    <li key={problem} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                      {problem}
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </Container>
      </Section>

      {/* 5. Avantajlar */}
      {service.advantages.length > 0 && (
        <Section spacing="md" tone="light">
          <Container>
            <SectionHeader
              eyebrow="Avantajlar"
              title="Bu yöntem ne sağlıyor?"
              description="Aşağıdaki maddeler yöntemin doğasından kaynaklanan genel avantajlardır; her yapıda sonuç keşif ve uygulama planına göre değişir."
            />
            <Reveal stagger className="mt-12">
              <ul className="grid gap-x-10 md:grid-cols-2">
                {service.advantages.map((advantage, index) => (
                  <RevealItem
                    as="li"
                    key={advantage.title}
                    className="flex flex-col gap-2 border-t border-line py-5"
                  >
                    <span className="tech-label text-brand-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-semibold text-ink">{advantage.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-muted">{advantage.description}</p>
                  </RevealItem>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>
      )}

      {/* 6. Uygun yüzeyler */}
      {service.surfaces.length > 0 && (
        <Section spacing="md" tone="light">
          <Container>
            <div className="flex flex-col gap-6 rounded-lg border border-line p-8 md:flex-row md:items-center md:gap-12">
              <div className="flex items-center gap-3 md:w-64 md:shrink-0">
                <Layers className="size-5 text-brand-600" aria-hidden />
                <h2 className="text-lg font-semibold text-ink">Uygun yüzeyler</h2>
              </div>
              <ul className="flex flex-wrap gap-2">
                {service.surfaces.map((surface) => (
                  <li key={surface}>
                    <Badge tone="outline" className="px-3 py-1.5 text-sm">
                      {surface}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      )}

      {/* 7. Uygulama süreci */}
      {service.processSteps.length > 0 && (
        <Section
          spacing="md"
          id="surec"
          tone="dark"
          className="relative isolate scroll-mt-24 overflow-hidden"
        >
          {/* Teknik plan dokusu — süreç anlatımını "operasyon" diline bağlar */}
          <BlueprintBackground opacity="opacity-50" />
          <RadialLight position="15% 0%" color="rgba(17,85,240,0.18)" />

          <Container className="relative">
            <SectionHeader eyebrow="Süreç" title="Uygulama nasıl ilerliyor?" dark />
            <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {service.processSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex flex-col gap-3 border-t-2 border-line-inverse pt-5 transition-colors hover:border-signal"
                >
                  <span className="font-display text-sm font-bold text-brand-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-semibold text-ink-inverse">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-inverse-muted">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      )}

      {/* 8. İlgili sektörler */}
      {service.relatedSectors.length > 0 && (
        <Section spacing="md" tone="light">
          <Container>
            <SectionHeader eyebrow="Çalışma Alanları" title="Bu hizmeti hangi yapılarda veriyoruz?" />
            <ul className="mt-8 flex flex-wrap gap-3">
              {service.relatedSectors.map((sector) => (
                <li key={sector.slug}>
                  <Link
                    href={`/sektorler/${sector.slug}`}
                    className="flex items-center gap-2.5 rounded-sm border border-line bg-surface-raised px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-brand-500 hover:text-brand-600"
                  >
                    <Icon name={sector.icon} className="size-4" />
                    {sector.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* 9. Gerçek proje / önce-sonra örnekleri */}
      {service.beforeAfterSets.length > 0 && (
        <Section spacing="md" tone="light">
          <Container>
            <SectionHeader eyebrow="Kanıt" title="Öncesi ve sonrası" />
            <ul className="mt-10 grid gap-8 md:grid-cols-2">
              {service.beforeAfterSets.map((set) => (
                <li key={set.id} className="flex flex-col gap-3">
                  <BeforeAfterSlider
                    beforeImage={set.beforeImage}
                    afterImage={set.afterImage}
                    beforeAlt={set.beforeAlt}
                    afterAlt={set.afterAlt}
                    title={set.title}
                  />
                  <h3 className="text-base font-semibold text-ink">{set.title}</h3>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {service.projects.length > 0 && (
        <Section spacing="md" tone="light">
          <Container>
            <SectionHeader
              eyebrow="Projeler"
              title="Bu hizmet kapsamında tamamlanan işler"
              action={
                <Button asChild variant="secondary">
                  <Link href="/projeler">Tüm Projeler</Link>
                </Button>
              }
            />
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {service.projects.map((project) => (
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

      {/* 10. SSS */}
      {service.faqs.length > 0 && (
        <Section spacing="md" tone="light">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <SectionHeader
                eyebrow="SSS"
                title={`${service.title} hakkında sık sorulanlar`}
                className="lg:sticky lg:top-28 lg:self-start"
              />
              <FaqAccordion items={service.faqs} />
            </div>
          </Container>
        </Section>
      )}

      {/* 11. Teklif CTA */}
      <Section spacing="md" id="teklif" tone="brand" className="scroll-mt-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <SectionHeader
              eyebrow="Teklif Al"
              title={`${service.title} için keşif talep edin`}
              description="Yapınız hakkındaki birkaç bilgi, gerçekçi bir teklif hazırlamamız için yeterli."
              className="lg:sticky lg:top-28 lg:self-start"
            />
            <div className="panel rounded-lg p-6 md:p-8 shadow-lg">
              <QuoteForm
                services={serviceOptions}
                turnstileSiteKey={publicEnv.turnstileSiteKey}
                whatsapp={settings.whatsapp}
                phone={settings.phone}
                defaultService={service.slug}
                compact
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 12. İlgili blog içerikleri + diğer hizmetler */}
      {posts.length > 0 && (
        <Section spacing="md" tone="light">
          <Container>
            <SectionHeader eyebrow="Blog" title="İlgili içerikler" />
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.id}>
                  <BlogCard
                    title={post.title}
                    slug={post.slug}
                    excerpt={post.excerpt}
                    featuredImage={post.featuredImage}
                    publishedAt={post.publishedAt}
                    categoryName={post.category?.name}
                    readingMinutes={post.readingMinutes}
                    className="h-full"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {otherServices.length > 0 && (
        <Section spacing="md" tone="light">
          <Container>
            {/* "Diğer hizmetlerimiz" (grup hizmetleri) bölümüyle karışmaması
                için bu başlık kardeş temizlik hizmetlerini işaret eder. */}
            <h2 className="text-xs font-semibold tracking-[0.09em] text-ink-subtle uppercase">
              Diğer temizlik hizmetlerimiz
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {otherServices.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/hizmetler/${item.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-md border border-line bg-surface-raised p-5 transition-colors hover:border-brand-500"
                  >
                    <span className="text-sm font-medium text-ink">{item.title}</span>
                    <ArrowRight
                      className="size-4 shrink-0 text-ink-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  )
}
