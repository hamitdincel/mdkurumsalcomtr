import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type Column<T> = {
  header: string
  cell: (row: T) => React.ReactNode
  className?: string
}

/** Yönetim panelindeki tüm liste ekranları için ortak tablo. */
export function AdminTable<T extends { id: string }>({
  rows,
  columns,
  rowHref,
  emptyMessage = 'Henüz kayıt bulunmuyor.',
}: {
  rows: T[]
  columns: Column<T>[]
  rowHref?: (row: T) => string
  emptyMessage?: string
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-line-strong bg-surface-raised/50 p-14 text-center">
        <p className="text-sm text-ink-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="panel overflow-x-auto rounded-md">
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="border-b border-line bg-surface-sunken/60">
          <tr className="text-left text-xs tracking-wide text-ink-subtle uppercase">
            {columns.map((column) => (
              <th key={column.header} scope="col" className={cn('px-4 py-3 font-medium', column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-surface-sunken/40">
              {columns.map((column, index) => (
                <td key={column.header} className={cn('px-4 py-3', column.className)}>
                  {index === 0 && rowHref ? (
                    <Link href={rowHref(row)} className="block font-medium text-ink hover:text-brand-600">
                      {column.cell(row)}
                    </Link>
                  ) : (
                    column.cell(row)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StatusBadge({ active, labels }: { active: boolean; labels?: [string, string] }) {
  const [activeLabel, passiveLabel] = labels ?? ['Yayında', 'Pasif']
  return <Badge tone={active ? 'success' : 'neutral'}>{active ? activeLabel : passiveLabel}</Badge>
}
