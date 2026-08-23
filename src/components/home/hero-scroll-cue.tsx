'use client'

import * as React from 'react'

/**
 * Masaüstünde hero'nun sol alt köşesinde minimal kaydırma ipucu.
 * İlk kaydırmadan sonra kaybolur; mobilde hiç gösterilmez (yer darlığı).
 * Tamamen dekoratiftir → aria-hidden.
 */
export function HeroScrollCue() {
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) setVisible(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <span
      aria-hidden
      className="tech-label pointer-events-none absolute bottom-28 right-8 hidden flex-col items-center gap-2 text-white/45 transition-opacity duration-500 lg:flex"
    >
      <span className="[writing-mode:vertical-rl]">Kaydırın</span>
      <span className="h-12 w-px bg-gradient-to-b from-white/50 to-transparent" />
    </span>
  )
}
