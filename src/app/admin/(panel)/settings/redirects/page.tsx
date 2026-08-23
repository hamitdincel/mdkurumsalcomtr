import type { Metadata } from 'next'
import { listRedirectsForAdmin } from '@/repositories/content-repository'
import { requirePermission } from '@/lib/auth/guard'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { AdminTable, StatusBadge } from '@/components/admin/admin-table'
import { EntityForm } from '@/components/admin/entity-form'
import { redirectFormSections } from '@/components/admin/form-configs'
import { saveRedirectAction } from '@/actions/content-actions'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Yönlendirmeler' }
export const dynamic = 'force-dynamic'

export default async function RedirectsPage() {
  await requirePermission('*')
  const redirects = await listRedirectsForAdmin()

  return (
    <>
      <AdminPageHeader
        title="Yönlendirmeler"
        backHref="/admin/settings"
        backLabel="Site Ayarları"
        description="Bir sayfanın adresi değiştiğinde eski adresi yenisine yönlendirerek SEO değerini koruyun."
      />

      <AdminContent className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <AdminTable
          rows={redirects}
          emptyMessage="Henüz yönlendirme tanımlanmadı."
          columns={[
            {
              header: 'Eski Yol',
              cell: (row) => <code className="text-xs">{row.oldPath}</code>,
            },
            {
              header: 'Yeni Yol',
              cell: (row) => <code className="text-xs text-brand-600">{row.newPath}</code>,
            },
            { header: 'Tip', cell: (row) => <Badge tone="outline">{row.statusCode}</Badge> },
            { header: 'Durum', cell: (row) => <StatusBadge active={row.active} labels={['Aktif', 'Pasif']} /> },
            { header: 'Kullanım', cell: (row) => <span className="tabular-nums">{row.hits}</span> },
          ]}
        />

        <div>
          <h2 className="mb-4 text-sm font-semibold text-ink">Yeni Yönlendirme</h2>
          <EntityForm
            sections={redirectFormSections()}
            action={saveRedirectAction}
            returnHref="/admin/settings/redirects"
            defaultValues={{ active: true, statusCode: '301' }}
            submitLabel="Yönlendirme Ekle"
          />
        </div>
      </AdminContent>
    </>
  )
}
