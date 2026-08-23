'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db/prisma'
import { checkPermission } from '@/lib/auth/guard'
import { uploadFile, deleteFile } from '@/lib/storage'
import { validateUpload } from '@/lib/security/upload-constants'
import { safeDisplayName } from '@/lib/security/upload'
import { rateLimit, rateLimits } from '@/lib/security/rate-limit'

export type UploadResult =
  | { ok: true; url: string; id: string }
  | { ok: false; error: string }

async function getClientIp(): Promise<string | null> {
  const headerList = await headers()
  return headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
}

/**
 * Medya yükleme.
 * MIME/boyut kontrolü hem client hem server tarafında yapılır; dosya adı
 * kullanıcıdan alınmaz, rastgele anahtar üretilir.
 */
export async function uploadMediaAction(formData: FormData): Promise<UploadResult> {
  const auth = await checkPermission('media:write')
  if (!auth.ok) return { ok: false, error: auth.error }

  const ip = await getClientIp()
  const limit = await rateLimit(`upload:${auth.user.id}:${ip ?? ''}`, rateLimits.upload)
  if (!limit.success) {
    return { ok: false, error: 'Çok fazla yükleme yapıldı. Lütfen biraz bekleyin.' }
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return { ok: false, error: 'Dosya bulunamadı.' }
  }

  const validationError = validateUpload(file)
  if (validationError) {
    return { ok: false, error: validationError.message }
  }

  const folder = String(formData.get('folder') ?? 'genel')
  const alt = String(formData.get('alt') ?? '')

  try {
    const stored = await uploadFile(file, folder)

    const asset = await prisma.mediaAsset.create({
      data: {
        url: stored.url,
        key: stored.key,
        filename: safeDisplayName(stored.filename),
        mimeType: stored.mimeType,
        size: stored.size,
        alt: alt || null,
        folder,
      },
    })

    revalidatePath('/admin/media')
    return { ok: true, url: asset.url, id: asset.id }
  } catch (error) {
    console.error('[media] Yükleme hatası:', error)
    return { ok: false, error: 'Dosya yüklenemedi. Depolama ayarlarını kontrol edin.' }
  }
}

export async function deleteMediaAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const auth = await checkPermission('media:write')
  if (!auth.ok) return { ok: false, error: auth.error }

  try {
    const asset = await prisma.mediaAsset.findUnique({ where: { id } })
    if (!asset) return { ok: false, error: 'Dosya bulunamadı.' }

    await deleteFile(asset.key).catch(() => undefined)
    await prisma.mediaAsset.delete({ where: { id } })

    revalidatePath('/admin/media')
    return { ok: true }
  } catch (error) {
    console.error('[media] Silme hatası:', error)
    return { ok: false, error: 'Dosya silinemedi.' }
  }
}

/** Medya kütüphanesinden seçim için hafif liste. */
export async function listMediaForPicker(): Promise<
  { id: string; url: string; filename: string; alt: string | null }[]
> {
  const auth = await checkPermission('content:read')
  if (!auth.ok) return []

  return prisma.mediaAsset.findMany({
    orderBy: { createdAt: 'desc' },
    take: 60,
    select: { id: true, url: true, filename: true, alt: true },
  })
}
