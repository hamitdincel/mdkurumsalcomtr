import Image from 'next/image'
import { Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

type TestimonialCardProps = {
  personName: string
  company: string
  jobTitle?: string | null
  text: string
  avatar?: string | null
  logo?: string | null
  className?: string
}

/** Yalnızca gerçek, alınmış müşteri yorumları için. Sahte yorum üretilmez. */
export function TestimonialCard({
  personName,
  company,
  jobTitle,
  text,
  avatar,
  logo,
  className,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        'flex h-full flex-col gap-5 rounded-md border border-line bg-surface-raised p-7',
        className,
      )}
    >
      <Quote className="size-6 text-brand-500/60" aria-hidden />

      <blockquote className="flex-1 text-base leading-relaxed text-ink">
        <p>{text}</p>
      </blockquote>

      <figcaption className="flex items-center gap-3 border-t border-line pt-5">
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-sm font-semibold text-ink-muted"
          >
            {personName.slice(0, 1).toUpperCase()}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{personName}</p>
          <p className="truncate text-xs text-ink-subtle">
            {[jobTitle, company].filter(Boolean).join(', ')}
          </p>
        </div>

        {logo && (
          <Image
            src={logo}
            alt={company}
            width={72}
            height={28}
            className="h-7 w-auto max-w-20 object-contain opacity-70"
          />
        )}
      </figcaption>
    </figure>
  )
}
