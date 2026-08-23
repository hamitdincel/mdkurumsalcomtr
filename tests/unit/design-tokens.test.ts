import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * TASARIM TOKEN'LARI — ERİŞİLEBİLİRLİK REGRESYON TESTİ
 * ---------------------------------------------------------------------------
 * Site iki temayı da destekler. Bir token elle değiştirildiğinde kontrastın
 * sessizce AA sınırının altına düşmesi çok kolaydır; bu test o durumu build
 * zamanında yakalar.
 *
 * Ayrıca koyu paletin iki ayrı yerde (sistem tercihi + açık seçim) tanımlı
 * olması gerektiği için, bu iki bloğun birbirinden ayrışmadığı da kontrol
 * edilir.
 */

const css = fs.readFileSync(path.resolve(__dirname, '../../src/app/globals.css'), 'utf8')

function readBlock(pattern: RegExp): Record<string, string> {
  const match = css.match(pattern)
  if (!match) throw new Error(`globals.css içinde blok bulunamadı: ${pattern}`)
  const tokens: Record<string, string> = {}
  for (const [, name, value] of (match[1] ?? '').matchAll(/(--t-[a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8});/g)) {
    if (name && value) tokens[name] = value
  }
  return tokens
}

const light = readBlock(/:root\s*\{([\s\S]*?)\n\}/)
const dark = readBlock(/:root\[data-theme='dark'\]\s*\{([\s\S]*?)\n\}/)
const darkFromSystem = readBlock(/:root:not\(\[data-theme='light'\]\)\s*\{([\s\S]*?)\n\s*\}/)

function relativeLuminance(hex: string): number {
  const normalized =
    hex.length === 4
      ? hex
          .slice(1)
          .split('')
          .map((channel) => channel + channel)
          .join('')
      : hex.slice(1)

  const weights = [0.2126, 0.7152, 0.0722]
  return [0, 2, 4].reduce((total, offset, index) => {
    const channel = parseInt(normalized.slice(offset, offset + 2), 16) / 255
    const linear = channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    return total + linear * (weights[index] ?? 0)
  }, 0)
}

function contrast(a: string, b: string): number {
  const first = relativeLuminance(a)
  const second = relativeLuminance(b)
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Temayla DÖNMEYEN sabit renkler (@theme bloğu).
 * Fotoğraf üstü metin ve yönetim paneli kabuğu için kullanılır.
 */
const ONYX = '#0b0e11'
const INK_ON_DARK = '#ffffff'
const INK_ON_DARK_MUTED = '#9aa7b1'
const SIGNAL = '#00c2d1'

/** WhatsApp marka renkleri — sabittir, temayla dönmez. */
const WHATSAPP = '#25d366'
const WHATSAPP_HOVER = '#1fbe5b'
const INK_ON_WHATSAPP = '#0b141a'

/** [metin token'ı, zemin token'ı, minimum oran, açıklama] */
const TEXT_PAIRS: [string, string, number, string][] = [
  ['--t-ink', '--t-surface', 4.5, 'ana metin / sayfa zemini'],
  ['--t-ink', '--t-surface-raised', 4.5, 'ana metin / kart'],
  ['--t-ink', '--t-surface-sunken', 4.5, 'ana metin / kuyu'],
  ['--t-ink', '--t-surface-overlay', 4.5, 'ana metin / modal'],
  ['--t-ink-muted', '--t-surface', 4.5, 'ikincil metin / sayfa zemini'],
  ['--t-ink-muted', '--t-surface-raised', 4.5, 'ikincil metin / kart'],
  ['--t-ink-muted', '--t-surface-sunken', 4.5, 'ikincil metin / kuyu'],
  ['--t-ink-subtle', '--t-surface', 4.5, 'meta metin / sayfa zemini'],
  ['--t-ink-subtle', '--t-surface-raised', 4.5, 'meta metin / kart'],
  ['--t-ink-subtle', '--t-surface-sunken', 4.5, 'meta metin / kuyu'],
  ['--t-brand-600', '--t-surface', 4.5, 'bağlantı / sayfa zemini'],
  ['--t-brand-600', '--t-surface-raised', 4.5, 'bağlantı / kart'],
  ['--t-brand-700', '--t-brand-50', 4.5, 'marka rozeti'],
  ['--t-success', '--t-success-soft', 4.5, 'başarı rozeti'],
  ['--t-warning', '--t-warning-soft', 4.5, 'uyarı rozeti'],
  ['--t-danger', '--t-danger-soft', 4.5, 'hata rozeti'],
  ['--t-info', '--t-info-soft', 4.5, 'bilgi rozeti'],
  ['--t-danger', '--t-surface-raised', 4.5, 'hata metni / kart'],
  ['--t-on-action', '--t-action', 4.5, 'birincil buton metni'],
  ['--t-on-action', '--t-action-hover', 4.5, 'birincil buton metni (hover)'],
  ['--t-on-action', '--t-action-active', 4.5, 'birincil buton metni (active)'],
]

/** Arayüz bileşenleri (odak halkası, kenarlık) için WCAG 1.4.11 → 3:1 */
const UI_PAIRS: [string, string, number, string][] = [
  ['--t-brand-500', '--t-surface', 3, 'odak halkası / sayfa zemini'],
  ['--t-brand-500', '--t-surface-raised', 3, 'odak halkası / kart'],
]

describe.each([
  ['açık tema', light],
  ['koyu tema', dark],
])('%s kontrast oranları', (_themeName, tokens) => {
  it.each([...TEXT_PAIRS, ...UI_PAIRS])(
    '%s / %s en az %s:1 olmalı (%s)',
    (foreground, background, minimum) => {
      const fg = tokens[foreground]
      const bg = tokens[background]
      if (!fg || !bg) throw new Error(`token tanımlı değil: ${foreground} / ${background}`)
      expect(contrast(fg, bg)).toBeGreaterThanOrEqual(minimum)
    },
  )

  it('kontrast bölümlerin metni okunabilir', () => {
    // .section-dark / .section-deep artık temayla döner: açık temada beyaz
    // yüzey + koyu metin, koyu temada grafit yüzey + açık metin.
    const inverse = tokens['--t-surface-inverse'] ?? ''
    const inverseRaised = tokens['--t-surface-inverse-raised'] ?? ''
    const deep = tokens['--t-surface-deep'] ?? ''
    const ink = tokens['--t-ink-inverse'] ?? ''
    const inkMuted = tokens['--t-ink-inverse-muted'] ?? ''

    expect(contrast(ink, inverse)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(ink, deep)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(inkMuted, inverse)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(inkMuted, inverseRaised)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(inkMuted, deep)).toBeGreaterThanOrEqual(4.5)
  })

  it('kontrast yüzey, sayfa zemininden ayrışır', () => {
    // Aynı renge düşerse bölüm sınırı kaybolur.
    expect(tokens['--t-surface-inverse']).not.toBe(tokens['--t-surface'])
    expect(tokens['--t-surface-deep']).not.toBe(tokens['--t-surface'])
  })

  it('yüzey merdiveni sıralı: kuyu → sayfa → kart → modal', () => {
    const order = ['--t-surface-sunken', '--t-surface', '--t-surface-raised', '--t-surface-overlay']
    const luminances = order.map((token) => relativeLuminance(tokens[token] ?? '#000000'))

    for (let index = 1; index < luminances.length; index++) {
      // Her iki temada da "yükselen yüzey daha aydınlık" kuralı geçerlidir:
      // koyu temada da kart, sayfa zemininden bir tık açıktır.
      expect(
        luminances[index] ?? 0,
        `${order[index]} bir önceki katmandan ayrışmalı`,
      ).toBeGreaterThan(luminances[index - 1] ?? 0)
    }
  })
})

describe('sabit koyu aile (onyx)', () => {
  // Fotoğraf zeminleri ve yönetim paneli kabuğu temayla dönmez; bu yüzden
  // kontrastları tek seferlik kontrol edilir.
  it('fotoğraf/kabuk üstündeki metin okunabilir', () => {
    expect(contrast(INK_ON_DARK, ONYX)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(INK_ON_DARK_MUTED, ONYX)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(SIGNAL, ONYX)).toBeGreaterThanOrEqual(4.5)
  })

  it('scrim, fotoğraf üstündeki beyaz metni taşıyacak kadar koyu', () => {
    expect(contrast(INK_ON_DARK, '#06080a')).toBeGreaterThanOrEqual(4.5)
  })

  it('WhatsApp butonunun metni okunabilir', () => {
    // Marka yeşili üzerinde BEYAZ metin yalnızca ~2:1 verir ve AA'yı geçemez;
    // bu yüzden butonda koyu metin kullanılır. Bu test, birisi "daha WhatsApp
    // gibi dursun" diye beyaza çevirirse uyarır.
    expect(contrast(INK_ON_WHATSAPP, WHATSAPP)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(INK_ON_WHATSAPP, WHATSAPP_HOVER)).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#ffffff', WHATSAPP)).toBeLessThan(4.5)
  })
})

describe('tema blokları', () => {
  it('koyu palet, sistem tercihi ve açık seçim bloklarında birebir aynı', () => {
    // İki blok elle güncellendiği için birbirinden ayrışması en olası hata.
    expect(darkFromSystem).toEqual(dark)
  })

  it('açık ve koyu paletler aynı token kümesini tanımlar', () => {
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort())
  })
})
