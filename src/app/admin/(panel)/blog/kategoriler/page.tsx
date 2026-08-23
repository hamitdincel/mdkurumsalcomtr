import type { Metadata } from 'next'
import { listCategories } from '@/repositories/post-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { AdminTable } from '@/components/admin/admin-table'
import { EntityForm } from '@/components/admin/entity-form'
import { categoryFormSections } from '@/components/admin/form-configs'
import { saveCategoryAction } from '@/actions/content-actions'
import { CategoryDeleteButton } from '@/components/admin/category-delete-button'

export const metadata: Metadata = { title: 'Blog Kategorileri' }
export const dynamic = 'force-dynamic'

export default async function BlogCategoriesPage() {
  const categories = await listCategories()

  return (
    <>
      <AdminPageHeader
        title="Blog Kategorileri"
        backHref="/admin/blog"
        backLabel="Blog"
        description="İçerik kümelerinizi kategorilerle yapılandırın (pillar/cluster yaklaşımı)."
      />

      <AdminContent className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">
        <div>
          <AdminTable
            rows={categories}
            emptyMessage="Henüz kategori eklenmedi."
            columns={[
              { header: 'Kategori', cell: (row) => row.name },
              {
                header: 'Slug',
                cell: (row) => <code className="text-xs text-ink-subtle">/{row.slug}</code>,
              },
              {
                header: 'Yazı',
                cell: (row) => <span className="tabular-nums">{row._count.posts}</span>,
              },
              {
                header: '',
                cell: (row) => <CategoryDeleteButton id={row.id} name={row.name} />,
                className: 'text-right',
              },
            ]}
          />
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-ink">Yeni Kategori</h2>
          <EntityForm
            sections={categoryFormSections()}
            action={saveCategoryAction}
            returnHref="/admin/blog/kategoriler"
            defaultValues={{ sortOrder: 0 }}
            submitLabel="Kategori Ekle"
          />
        </div>
      </AdminContent>
    </>
  )
}
