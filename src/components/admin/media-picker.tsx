'use client'

import * as React from 'react'
import Image from 'next/image'
import { ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { listMediaForPicker, uploadMediaAction } from '@/actions/media-actions'
import { UploadDropzone } from '@/components/admin/upload-dropzone'
import { validateUpload } from '@/lib/security/upload-constants'

type PickerAsset = { id: string; url: string; filename: string; alt: string | null }

const UPLOAD_FAILED_MESSAGE =
  'Dosya yüklenemedi. Bağlantı koptu ya da sunucu dosyayı reddetti. Ayrıntı için tarayıcı konsoluna bakın.'

/**
 * Görsel alanı: doğrudan URL girilebilir, kütüphaneden seçilebilir veya
 * yeni dosya yüklenebilir.
 */
export function MediaPickerField({
  name,
  label,
  hint,
  defaultValue,
  error,
}: {
  name: string
  label: string
  hint?: string
  defaultValue?: string
  error?: string
}) {
  const [value, setValue] = React.useState(defaultValue ?? '')
  const [open, setOpen] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [assets, setAssets] = React.useState<PickerAsset[]>([])
  const [loading, setLoading] = React.useState(false)

  const openLibrary = async () => {
    setOpen(true)
    setLoading(true)
    setAssets(await listMediaForPicker())
    setLoading(false)
  }

  const handleUpload = async (files: File[]) => {
    const file = files[0]
    if (!file) return

    setUploadError(null)

    // Sunucudaki kurallarla birebir aynı kontrol; kullanıcı sebebi hemen görür.
    const invalid = validateUpload(file)
    if (invalid) {
      setUploadError(invalid.message)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'icerik')

      const result = await uploadMediaAction(formData)

      if (!result.ok) {
        setUploadError(result.error)
        return
      }

      setValue(result.url)
      setOpen(false)
    } catch (error) {
      // Action'ın kendisi patlarsa (ağ hatası, gövde boyutu sınırı) hata
      // yakalanmazsa arayüz sonsuza kadar "Yükleniyor…" durumunda kalır ve
      // kullanıcı hiçbir şey olmamış gibi görür.
      console.error('[media] Yükleme başarısız:', error)
      setUploadError(UPLOAD_FAILED_MESSAGE)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      {hint && <p className="text-xs text-ink-subtle">{hint}</p>}

      <input type="hidden" name={name} value={value} readOnly />

      {value ? (
        <div className="relative w-fit overflow-hidden rounded-sm border border-line bg-surface-sunken">
          <Image
            src={value}
            alt=""
            width={220}
            height={140}
            className="h-32 w-auto max-w-56 object-contain"
            unoptimized
          />
          <button
            type="button"
            onClick={() => setValue('')}
            aria-label="Görseli kaldır"
            className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-sm bg-surface-raised/90 text-ink-subtle hover:text-danger"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center rounded-sm border border-dashed border-line-strong bg-surface-sunken/50 text-sm text-ink-subtle">
          Görsel seçilmedi
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={openLibrary}>
          <ImagePlus className="size-4" aria-hidden />
          Kütüphaneden Seç / Yükle
        </Button>

        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="veya doğrudan URL yapıştırın"
          className="h-9 max-w-md flex-1 text-sm"
          aria-label={`${label} URL`}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="text-lg font-semibold text-ink">Medya Kütüphanesi</DialogTitle>

          <div className="mt-5 flex flex-col gap-5">
            <UploadDropzone
              onFiles={handleUpload}
              uploading={uploading}
              idleLabel="Yeni dosya yükle"
              className="p-5"
            />

            {uploadError && (
              <p role="alert" className="text-sm text-danger">
                {uploadError}
              </p>
            )}

            {loading ? (
              <p className="py-8 text-center text-sm text-ink-subtle">Yükleniyor…</p>
            ) : assets.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-subtle">
                Kütüphanede henüz dosya yok.
              </p>
            ) : (
              <ul className="grid max-h-96 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
                {assets.map((asset) => (
                  <li key={asset.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setValue(asset.url)
                        setOpen(false)
                      }}
                      className="group relative block aspect-square w-full overflow-hidden rounded-sm border border-line bg-surface-sunken transition-colors hover:border-brand-500"
                    >
                      <Image
                        src={asset.url}
                        alt={asset.alt ?? asset.filename}
                        fill
                        sizes="150px"
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
