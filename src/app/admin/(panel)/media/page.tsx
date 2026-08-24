import type { Metadata } from 'next'
import { listMediaAssets, listMediaFolders } from '@/repositories/content-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { MediaLibrary } from '@/components/admin/media-library'

export const metadata: Metadata = { title: 'Medya' }
export const dynamic = 'force-dynamic'

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ klasor?: string }>
}) {
  const { klasor } = await searchParams
  const [{ items, total }, folders] = await Promise.all([
    listMediaAssets({ folder: klasor, take: 60 }),
    listMediaFolders(),
  ])

  return (
    <>
      <AdminPageHeader
        title="Medya Kütüphanesi"
        description={`${total} dosya. Görseller WebP/AVIF'e otomatik dönüştürülerek servis edilir.`}
      />

      <AdminContent className="flex flex-col gap-6">
        <MediaLibrary assets={items} folders={folders} activeFolder={klasor} />
      </AdminContent>
    </>
  )
}
