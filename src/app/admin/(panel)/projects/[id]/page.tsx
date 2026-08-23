import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { getProjectById } from '@/repositories/project-repository'
import { serviceOptions } from '@/repositories/service-repository'
import { sectorOptions } from '@/repositories/sector-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { EntityForm } from '@/components/admin/entity-form'
import { projectFormSections } from '@/components/admin/form-configs'
import { saveProjectAction } from '@/actions/content-actions'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Proje Düzenle' }
export const dynamic = 'force-dynamic'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [project, services, sectors] = await Promise.all([
    getProjectById(id),
    serviceOptions(),
    sectorOptions(),
  ])

  if (!project) notFound()

  return (
    <>
      <AdminPageHeader
        title={project.title}
        backHref="/admin/projects"
        backLabel="Projeler"
        actions={
          project.published ? (
            <Button asChild variant="secondary" size="sm">
              <Link href={`/projeler/${project.slug}`} target="_blank">
                <ExternalLink className="size-4" aria-hidden />
                Sayfayı Gör
              </Link>
            </Button>
          ) : null
        }
      />

      <AdminContent>
        <EntityForm
          sections={projectFormSections(
            services.map((s) => ({ value: s.id, label: s.title })),
            sectors.map((s) => ({ value: s.id, label: s.title })),
          )}
          action={saveProjectAction}
          entityId={project.id}
          deleteEntity="project"
          returnHref="/admin/projects"
          defaultValues={{
            title: project.title,
            slug: project.slug,
            city: project.city,
            clientName: project.clientName ?? '',
            anonymized: project.anonymized,
            summary: project.summary,
            serviceId: project.serviceId ?? '',
            sectorId: project.sectorId ?? '',
            buildingType: project.buildingType ?? '',
            surfaceType: project.surfaceType ?? '',
            area: project.area ?? '',
            height: project.height ?? '',
            duration: project.duration ?? '',
            completionDate: project.completionDate,
            challenge: project.challenge ?? '',
            solution: project.solution ?? '',
            result: project.result ?? '',
            coverImage: project.coverImage ?? '',
            sortOrder: project.sortOrder,
            published: project.published,
            featured: project.featured,
            seoTitle: project.seoTitle ?? '',
            metaDescription: project.metaDescription ?? '',
            ogImage: project.ogImage ?? '',
          }}
        />
      </AdminContent>
    </>
  )
}
