import type { Metadata } from 'next'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { EntityForm } from '@/components/admin/entity-form'
import { projectFormSections } from '@/components/admin/form-configs'
import { saveProjectAction } from '@/actions/content-actions'
import { serviceOptions } from '@/repositories/service-repository'
import { sectorOptions } from '@/repositories/sector-repository'

export const metadata: Metadata = { title: 'Yeni Proje' }
export const dynamic = 'force-dynamic'

export default async function NewProjectPage() {
  const [services, sectors] = await Promise.all([serviceOptions(), sectorOptions()])

  return (
    <>
      <AdminPageHeader
        title="Yeni Proje"
        backHref="/admin/projects"
        backLabel="Projeler"
        description="Yalnızca gerçek proje verilerini girin. Süre, alan gibi alanlar bilinmiyorsa boş bırakın."
      />

      <AdminContent>
        <EntityForm
          sections={projectFormSections(
            services.map((s) => ({ value: s.id, label: s.title })),
            sectors.map((s) => ({ value: s.id, label: s.title })),
          )}
          action={saveProjectAction}
          returnHref="/admin/projects"
          defaultValues={{ published: false, sortOrder: 0 }}
          submitLabel="Projeyi Oluştur"
        />
      </AdminContent>
    </>
  )
}
