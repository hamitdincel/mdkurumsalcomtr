import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { listServicesForAdmin } from '@/repositories/service-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { AdminTable, StatusBadge } from '@/components/admin/admin-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'

export const metadata: Metadata = { title: 'Hizmetler' }
export const dynamic = 'force-dynamic'

export default async function AdminServicesPage() {
  const services = await listServicesForAdmin()

  return (
    <>
      <AdminPageHeader
        title="Hizmetler"
        description="Hizmet sayfalarını buradan yönetebilirsiniz. Her hizmet için özgün içerik ve SEO metni girilmelidir."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/services/yeni">
              <Plus className="size-4" aria-hidden />
              Yeni Hizmet
            </Link>
          </Button>
        }
      />

      <AdminContent>
        <AdminTable
          rows={services}
          rowHref={(row) => `/admin/services/${row.id}`}
          emptyMessage="Henüz hizmet eklenmedi. Yeni hizmet ekleyerek başlayın."
          columns={[
            { header: 'Başlık', cell: (row) => row.title },
            {
              header: 'Slug',
              cell: (row) => <code className="text-xs text-ink-subtle">/{row.slug}</code>,
            },
            {
              header: 'Durum',
              cell: (row) => (
                <div className="flex gap-1.5">
                  <StatusBadge active={row.active} />
                  {row.featured && <Badge tone="brand">Öne çıkan</Badge>}
                </div>
              ),
            },
            {
              header: 'Proje',
              cell: (row) => <span className="tabular-nums">{row._count.projects}</span>,
            },
            {
              header: 'Talep',
              cell: (row) => <span className="tabular-nums">{row._count.leads}</span>,
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
