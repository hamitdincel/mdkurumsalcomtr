'use client'

import * as React from 'react'
import Image from 'next/image'
import { MoveHorizontal } from 'lucide-react'
import { trackEvent } from '@/lib/analytics/events'
import { cn } from '@/lib/utils'

type BeforeAfterSliderProps = {
  beforeImage: string
  afterImage: string
  beforeAlt?: string | null
  afterAlt?: string | null
  title?: string
  className?: string
  priority?: boolean
}

/**
 * Öncesi/sonrası karşılaştırma bileşeni.
 *
 * Erişilebilirlik: Sürükleme dışında klavye (ok tuşları) ile de kontrol edilir;
 * slider bir <input type="range"> üzerinden yönetilir, bu sayede ekran
 * okuyucular ve klavye kullanıcıları için native davranış korunur.
 *
 * Performans: Görseller lazy yüklenir (priority verilmedikçe).
 */
export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  title,
  className,
  priority,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = React.useState(50)
  const [dragging, setDragging] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const interactionTracked = React.useRef(false)

  const reportInteraction = React.useCallback(() => {
    if (interactionTracked.current) return
    interactionTracked.current = true
    trackEvent('before_after_interaction', { title: title ?? 'before_after' })
  }, [title])

  const updateFromClientX = React.useCallback(
    (clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const next = ((clientX - rect.left) / rect.width) * 100
      setPosition(Math.min(100, Math.max(0, next)))
      reportInteraction()
    },
    [reportInteraction],
  )

  React.useEffect(() => {
    if (!dragging) return

    const onPointerMove = (event: PointerEvent) => updateFromClientX(event.clientX)
    const onPointerUp = () => setDragging(false)

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [dragging, updateFromClientX])

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative aspect-[4/3] w-full touch-pan-y overflow-hidden rounded-md bg-surface-sunken select-none',
        className,
      )}
      onPointerDown={(event) => {
        setDragging(true)
        updateFromClientX(event.clientX)
      }}
    >
      {/* SONRASI — alt katman */}
      <Image
        src={afterImage}
        alt={afterAlt ?? `${title ?? 'Uygulama'} — sonrası`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
        className="object-cover"
        draggable={false}
      />

      {/* ÖNCESİ — üst katman, clip-path ile kırpılır */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image
          src={beforeImage}
          alt={beforeAlt ?? `${title ?? 'Uygulama'} — öncesi`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          className="object-cover"
          draggable={false}
        />
      </div>

      {/* Etiketler */}
      <span className="pointer-events-none absolute top-3 left-3 rounded-xs bg-scrim/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
        Öncesi
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-xs bg-action/90 px-2.5 py-1 text-xs font-medium text-on-action backdrop-blur-sm">
        Sonrası
      </span>

      {/* Ayırıcı çizgi */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-paper shadow-md"
        style={{ left: `${position}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink-on-paper shadow-lg">
          <MoveHorizontal className="size-5" aria-hidden />
        </span>
      </div>

      {/* Klavye ve ekran okuyucu kontrolü */}
      <label className="sr-only" htmlFor={`ba-${title ?? 'slider'}`}>
        {title ? `${title} — öncesi/sonrası karşılaştırma` : 'Öncesi/sonrası karşılaştırma'}
      </label>
      <input
        id={`ba-${title ?? 'slider'}`}
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(event) => {
          setPosition(Number(event.target.value))
          reportInteraction()
        }}
        aria-valuetext={`Öncesi görünürlüğü %${Math.round(position)}`}
        className="absolute inset-x-0 bottom-0 h-11 w-full cursor-ew-resize opacity-0"
      />
    </div>
  )
}
