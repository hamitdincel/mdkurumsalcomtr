'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container, Section } from '@/components/shared/section'
import { MediaImage } from '@/components/shared/media-image'
import { SectionNumber } from '@/components/shared/technical'
import type { SectorSummary } from '@/services/content-service'
import { cn } from '@/lib/utils'

/**
 * SECTION 08 — KULLANIM ALANLARI ("industry matrix")
 *
 * İkon ızgarası yerine tipografik sektör satırları: numara + başlık + ok.
 * Masaüstünde satırın üzerine gelindiğinde sağda ilgili görsel belirir;
 * mobilde görsel yerine sade liste kalır (hover-only bilgi bırakılmaz —
 * satırın kendisi zaten bağlantıdır).
 *
 * Açık yüzeyde kalır: bir önceki teknoloji bölümü koyu olduğu için burada da
 * koyu kullanmak iki bloğu birbirine yapıştırır.
 */
export function UseCases({ sectors }: { sectors: SectorSummary[] }) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  if (sectors.length === 0) return null

  const activeSector = sectors[activeIndex] ?? sectors[0]

  return (
    <Section spacing="md" tone="light">
      <Container>
        <div className="max-w-2xl">
          <SectionNumber number="05" label="UYGULAMA ALANLARI" />
          <h2 className="mt-6 text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-ink">
            Hangi yapılarda çalışıyoruz?
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            Her yapı türünün kendine özgü erişim, güvenlik ve zamanlama gereksinimleri var.
            Planlamayı buna göre yapıyoruz.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          {/* --- Sektör satırları --- */}
          <ul className="flex flex-col">
            {sectors.map((sector, index) => (
              <li key={sector.slug}>
                <Link
                  href={`/sektorler/${sector.slug}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className={cn(
                    'group flex items-center gap-5 border-t border-line py-5 transition-colors duration-300',
                    'last:border-b hover:bg-surface-raised',
                  )}
                >
                  <span
                    className={cn(
                      'tech-label w-6 shrink-0 transition-colors',
                      index === activeIndex ? 'text-brand-600' : 'text-ink-subtle',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="flex-1 text-lg leading-snug font-medium text-ink transition-colors group-hover:text-brand-700 md:text-xl">
                    {sector.title}
                  </span>

                  <ArrowUpRight
                    aria-hidden
                    className="size-5 shrink-0 text-ink-subtle transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* --- Seçili sektörün görseli (yalnızca geniş ekran) --- */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface-sunken">
                {sectors.map((sector, index) => (
                  <div
                    key={sector.slug}
                    aria-hidden={index !== activeIndex}
                    className={cn(
                      'absolute inset-0 transition-opacity duration-500',
                      index === activeIndex ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    <MediaImage
                      src={sector.heroImage}
                      alt=""
                      sizes="30vw"
                      placeholderLabel="Çalışma alanı görseli"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-scrim/70 to-transparent"
                    />
                  </div>
                ))}

                <p className="absolute right-5 bottom-5 left-5 text-sm leading-relaxed text-white/85">
                  {activeSector?.shortDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
