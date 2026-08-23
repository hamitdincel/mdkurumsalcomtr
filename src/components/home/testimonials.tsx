'use client'

import * as React from 'react'
import Image from 'next/image'
import { Quote } from 'lucide-react'
import { Container, Section } from '@/components/shared/section'
import { SectionNumber } from '@/components/shared/technical'
import { cn } from '@/lib/utils'

type Testimonial = {
  id: string
  personName: string
  company: string
  jobTitle: string | null
  text: string
  avatar: string | null
  logo: string | null
}

/**
 * SECTION 13 — MÜŞTERİ YORUMLARI (editorial)
 *
 * Üç genel alıntı kartı yerine tek büyük editorial yorum. Birden fazla kayıt
 * varsa minimal sayfalama kullanılır — OTOMATİK GEÇİŞ YOKTUR (kullanıcı
 * kontrolü esastır).
 *
 * Yalnızca panelden girilmiş gerçek yorumlar gösterilir; kayıt yoksa bölüm
 * hiç render edilmez.
 */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = React.useState(0)

  if (testimonials.length === 0) return null

  const active = testimonials[index] ?? testimonials[0]
  if (!active) return null

  return (
    <Section spacing="md" tone="light">
      <Container>
        <SectionNumber number="07" label="MÜŞTERİ GÖRÜŞÜ" />

        <figure className="mt-10 grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
          <Quote className="size-10 shrink-0 text-brand-500/50" aria-hidden />

          <div>
            <blockquote className="max-w-4xl text-2xl leading-[1.4] font-medium text-balance text-ink md:text-3xl">
              <p>{active.text}</p>
            </blockquote>

            <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
              {active.avatar ? (
                <Image
                  src={active.avatar}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-base font-semibold text-ink-muted"
                >
                  {active.personName.slice(0, 1).toUpperCase()}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-ink">{active.personName}</p>
                <p className="text-sm text-ink-subtle">
                  {[active.jobTitle, active.company].filter(Boolean).join(', ')}
                </p>
              </div>

              {active.logo && (
                <Image
                  src={active.logo}
                  alt={active.company}
                  width={96}
                  height={36}
                  className="h-9 w-auto max-w-28 object-contain opacity-70"
                />
              )}
            </figcaption>

            {/* Minimal sayfalama — otomatik geçiş yok */}
            {testimonials.length > 1 && (
              <div className="mt-8 flex items-center gap-2">
                {testimonials.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    aria-label={`${itemIndex + 1}. yorumu göster`}
                    aria-current={itemIndex === index}
                    className={cn(
                      'h-1 rounded-full transition-all duration-300',
                      itemIndex === index ? 'w-10 bg-brand-500' : 'w-5 bg-line-strong hover:bg-ink-subtle',
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </figure>
      </Container>
    </Section>
  )
}
