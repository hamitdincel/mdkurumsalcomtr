'use client'

import * as React from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Container, Section } from '@/components/shared/section'
import { formatNumber } from '@/lib/utils'

type Stat = { label: string; value: number; suffix?: string }

/**
 * SECTION 09 — SAYILARLA ŞİRKET (metric rail)
 *
 * Küçük metrik kartları yerine tam genişlikte tek şerit: dev rakamlar,
 * aralarında dikey ayraçlar. Kart yığılmasını kırar ve sayfaya "veri" ritmi
 * katar.
 *
 * KRİTİK KURAL: Bu bölüm YALNIZCA yönetim panelinden gerçek veri girildiğinde
 * görünür. Veri yoksa hiçbir sayaç uydurulmaz ve bölüm hiç render edilmez.
 */
export function StatsSection({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null

  return (
    /*
     * Metrik şeridi sayfa zemininde durur; ayrımı üst/alt hairline ile yapar.
     * Dev rakamlar zaten yeterince güçlü bir odak oluşturduğu için burada ayrıca
     * yüzey tonu değiştirmek gerekmiyor — sayfanın sakinliği korunur.
     */
    <Section spacing="md" tone="light" className="border-y border-line">
      <Container>
        <ul className="grid gap-y-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {stats.map((stat, index) => (
            <li
              key={stat.label}
              className={
                index > 0
                  ? 'flex flex-col gap-2 lg:border-l lg:border-line lg:pl-8'
                  : 'flex flex-col gap-2'
              }
            >
              <CountUp value={stat.value} suffix={stat.suffix} />
              <span className="tech-label text-ink-subtle">{stat.label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = React.useState(reduceMotion ? value : 0)

  // Sayaç animasyonu requestAnimationFrame ile sürülür (dış sistem senkronizasyonu).
  React.useEffect(() => {
    if (!inView || reduceMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hareket azaltma tercihinde animasyon atlanır
      if (reduceMotion) setDisplay(value)
      return
    }

    const duration = 1400
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplay(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, reduceMotion])

  return (
    <motion.span
      ref={ref}
      className="font-display text-[length:var(--text-metric)] leading-[var(--text-metric--line-height)] font-bold tracking-[-0.04em] text-ink tabular-nums"
    >
      {formatNumber(display)}
      {suffix && <span className="ml-1 align-top text-2xl text-brand-600">{suffix}</span>}
    </motion.span>
  )
}
