import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { listReferencesForAdmin } from '@/repositories/content-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { AdminTable, StatusBadge } from '@/components/admin/admin-table'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Referanslar' }
export const dynamic = 'force-dynamic'

export default async function AdminReferencesPage() {
  const references = await listReferencesForAdmin()

  return (
    <>
      <AdminPageHeader
        title="Referanslar"
        description="Ana sayfadaki logo bandı. Yalnızca gerçekten çalıştığınız ve logo kullanım izni aldığınız kurumları ekleyin."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/references/yeni">
              <Plus className="size-4" aria-hidden />
              Yeni Referans
            </Link>
          </Button>
        }
      />

      <AdminContent>
        <AdminTable
          rows={references}
          rowHref={(row) => `/admin/references/${row.id}`}
          emptyMessage="Henüz referans eklenmedi. Referans eklenene kadar ana sayfadaki logo bandı gizli kalır."
          columns={[
            { header: 'Firma', cell: (row) => row.name },
            {
              header: 'Logo',
              cell: (row) => (
                <Image
                  src={row.logo}
                  alt=""
                  width={90}
                  height={30}
                  className="h-7 w-auto max-w-24 object-contain"
                  unoptimized
                />
              ),
            },
            { header: 'Durum', cell: (row) => <StatusBadge active={row.active} /> },
            { header: 'Sıra', cell: (row) => <span className="tabular-nums">{row.sortOrder}</span> },
          ]}
        />
      </AdminContent>
    </>
  )
}
