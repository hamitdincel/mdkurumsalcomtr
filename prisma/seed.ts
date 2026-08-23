/**
 * SEED SCRIPT
 * ---------------------------------------------------------------------------
 * Üretilen veriler:
 *  1) İlk admin kullanıcısı (SEED_ADMIN_* env değişkenlerinden)
 *  2) Hizmet, sektör ve SSS içerikleri (src/config/content.ts — gerçek,
 *     doğrulanabilir metinler; sayısal iddia içermez)
 *  3) Blog kategorileri
 *
 * ÜRETİLMEYENLER (bilinçli):
 *  - Sahte referans logosu
 *  - Sahte müşteri yorumu
 *  - Sahte istatistik / başarı sayısı
 *  - Sahte proje
 *
 * Demo/geliştirme verisi yalnızca SEED_DEMO=true ile ve açıkça "Demo" olarak
 * işaretlenerek eklenir. Production seed'inde çalıştırılmamalıdır.
 */
import { PrismaClient } from '@prisma/client'
import { hash } from '@node-rs/argon2'
import { staticServices, staticSectors, staticFaqs } from '../src/config/content'
import { serviceImages, sectorImages } from '../src/config/images'

const prisma = new PrismaClient()

const argonOptions = { memoryCost: 19456, timeCost: 2, parallelism: 1, outputLen: 32 } as const

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME ?? 'Site Yöneticisi'

  if (!email || !password) {
    console.warn(
      '⚠  SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD tanımlı değil — admin kullanıcı oluşturulmadı.',
    )
    return
  }

  if (password.length < 10) {
    console.error('✖ SEED_ADMIN_PASSWORD en az 10 karakter olmalıdır. Admin oluşturulmadı.')
    return
  }

  const passwordHash = await hash(password, argonOptions)

  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { name, role: 'ADMIN', active: true },
    create: { email: email.toLowerCase(), name, passwordHash, role: 'ADMIN' },
  })

  console.log(`✔ Admin kullanıcı hazır: ${email}`)
}

async function seedServices() {
  for (const [index, service] of staticServices.entries()) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        title: service.title,
        slug: service.slug,
        shortDescription: service.shortDescription,
        intro: service.intro,
        icon: service.icon,
        active: true,
        featured: index < 3,
        sortOrder: index * 10,
        problems: service.problems,
        surfaces: service.surfaces,
        advantages: service.advantages,
        processSteps: service.process,
        seoTitle: service.seoTitle,
        metaDescription: service.metaDescription,
      },
    })
  }
  console.log(`✔ ${staticServices.length} hizmet içeriği hazır`)
}

async function seedSectors() {
  for (const [index, sector] of staticSectors.entries()) {
    await prisma.sector.upsert({
      where: { slug: sector.slug },
      update: {},
      create: {
        title: sector.title,
        slug: sector.slug,
        shortDescription: sector.shortDescription,
        intro: sector.intro,
        icon: sector.icon,
        active: true,
        sortOrder: index * 10,
        needs: sector.needs,
        approach: sector.approach,
        seoTitle: sector.seoTitle,
        metaDescription: sector.metaDescription,
      },
    })
  }
  console.log(`✔ ${staticSectors.length} çalışma alanı içeriği hazır`)
}

/** Hizmet ↔ sektör ilişkileri — ilgili içerik blokları ve iç linkleme için. */
async function seedRelations() {
  const relations: Record<string, string[]> = {
    'drone-ile-dis-cephe-temizligi': [
      'plazalar-ve-ofis-binalari',
      'gokdelenler-ve-rezidanslar',
      'avm-ve-perakende',
      'oteller-ve-turizm',
      'kamu-ve-belediye',
    ],
    'cam-cephe-temizligi': [
      'plazalar-ve-ofis-binalari',
      'gokdelenler-ve-rezidanslar',
      'avm-ve-perakende',
      'hastaneler-ve-saglik',
    ],
    'gunes-paneli-temizligi': ['enerji-santralleri', 'fabrikalar-ve-sanayi', 'lojistik-ve-depolar'],
    'cati-temizligi': ['okullar-ve-kampusler', 'lojistik-ve-depolar', 'fabrikalar-ve-sanayi'],
    'endustriyel-cephe-temizligi': [
      'fabrikalar-ve-sanayi',
      'lojistik-ve-depolar',
      'enerji-santralleri',
    ],
    'kompozit-metal-beton-yuzey-temizligi': [
      'plazalar-ve-ofis-binalari',
      'kamu-ve-belediye',
      'okullar-ve-kampusler',
    ],
  }

  let count = 0
  for (const [serviceSlug, sectorSlugs] of Object.entries(relations)) {
    const service = await prisma.service.findUnique({ where: { slug: serviceSlug } })
    if (!service) continue

    for (const sectorSlug of sectorSlugs) {
      const sector = await prisma.sector.findUnique({ where: { slug: sectorSlug } })
      if (!sector) continue

      await prisma.sectorService.upsert({
        where: { sectorId_serviceId: { sectorId: sector.id, serviceId: service.id } },
        update: {},
        create: { sectorId: sector.id, serviceId: service.id },
      })
      count++
    }
  }
  console.log(`✔ ${count} hizmet-sektör ilişkisi hazır`)
}

/**
 * Projeyle birlikte gelen görselleri, kapak görseli henüz atanmamış
 * kayıtlara uygular. Panelden görsel yüklenmiş kayıtlara DOKUNMAZ.
 */
async function seedDefaultImages() {
  let updated = 0

  for (const [slug, image] of Object.entries(serviceImages)) {
    const result = await prisma.service.updateMany({
      where: { slug, heroImage: null },
      data: { heroImage: image },
    })
    updated += result.count
  }

  for (const [slug, image] of Object.entries(sectorImages)) {
    const result = await prisma.sector.updateMany({
      where: { slug, heroImage: null },
      data: { heroImage: image },
    })
    updated += result.count
  }

  console.log(`✔ ${updated} kayda varsayılan kapak görseli uygulandı`)
}

async function seedFaqs() {
  const existing = await prisma.faq.count()
  if (existing > 0) {
    console.log('• SSS kayıtları zaten mevcut, atlandı')
    return
  }

  await prisma.faq.createMany({
    data: staticFaqs.map((faq, index) => ({
      question: faq.question,
      answer: faq.answer,
      sortOrder: index * 10,
      active: true,
    })),
  })
  console.log(`✔ ${staticFaqs.length} SSS kaydı hazır`)
}

async function seedCategories() {
  const categories = [
    { name: 'Dış Cephe Temizliği', slug: 'dis-cephe-temizligi', sortOrder: 0 },
    { name: 'Cam ve Yüzey Bakımı', slug: 'cam-ve-yuzey-bakimi', sortOrder: 10 },
    { name: 'Güneş Enerjisi', slug: 'gunes-enerjisi', sortOrder: 20 },
    { name: 'Bina Yönetimi', slug: 'bina-yonetimi', sortOrder: 30 },
    { name: 'Teknoloji', slug: 'teknoloji', sortOrder: 40 },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  console.log(`✔ ${categories.length} blog kategorisi hazır`)
}

/**
 * DEMO VERİSİ — yalnızca geliştirme.
 * Tüm kayıtlar başlıkta açıkça "Demo" olarak işaretlenir ve published=false
 * bırakılmaz ki arayüz test edilebilsin; production'da çalıştırılmamalıdır.
 */
async function seedDemoData() {
  console.log('… Demo verisi ekleniyor (SEED_DEMO=true)')

  const service = await prisma.service.findUnique({ where: { slug: 'cam-cephe-temizligi' } })
  const sector = await prisma.sector.findUnique({ where: { slug: 'plazalar-ve-ofis-binalari' } })

  await prisma.project.upsert({
    where: { slug: 'demo-proje-ofis-kulesi-cam-cephe' },
    update: {},
    create: {
      title: 'Demo Proje — Ofis Kulesi Cam Cephe Uygulaması',
      slug: 'demo-proje-ofis-kulesi-cam-cephe',
      anonymized: true,
      city: 'İstanbul',
      serviceId: service?.id,
      sectorId: sector?.id,
      buildingType: 'Plaza / Ofis Binası',
      surfaceType: 'Cam cephe',
      summary:
        'DEMO KAYIT — Arayüz testleri için oluşturulmuştur. Production ortamında silinmelidir.',
      challenge: 'Demo içerik: cephede yağmur sonrası oluşan mineral izleri.',
      solution: 'Demo içerik: saf su sistemiyle panel bazlı uygulama planı.',
      result: 'Demo içerik: uygulama sonrası cephe kontrolü birlikte yapıldı.',
      published: true,
      featured: true,
      sortOrder: 0,
    },
  })

  console.log('✔ Demo proje eklendi (production seed’inde çalıştırmayın)')
}

async function main() {
  console.log('\n▸ Seed başlıyor…\n')

  await seedAdmin()
  await seedServices()
  await seedSectors()
  await seedRelations()
  await seedDefaultImages()
  await seedFaqs()
  await seedCategories()

  if (process.env.SEED_DEMO === 'true') {
    await seedDemoData()
  }

  console.log('\n✔ Seed tamamlandı.\n')
}

main()
  .catch((error) => {
    console.error('✖ Seed hatası:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
