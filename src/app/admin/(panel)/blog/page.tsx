import type { Metadata } from 'next'
import Link from 'next/link'
import { FolderTree, Plus } from 'lucide-react'
import { listPostsForAdmin } from '@/repositories/post-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { AdminTable } from '@/components/admin/admin-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateTime } from '@/lib/utils'

export const metadata: Metadata = { title: 'Blog' }
export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const posts = await listPostsForAdmin()

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="SEO odaklı içerikler. Her yazı için benzersiz başlık ve meta açıklama girin."
        actions={
          <>
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/blog/kategoriler">
                <FolderTree className="size-4" aria-hidden />
                Kategoriler
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/blog/yeni">
                <Plus className="size-4" aria-hidden />
                Yeni Yazı
              </Link>
            </Button>
          </>
        }
      />

      <AdminContent>
        <AdminTable
          rows={posts}
          rowHref={(row) => `/admin/blog/${row.id}`}
          emptyMessage="Henüz yazı eklenmedi."
          columns={[
            { header: 'Başlık', cell: (row) => row.title },
            { header: 'Kategori', cell: (row) => row.category?.name ?? '—' },
            {
              header: 'Durum',
              cell: (row) =>
                row.status === 'PUBLISHED' ? (
                  <Badge tone="success">Yayında</Badge>
                ) : (
                  <Badge tone="neutral">Taslak</Badge>
                ),
            },
            {
              header: 'Yayın',
              cell: (row) => (
                <span className="whitespace-nowrap text-ink-subtle">
                  {formatDate(row.publishedAt) || '—'}
                </span>
              ),
            },
            { header: 'Yazar', cell: (row) => row.author?.name ?? '—' },
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
