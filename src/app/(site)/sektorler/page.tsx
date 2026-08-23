import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getSectors } from '@/services/content-service'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section } from '@/components/shared/section'
import { Reveal, RevealItem } from '@/components/shared/reveal'
import { Icon } from '@/components/shared/icon'
import { EmptyState } from '@/components/shared/empty-state'

export const revalidate = 900

const crumbs = [{ label: 'Çalışma Alanları', href: '/sektorler' }]

export const metadata: Metadata = buildMetadata({
  title: 'Çalışma Alanları — Plaza, AVM, Otel, Fabrika ve GES',
  description:
    'Plazalar, gökdelenler, AVM’ler, oteller, hastaneler, okullar, fabrikalar ve enerji santralleri için cephe ve yüzey temizliği planlaması.',
  path: '/sektorler',
})

export default async function SectorsPage() {
  const sectors = await getSectors()

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="04 / Uygulama Alanları"
        title="Her yapı türünün kendine özgü gereksinimleri var"
        description="Bir hastanenin cephe temizliği planı ile bir lojistik merkezinin planı aynı olamaz. Erişim, güvenlik ve zamanlama gereksinimlerini yapı türüne göre ele alıyoruz."
        crumbs={crumbs}
      />

      <Section spacing="md" tone="light">
        <Container>
          {sectors.length === 0 ? (
            <EmptyState
              title="Çalışma alanı içerikleri henüz eklenmedi"
              description="Yönetim panelinden çalışma alanı kayıtlarını ekleyerek bu sayfayı yayınlayabilirsiniz."
            />
          ) : (
            <Reveal stagger>
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sectors.map((sector) => (
                  <RevealItem as="li" key={sector.slug}>
                    <Link
                      href={`/sektorler/${sector.slug}`}
                      className="group flex h-full flex-col gap-4 rounded-md border border-line bg-surface-raised p-7 transition-all duration-300 hover:border-line-strong hover:shadow-md"
                    >
                      <span className="flex size-11 items-center justify-center rounded-sm bg-surface-sunken text-ink-muted transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
                        <Icon name={sector.icon} className="size-5" />
                      </span>
                      <h2 className="text-lg font-semibold text-ink">{sector.title}</h2>
                      <p className="flex-1 text-sm leading-relaxed text-ink-muted">
                        {sector.shortDescription}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
                        İncele
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </span>
                    </Link>
                  </RevealItem>
                ))}
              </ul>
            </Reveal>
          )}
        </Container>
      </Section>

    </>
  )
}
