'use client'

import * as React from 'react'
import { Loader2, Upload } from 'lucide-react'
import { ALLOWED_UPLOAD_MIME } from '@/lib/security/upload-constants'
import { cn } from '@/lib/utils'

/**
 * Dosya yükleme alanı: tıklama + sürükle-bırak.
 *
 * Tıklama yolu bilinçli olarak <label> + gerçek <input type="file"> ile
 * kurulur; JavaScript çalışmasa bile tarayıcı dosya seçiciyi açar.
 * Sürükle-bırak bunun üstüne binen ek bir kolaylıktır.
 *
 * `accept` sunucudaki izin listesinden türetilir — "image/*" gibi geniş bir
 * değer, sunucunun reddedeceği türlerin (svg, gif, bmp) seçilebilmesine ve
 * kullanıcının sebepsiz görünen bir hata almasına yol açıyordu.
 */

export const UPLOAD_ACCEPT = ALLOWED_UPLOAD_MIME.join(',')

export function UploadDropzone({
  onFiles,
  uploading,
  multiple = false,
  idleLabel,
  busyLabel = 'Yükleniyor…',
  className,
}: {
  onFiles: (files: File[]) => void
  uploading: boolean
  multiple?: boolean
  idleLabel: string
  busyLabel?: string
  className?: string
}) {
  const [dragging, setDragging] = React.useState(false)
  const dragDepth = React.useRef(0)

  const reset = () => {
    dragDepth.current = 0
    setDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    reset()
    if (uploading) return

    const files = Array.from(event.dataTransfer.files)
    if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1))
  }

  return (
    <label
      onDragEnter={(event) => {
        event.preventDefault()
        dragDepth.current += 1
        setDragging(true)
      }}
      onDragOver={(event) => {
        // preventDefault olmadan tarayıcı bırakma işlemine izin vermez.
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
      }}
      onDragLeave={(event) => {
        event.preventDefault()
        // İç elemanlar arası geçişte de dragleave tetiklenir; sayaçla ayırt edilir.
        dragDepth.current -= 1
        if (dragDepth.current <= 0) reset()
      }}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed p-8 text-center text-sm transition-colors',
        dragging
          ? 'border-brand-500 bg-brand-50 text-brand-700'
          : 'border-line-strong bg-surface-raised text-ink-muted hover:border-brand-500 hover:text-ink',
        className,
      )}
    >
      <span className="flex items-center gap-2.5">
        {uploading ? (
          <Loader2 className="size-5 animate-spin" aria-hidden />
        ) : (
          <Upload className="size-5" aria-hidden />
        )}
        {uploading ? busyLabel : dragging ? 'Bırakın' : idleLabel}
      </span>
      <span className="text-2xs text-ink-subtle">
        Sürükleyip bırakabilirsiniz · JPG, PNG, WebP, AVIF, HEIC, MP4, MOV, PDF · en fazla 15 MB
      </span>
      <input
        type="file"
        multiple={multiple}
        accept={UPLOAD_ACCEPT}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          event.target.value = ''
          if (files.length > 0) onFiles(files)
        }}
        disabled={uploading}
        className="sr-only"
      />
    </label>
  )
}
