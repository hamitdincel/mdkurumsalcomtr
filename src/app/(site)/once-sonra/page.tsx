import type { Metadata } from 'next'
import { listBeforeAfterSets } from '@/repositories/project-repository'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section } from '@/components/shared/section'
import { BeforeAfterSlider } from '@/components/shared/before-after-slider'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/empty-state'

export const revalidate = 900

const crumbs = [{ label: 'Öncesi & Sonrası', href: '/once-sonra' }]

export const metadata: Metadata = buildMetadata({
  title: 'Öncesi ve Sonrası — Uygulama Sonuçları',
  description:
    'Tamamladığımız cephe, cam ve panel temizliği uygulamalarının öncesi/sonrası karşılaştırmaları. Tüm görseller gerçek projelerden.',
  path: '/once-sonra',
})

export default async function BeforeAfterPage() {
  const items = await listBeforeAfterSets()

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="Kanıt"
        title="Öncesi ve sonrası"
        description="Uygulama sonuçlarını yalnızca gerçek proje fotoğraflarıyla paylaşıyoruz. Görsellerin üzerindeki tutamacı sürükleyerek karşılaştırabilirsiniz."
        crumbs={crumbs}
      />

      <Section spacing="md" tone="light">
        <Container>
          {items.length === 0 ? (
            <EmptyState
              title="Henüz öncesi/sonrası kaydı eklenmedi"
              description="Uygulama fotoğrafları yönetim panelinden eklendiğinde bu sayfada listelenecektir."
              actionLabel="Teklif Al"
              actionHref="/teklif-al"
            />
          ) : (
            <ul className="grid gap-10 md:grid-cols-2">
              {items.map((item, index) => (
                <li key={item.id} className="flex flex-col gap-4">
                  <BeforeAfterSlider
                    beforeImage={item.beforeImage}
                    afterImage={item.afterImage}
                    beforeAlt={item.beforeAlt}
                    afterAlt={item.afterAlt}
                    title={item.title}
                    priority={index < 2}
                  />
                  <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
                    {item.description && (
                      <p className="text-sm leading-relaxed text-ink-muted">{item.description}</p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {item.buildingType && <Badge tone="outline">{item.buildingType}</Badge>}
                      {item.surfaceType && <Badge tone="outline">{item.surfaceType}</Badge>}
                      {item.city && <Badge tone="outline">{item.city}</Badge>}
                      {item.service?.title && <Badge tone="brand">{item.service.title}</Badge>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

    </>
  )
}
