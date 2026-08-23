import type { Metadata } from 'next'
import { getGeneralFaqs } from '@/services/content-service'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section } from '@/components/shared/section'
import { FaqAccordion } from '@/components/shared/faq-accordion'
import { EmptyState } from '@/components/shared/empty-state'

export const revalidate = 900

const crumbs = [{ label: 'Sık Sorulan Sorular', href: '/sss' }]

export const metadata: Metadata = buildMetadata({
  title: 'Sık Sorulan Sorular',
  description:
    'Drone ile dış cephe temizliği nasıl yapılır, hangi yüzeylerde uygulanır, hava koşulları süreci nasıl etkiler? En çok sorulan sorular ve yanıtları.',
  path: '/sss',
})

export default async function FaqPage() {
  const faqs = await getGeneralFaqs()
  const faqLd = faqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })))

  return (
    <>
      <JsonLd data={faqLd ? [breadcrumbSchema(crumbs), faqLd] : breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="SSS"
        title="Sık sorulan sorular"
        description="Süreç, uygulama, güvenlik ve teklif hakkında en çok merak edilenleri derledik. Yanıtını bulamadığınız bir soru varsa bize yazabilirsiniz."
        crumbs={crumbs}
      />

      <Section spacing="md" tone="light">
        <Container className="max-w-4xl">
          {faqs.length === 0 ? (
            <EmptyState
              title="Henüz soru eklenmedi"
              description="Yönetim panelinden SSS kayıtlarını ekleyebilirsiniz."
            />
          ) : (
            <FaqAccordion items={faqs} />
          )}
        </Container>
      </Section>

    </>
  )
}
