import Link from 'next/link'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * İçerik henüz girilmemiş bölümler için nötr durum bloğu.
 * Sahte içerik üretmek yerine bu blok gösterilir.
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className,
  compact,
}: {
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line-strong bg-surface-raised text-center',
        compact ? 'p-8' : 'p-14',
        className,
      )}
    >
      <Inbox className="size-7 text-ink-subtle" aria-hidden />
      <p className="text-lg font-medium text-ink">{title}</p>
      {description && <p className="max-w-md text-sm text-ink-muted">{description}</p>}
      {actionLabel && actionHref && (
        <Button asChild variant="secondary" size="sm" className="mt-2">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  )
}
