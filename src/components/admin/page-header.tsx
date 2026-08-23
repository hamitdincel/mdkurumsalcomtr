import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AdminPageHeader({
  title,
  description,
  backHref,
  backLabel = 'Geri',
  actions,
  className,
}: {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        // Düz yüzey + tek ayraç. Önce section-raised + gölge birlikteydi;
        // veri yoğun ekranlarda gereksiz bir katman sinyaliydi.
        'border-b border-line bg-surface-raised',
        className,
      )}
    >
      <div className="flex flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-col gap-1.5">
          {backHref && (
            <Link
              href={backHref}
              className="mb-1 inline-flex w-fit items-center gap-1.5 text-sm text-ink-subtle transition-colors hover:text-ink"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              {backLabel}
            </Link>
          )}
          <h1 className="text-xl font-semibold text-ink md:text-2xl">{title}</h1>
          {description && <p className="max-w-2xl text-sm text-ink-muted">{description}</p>}
        </div>

        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export function AdminContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('px-5 py-6 md:px-8 md:py-8', className)}>{children}</div>
}
