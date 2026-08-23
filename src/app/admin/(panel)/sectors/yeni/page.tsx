import type { Metadata } from 'next'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { EntityForm } from '@/components/admin/entity-form'
import { sectorFormSections } from '@/components/admin/form-configs'
import { saveSectorAction } from '@/actions/content-actions'
import { serviceOptions } from '@/repositories/service-repository'

export const metadata: Metadata = { title: 'Yeni Çalışma Alanı' }
export const dynamic = 'force-dynamic'

export default async function NewSectorPage() {
  const services = await serviceOptions()

  return (
    <>
      <AdminPageHeader
        title="Yeni Çalışma Alanı"
        backHref="/admin/sectors"
        backLabel="Çalışma Alanları"
      />

      <AdminContent>
        <EntityForm
          sections={sectorFormSections(services.map((s) => ({ value: s.id, label: s.title })))}
          action={saveSectorAction}
          returnHref="/admin/sectors"
          defaultValues={{ active: true, sortOrder: 0 }}
          submitLabel="Çalışma Alanı Oluştur"
        />
      </AdminContent>
    </>
  )
}
