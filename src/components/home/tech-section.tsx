'use client'

import * as React from 'react'
import { Container, Section } from '@/components/shared/section'
import { MediaImage } from '@/components/shared/media-image'
import {
  BlueprintBackground,
  CornerBrackets,
  RadialLight,
  SectionNumber,
} from '@/components/shared/technical'
import { techHotspots } from '@/config/content'
import { altFor } from '@/config/images'
import { cn } from '@/lib/utils'

/**
 * SECTION 06 — DRONE SİSTEMİ (wow moment #2)
 *
 * Sayfanın en koyu ve en "teknik" yüzeyi. Kompozisyon:
 *   - arka planda tek bir ana dekoratif sistem (blueprint) + radyal ışık
 *   - görselin üzerinde tıklanabilir hotspot'lar
 *   - sağda seçili bileşenin açıklaması
 *
 * İÇERİK UYARISI: Burada donanım modeli, basınç, menzil, litre gibi teknik
 * DEĞER YAZILMAZ. Yalnızca sistemin bileşenleri nötr biçimde tanıtılır.
 * Gerçek donanım bilgisi netleştiğinde yönetim panelinden güncellenmelidir.
 */
export function TechSection({ image }: { image?: string | null }) {
  const [active, setActive] = React.useState<string>(techHotspots[0].id)
  const activeIndex = techHotspots.findIndex((h) => h.id === active)
  const activeHotspot = techHotspots[activeIndex] ?? techHotspots[0]

  return (
    <Section tone="deep" spacing="lg" className="relative overflow-hidden">
      <BlueprintBackground opacity="opacity-70" />
      <RadialLight position="50% 0%" color="rgba(17,85,240,0.22)" size="80% 55%" />

      <Container className="relative">
        <div className="max-w-3xl">
          <SectionNumber number="03" label="TEKNOLOJİ" />
          <h2 className="mt-6 text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-ink-inverse">
            Temizliği yalnızca yükseğe taşımadık. Sistemi baştan planladık.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-inverse-muted">
            Uygulama yalnızca havadaki üniteden ibaret değil. Yerdeki su hazırlığı, besleme hattı ve
            operasyon koordinasyonu sonucun asıl belirleyicisi.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-14">
          {/* --- Görsel + hotspot'lar --- */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line-inverse bg-surface-inverse-raised">
              <MediaImage
                src={image}
                alt={altFor(image, 'Drone temizlik sisteminin bileşenleri')}
                sizes="(max-width: 1024px) 100vw, 60vw"
                placeholderLabel="Sistem görseli — yönetim panelinden eklenecek"
              />

              {/* Görselin üzerinde çok hafif teknik ızgara */}
              <div aria-hidden className="blueprint-grid absolute inset-0 opacity-30" />

              {techHotspots.map((hotspot, index) => {
                const isActive = hotspot.id === active
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => setActive(hotspot.id)}
                    onMouseEnter={() => setActive(hotspot.id)}
                    aria-pressed={isActive}
                    className="absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-offset-4"
                    style={{ left: `${hotspot.position.x}%`, top: `${hotspot.position.y}%` }}
                  >
                    <span className="sr-only">{hotspot.title}</span>
                    <span
                      aria-hidden
                      className={cn(
                        // Bu işaretler FOTOĞRAFIN ÜSTÜNDE durur: renkleri temayla
                        // dönmeyen sabit token'lardan gelir.
                        'flex size-8 items-center justify-center rounded-full border transition-all duration-300',
                        isActive
                          ? 'scale-110 border-signal bg-signal/25 shadow-[0_0_0_6px_rgba(0,194,209,0.12)]'
                          : 'border-line-on-dark bg-scrim/50 backdrop-blur-sm hover:border-signal',
                      )}
                    >
                      <span
                        className={cn(
                          'tech-label transition-colors',
                          isActive ? 'text-signal' : 'text-ink-on-dark',
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <CornerBrackets tone="accent" className="opacity-70" />
          </div>

          {/* --- Bileşen listesi --- */}
          <div>
            <ul className="flex flex-col">
              {techHotspots.map((hotspot, index) => {
                const isActive = hotspot.id === active
                return (
                  <li key={hotspot.id}>
                    <button
                      type="button"
                      onClick={() => setActive(hotspot.id)}
                      className={cn(
                        'group flex w-full items-start gap-4 border-t border-line-inverse py-4 text-left transition-colors duration-300',
                        'last:border-b',
                        isActive ? 'bg-surface-inverse-raised' : 'hover:bg-transparent',
                      )}
                    >
                      <span
                        className={cn(
                          'tech-label mt-1 shrink-0 transition-colors',
                          isActive ? 'text-brand-600' : 'text-ink-inverse-muted/60',
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            'block text-base font-semibold transition-colors',
                            isActive ? 'text-ink-inverse' : 'text-ink-inverse-muted group-hover:text-ink-inverse',
                          )}
                        >
                          {hotspot.title}
                        </span>
                        <span
                          className={cn(
                            'mt-1 block text-sm leading-relaxed text-ink-inverse-muted transition-all duration-300',
                            isActive ? 'opacity-100' : 'hidden lg:block lg:opacity-45',
                          )}
                        >
                          {hotspot.description}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* Mobilde seçili bileşenin açıklaması */}
            <p className="mt-6 text-sm leading-relaxed text-ink-inverse-muted lg:hidden">
              <span className="font-semibold text-brand-600">{activeHotspot.title}:</span>{' '}
              {activeHotspot.description}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
