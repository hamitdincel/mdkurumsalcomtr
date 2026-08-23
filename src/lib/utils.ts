import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Türkçe metinden ASCII slug üretir (SEO için ASCII tercih edilir). */
export function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
  }

  return input
    .trim()
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (ch) => map[ch] ?? ch)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Tarihi Türkçe uzun formatta biçimlendirir. */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/** Tarih + saat. */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/** Sayıyı Türkçe binlik ayraçla biçimlendirir. */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return ''
  return new Intl.NumberFormat('tr-TR').format(value)
}

/** "3 dakika önce" tarzı göreli zaman. */
export function formatRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const minutes = Math.round(diff / 60000)
  const rtf = new Intl.RelativeTimeFormat('tr-TR', { numeric: 'auto' })

  if (Math.abs(minutes) < 60) return rtf.format(-minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return rtf.format(-hours, 'hour')
  const days = Math.round(hours / 24)
  if (Math.abs(days) < 30) return rtf.format(-days, 'day')
  const months = Math.round(days / 30)
  if (Math.abs(months) < 12) return rtf.format(-months, 'month')
  return rtf.format(-Math.round(months / 12), 'year')
}

/** Metni belirtilen karakter sayısında kelime sınırında keser. */
export function truncate(text: string, length = 160): string {
  if (text.length <= length) return text
  const cut = text.slice(0, length)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : length).trimEnd()}…`
}

/** HTML etiketlerini temizleyip düz metin döner (excerpt/meta üretimi için). */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Ortalama 200 kelime/dakika üzerinden okuma süresi. */
export function readingTime(text: string): number {
  const words = stripHtml(text).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/** Türk telefon numarasını okunur biçime çevirir: +90 532 123 45 67 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  const national = digits.startsWith('90') ? digits.slice(2) : digits.replace(/^0/, '')
  if (national.length !== 10) return raw
  return `+90 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6, 8)} ${national.slice(8)}`
}

/** tel: linki için E.164 formatı. */
export function toTelHref(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('90')) return `+${digits}`
  return `+90${digits.replace(/^0/, '')}`
}

/** Dosya boyutunu okunur hale getirir. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Bilinmeyen JSON alanını güvenle string dizisine çevirir. */
export function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is string => typeof v === 'string')
}

/** Bilinmeyen JSON alanını {title, description} dizisine çevirir. */
export function toItemArray(value: unknown): { title: string; description: string }[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (item && typeof item === 'object' && 'title' in item) {
      const record = item as Record<string, unknown>
      return [
        {
          title: String(record.title ?? ''),
          description: String(record.description ?? ''),
        },
      ]
    }
    return []
  })
}
