import type { Metadata } from 'next'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { EntityForm } from '@/components/admin/entity-form'
import { serviceFormSections } from '@/components/admin/form-configs'
import { saveServiceAction } from '@/actions/content-actions'

export const metadata: Metadata = { title: 'Yeni Hizmet' }

export default function NewServicePage() {
  return (
    <>
      <AdminPageHeader
        title="Yeni Hizmet"
        backHref="/admin/services"
        backLabel="Hizmetler"
        description="Her hizmet için özgün içerik girin; hizmetler arasında aynı metni kopyalamayın."
      />

      <AdminContent>
        <EntityForm
          sections={serviceFormSections()}
          action={saveServiceAction}
          returnHref="/admin/services"
          defaultValues={{ active: true, sortOrder: 0 }}
          submitLabel="Hizmeti Oluştur"
        />
      </AdminContent>
    </>
  )
}
