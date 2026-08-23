'use client'

import * as React from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { MediaImage } from './media-image'
import { cn } from '@/lib/utils'

/**
 * MASKE AÇILIŞLI GÖRSEL
 * ---------------------------------------------------------------------------
 * Görselin üzerindeki graphite perde yukarı çekilirken görsel 1.04'ten 1.0'a
 * iner. Yalnızca sayfanın ANA görsellerinde kullanılır (her fotoğrafta değil) —
 * aksi halde etki değersizleşir.
 *
 * prefers-reduced-motion açıkken perde hiç oluşturulmaz, görsel doğrudan
 * görünür.
 */
export function ImageReveal({
  src,
  alt,
  className,
  imageClassName,
  sizes,
  priority,
  placeholderLabel,
  delay = 0,
}: {
  src: string | null | undefined
  alt: string
  className?: string
  imageClassName?: string
  sizes?: string
  priority?: boolean
  placeholderLabel?: string
  delay?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduceMotion = useReducedMotion()
  const animate = !reduceMotion

  return (
    <div ref={ref} className={cn('relative overflow-hidden bg-surface-sunken', className)}>
      <motion.div
        className="absolute inset-0"
        initial={animate ? { scale: 1.04 } : false}
        animate={animate && inView ? { scale: 1 } : undefined}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        <MediaImage
          src={src}
          alt={alt}
          sizes={sizes}
          priority={priority}
          className={imageClassName}
          placeholderLabel={placeholderLabel}
        />
      </motion.div>

      {animate && (
        <motion.span
          aria-hidden
          className="absolute inset-0 origin-top bg-onyx"
          initial={{ scaleY: 1 }}
          animate={inView ? { scaleY: 0 } : undefined}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </div>
  )
}
