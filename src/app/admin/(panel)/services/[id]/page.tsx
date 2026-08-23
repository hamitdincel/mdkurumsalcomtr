import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { getServiceById } from '@/repositories/service-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { EntityForm } from '@/components/admin/entity-form'
import { serviceFormSections } from '@/components/admin/form-configs'
import { saveServiceAction } from '@/actions/content-actions'
import { Button } from '@/components/ui/button'
import { toItemArray, toStringArray } from '@/lib/utils'

export const metadata: Metadata = { title: 'Hizmet Düzenle' }
export const dynamic = 'force-dynamic'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await getServiceById(id)

  if (!service) notFound()

  return (
    <>
      <AdminPageHeader
        title={service.title}
        backHref="/admin/services"
        backLabel="Hizmetler"
        actions={
          <Button asChild variant="secondary" size="sm">
            <Link href={`/hizmetler/${service.slug}`} target="_blank">
              <ExternalLink className="size-4" aria-hidden />
              Sayfayı Gör
            </Link>
          </Button>
        }
      />

      <AdminContent>
        <EntityForm
          sections={serviceFormSections()}
          action={saveServiceAction}
          entityId={service.id}
          deleteEntity="service"
          returnHref="/admin/services"
          defaultValues={{
            title: service.title,
            slug: service.slug,
            shortDescription: service.shortDescription,
            intro: service.intro ?? '',
            content: service.content ?? '',
            heroImage: service.heroImage ?? '',
            icon: service.icon ?? '',
            sortOrder: service.sortOrder,
            active: service.active,
            featured: service.featured,
            problems: toStringArray(service.problems),
            surfaces: toStringArray(service.surfaces),
            advantages: toItemArray(service.advantages),
            processSteps: toItemArray(service.processSteps),
            seoTitle: service.seoTitle ?? '',
            metaDescription: service.metaDescription ?? '',
            ogImage: service.ogImage ?? '',
          }}
        />
      </AdminContent>
    </>
  )
}
