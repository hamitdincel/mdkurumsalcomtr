import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Icon } from '@/components/shared/icon'
import { MediaImage } from '@/components/shared/media-image'
import { MediaScrim } from '@/components/shared/media-scrim'
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
  /**
   * Ekranın üst kısmında (fold üstü) görünen kartlar için `true`.
   * next/image varsayılan olarak lazy yükler; ilk satırdaki kart LCP öğesi
   * olduğunda bu, ölçülebilir bir LCP gecikmesi demek. Yalnızca ilk satıra
   * verilir — hepsine verilirse öncelik anlamını yitirir.
   */
  priority?: boolean
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
  priority,
  className,
}: ServiceCardProps) {
  const number = index !== undefined ? String(index + 1).padStart(2, '0') : undefined

  if (variant === 'info') {
    return (
      <article
        className={cn(
          'group border-line bg-surface-raised hover:border-line-strong relative flex flex-col justify-between gap-8 overflow-hidden rounded-md border p-7 transition-colors duration-300',
          className,
        )}
      >
        <span
          aria-hidden
          className="from-brand-500 to-signal absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-300 group-hover:scale-x-100"
        />

        <div className="flex items-start justify-between gap-4">
          <Icon name={icon} className="text-brand-600 size-9" />
          {number && <span className="tech-label text-ink-subtle">{number}</span>}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-ink text-xl leading-snug font-semibold">
            <Link href={`/hizmetler/${slug}`} className="after:absolute after:inset-0">
              {title}
            </Link>
          </h3>
          <p className="text-ink-muted text-base leading-relaxed">{shortDescription}</p>
          <span className="text-brand-600 mt-1 inline-flex items-center gap-1.5 text-sm font-medium">
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
        'group bg-onyx relative isolate flex overflow-hidden rounded-md',
        featured ? 'min-h-[26rem]' : 'min-h-[24rem]',
        className,
      )}
    >
      <MediaImage
        src={image}
        alt={title}
        sizes={featured ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 33vw'}
        priority={priority}
        className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
        placeholderLabel="Hizmet görseli"
      />

      {/* Hover'da marka tonu */}
      <div
        aria-hidden
        className="bg-brand-500/0 group-hover:bg-brand-500/10 absolute inset-0 transition-colors duration-500"
      />
      {/* Accent kenar */}
      <span
        aria-hidden
        className="from-brand-500 to-signal absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100"
      />

      {/*
        AÇIKLAMA YOK, KARARTMA YALNIZCA BU BANTTA.
        Kartta numara, başlık ve ok var; açıklama metni hizmet detayında.
        Karartma fotoğrafın tamamına değil, yalnızca bu satırın arkasına
        uygulanır ve `soft` yoğunlukta — fotoğraf belirgin biçimde kararmaz
        ama başlık ile ok butonu parlak bir zemine denk geldiğinde kaybolmaz.
        Metin gölgesi ikinci kat destek olarak duruyor.
      */}
      <div className="relative mt-auto w-full">
        <MediaScrim soft />

        <div className="relative flex items-end justify-between gap-6 p-6 md:p-7">
          <div className="flex flex-col gap-2.5">
            {number && (
              <span className="tech-label text-signal drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                {number}
              </span>
            )}

            <h3
              className={cn(
                'leading-snug font-semibold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]',
                featured ? 'text-2xl md:text-3xl' : 'text-xl',
              )}
            >
              <Link href={`/hizmetler/${slug}`} className="after:absolute after:inset-0">
                {title}
              </Link>
            </h3>
          </div>

          <span className="group-hover:border-signal group-hover:bg-signal/15 flex size-11 shrink-0 items-center justify-center rounded-sm border border-white/45 text-white transition-all duration-300">
            <ArrowUpRight
              className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </span>
        </div>
      </div>
    </article>
  )
}
