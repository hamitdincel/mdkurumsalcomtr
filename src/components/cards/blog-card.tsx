import Link from 'next/link'
import { Clock } from 'lucide-react'
import { MediaImage } from '@/components/shared/media-image'
import { cn, formatDate } from '@/lib/utils'

type BlogCardProps = {
  title: string
  slug: string
  excerpt: string
  featuredImage?: string | null
  publishedAt?: Date | string | null
  categoryName?: string | null
  readingMinutes?: number | null
  className?: string
}

export function BlogCard({
  title,
  slug,
  excerpt,
  featuredImage,
  publishedAt,
  categoryName,
  readingMinutes,
  className,
}: BlogCardProps) {
  return (
    <article
      className={cn(
        'group relative flex flex-col gap-4 rounded-md border border-line bg-surface-raised p-4 transition-all duration-300 hover:border-line-strong hover:shadow-md',
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-surface-sunken">
        <MediaImage
          src={featuredImage}
          alt={title}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
          placeholderLabel="Yazı görseli"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-2 pb-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-subtle">
          {categoryName && <span className="font-medium text-brand-600">{categoryName}</span>}
          {publishedAt && (
            <>
              {categoryName && <span aria-hidden>·</span>}
              <time dateTime={new Date(publishedAt).toISOString()}>{formatDate(publishedAt)}</time>
            </>
          )}
          {readingMinutes ? (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" aria-hidden />
                {readingMinutes} dk
              </span>
            </>
          ) : null}
        </div>

        <h3 className="text-lg leading-snug font-semibold text-ink">
          <Link href={`/blog/${slug}`} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">{excerpt}</p>
      </div>
    </article>
  )
}
