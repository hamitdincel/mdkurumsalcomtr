'use client'

import * as React from 'react'

/**
 * Hero arka plan videosu.
 *
 * Kurallar:
 *  - Mobilde hiç yüklenmez (veri tüketimi + LCP).
 *  - prefers-reduced-motion aktifse yüklenmez; poster görseli kalır.
 *  - preload="none" + yalnızca görünür olduğunda kaynak atanır.
 *  - Video yüklenene kadar poster görünür; CLS oluşmaz (mutlak konumlu).
 */
export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const [shouldLoad, setShouldLoad] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection

    if (prefersReducedMotion || !isDesktop || connection?.saveData) return

    // Ana içerik yüklendikten sonra videoyu başlat.
    const timer = setTimeout(() => setShouldLoad(true), 600)
    return () => clearTimeout(timer)
  }, [])

  React.useEffect(() => {
    if (shouldLoad) videoRef.current?.play().catch(() => undefined)
  }, [shouldLoad])

  if (!shouldLoad) return null

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 size-full object-cover"
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
