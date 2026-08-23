import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { listBeforeAfterForAdmin } from '@/repositories/project-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { AdminTable, StatusBadge } from '@/components/admin/admin-table'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Öncesi & Sonrası' }
export const dynamic = 'force-dynamic'

export default async function AdminBeforeAfterPage() {
  const sets = await listBeforeAfterForAdmin()

  return (
    <>
      <AdminPageHeader
        title="Öncesi & Sonrası"
        description="Karşılaştırma görselleri. Yalnızca gerçek uygulama fotoğrafları kullanılmalıdır."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/before-after/yeni">
              <Plus className="size-4" aria-hidden />
              Yeni Kayıt
            </Link>
          </Button>
        }
      />

      <AdminContent>
        <AdminTable
          rows={sets}
          rowHref={(row) => `/admin/before-after/${row.id}`}
          emptyMessage="Henüz kayıt eklenmedi. Kayıt eklenene kadar ilgili bölümler sitede gizli kalır."
          columns={[
            { header: 'Başlık', cell: (row) => row.title },
            {
              header: 'Görseller',
              cell: (row) => (
                <div className="flex gap-1.5">
                  <Image
                    src={row.beforeImage}
                    alt=""
                    width={48}
                    height={36}
                    className="h-9 w-12 rounded-xs object-cover"
                    unoptimized
                  />
                  <Image
                    src={row.afterImage}
                    alt=""
                    width={48}
                    height={36}
                    className="h-9 w-12 rounded-xs object-cover"
                    unoptimized
                  />
                </div>
              ),
            },
            { header: 'Hizmet', cell: (row) => row.service?.title ?? '—' },
            { header: 'Proje', cell: (row) => row.project?.title ?? '—' },
            { header: 'Durum', cell: (row) => <StatusBadge active={row.active} /> },
          ]}
        />
      </AdminContent>
    </>
  )
}
