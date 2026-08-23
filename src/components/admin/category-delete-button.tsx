'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteEntityAction } from '@/actions/content-actions'

export function CategoryDeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [pending, setPending] = React.useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) return

    setPending(true)
    const result = await deleteEntityAction('category', id)
    setPending(false)

    if (result.status === 'error') {
      window.alert(result.message)
      return
    }
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      aria-label={`${name} kategorisini sil`}
      className="rounded-sm p-2 text-ink-subtle transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-50"
    >
      <Trash2 className="size-4" aria-hidden />
    </button>
  )
}
