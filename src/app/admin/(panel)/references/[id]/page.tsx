import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma, databaseConfigured } from '@/lib/db/prisma'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { EntityForm } from '@/components/admin/entity-form'
import { referenceFormSections } from '@/components/admin/form-configs'
import { saveReferenceAction } from '@/actions/content-actions'

export const metadata: Metadata = { title: 'Referans' }
export const dynamic = 'force-dynamic'

/** "yeni" id'si oluşturma modunu, diğer id'ler düzenleme modunu açar. */
export default async function ReferenceFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'yeni'

  const reference =
    !isNew && databaseConfigured ? await prisma.reference.findUnique({ where: { id } }) : null

  if (!isNew && !reference) notFound()

  return (
    <>
      <AdminPageHeader
        title={isNew ? 'Yeni Referans' : reference!.name}
        backHref="/admin/references"
        backLabel="Referanslar"
      />

      <AdminContent>
        <EntityForm
          sections={referenceFormSections()}
          action={saveReferenceAction}
          entityId={reference?.id}
          deleteEntity={reference ? 'reference' : undefined}
          returnHref="/admin/references"
          defaultValues={
            reference
              ? {
                  name: reference.name,
                  logo: reference.logo,
                  website: reference.website ?? '',
                  sortOrder: reference.sortOrder,
                  active: reference.active,
                }
              : { active: true, sortOrder: 0 }
          }
        />
      </AdminContent>
    </>
  )
}
