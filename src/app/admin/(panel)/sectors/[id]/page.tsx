import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { getSectorById } from '@/repositories/sector-repository'
import { serviceOptions } from '@/repositories/service-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { EntityForm } from '@/components/admin/entity-form'
import { sectorFormSections } from '@/components/admin/form-configs'
import { saveSectorAction } from '@/actions/content-actions'
import { Button } from '@/components/ui/button'
import { toStringArray } from '@/lib/utils'

export const metadata: Metadata = { title: 'Çalışma Alanı Düzenle' }
export const dynamic = 'force-dynamic'

export default async function EditSectorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [sector, services] = await Promise.all([getSectorById(id), serviceOptions()])

  if (!sector) notFound()

  return (
    <>
      <AdminPageHeader
        title={sector.title}
        backHref="/admin/sectors"
        backLabel="Çalışma Alanları"
        actions={
          <Button asChild variant="secondary" size="sm">
            <Link href={`/sektorler/${sector.slug}`} target="_blank">
              <ExternalLink className="size-4" aria-hidden />
              Sayfayı Gör
            </Link>
          </Button>
        }
      />

      <AdminContent>
        <EntityForm
          sections={sectorFormSections(services.map((s) => ({ value: s.id, label: s.title })))}
          action={saveSectorAction}
          entityId={sector.id}
          deleteEntity="sector"
          returnHref="/admin/sectors"
          defaultValues={{
            title: sector.title,
            slug: sector.slug,
            shortDescription: sector.shortDescription,
            intro: sector.intro ?? '',
            content: sector.content ?? '',
            heroImage: sector.heroImage ?? '',
            icon: sector.icon ?? '',
            sortOrder: sector.sortOrder,
            active: sector.active,
            needs: toStringArray(sector.needs),
            approach: toStringArray(sector.approach),
            serviceIds: sector.services.map((s) => s.serviceId),
            seoTitle: sector.seoTitle ?? '',
            metaDescription: sector.metaDescription ?? '',
            ogImage: sector.ogImage ?? '',
          }}
        />
      </AdminContent>
    </>
  )
}
