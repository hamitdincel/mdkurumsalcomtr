import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/shared/section'
import { Reveal, RevealItem } from '@/components/shared/reveal'
import { SectionNumber } from '@/components/shared/technical'
import { Button } from '@/components/ui/button'
import { ServiceCard } from '@/components/cards/service-card'
import type { ServiceSummary } from '@/services/content-service'

/**
 * SECTION 04 — HİZMETLER (bento)
 *
 * Kart yığılmasını kırmak için iki kart tipi karıştırılır:
 *   - İlk hizmet: geniş, fotoğraf baskın "feature tile"
 *   - Yanında: bilgi baskın (zeminli, ikonlu) kart
 *   - Alt sıra: fotoğraf baskın kartlar
 *
 * Böylece aynı görünümde altı kart yan yana dizilmez.
 */
export function ServicesSection({ services }: { services: ServiceSummary[] }) {
  if (services.length === 0) return null

  const [first, second, ...rest] = services

  return (
    <Section tone="light" spacing="lg" className="border-y border-line">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-2xl">
            <SectionNumber number="01" label="HİZMETLER" />
            <h2 className="mt-6 text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-ink">
              Yüzeye ve yapıya göre planlanan hizmetler
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              Her cephe farklı bir malzeme, farklı bir kirlilik türü ve farklı bir erişim koşulu
              barındırır. Uygulama yöntemi keşif sonrasında belirlenir.
            </p>
          </div>

          <Button asChild variant="secondary" className="shrink-0">
            <Link href="/hizmetler">
              Tüm Hizmetler
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <Reveal stagger className="mt-14">
          {/* Üst sıra: geniş feature tile + bilgi kartı */}
          <ul className="grid gap-5 lg:grid-cols-3">
            {first && (
              <RevealItem as="li" className="lg:col-span-2">
                <ServiceCard
                  title={first.title}
                  slug={first.slug}
                  shortDescription={first.shortDescription}
                  icon={first.icon}
                  image={first.heroImage}
                  index={0}
                  variant="media"
                  featured
                  className="h-full"
                />
              </RevealItem>
            )}

            {second && (
              <RevealItem as="li">
                <ServiceCard
                  title={second.title}
                  slug={second.slug}
                  shortDescription={second.shortDescription}
                  icon={second.icon}
                  image={second.heroImage}
                  index={1}
                  variant="info"
                  className="h-full"
                />
              </RevealItem>
            )}
          </ul>

          {/* Alt sıra: fotoğraf baskın kartlar */}
          {rest.length > 0 && (
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {rest.slice(0, 4).map((service, index) => (
                <RevealItem as="li" key={service.slug}>
                  <ServiceCard
                    title={service.title}
                    slug={service.slug}
                    shortDescription={service.shortDescription}
                    icon={service.icon}
                    image={service.heroImage}
                    index={index + 2}
                    variant="media"
                    className="h-full"
                  />
                </RevealItem>
              ))}
            </ul>
          )}
        </Reveal>
      </Container>
    </Section>
  )
}
