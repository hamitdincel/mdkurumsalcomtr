import type { Metadata } from 'next'
import { getSettings } from '@/services/settings-service'
import { getServices, getSectors } from '@/services/content-service'
import {
  listActiveReferences,
  listActiveTestimonials,
} from '@/repositories/content-repository'
import { listFeaturedProjects, listBeforeAfterSets } from '@/repositories/project-repository'
import { listPublishedPosts } from '@/repositories/post-repository'
import { buildMetadata } from '@/lib/seo/metadata'
import { siteImages } from '@/config/images'

import { Hero } from '@/components/home/hero'
import { LogoCloud } from '@/components/home/logo-cloud'
import { ProblemSolution } from '@/components/home/problem-solution'
import { ServicesSection } from '@/components/home/services-section'
import { ProcessTimeline } from '@/components/home/process-timeline'
import { TechSection } from '@/components/home/tech-section'
import { BeforeAfterSection } from '@/components/home/before-after-section'
import { UseCases } from '@/components/home/use-cases'
import { StatsSection } from '@/components/home/stats-section'
import { CaseStudies } from '@/components/home/case-studies'
import { Testimonials } from '@/components/home/testimonials'
import { BlogTeaser } from '@/components/home/blog-teaser'
import { OtherServices } from '@/components/shared/other-services'

/** İçerik ISR ile yenilenir; admin güncellemeleri revalidatePath ile anında yansır. */
export const revalidate = 900

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()

  return buildMetadata({
    title: `${settings.brandName} — Drone ile Dış Cephe ve Yüzey Temizliği`,
    description:
      'Drone destekli sistemlerle dış cephe, cam yüzey, güneş paneli ve çatı temizliği. Keşif, operasyon planlaması ve kontrollü uygulama süreciyle kurumsal temizlik çözümleri.',
    path: '/',
    ogImage: settings.defaultOgImage,
  })
}

export default async function HomePage() {
  const [
    settings,
    services,
    sectors,
    references,
    testimonials,
    projects,
    beforeAfter,
    posts,
  ] = await Promise.all([
    getSettings(),
    getServices(),
    getSectors(),
    listActiveReferences(),
    listActiveTestimonials(3),
    listFeaturedProjects(3),
    listBeforeAfterSets({ take: 2 }),
    listPublishedPosts({ take: 3 }),
  ])

  return (
    <>
      {/*
        SAYFA RİTMİ
        (bkz. docs/tasarim-sistemi.txt § 7 — Bölüm ritmi)

        Sağdaki ton, bölümün yüzey katmanıdır. Ton değişimi bir NOKTALAMA
        işaretidir: sayfa baskın olarak `light` zeminde ilerler, `raised`
        birkaç anı işaretler, `dark/deep` sinematik kırılmadır.
        Ardışık bölümlerin aynı tonu paylaşması sorun değildir; sınır
        gerektiğinde hairline ile çizilir.
      */}
      {/* 01 cinematic   dark   */} <Hero settings={settings} />
      {/* 02 minimal     raised */} <LogoCloud references={references} />
      {/* 03 editorial   light  */} <ProblemSolution image={siteImages.problemSolution} />
      {/* 04 bento       light  */} <ServicesSection services={services} />
      {/* 05 editorial   raised */} <ProcessTimeline />
      {/* 06 technical   deep   */} <TechSection image={siteImages.technology} />
      {/* 07 proof       light  */} <BeforeAfterSection items={beforeAfter} />
      {/* 08 editorial   light  */} <UseCases sectors={sectors} />
      {/* 09 metric rail light  */} <StatsSection stats={settings.stats} />
      {/* 10 editorial   light  */} <CaseStudies projects={projects} />
      {/* 12 spacious    light  */} <Testimonials testimonials={testimonials} />
      {/*
        13 — DİĞER HİZMETLER (raised)
        Sona yakın ve düşük vurguyla konumlandırılır: ana sayfanın ağırlığı
        drone temizliğinde kalsın diye bilinçli bir yerleşim.
      */}
      <OtherServices number="08 / GRUP HİZMETLERİ" />
      {/* 14 editorial   light  */} <BlogTeaser posts={posts} />
      {/* 15 — Footer, site layout içinde (sayfanın kapanışı) */}
    </>
  )
}
