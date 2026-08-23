import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Info } from 'lucide-react'
import { listTestimonialsForAdmin } from '@/repositories/content-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { AdminTable, StatusBadge } from '@/components/admin/admin-table'
import { Button } from '@/components/ui/button'
import { truncate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Müşteri Yorumları' }
export const dynamic = 'force-dynamic'

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonialsForAdmin()

  return (
    <>
      <AdminPageHeader
        title="Müşteri Yorumları"
        description="Yalnızca müşteriden alınmış ve yayın onayı verilmiş gerçek yorumlar eklenmelidir."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/testimonials/yeni">
              <Plus className="size-4" aria-hidden />
              Yeni Yorum
            </Link>
          </Button>
        }
      />

      <AdminContent className="flex flex-col gap-5">
        <div className="flex items-start gap-3 rounded-md border border-line bg-surface-sunken p-4 text-sm text-ink-muted">
          <Info className="mt-0.5 size-4 shrink-0 text-ink-subtle" aria-hidden />
          Sahte yorum eklemeyin. Schema.org çıktısında da puan/derecelendirme üretilmez; yalnızca
          gerçek yorumlar sitede gösterilir.
        </div>

        <AdminTable
          rows={testimonials}
          rowHref={(row) => `/admin/testimonials/${row.id}`}
          emptyMessage="Henüz yorum eklenmedi. Yorum eklenene kadar ilgili bölüm sitede gizli kalır."
          columns={[
            { header: 'Kişi', cell: (row) => row.personName },
            { header: 'Firma', cell: (row) => row.company },
            {
              header: 'Yorum',
              cell: (row) => <span className="text-ink-muted">{truncate(row.text, 80)}</span>,
            },
            { header: 'Proje', cell: (row) => row.project?.title ?? '—' },
            { header: 'Durum', cell: (row) => <StatusBadge active={row.active} /> },
          ]}
        />
      </AdminContent>
    </>
  )
}
