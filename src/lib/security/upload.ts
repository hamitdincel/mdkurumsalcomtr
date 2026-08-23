import 'server-only'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { env } from '@/config/env'
import { EXTENSION_BY_MIME } from './upload-constants'

export {
  ALLOWED_UPLOAD_MIME,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_COUNT,
  validateUpload,
  type UploadValidationError,
} from './upload-constants'

/**
 * Nesne anahtarı üretir.
 * Kullanıcının dosya adı anahtar olarak KULLANILMAZ (path traversal ve
 * tahmin edilebilir URL riski). Yalnızca uzantı korunur.
 */
export function buildObjectKey(folder: string, file: File): string {
  const safeFolder = folder.replace(/[^a-z0-9/-]/gi, '').replace(/^\/+|\/+$/g, '') || 'genel'
  const fallbackExt = extname(file.name).toLowerCase().slice(0, 6) || '.bin'
  const ext = EXTENSION_BY_MIME[file.type] ?? fallbackExt
  const date = new Date()
  const yyyymm = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`
  return `${safeFolder}/${yyyymm}/${randomUUID()}${ext}`
}

/** Görüntülenecek dosya adını güvenli hale getirir. */
export function safeDisplayName(name: string): string {
  return name.replace(/[^\p{L}\p{N}._ -]/gu, '').slice(0, 120) || 'dosya'
}

export const storageConfigured =
  env.STORAGE_DRIVER === 's3'
    ? Boolean(env.S3_BUCKET && env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY)
    : true
