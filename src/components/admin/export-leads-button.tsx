'use client'

import * as React from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportLeadsAction } from '@/actions/lead-admin-actions'
import type { LeadListFilters } from '@/repositories/lead-repository'

/**
 * CSV dışa aktarım.
 * Dosya sunucuda üretilir, tarayıcıda Blob olarak indirilir — böylece
 * yetkilendirme sunucu tarafında kalır ve URL üzerinden veri sızmaz.
 */
export function ExportLeadsButton({ filters }: { filters: LeadListFilters }) {
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleExport = async () => {
    setPending(true)
    setError(null)

    const result = await exportLeadsAction(filters)
    setPending(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = result.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="secondary" size="sm" onClick={handleExport} loading={pending} disabled={pending}>
        <Download className="size-4" aria-hidden />
        CSV İndir
      </Button>
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
