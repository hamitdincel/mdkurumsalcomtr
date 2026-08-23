import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Icon } from '@/components/shared/icon'
import { MediaImage } from '@/components/shared/media-image'
import { cn } from '@/lib/utils'

/**
 * HİZMET KARTI — iki tip
 *
 *   media : Fotoğraf baskın. Görsel tam kartı kaplar, başlık alt gradyanın
 *           üzerinde durur. Öne çıkan hizmetlerde kullanılır.
 *   info  : Bilgi baskın. Zeminsiz/koyu, büyük çizgisel ikon, açıklama ve
 *           hizmet numarası. Kart yığılmasını kırmak için araya girer.
 *
 * Her iki tipte de hover: max 1.035 görsel zoom, ok kayması, accent kenar.
 */
type ServiceCardProps = {
  title: string
  slug: string
  shortDescription: string
  icon?: string | null
  image?: string | null
  /** Sıra numarası — "01" biçiminde gösterilir */
  index?: number
  variant?: 'media' | 'info'
  /** Bento içinde büyük yer kaplayan öne çıkan kart */
  featured?: boolean
  className?: string
}

export function ServiceCard({
  title,
  slug,
  shortDescription,
  icon,
  image,
  index,
  variant = 'media',
  featured,
  className,
}: ServiceCardProps) {
  const number = index !== undefined ? String(index + 1).padStart(2, '0') : undefined

  if (variant === 'info') {
    return (
      <article
        className={cn(
          'group relative flex flex-col justify-between gap-8 overflow-hidden rounded-md border border-line bg-surface-raised p-7 transition-colors duration-300 hover:border-line-strong',
          className,
        )}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-signal transition-transform duration-300 group-hover:scale-x-100"
        />

        <div className="flex items-start justify-between gap-4">
          <Icon name={icon} className="size-9 text-brand-600" />
          {number && <span className="tech-label text-ink-subtle">{number}</span>}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xl leading-snug font-semibold text-ink">
            <Link href={`/hizmetler/${slug}`} className="after:absolute after:inset-0">
              {title}
            </Link>
          </h3>
          <p className="text-base leading-relaxed text-ink-muted">{shortDescription}</p>
          <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
            Detayları İncele
            <ArrowUpRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </span>
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'group relative isolate flex overflow-hidden rounded-md bg-onyx',
        featured ? 'min-h-[26rem]' : 'min-h-80',
        className,
      )}
    >
      <MediaImage
        src={image}
        alt={title}
        sizes={featured ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 33vw'}
        className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
        placeholderLabel="Hizmet görseli"
      />

      {/*
       * Okunabilirlik gradyanı.
       * Parlak fotoğraflarda (gökyüzü, güneş paneli, beyaz cephe) eski yoğunluk
       * yetersizdi ve metin fotoğrafın içinde kayboluyordu. Gradyan artık altta
       * neredeyse opak başlar ve metin bloğunun bittiği yere kadar taşır;
       * üstte görselin kendisi açıkta kalır.
       */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/80 via-45% to-scrim/10"
      />
      {/* Hover'da marka tonu */}
      <div
        aria-hidden
        className="absolute inset-0 bg-brand-500/0 transition-colors duration-500 group-hover:bg-brand-500/10"
      />
      {/* Accent kenar */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-signal transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="relative mt-auto flex w-full items-end justify-between gap-6 p-6 md:p-7">
        <div className="flex flex-col gap-2.5">
          {number && <span className="tech-label text-signal">{number}</span>}

          <h3
            className={cn(
              'leading-snug font-semibold text-white',
              featured ? 'text-2xl md:text-3xl' : 'text-xl',
            )}
          >
            <Link href={`/hizmetler/${slug}`} className="after:absolute after:inset-0">
              {title}
            </Link>
          </h3>

          <p
            className={cn(
              'max-w-md text-sm leading-relaxed text-ink-on-dark-muted',
              featured ? 'block' : 'hidden md:block',
            )}
          >
            {shortDescription}
          </p>
        </div>

        <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-white/25 text-white transition-all duration-300 group-hover:border-signal group-hover:bg-signal/15">
          <ArrowUpRight
            className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </article>
  )
}
