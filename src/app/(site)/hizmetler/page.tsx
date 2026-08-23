import type { Metadata } from 'next'
import { getServices } from '@/services/content-service'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section } from '@/components/shared/section'
import { Reveal, RevealItem } from '@/components/shared/reveal'
import { ServiceCard } from '@/components/cards/service-card'
import { EmptyState } from '@/components/shared/empty-state'
import { OtherServices } from '@/components/shared/other-services'

export const revalidate = 900

const crumbs = [{ label: 'Hizmetler', href: '/hizmetler' }]

export const metadata: Metadata = buildMetadata({
  title: 'Hizmetlerimiz — Drone ile Cephe, Cam ve Yüzey Temizliği',
  description:
    'Dış cephe, cam cephe, güneş paneli, çatı ve endüstriyel yüzey temizliği hizmetlerimiz. Ayrıca özel güvenlik, elektronik güvenlik ve tesis yönetimi hizmetleri.',
  path: '/hizmetler',
})

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="01 / Hizmetler"
        title="Yüzeye ve yapıya göre planlanan temizlik hizmetleri"
        description="Her cephe farklı bir malzeme, farklı bir kirlilik türü ve farklı bir erişim koşulu barındırır. Uygulama yöntemini keşif sonrasında birlikte belirliyoruz."
        crumbs={crumbs}
      />

      <Section spacing="md" tone="light">
        <Container>
          {services.length === 0 ? (
            <EmptyState
              title="Hizmet içerikleri henüz eklenmedi"
              description="Yönetim panelinden hizmet kayıtlarını ekleyerek bu sayfayı yayınlayabilirsiniz."
            />
          ) : (
            <Reveal stagger>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <RevealItem as="li" key={service.slug}>
                    <ServiceCard
                      title={service.title}
                      slug={service.slug}
                      shortDescription={service.shortDescription}
                      icon={service.icon}
                      image={service.heroImage}
                      className="h-full"
                    />
                  </RevealItem>
                ))}
              </ul>
            </Reveal>
          )}
        </Container>
      </Section>

      {/*
        Drone hizmetleri yukarıda; grup çatısı altındaki tamamlayıcı hizmetler
        sayfanın sonunda, düşük vurguyla listelenir.
        Ton: hizmet ızgarası "sunken" olduğu için burada "raised" kullanılır.
      */}
      <OtherServices tone="raised" />
    </>
  )
}
