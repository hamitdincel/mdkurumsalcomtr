import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { PutObjectCommand, S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { env } from '@/config/env'
import { buildObjectKey } from '@/lib/security/upload'

export type StoredFile = {
  url: string
  key: string
  filename: string
  mimeType: string
  size: number
}

let s3Client: S3Client | null = null

function getS3(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: env.S3_REGION,
      endpoint: env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID ?? '',
        secretAccessKey: env.S3_SECRET_ACCESS_KEY ?? '',
      },
    })
  }
  return s3Client
}

/**
 * Dosyayı yapılandırılmış depolama sağlayıcısına yükler.
 *
 * - STORAGE_DRIVER=s3   → Cloudflare R2 / AWS S3 / MinIO
 * - STORAGE_DRIVER=local→ public/uploads (yalnızca geliştirme; production'da
 *   container yeniden başlatıldığında veri kaybolur)
 */
export async function uploadFile(file: File, folder = 'genel'): Promise<StoredFile> {
  const key = buildObjectKey(folder, file)
  const buffer = Buffer.from(await file.arrayBuffer())

  if (env.STORAGE_DRIVER === 's3') {
    if (!env.S3_BUCKET) throw new Error('S3_BUCKET tanımlı değil.')

    await getS3().send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    )

    const base = (env.S3_PUBLIC_BASE_URL ?? '').replace(/\/$/, '')
    return {
      url: base ? `${base}/${key}` : key,
      key,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
    }
  }

  const target = join(process.cwd(), 'public', 'uploads', key)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, buffer)

  return {
    url: `/uploads/${key}`,
    key,
    filename: file.name,
    mimeType: file.type,
    size: file.size,
  }
}

export async function deleteFile(key: string): Promise<void> {
  if (env.STORAGE_DRIVER !== 's3' || !env.S3_BUCKET) return
  await getS3().send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: key }))
}
