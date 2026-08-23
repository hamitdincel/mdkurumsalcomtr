import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Crumb = { label: string; href: string }

/**
 * Görsel breadcrumb. Schema.org BreadcrumbList çıktısı ayrıca
 * `breadcrumbSchema()` ile üretilir (bkz. src/lib/seo/schema.ts).
 */
export function Breadcrumb({
  items,
  className,
  dark,
}: {
  items: Crumb[]
  className?: string
  dark?: boolean
}) {
  return (
    <nav aria-label="Sayfa yolu" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="flex items-center gap-1.5">
          <Link
            href="/"
            className={cn(
              'transition-colors',
              dark ? 'text-ink-inverse-muted hover:text-white' : 'text-ink-subtle hover:text-ink',
            )}
          >
            Ana Sayfa
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              <ChevronRight
                aria-hidden
                className={cn('size-3.5', dark ? 'text-ink-inverse-muted/60' : 'text-ink-subtle/60')}
              />
              {isLast ? (
                <span
                  aria-current="page"
                  className={cn('font-medium', dark ? 'text-white' : 'text-ink')}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'transition-colors',
                    dark
                      ? 'text-ink-inverse-muted hover:text-white'
                      : 'text-ink-subtle hover:text-ink',
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
