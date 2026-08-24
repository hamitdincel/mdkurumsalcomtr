/**
 * ESKİ YEREL MEDYAYI TAŞIMA
 * ---------------------------------------------------------------------------
 * Panelden yüklenen dosyalar önceden `public/uploads` ve `public/gallery`
 * altına yazılıyordu. Next.js production'da public/ içeriğini yalnızca açılışta
 * taradığı için bu dosyalar sunucu yeniden başlatılana kadar 404 dönüyordu.
 *
 * Bu script:
 *   1) eski dizinlerdeki dosyaları yeni veri dizinine taşır,
 *   2) MediaAsset kayıtlarının url alanını `/medya/<key>` olarak günceller.
 *
 * Anahtar (key) alanı hiç değişmediği için dosyalar yeni düzende de aynı yola
 * denk gelir. Docker'da eski named volume yeni mount noktasına bağlıysa (1)
 * adımı zaten gereksizdir; script bu durumda yalnızca url'leri günceller.
 *
 * Kullanım:
 *   npm run media:migrate-local -- --dry-run   # yalnızca rapor
 *   npm run media:migrate-local                # uygula
 */
import { PrismaClient } from '@prisma/client'
import { access, mkdir, rename } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { localStorageRoot, resolveLocalPath } from '../src/lib/storage/local.ts'

const dryRun = process.argv.includes('--dry-run')
const prisma = new PrismaClient()

const LEGACY_ROOTS = [
  join(process.cwd(), 'public', 'uploads'),
  join(process.cwd(), 'public', 'gallery'),
]

async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

const assets = await prisma.mediaAsset.findMany({
  where: { OR: [{ url: { startsWith: '/uploads/' } }, { url: { startsWith: '/gallery/' } }] },
  orderBy: { createdAt: 'asc' },
})

console.log(`Taşınacak kayıt: ${assets.length}`)
console.log(`Hedef dizin: ${localStorageRoot()}${dryRun ? '  (DRY RUN)' : ''}\n`)

let moved = 0
let missing = 0

for (const asset of assets) {
  const target = resolveLocalPath(asset.key)
  if (!target) {
    console.warn(`! geçersiz anahtar, atlandı: ${asset.key}`)
    continue
  }

  if (await exists(target)) {
    console.log(`= ${asset.key} (hedefte zaten var)`)
  } else {
    const source = (
      await Promise.all(
        LEGACY_ROOTS.map(async (root) => {
          const candidate = join(root, asset.key)
          return (await exists(candidate)) ? candidate : null
        }),
      )
    ).find(Boolean)

    if (!source) {
      missing += 1
      console.warn(`! dosya bulunamadı: ${asset.key} (kayıt yine de güncellenecek)`)
    } else if (dryRun) {
      moved += 1
      console.log(`+ ${source} → ${target}`)
    } else {
      await mkdir(dirname(target), { recursive: true })
      await rename(source, target)
      moved += 1
      console.log(`+ ${asset.key}`)
    }
  }

  if (!dryRun) {
    await prisma.mediaAsset.update({
      where: { id: asset.id },
      data: { url: `/medya/${asset.key}` },
    })
  }
}

console.log(
  `\nTaşınan dosya: ${moved} · Bulunamayan: ${missing} · Güncellenen kayıt: ${dryRun ? 0 : assets.length}`,
)
if (missing > 0) {
  console.log('Bulunamayan dosyalar sunucudan silinmiş demektir; panelden yeniden yükleyin.')
}

await prisma.$disconnect()
