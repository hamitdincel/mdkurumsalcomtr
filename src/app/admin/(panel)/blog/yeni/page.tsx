import type { Metadata } from 'next'
import { listCategories } from '@/repositories/post-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { PostForm } from '@/components/admin/post-form'

export const metadata: Metadata = { title: 'Yeni Yazı' }
export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
  const categories = await listCategories()

  return (
    <>
      <AdminPageHeader title="Yeni Yazı" backHref="/admin/blog" backLabel="Blog" />

      <AdminContent>
        <PostForm categories={categories.map((c) => ({ value: c.id, label: c.name }))} />
      </AdminContent>
    </>
  )
}
