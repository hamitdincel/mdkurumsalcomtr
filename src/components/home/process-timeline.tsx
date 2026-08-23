'use client'

import * as React from 'react'
import { Container, Section } from '@/components/shared/section'
import { MeasureRule, SectionNumber } from '@/components/shared/technical'
import { processSteps } from '@/config/content'
import { cn } from '@/lib/utils'

/**
 * SECTION 05 — NASIL ÇALIŞIR (scroll story)
 *
 * Masaüstünde solda yapışkan başlık ve ilerleme çizgisi, sağda kaydırıldıkça
 * aktifleşen adımlar. Mobilde sade dikey zaman çizelgesine iner.
 *
 * Performans/erişilebilirlik:
 *  - Scroll listener YOK; IntersectionObserver kullanılır.
 *  - Aktiflik yalnızca görsel vurgudur; tüm metinler her zaman DOM'da ve
 *    okunabilir durumdadır (SEO ve ekran okuyucu için).
 *  - prefers-reduced-motion'da geçişler devre dışı kalır (global kural).
 */
export function ProcessTimeline() {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const stepRefs = React.useRef<(HTMLLIElement | null)[]>([])

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visible) return
        const index = Number((visible.target as HTMLElement).dataset.index)
        if (!Number.isNaN(index)) setActiveIndex(index)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0.1, 0.5, 1] },
    )

    for (const node of stepRefs.current) {
      if (node) observer.observe(node)
    }
    return () => observer.disconnect()
  }, [])

  const progress = ((activeIndex + 1) / processSteps.length) * 100

  return (
    <Section tone="light" spacing="md" id="surec" className="scroll-mt-28 border-y border-line">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* --- Yapışkan başlık + ilerleme --- */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionNumber number="02" label="SÜREÇ" />

            <h2 className="mt-6 text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-ink">
              5 adımda operasyon
            </h2>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
              Teklif öncesinde binayı tanımak, doğru yöntemi seçmenin ilk şartı. Süreç her projede
              aynı disiplinle ilerliyor.
            </p>

            {/* İlerleme çizgisi — dekoratif */}
            <div aria-hidden className="mt-10 hidden items-center gap-4 lg:flex">
              <span className="tech-label text-brand-600">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="relative h-px flex-1 bg-line-strong">
                <span
                  className="absolute inset-y-0 left-0 bg-brand-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </span>
              <span className="tech-label text-ink-subtle">
                {String(processSteps.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* --- Adımlar --- */}
          <ol className="flex flex-col">
            {processSteps.map((step, index) => {
              const isActive = index === activeIndex

              return (
                <li
                  key={step.number}
                  data-index={index}
                  ref={(node) => {
                    stepRefs.current[index] = node
                  }}
                  className="relative border-t border-line py-8 last:border-b lg:py-12"
                >
                  {/* Aktif adımın sol kenar göstergesi */}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute top-0 left-0 h-full w-0.5 origin-top bg-brand-500 transition-transform duration-500',
                      isActive ? 'scale-y-100' : 'scale-y-0',
                    )}
                  />

                  <div className={cn('transition-opacity duration-500 lg:pl-8', isActive ? 'opacity-100' : 'lg:opacity-60')}>
                    <div className="flex items-baseline gap-4">
                      <span
                        className={cn(
                          'tech-label transition-colors',
                          isActive ? 'text-brand-600' : 'text-ink-subtle',
                        )}
                      >
                        {step.number}
                      </span>
                      <h3 className="text-xl font-semibold text-ink md:text-2xl">{step.title}</h3>
                    </div>

                    <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted lg:pl-12">
                      {step.description}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <MeasureRule className="mt-14 hidden lg:block" />
      </Container>
    </Section>
  )
}
