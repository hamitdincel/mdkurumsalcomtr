import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { listProjectsForAdmin } from '@/repositories/project-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { AdminTable, StatusBadge } from '@/components/admin/admin-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Projeler' }
export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
  const projects = await listProjectsForAdmin()

  return (
    <>
      <AdminPageHeader
        title="Projeler"
        description="Vaka çalışmaları. Yalnızca gerçekten tamamlanmış işleri yayına alın."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/projects/yeni">
              <Plus className="size-4" aria-hidden />
              Yeni Proje
            </Link>
          </Button>
        }
      />

      <AdminContent>
        <AdminTable
          rows={projects}
          rowHref={(row) => `/admin/projects/${row.id}`}
          emptyMessage="Henüz proje eklenmedi. Proje eklenene kadar ana sayfadaki vaka çalışmaları bölümü gizli kalır."
          columns={[
            { header: 'Proje', cell: (row) => row.title },
            { header: 'Şehir', cell: (row) => row.city },
            { header: 'Hizmet', cell: (row) => row.service?.title ?? '—' },
            {
              header: 'Durum',
              cell: (row) => (
                <div className="flex gap-1.5">
                  <StatusBadge active={row.published} />
                  {row.featured && <Badge tone="brand">Öne çıkan</Badge>}
                </div>
              ),
            },
            {
              header: 'Tamamlanma',
              cell: (row) => (
                <span className="whitespace-nowrap text-ink-subtle">
                  {formatDate(row.completionDate) || '—'}
                </span>
              ),
            },
          ]}
        />
      </AdminContent>
    </>
  )
}
