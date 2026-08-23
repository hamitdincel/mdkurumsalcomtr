'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Copy, Loader2, Trash2, Upload } from 'lucide-react'
import { deleteMediaAction, uploadMediaAction } from '@/actions/media-actions'
import { MAX_UPLOAD_BYTES } from '@/lib/security/upload-constants'
import { cn, formatBytes, formatDate } from '@/lib/utils'

type Asset = {
  id: string
  url: string
  filename: string
  mimeType: string
  size: number
  alt: string | null
  folder: string | null
  createdAt: Date
}

export function MediaLibrary({
  assets,
  folders,
  activeFolder,
}: {
  assets: Asset[]
  folders: string[]
  activeFolder?: string
}) {
  const router = useRouter()
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState<string | null>(null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    setError(null)
    setUploading(true)

    for (const file of files) {
      if (file.size > MAX_UPLOAD_BYTES) {
        setError(`"${file.name}" 15 MB sınırını aşıyor.`)
        continue
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', activeFolder ?? 'genel')

      const result = await uploadMediaAction(formData)
      if (!result.ok) setError(result.error)
    }

    setUploading(false)
    event.target.value = ''
    router.refresh()
  }

  const handleDelete = async (asset: Asset) => {
    if (!window.confirm(`"${asset.filename}" dosyasını silmek istediğinize emin misiniz?`)) return

    const result = await deleteMediaAction(asset.id)
    if (!result.ok) {
      window.alert(result.error ?? 'Dosya silinemedi.')
      return
    }
    router.refresh()
  }

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <label className="flex cursor-pointer items-center justify-center gap-2.5 rounded-md border border-dashed border-line-strong bg-surface-raised p-8 text-sm text-ink-muted transition-colors hover:border-brand-500 hover:text-ink">
        {uploading ? (
          <Loader2 className="size-5 animate-spin" aria-hidden />
        ) : (
          <Upload className="size-5" aria-hidden />
        )}
        {uploading ? 'Yükleniyor…' : 'Dosya yüklemek için tıklayın (birden fazla seçebilirsiniz)'}
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleUpload}
          disabled={uploading}
          className="sr-only"
        />
      </label>

      {error && (
        <p role="alert" className="rounded-sm border border-danger/30 bg-danger-soft p-3 text-sm text-danger">
          {error}
        </p>
      )}

      {folders.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <FolderChip href="/admin/media" active={!activeFolder}>
            Tümü
          </FolderChip>
          {folders.map((folder) => (
            <FolderChip
              key={folder}
              href={`/admin/media?klasor=${encodeURIComponent(folder)}`}
              active={activeFolder === folder}
            >
              {folder}
            </FolderChip>
          ))}
        </div>
      )}

      {assets.length === 0 ? (
        <div className="rounded-md border border-dashed border-line-strong p-14 text-center">
          <p className="text-sm text-ink-muted">Henüz dosya yüklenmedi.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {assets.map((asset) => (
            <li key={asset.id} className="overflow-hidden panel rounded-md">
              <div className="relative aspect-square bg-surface-sunken">
                {asset.mimeType.startsWith('image/') ? (
                  <Image
                    src={asset.url}
                    alt={asset.alt ?? asset.filename}
                    fill
                    sizes="240px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-ink-subtle">
                    {asset.mimeType}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 p-3">
                <p className="truncate text-xs font-medium text-ink" title={asset.filename}>
                  {asset.filename}
                </p>
                <p className="text-2xs text-ink-subtle">
                  {formatBytes(asset.size)} · {formatDate(asset.createdAt)}
                </p>

                <div className="mt-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() => copyUrl(asset.url)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xs border border-line px-2 py-1.5 text-2xs text-ink-muted transition-colors hover:border-brand-500 hover:text-brand-600"
                  >
                    <Copy className="size-3" aria-hidden />
                    {copied === asset.url ? 'Kopyalandı' : 'URL'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(asset)}
                    aria-label={`${asset.filename} dosyasını sil`}
                    className="rounded-xs border border-line px-2 py-1.5 text-ink-subtle transition-colors hover:border-danger hover:text-danger"
                  >
                    <Trash2 className="size-3" aria-hidden />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FolderChip({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-sm border px-3 py-1.5 text-sm transition-colors',
        active
          ? 'border-ink bg-ink text-surface'
          : 'border-line bg-surface-raised text-ink-muted hover:border-line-strong',
      )}
    >
      {children}
    </Link>
  )
}
