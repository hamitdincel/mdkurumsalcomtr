import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/shared/section'
import { SectionNumber } from '@/components/shared/technical'
import { Button } from '@/components/ui/button'
import { FaqAccordion, type FaqEntry } from '@/components/shared/faq-accordion'

/** SECTION 14 — SSS (FAQPage schema ana sayfada ayrıca üretilir) */
export function FaqSection({ items }: { items: FaqEntry[] }) {
  if (items.length === 0) return null

  return (
    <Section spacing="md" tone="light" className="border-t border-line">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
            <div>
              <SectionNumber number="09" label="MERAK EDİLENLER" />
              <h2 className="mt-6 text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-ink">
                Sık sorulan sorular
              </h2>
              <p className="mt-5 max-w-sm text-lg leading-relaxed text-ink-muted">
                Süreç, uygulama ve teklif hakkında en çok merak edilenler.
              </p>
            </div>
            <Button asChild variant="secondary" className="self-start">
              <Link href="/sss">
                Tüm Sorular
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <FaqAccordion items={items.slice(0, 6)} />
        </div>
      </Container>
    </Section>
  )
}
