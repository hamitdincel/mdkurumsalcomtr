import { describe, expect, it } from 'vitest'
import {
  formatBytes,
  formatNumber,
  formatPhone,
  readingTime,
  slugify,
  stripHtml,
  toItemArray,
  toStringArray,
  toTelHref,
  truncate,
} from '@/lib/utils'

describe('slugify', () => {
  it('Türkçe karakterleri ASCII karşılıklarına çevirir', () => {
    expect(slugify('Drone ile Dış Cephe Temizliği')).toBe('drone-ile-dis-cephe-temizligi')
    expect(slugify('Güneş Paneli Temizliği')).toBe('gunes-paneli-temizligi')
    expect(slugify('İstanbul Çağlayan Şişli Ödeme')).toBe('istanbul-caglayan-sisli-odeme')
  })

  it('noktalama ve fazla boşlukları temizler', () => {
    expect(slugify('  Merhaba,   Dünya! ')).toBe('merhaba-dunya')
    expect(slugify('A / B & C')).toBe('a-b-c')
  })
})

describe('formatPhone / toTelHref', () => {
  it('numarayı okunur biçime çevirir', () => {
    expect(formatPhone('05321234567')).toBe('+90 532 123 45 67')
    expect(formatPhone('+905321234567')).toBe('+90 532 123 45 67')
  })

  it('tel: bağlantısı için E.164 üretir', () => {
    expect(toTelHref('0532 123 45 67')).toBe('+905321234567')
    expect(toTelHref('+90 532 123 45 67')).toBe('+905321234567')
  })
})

describe('formatNumber', () => {
  it('binlik ayracı uygular', () => {
    expect(formatNumber(2500)).toBe('2.500')
    expect(formatNumber(1234567)).toBe('1.234.567')
  })

  it('geçersiz değerde boş string döner', () => {
    expect(formatNumber(null)).toBe('')
    expect(formatNumber(undefined)).toBe('')
  })
})

describe('truncate', () => {
  it('kelime sınırında keser', () => {
    const text = 'Drone ile dış cephe temizliği yüksek yapılarda uygulanır'
    expect(truncate(text, 20).length).toBeLessThanOrEqual(21)
    expect(truncate(text, 20).endsWith('…')).toBe(true)
  })

  it('kısa metni değiştirmez', () => {
    expect(truncate('kısa metin', 100)).toBe('kısa metin')
  })
})

describe('stripHtml / readingTime', () => {
  it('etiketleri temizler', () => {
    expect(stripHtml('<p>Merhaba <strong>dünya</strong></p>')).toBe('Merhaba dünya')
  })

  it('okuma süresini en az 1 dakika olarak döner', () => {
    expect(readingTime('kısa metin')).toBe(1)
    expect(readingTime('kelime '.repeat(400))).toBe(2)
  })
})

describe('formatBytes', () => {
  it('okunur boyut üretir', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(2048)).toBe('2.0 KB')
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB')
  })
})

describe('JSON alan dönüştürücüleri', () => {
  it('toStringArray yalnızca string değerleri döner', () => {
    expect(toStringArray(['a', 1, null, 'b'])).toEqual(['a', 'b'])
    expect(toStringArray(null)).toEqual([])
    expect(toStringArray({ a: 1 })).toEqual([])
  })

  it('toItemArray başlık/açıklama çiftlerini normalize eder', () => {
    expect(toItemArray([{ title: 'Başlık', description: 'Açıklama' }, { foo: 'bar' }])).toEqual([
      { title: 'Başlık', description: 'Açıklama' },
    ])
    expect(toItemArray(undefined)).toEqual([])
  })
})
