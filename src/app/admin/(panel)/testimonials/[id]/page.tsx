import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma, databaseConfigured } from '@/lib/db/prisma'
import { listProjectsForAdmin } from '@/repositories/project-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { EntityForm } from '@/components/admin/entity-form'
import { testimonialFormSections } from '@/components/admin/form-configs'
import { saveTestimonialAction } from '@/actions/content-actions'

export const metadata: Metadata = { title: 'Müşteri Yorumu' }
export const dynamic = 'force-dynamic'

export default async function TestimonialFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'yeni'

  const [testimonial, projects] = await Promise.all([
    !isNew && databaseConfigured ? prisma.testimonial.findUnique({ where: { id } }) : null,
    listProjectsForAdmin(),
  ])

  if (!isNew && !testimonial) notFound()

  return (
    <>
      <AdminPageHeader
        title={isNew ? 'Yeni Müşteri Yorumu' : testimonial!.personName}
        backHref="/admin/testimonials"
        backLabel="Müşteri Yorumları"
      />

      <AdminContent>
        <EntityForm
          sections={testimonialFormSections(projects.map((p) => ({ value: p.id, label: p.title })))}
          action={saveTestimonialAction}
          entityId={testimonial?.id}
          deleteEntity={testimonial ? 'testimonial' : undefined}
          returnHref="/admin/testimonials"
          defaultValues={
            testimonial
              ? {
                  personName: testimonial.personName,
                  company: testimonial.company,
                  jobTitle: testimonial.jobTitle ?? '',
                  text: testimonial.text,
                  avatar: testimonial.avatar ?? '',
                  logo: testimonial.logo ?? '',
                  projectId: testimonial.projectId ?? '',
                  sortOrder: testimonial.sortOrder,
                  active: testimonial.active,
                }
              : { active: true, sortOrder: 0 }
          }
        />
      </AdminContent>
    </>
  )
}
