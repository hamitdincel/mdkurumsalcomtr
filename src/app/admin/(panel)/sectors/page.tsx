import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { listSectorsForAdmin } from '@/repositories/sector-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { AdminTable, StatusBadge } from '@/components/admin/admin-table'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'

export const metadata: Metadata = { title: 'Çalışma Alanları' }
export const dynamic = 'force-dynamic'

export default async function AdminSectorsPage() {
  const sectors = await listSectorsForAdmin()

  return (
    <>
      <AdminPageHeader
        title="Çalışma Alanları"
        description="Plaza, AVM, otel, fabrika gibi yapı türlerine özel sayfalar."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/sectors/yeni">
              <Plus className="size-4" aria-hidden />
              Yeni Çalışma Alanı
            </Link>
          </Button>
        }
      />

      <AdminContent>
        <AdminTable
          rows={sectors}
          rowHref={(row) => `/admin/sectors/${row.id}`}
          emptyMessage="Henüz çalışma alanı eklenmedi."
          columns={[
            { header: 'Başlık', cell: (row) => row.title },
            {
              header: 'Slug',
              cell: (row) => <code className="text-xs text-ink-subtle">/{row.slug}</code>,
            },
            { header: 'Durum', cell: (row) => <StatusBadge active={row.active} /> },
            {
              header: 'Proje',
              cell: (row) => <span className="tabular-nums">{row._count.projects}</span>,
            },
            {
              header: 'Güncelleme',
              cell: (row) => (
                <span className="whitespace-nowrap text-ink-subtle">{formatDateTime(row.updatedAt)}</span>
              ),
            },
          ]}
        />
      </AdminContent>
    </>
  )
}
