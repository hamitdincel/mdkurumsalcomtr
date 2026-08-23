import type { Metadata } from 'next'
import { AlertTriangle } from 'lucide-react'
import { listMediaAssets, listMediaFolders } from '@/repositories/content-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { MediaLibrary } from '@/components/admin/media-library'
import { env } from '@/config/env'

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

  const usingLocalStorage = env.STORAGE_DRIVER === 'local'

  return (
    <>
      <AdminPageHeader
        title="Medya Kütüphanesi"
        description={`${total} dosya. Görseller WebP/AVIF'e otomatik dönüştürülerek servis edilir.`}
      />

      <AdminContent className="flex flex-col gap-6">
        {usingLocalStorage && (
          <div className="flex items-start gap-3 rounded-md border border-warning/30 bg-warning-soft p-4 text-sm text-warning">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <strong className="font-semibold">Yerel depolama kullanılıyor.</strong> Bu mod yalnızca
              geliştirme içindir; sunucu yeniden dağıtıldığında dosyalar kaybolur. Production için
              <code className="mx-1">STORAGE_DRIVER=s3</code> ile Cloudflare R2 / AWS S3
              yapılandırın.
            </div>
          </div>
        )}

        <MediaLibrary assets={items} folders={folders} activeFolder={klasor} />
      </AdminContent>
    </>
  )
}
