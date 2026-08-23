import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma, databaseConfigured } from '@/lib/db/prisma'
import { serviceOptions } from '@/repositories/service-repository'
import { listProjectsForAdmin } from '@/repositories/project-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { EntityForm } from '@/components/admin/entity-form'
import { beforeAfterFormSections } from '@/components/admin/form-configs'
import { saveBeforeAfterAction } from '@/actions/content-actions'

export const metadata: Metadata = { title: 'Öncesi & Sonrası Kaydı' }
export const dynamic = 'force-dynamic'

export default async function BeforeAfterFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'yeni'

  const [set, services, projects] = await Promise.all([
    !isNew && databaseConfigured ? prisma.beforeAfterSet.findUnique({ where: { id } }) : null,
    serviceOptions(),
    listProjectsForAdmin(),
  ])

  if (!isNew && !set) notFound()

  return (
    <>
      <AdminPageHeader
        title={isNew ? 'Yeni Öncesi/Sonrası Kaydı' : set!.title}
        backHref="/admin/before-after"
        backLabel="Öncesi & Sonrası"
      />

      <AdminContent>
        <EntityForm
          sections={beforeAfterFormSections(
            services.map((s) => ({ value: s.id, label: s.title })),
            projects.map((p) => ({ value: p.id, label: p.title })),
          )}
          action={saveBeforeAfterAction}
          entityId={set?.id}
          deleteEntity={set ? 'beforeAfter' : undefined}
          returnHref="/admin/before-after"
          defaultValues={
            set
              ? {
                  title: set.title,
                  description: set.description ?? '',
                  beforeImage: set.beforeImage,
                  afterImage: set.afterImage,
                  beforeAlt: set.beforeAlt ?? '',
                  afterAlt: set.afterAlt ?? '',
                  buildingType: set.buildingType ?? '',
                  surfaceType: set.surfaceType ?? '',
                  city: set.city ?? '',
                  serviceId: set.serviceId ?? '',
                  projectId: set.projectId ?? '',
                  sortOrder: set.sortOrder,
                  active: set.active,
                  featured: set.featured,
                }
              : { active: true, featured: false, sortOrder: 0 }
          }
        />
      </AdminContent>
    </>
  )
}
