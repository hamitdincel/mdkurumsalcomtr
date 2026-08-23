import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { MediaImage } from '@/components/shared/media-image'
import { Badge } from '@/components/ui/badge'
import { cn, formatNumber } from '@/lib/utils'

type ProjectCardProps = {
  title: string
  slug: string
  city: string
  summary: string
  coverImage?: string | null
  surfaceType?: string | null
  buildingType?: string | null
  area?: number | null
  serviceTitle?: string | null
  clientName?: string | null
  anonymized?: boolean
  sectorTitle?: string | null
  className?: string
}

export function ProjectCard({
  title,
  slug,
  city,
  summary,
  coverImage,
  surfaceType,
  buildingType,
  area,
  serviceTitle,
  clientName,
  anonymized,
  sectorTitle,
  className,
}: ProjectCardProps) {
  // Müşteri adı gizliyse sektör adı gösterilir — uydurma isim kullanılmaz.
  const clientLabel = anonymized ? (sectorTitle ?? 'Kurumsal müşteri') : clientName

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-md border border-line bg-surface-raised transition-all duration-300 hover:border-line-strong hover:shadow-lg',
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-signal transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="relative aspect-[4/3] overflow-hidden bg-surface-sunken">
        <MediaImage
          src={coverImage}
          alt={title}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
          placeholderLabel="Proje görseli"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-subtle">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden />
            {city}
          </span>
          {clientLabel && (
            <>
              <span aria-hidden>·</span>
              <span>{clientLabel}</span>
            </>
          )}
        </div>

        <h3 className="text-lg font-semibold text-ink">
          <Link href={`/projeler/${slug}`} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>

        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-ink-muted">{summary}</p>

        <div className="mt-1 flex flex-wrap gap-1.5">
          {serviceTitle && <Badge tone="brand">{serviceTitle}</Badge>}
          {buildingType && <Badge tone="outline">{buildingType}</Badge>}
          {surfaceType && <Badge tone="outline">{surfaceType}</Badge>}
          {area ? <Badge tone="outline">{formatNumber(area)} m²</Badge> : null}
        </div>

        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
          Projeyi İncele
          <ArrowUpRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </article>
  )
}
