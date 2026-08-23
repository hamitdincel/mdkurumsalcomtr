import { databaseConfigured } from './prisma'
import { isProduction } from '@/config/env'

/**
 * Veritabanı erişimini güvenli hale getiren sarmalayıcı.
 *
 * Neden gerekli:
 * - Build sırasında (Vercel/CI) veritabanı erişilebilir olmayabilir; sayfa
 *   üretimi bu yüzden patlamamalı.
 * - DB henüz kurulmamışken site statik fallback içerikle çalışabilmeli.
 * - Geçici bağlantı hatasında kullanıcıya stack trace değil, boş/varsayılan
 *   içerik gösterilmeli.
 *
 * Hata yutulmaz; sunucu log'una yazılır.
 */
export async function safeQuery<T>(
  operation: () => Promise<T>,
  fallback: T,
  context = 'db',
): Promise<T> {
  if (!databaseConfigured) return fallback

  try {
    return await operation()
  } catch (error) {
    console.error(`[${context}] Veritabanı sorgusu başarısız:`, error)
    if (isProduction) {
      // TODO: Sentry vb. hata izleme servisine iletilebilir.
    }
    return fallback
  }
}

/**
 * Yazma işlemleri için — burada hata yutulmaz, çağıran katman
 * kullanıcıya anlamlı bir mesaj göstermekle yükümlüdür.
 */
export function assertDatabase(): void {
  if (!databaseConfigured) {
    throw new Error(
      'DATABASE_URL tanımlı değil. Bu işlem için veritabanı bağlantısı gereklidir.',
    )
  }
}
