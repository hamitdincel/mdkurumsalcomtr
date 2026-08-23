import Image from 'next/image'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type MediaImageProps = {
  src: string | null | undefined
  alt: string
  className?: string
  containerClassName?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
  width?: number
  height?: number
  /** Görsel yoksa gösterilecek etiket */
  placeholderLabel?: string
}

/**
 * Görsel sarmalayıcı.
 * - Görsel yoksa stok görsel/placeholder yerine nötr, markaya uygun bir blok gösterir.
 *   (Sahte stok görsel hissi verilmez.)
 * - Uzak host'lar next.config.ts içindeki remotePatterns ile sınırlandırılmıştır.
 */
export function MediaImage({
  src,
  alt,
  className,
  containerClassName,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  priority,
  fill = true,
  width,
  height,
  placeholderLabel,
}: MediaImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-surface-sunken',
          fill ? 'absolute inset-0' : 'aspect-[4/3] w-full',
          containerClassName,
          className,
        )}
        role="img"
        aria-label={placeholderLabel ?? `${alt} — görsel henüz eklenmedi`}
      >
        <div className="flex flex-col items-center gap-2 px-4 text-center text-ink-subtle">
          <ImageOff className="size-6" aria-hidden />
          {placeholderLabel && <span className="text-xs">{placeholderLabel}</span>}
        </div>
      </div>
    )
  }

  if (!fill && width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={className}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      sizes={sizes}
      className={cn('object-cover', className)}
    />
  )
}
