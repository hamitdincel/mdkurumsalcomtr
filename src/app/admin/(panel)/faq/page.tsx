import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { listFaqsForAdmin } from '@/repositories/content-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { AdminTable, StatusBadge } from '@/components/admin/admin-table'
import { Button } from '@/components/ui/button'
import { truncate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Sık Sorulan Sorular' }
export const dynamic = 'force-dynamic'

export default async function AdminFaqPage() {
  const faqs = await listFaqsForAdmin()

  return (
    <>
      <AdminPageHeader
        title="Sık Sorulan Sorular"
        description="SSS sayfası ve hizmet detaylarındaki soru-cevaplar. FAQPage schema'sı otomatik üretilir."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/faq/yeni">
              <Plus className="size-4" aria-hidden />
              Yeni Soru
            </Link>
          </Button>
        }
      />

      <AdminContent>
        <AdminTable
          rows={faqs}
          rowHref={(row) => `/admin/faq/${row.id}`}
          emptyMessage="Henüz soru eklenmedi."
          columns={[
            { header: 'Soru', cell: (row) => row.question },
            {
              header: 'Cevap',
              cell: (row) => <span className="text-ink-muted">{truncate(row.answer, 70)}</span>,
            },
            { header: 'Hizmet', cell: (row) => row.service?.title ?? 'Genel' },
            { header: 'Durum', cell: (row) => <StatusBadge active={row.active} /> },
            { header: 'Sıra', cell: (row) => <span className="tabular-nums">{row.sortOrder}</span> },
          ]}
        />
      </AdminContent>
    </>
  )
}
