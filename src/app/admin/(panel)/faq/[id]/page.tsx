import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma, databaseConfigured } from '@/lib/db/prisma'
import { serviceOptions } from '@/repositories/service-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { EntityForm } from '@/components/admin/entity-form'
import { faqFormSections } from '@/components/admin/form-configs'
import { saveFaqAction } from '@/actions/content-actions'
import { truncate } from '@/lib/utils'

export const metadata: Metadata = { title: 'SSS Kaydı' }
export const dynamic = 'force-dynamic'

export default async function FaqFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'yeni'

  const [faq, services] = await Promise.all([
    !isNew && databaseConfigured ? prisma.faq.findUnique({ where: { id } }) : null,
    serviceOptions(),
  ])

  if (!isNew && !faq) notFound()

  return (
    <>
      <AdminPageHeader
        title={isNew ? 'Yeni Soru' : truncate(faq!.question, 60)}
        backHref="/admin/faq"
        backLabel="Sık Sorulan Sorular"
      />

      <AdminContent>
        <EntityForm
          sections={faqFormSections(services.map((s) => ({ value: s.id, label: s.title })))}
          action={saveFaqAction}
          entityId={faq?.id}
          deleteEntity={faq ? 'faq' : undefined}
          returnHref="/admin/faq"
          defaultValues={
            faq
              ? {
                  question: faq.question,
                  answer: faq.answer,
                  serviceId: faq.serviceId ?? '',
                  sortOrder: faq.sortOrder,
                  active: faq.active,
                }
              : { active: true, sortOrder: 0 }
          }
        />
      </AdminContent>
    </>
  )
}
