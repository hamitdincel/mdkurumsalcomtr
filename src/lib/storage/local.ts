import { isAbsolute, join, resolve, sep } from 'node:path'
import { env } from '@/config/env'
import { EXTENSION_BY_MIME } from '@/lib/security/upload-constants'

/**
 * YEREL DEPOLAMA (STORAGE_DRIVER=local)
 * ---------------------------------------------------------------------------
 * Dosyalar bilinçli olarak `public/` ALTINA yazılmaz. Next.js production'da
 * `public/` içeriğini sunucu açılırken bir kez tarar ve yalnızca o anki
 * listeyi servis eder (bkz. next/dist/server/lib/router-utils/filesystem.js);
 * çalışma anında yazılan dosyalar sunucu yeniden başlatılana kadar 404 döner.
 *
 * Bu yüzden hedef dizin public/ dışındadır ve dosyalar `/medya/...` route
 * handler'ı üzerinden servis edilir. Dizin, container'da named volume'a
 * bağlanarak kalıcı hale getirilir.
 *
 * Not: Bu dosya `server-only` ile işaretlenmez — node: modülleri zaten client
 * bundle'a girmesini engeller ve bakım script'i (scripts/migrate-local-media)
 * aynı yol mantığını kopyalamadan kullanabilsin diye çalıştırılabilir kalır.
 */

/** Yerel dosyaların servis edildiği URL öneki. */
export const LOCAL_MEDIA_PREFIX = '/medya'

/** Yükleme kökü. LOCAL_STORAGE_DIR verilmezse <proje>/data/uploads. */
export function localStorageRoot(): string {
  const configured = env.LOCAL_STORAGE_DIR?.trim()
  return configured ? resolve(configured) : join(process.cwd(), 'data', 'uploads')
}

/**
 * Nesne anahtarını disk yoluna çevirir.
 * Anahtar kök dizinin dışına çıkıyorsa (path traversal) null döner.
 */
export function resolveLocalPath(key: string): string | null {
  if (!key || key.includes('\0') || isAbsolute(key)) return null
  if (key.split(/[\\/]/).some((segment) => segment === '..')) return null

  const root = localStorageRoot()
  const target = resolve(root, key)

  return target.startsWith(root + sep) ? target : null
}

const MIME_BY_EXTENSION: Record<string, string> = {
  ...Object.fromEntries(Object.entries(EXTENSION_BY_MIME).map(([mime, ext]) => [ext, mime])),
  '.jpeg': 'image/jpeg',
}

/**
 * Uzantıdan içerik türü.
 * Yükleme sırasında izin verilen türler dışındaki uzantılar için null döner;
 * böylece dizine başka yolla düşmüş bir dosya servis edilmez.
 */
export function mimeTypeForKey(key: string): string | null {
  const dot = key.lastIndexOf('.')
  if (dot === -1) return null
  return MIME_BY_EXTENSION[key.slice(dot).toLowerCase()] ?? null
}
