import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { findRedirect } from '@/repositories/content-repository'

/**
 * YÖNLENDİRME YAKALAYICI (catch-all)
 *
 * Bilinen bir route ile eşleşmeyen istekler buraya düşer. Yönetim panelinden
 * tanımlanmış bir yönlendirme kaydı varsa uygulanır; yoksa 404 döner.
 *
 * Neden middleware'de değil: middleware edge runtime'da çalışır ve Prisma
 * ile veritabanı sorgusu yapamaz. Bu sayfa Node.js runtime'ında çalıştığı için
 * yönlendirme tablosuna erişebilir.
 */
export const dynamic = 'force-dynamic'

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const path = `/${slug.join('/')}`

  const rule = await findRedirect(path)

  if (rule) {
    if (rule.statusCode === 301) permanentRedirect(rule.newPath)
    redirect(rule.newPath)
  }

  notFound()
}
