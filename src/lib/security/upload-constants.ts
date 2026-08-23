/**
 * Yükleme kısıtları — hem client (form UI) hem server (doğrulama) tarafında
 * kullanılır. Bu dosya bilinçli olarak Node.js API'si içermez ki client
 * bundle'a güvenle dahil edilebilsin.
 */

export const ALLOWED_UPLOAD_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'video/mp4',
  'video/quicktime',
  'application/pdf',
] as const

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024 // 15 MB
export const MAX_UPLOAD_COUNT = 5

export const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/heic': '.heic',
  'video/mp4': '.mp4',
  'video/quicktime': '.mov',
  'application/pdf': '.pdf',
}

export type UploadValidationError = { code: string; message: string }

/** MIME, boyut ve uzantı kontrolü — client ve server'da aynı kurallar. */
export function validateUpload(file: File): UploadValidationError | null {
  if (!ALLOWED_UPLOAD_MIME.includes(file.type as (typeof ALLOWED_UPLOAD_MIME)[number])) {
    return {
      code: 'INVALID_TYPE',
      message: `Desteklenmeyen dosya türü: ${file.name}. Yalnızca görsel, PDF ve kısa video yükleyebilirsiniz.`,
    }
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      code: 'TOO_LARGE',
      message: `${file.name} dosyası çok büyük. En fazla 15 MB yükleyebilirsiniz.`,
    }
  }

  if (file.size === 0) {
    return { code: 'EMPTY', message: `${file.name} dosyası boş görünüyor.` }
  }

  return null
}
