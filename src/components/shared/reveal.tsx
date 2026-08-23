'use client'

import * as React from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * MERKEZİ REVEAL SİSTEMİ
 * ---------------------------------------------------------------------------
 * SADELEŞTİRİLDİ. Süreler 600–900ms ve hareket mesafeleri 24–28px idi; ayrıca
 * `clip` varyantı maske animasyonu yapıyordu. Uzun, gösterişli girişler sayfada
 * aşağı inildikçe yoruyordu.
 *
 * Yeni motion dili: yalnızca opaklık + küçük translate, 240–320ms, bir kez.
 *
 *   fade  → yalnızca opaklık (metin blokları, ikincil içerik)
 *   rise  → opaklık + 10px yükselme (kartlar, listeler)
 *   clip  → başlık blokları; artık maske değil, biraz daha belirgin rise
 *   line  → soldan büyüyen çizgi (ayraçlar)
 *
 * prefers-reduced-motion açıkken hiçbiri uygulanmaz; içerik anında görünür.
 */
export type RevealVariant = 'fade' | 'rise' | 'clip' | 'line'

const EASE = [0.22, 1, 0.36, 1] as const

const variantMap: Record<RevealVariant, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.26, ease: EASE } },
  },
  rise: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
  },
  clip: {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
  },
  line: {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.4, ease: EASE } },
  },
}

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  variant?: RevealVariant
  /** Alt öğeleri sırayla göstermek için */
  stagger?: boolean
  as?: 'div' | 'section' | 'li' | 'article' | 'span'
}

export function Reveal({
  children,
  className,
  delay = 0,
  variant = 'rise',
  stagger,
  as = 'div',
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const MotionComp = motion[as]

  if (reduceMotion) {
    const Comp = as
    return <Comp className={className}>{children}</Comp>
  }

  const base = variantMap[variant]
  const visible = (base.visible ?? {}) as Record<string, unknown>
  const transition = (visible.transition ?? {}) as Record<string, unknown>

  const variants: Variants = {
    hidden: base.hidden ?? {},
    visible: {
      ...visible,
      transition: {
        ...transition,
        delay,
        ...(stagger ? { staggerChildren: 0.04, delayChildren: delay } : {}),
      },
    },
  }

  return (
    <MotionComp
      className={cn(variant === 'line' && 'origin-left', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
    >
      {children}
    </MotionComp>
  )
}

export const revealChild: Variants = variantMap.rise

export function RevealItem({
  children,
  className,
  as = 'div',
  variant = 'rise',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
  variant?: RevealVariant
}) {
  const reduceMotion = useReducedMotion()
  const MotionComp = motion[as]

  if (reduceMotion) {
    const Comp = as
    return <Comp className={className}>{children}</Comp>
  }

  return (
    <MotionComp className={className} variants={variantMap[variant]}>
      {children}
    </MotionComp>
  )
}
