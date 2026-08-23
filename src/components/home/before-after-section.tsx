'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/shared/section'
import { Button } from '@/components/ui/button'
import { BeforeAfterSlider } from '@/components/shared/before-after-slider'
import { SectionNumber } from '@/components/shared/technical'
import { cn } from '@/lib/utils'

export type BeforeAfterItem = {
  id: string
  title: string
  beforeImage: string
  afterImage: string
  beforeAlt: string | null
  afterAlt: string | null
  buildingType: string | null
  surfaceType: string | null
  city: string | null
  service?: { title: string } | null
}

/**
 * SECTION 07 — ÖNCESİ & SONRASI (kanıt bölümü)
 *
 * Tek kayıt varsa neredeyse tam genişlikte tek bir güçlü karşılaştırma;
 * birden fazla kayıt varsa otomatik döngü YERİNE kullanıcı kontrollü seçici
 * (tab) kullanılır — dikkat çalınmaz, kullanıcı yönetir.
 *
 * Yalnızca gerçek proje fotoğrafları kullanılır; kayıt yoksa bölüm hiç
 * render edilmez.
 */
export function BeforeAfterSection({ items }: { items: BeforeAfterItem[] }) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  if (items.length === 0) return null

  const active = items[activeIndex] ?? items[0]
  if (!active) return null

  const metadata = [active.buildingType, active.surfaceType, active.city, active.service?.title]
    .filter(Boolean)
    .join(' · ')

  return (
    <Section tone="light" spacing="md" className="border-y border-line">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-2xl">
            <SectionNumber number="04" label="KANIT" />
            <h2 className="mt-6 text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-ink">
              Sonucu görün.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              Uygulama sonuçlarını gerçek proje fotoğraflarıyla paylaşıyoruz. Tutamacı sürükleyerek
              karşılaştırabilirsiniz.
            </p>
          </div>

          <Button asChild variant="secondary" className="shrink-0">
            <Link href="/once-sonra">
              Tümünü Gör
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        {/* Birden fazla kayıt varsa seçici */}
        {items.length > 1 && (
          <div
            role="tablist"
            aria-label="Öncesi ve sonrası örnekleri"
            className="mt-10 flex flex-wrap gap-2"
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                role="tab"
                type="button"
                aria-selected={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'rounded-sm border px-4 py-2.5 text-sm transition-colors',
                  index === activeIndex
                    ? 'border-ink bg-ink text-surface'
                    : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink',
                )}
              >
                {item.title}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10">
          <BeforeAfterSlider
            key={active.id}
            beforeImage={active.beforeImage}
            afterImage={active.afterImage}
            beforeAlt={active.beforeAlt}
            afterAlt={active.afterAlt}
            title={active.title}
            className="aspect-[16/10] md:aspect-[21/9]"
            priority
          />

          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6 md:flex-row md:items-baseline md:justify-between">
            <h3 className="text-lg font-semibold text-ink">{active.title}</h3>
            {metadata && <p className="tech-label text-ink-subtle">{metadata}</p>}
          </div>
        </div>
      </Container>
    </Section>
  )
}
