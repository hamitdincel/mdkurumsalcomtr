import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/login-form'
import { BrandMark } from '@/components/layout/brand'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Yönetim Paneli Girişi',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ devam?: string }>
}) {
  const { devam } = await searchParams

  /*
   * Giriş ekranı panelin sidebar'ıyla aynı dili konuşur: kalıcı grafit yüzey,
   * blueprint dokusu ve tek bir aydınlık kart. Böylece panele girmeden önce de
   * "yönetim alanı" olduğu görsel olarak belli olur.
   */
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <BrandMark className="size-9 text-brand-600" />
          <h1 className="text-xl font-semibold text-white">{siteConfig.name} Yönetim Paneli</h1>
          <p className="text-sm text-ink-muted">Devam etmek için giriş yapın.</p>
        </div>

        <div className="panel rounded-md p-7">
          <LoginForm redirectTo={devam} />
        </div>

        <p className="mt-6 text-center text-xs text-ink-subtle">
          Bu alan yalnızca yetkili kullanıcılar içindir. Giriş denemeleri kayıt altına alınır.
        </p>
      </div>
    </div>
  )
}
