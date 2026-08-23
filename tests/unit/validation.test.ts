import { describe, expect, it } from 'vitest'
import { quoteFormSchema, contactFormSchema } from '@/lib/validation/lead'
import { phoneSchema, slugSchema } from '@/lib/validation/common'

const validQuote = {
  city: 'İstanbul',
  serviceSlug: 'cam-cephe-temizligi',
  fullName: 'Ayşe Yılmaz',
  phone: '0532 123 45 67',
  kvkkConsent: 'on',
}

describe('phoneSchema', () => {
  it('yaygın Türkçe telefon formatlarını kabul eder', () => {
    const variants = [
      '0532 123 45 67',
      '05321234567',
      '+90 532 123 45 67',
      '+905321234567',
      '(0532) 123-45-67',
      '532 123 45 67',
    ]

    for (const value of variants) {
      expect(phoneSchema.safeParse(value).success, value).toBe(true)
    }
  })

  it('geçersiz numaraları reddeder', () => {
    const invalid = ['123', '0532123456', 'telefon yok', '', '01234567890']
    for (const value of invalid) {
      expect(phoneSchema.safeParse(value).success, value).toBe(false)
    }
  })
})

describe('slugSchema', () => {
  it('ASCII slug kabul eder', () => {
    expect(slugSchema.safeParse('drone-ile-dis-cephe-temizligi').success).toBe(true)
  })

  it('Türkçe karakter ve boşluk içeren slug’ı reddeder', () => {
    expect(slugSchema.safeParse('dış-cephe').success).toBe(false)
    expect(slugSchema.safeParse('iki kelime').success).toBe(false)
    expect(slugSchema.safeParse('Büyük-Harf').success).toBe(false)
  })
})

describe('quoteFormSchema', () => {
  it('zorunlu alanlar dolduğunda geçerlidir', () => {
    const result = quoteFormSchema.safeParse(validQuote)
    expect(result.success).toBe(true)
  })

  it('KVKK onayı olmadan reddeder', () => {
    const result = quoteFormSchema.safeParse({ ...validQuote, kvkkConsent: undefined })
    expect(result.success).toBe(false)
  })

  it('pazarlama izni zorunlu değildir ve hizmet talebini engellemez', () => {
    const result = quoteFormSchema.safeParse({ ...validQuote, marketingOptIn: undefined })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.marketingOptIn).toBe(false)
  })

  it('honeypot alanı doluysa reddeder', () => {
    const result = quoteFormSchema.safeParse({ ...validQuote, website: 'http://spam.example' })
    expect(result.success).toBe(false)
  })

  it('boş opsiyonel sayısal alanları undefined’a çevirir', () => {
    const result = quoteFormSchema.safeParse({ ...validQuote, estimatedArea: '', floorCount: '' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.estimatedArea).toBeUndefined()
      expect(result.data.floorCount).toBeUndefined()
    }
  })

  it('sayısal alanları sayıya çevirir', () => {
    const result = quoteFormSchema.safeParse({ ...validQuote, estimatedArea: '2500' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.estimatedArea).toBe(2500)
  })

  it('makul olmayan büyük alan değerini reddeder', () => {
    const result = quoteFormSchema.safeParse({ ...validQuote, estimatedArea: '99999999' })
    expect(result.success).toBe(false)
  })

  it('boş e-postayı undefined yapar, geçersiz e-postayı reddeder', () => {
    const empty = quoteFormSchema.safeParse({ ...validQuote, email: '' })
    expect(empty.success).toBe(true)
    if (empty.success) expect(empty.data.email).toBeUndefined()

    const invalid = quoteFormSchema.safeParse({ ...validQuote, email: 'hatali-eposta' })
    expect(invalid.success).toBe(false)
  })
})

describe('contactFormSchema', () => {
  it('çok kısa mesajı reddeder', () => {
    const result = contactFormSchema.safeParse({
      fullName: 'Test Kullanıcı',
      email: 'test@example.com',
      message: 'kısa',
      kvkkConsent: 'on',
    })
    expect(result.success).toBe(false)
  })

  it('geçerli veriyi kabul eder', () => {
    const result = contactFormSchema.safeParse({
      fullName: 'Test Kullanıcı',
      email: 'TEST@Example.com',
      message: 'Cephe temizliği hakkında bilgi almak istiyorum.',
      kvkkConsent: 'on',
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.email).toBe('test@example.com')
  })
})
