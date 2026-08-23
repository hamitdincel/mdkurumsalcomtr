'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { checkPermission } from '@/lib/auth/guard'
import { siteSettingsSchema } from '@/lib/validation/content'
import { toFieldErrors, type ActionState } from '@/lib/validation/common'
import { SETTINGS_CACHE_TAG, saveSettings } from '@/services/settings-service'
import { prisma } from '@/lib/db/prisma'

/**
 * Site ayarlarını kaydeder.
 *
 * İstatistik alanları boş bırakılırsa ilgili sayaçlar tamamen kaldırılır —
 * ana sayfadaki "Sayılarla Şirket" bölümü gizlenir. Sahte veri üretilmez.
 */
export async function saveSettingsAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await checkPermission('*')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const raw: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue
    raw[key] = value === '' ? undefined : value
  }

  // Hizmet bölgeleri JSON dizi olarak gelir.
  const serviceAreas = formData.get('serviceAreas')
  if (typeof serviceAreas === 'string' && serviceAreas.trim() !== '') {
    try {
      raw.serviceAreas = JSON.parse(serviceAreas)
    } catch {
      raw.serviceAreas = undefined
    }
  } else {
    raw.serviceAreas = []
  }

  const parsed = siteSettingsSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Lütfen işaretli alanları kontrol edin.',
      fieldErrors: toFieldErrors(parsed.error),
    }
  }

  try {
    await saveSettings(parsed.data)

    await prisma.auditLog
      .create({ data: { userId: auth.user.id, action: 'UPDATE', entity: 'SiteSetting' } })
      .catch(() => undefined)

    // Ayarlar tüm sayfalarda kullanılır — cache etiketi ve ana rotalar yenilenir.
    // Ayar cache etiketi geçersizleştirilir (read-your-own-writes).
    updateTag(SETTINGS_CACHE_TAG)
    revalidatePath('/')
    revalidatePath('/hizmetler')
    revalidatePath('/iletisim')

    return { status: 'success', message: 'Ayarlar kaydedildi.' }
  } catch (error) {
    console.error('[settings] Kayıt hatası:', error)
    return { status: 'error', message: 'Ayarlar kaydedilemedi. Lütfen tekrar deneyin.' }
  }
}
