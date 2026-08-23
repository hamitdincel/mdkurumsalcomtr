import { describe, expect, it } from 'vitest'
import { sanitizeHtml, sanitizeText, sanitizeMultiline } from '@/lib/security/sanitize'
import { validateUpload, MAX_UPLOAD_BYTES } from '@/lib/security/upload-constants'
import { calculateSpamScore, leadsToCsv } from '@/services/lead-service'

describe('sanitizeHtml', () => {
  it('script etiketlerini kaldırır', () => {
    const dirty = '<p>Merhaba</p><script>alert("xss")</script>'
    const clean = sanitizeHtml(dirty)
    expect(clean).not.toContain('script')
    expect(clean).toContain('Merhaba')
  })

  it('olay dinleyicilerini (onerror) kaldırır', () => {
    const clean = sanitizeHtml('<img src="x" onerror="alert(1)">')
    expect(clean).not.toContain('onerror')
  })

  it('javascript: protokolünü engeller', () => {
    const clean = sanitizeHtml('<a href="javascript:alert(1)">link</a>')
    expect(clean).not.toContain('javascript:')
  })

  it('izin verilen biçimlendirmeyi korur', () => {
    const clean = sanitizeHtml('<h2>Başlık</h2><p><strong>kalın</strong> ve <em>italik</em></p>')
    expect(clean).toContain('<h2>')
    expect(clean).toContain('<strong>')
    expect(clean).toContain('<em>')
  })

  it('iframe gibi gömülü içerikleri kaldırır', () => {
    const clean = sanitizeHtml('<iframe src="https://evil.example"></iframe><p>ok</p>')
    expect(clean).not.toContain('iframe')
  })
})

describe('sanitizeText', () => {
  it('fazla boşlukları normalize eder', () => {
    expect(sanitizeText('  çok    boşluklu   metin ')).toBe('çok boşluklu metin')
  })

  it('çok satırlı metinde satır sonlarını korur', () => {
    expect(sanitizeMultiline('satır1\n\n\n\nsatır2')).toBe('satır1\n\nsatır2')
  })
})

describe('validateUpload', () => {
  const makeFile = (type: string, size: number, name = 'dosya') =>
    ({ type, size, name }) as File

  it('desteklenen görsel türlerini kabul eder', () => {
    expect(validateUpload(makeFile('image/jpeg', 1024))).toBeNull()
    expect(validateUpload(makeFile('image/webp', 1024))).toBeNull()
  })

  it('çalıştırılabilir dosyaları reddeder', () => {
    const error = validateUpload(makeFile('application/x-msdownload', 1024, 'virus.exe'))
    expect(error?.code).toBe('INVALID_TYPE')
  })

  it('boyut sınırını aşan dosyayı reddeder', () => {
    const error = validateUpload(makeFile('image/jpeg', MAX_UPLOAD_BYTES + 1))
    expect(error?.code).toBe('TOO_LARGE')
  })

  it('boş dosyayı reddeder', () => {
    expect(validateUpload(makeFile('image/png', 0))?.code).toBe('EMPTY')
  })
})

describe('calculateSpamScore', () => {
  it('honeypot dolduğunda yüksek skor verir', () => {
    expect(
      calculateSpamScore({ fullName: 'Bot', message: 'merhaba', filledHoneypot: true }),
    ).toBeGreaterThanOrEqual(100)
  })

  it('normal talebe düşük skor verir', () => {
    const score = calculateSpamScore({
      fullName: 'Ayşe Yılmaz',
      message: 'Plaza cephemiz için teklif almak istiyoruz.',
      filledHoneypot: false,
    })
    expect(score).toBeLessThan(20)
  })

  it('bağlantı ve spam anahtar kelimelerini işaretler', () => {
    const score = calculateSpamScore({
      fullName: 'X',
      message: 'Cheap SEO backlink service https://spam.example',
      filledHoneypot: false,
    })
    expect(score).toBeGreaterThan(40)
  })
})

describe('leadsToCsv', () => {
  const lead = {
    id: 'abcdef12-3456-7890-abcd-ef1234567890',
    createdAt: new Date('2026-01-15T10:30:00Z'),
    fullName: 'Ayşe Yılmaz',
    companyName: 'Örnek A.Ş.',
    phone: '+905321234567',
    email: 'ayse@example.com',
    city: 'İstanbul',
    serviceLabel: null,
    service: { title: 'Cam Cephe Temizliği' },
    buildingType: 'Plaza / Ofis Binası',
    estimatedArea: 2500,
    surfaceType: 'Cam cephe',
    status: 'NEW',
    assignedUser: null,
    message: 'Satır1\nSatır2 "tırnaklı"',
  }

  it('BOM ile başlar (Excel Türkçe karakter uyumu)', () => {
    expect(leadsToCsv([lead]).startsWith('﻿')).toBe(true)
  })

  it('tırnak ve satır sonlarını kaçırır', () => {
    const csv = leadsToCsv([lead])
    expect(csv).toContain('""tırnaklı""')
    expect(csv.split('\n')).toHaveLength(2)
  })

  it('talep numarasını kısaltılmış biçimde yazar', () => {
    expect(leadsToCsv([lead])).toContain('ABCDEF12')
  })
})
