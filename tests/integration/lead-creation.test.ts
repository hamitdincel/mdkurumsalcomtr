import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { quoteFormSchema } from '@/lib/validation/lead'

/**
 * LEAD OLUŞTURMA ENTEGRASYON TESTİ
 * ---------------------------------------------------------------------------
 * Gerçek bir PostgreSQL bağlantısı gerektirir. Veritabanı erişilebilir değilse
 * testler atlanır (kırmızıya düşmez):
 *
 *   docker compose up -d db
 *   npm run db:push
 *   npm test
 */
const prisma = new PrismaClient()
let databaseAvailable = false
const createdIds: string[] = []

describe('Lead oluşturma akışı', () => {
  beforeAll(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`
      databaseAvailable = true
    } catch {
      databaseAvailable = false
      console.warn('[test] Veritabanı erişilemiyor — entegrasyon testleri atlandı.')
    }
  })

  afterAll(async () => {
    if (databaseAvailable && createdIds.length > 0) {
      await prisma.lead.deleteMany({ where: { id: { in: createdIds } } })
    }
    await prisma.$disconnect().catch(() => undefined)
  })

  it('geçerli form verisi veritabanına yazılır', async (ctx) => {
    if (!databaseAvailable) return ctx.skip()

    const parsed = quoteFormSchema.parse({
      city: 'İstanbul',
      serviceSlug: 'cam-cephe-temizligi',
      fullName: 'Entegrasyon Testi',
      phone: '05321234567',
      email: 'entegrasyon@example.com',
      estimatedArea: '1500',
      kvkkConsent: 'on',
      message: 'Test talebi',
    })

    const lead = await prisma.lead.create({
      data: {
        fullName: parsed.fullName,
        phone: parsed.phone,
        email: parsed.email ?? null,
        city: parsed.city,
        estimatedArea: parsed.estimatedArea ?? null,
        message: parsed.message ?? null,
        kvkkConsent: true,
        kvkkConsentAt: new Date(),
        marketingOptIn: parsed.marketingOptIn,
        source: 'test',
      },
    })

    createdIds.push(lead.id)

    expect(lead.id).toBeTruthy()
    expect(lead.status).toBe('NEW')
    expect(lead.isRead).toBe(false)
    expect(lead.estimatedArea).toBe(1500)
    expect(lead.kvkkConsent).toBe(true)
    expect(lead.marketingOptIn).toBe(false)
  })

  it('ekler lead ile birlikte transaction içinde yazılır', async (ctx) => {
    if (!databaseAvailable) return ctx.skip()

    const lead = await prisma.$transaction(async (tx) => {
      const created = await tx.lead.create({
        data: {
          fullName: 'Ek Dosyalı Talep',
          phone: '05321234567',
          city: 'Ankara',
          kvkkConsent: true,
          kvkkConsentAt: new Date(),
          source: 'test',
        },
      })

      await tx.leadAttachment.createMany({
        data: [
          {
            leadId: created.id,
            url: 'https://cdn.example/test.jpg',
            filename: 'test.jpg',
            mimeType: 'image/jpeg',
            size: 1024,
          },
        ],
      })

      return created
    })

    createdIds.push(lead.id)

    const withAttachments = await prisma.lead.findUnique({
      where: { id: lead.id },
      include: { attachments: true },
    })

    expect(withAttachments?.attachments).toHaveLength(1)
  })

  it('lead durumu satış hunisinde ilerletilebilir', async (ctx) => {
    if (!databaseAvailable) return ctx.skip()

    const lead = await prisma.lead.create({
      data: {
        fullName: 'Durum Testi',
        phone: '05321234567',
        city: 'İzmir',
        kvkkConsent: true,
        kvkkConsentAt: new Date(),
        source: 'test',
      },
    })
    createdIds.push(lead.id)

    const updated = await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'OFFER_SENT', isRead: true },
    })

    expect(updated.status).toBe('OFFER_SENT')
    expect(updated.isRead).toBe(true)
  })
})
