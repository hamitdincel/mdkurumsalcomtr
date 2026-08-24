import Link from 'next/link'
import { ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/shared/section'
import { BrandMark } from '@/components/layout/brand'
import { RadialLight } from '@/components/shared/technical'

/** Markaya uygun 404 sayfası. */
export default function NotFound() {
  return (
    /*
     * SABİT KOYU ZEMİN — temaya bağlı `.section-deep` DEĞİL.
     *
     * `.section-deep` açık temada beyaza dönüyor. Header ise /hizmetler/*,
     * /sektorler/*, /projeler/* kalıbına uyan her yolda saydam + beyaz metinli
     * "overlay" modunda açılıyor; slug bulunamayıp bu sayfa render edildiğinde
     * beyaz zemin üstünde beyaz navigasyon kalıyor ve menü görünmez oluyordu.
     * Header 404 olduğunu bilemez (istemci tarafında yalnızca yolu görür), bu
     * yüzden çözüm sayfanın kendisinde: zemin her iki temada da koyu kalır.
     *
     * `relative`: blueprint dokusu bu kutuya göre konumlanır, viewport'a değil.
     */
    <div className="grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-onyx px-5 text-center text-ink-on-dark">
      <div aria-hidden className="blueprint-grid absolute inset-0 opacity-40" />
      <RadialLight position="50% 15%" color="rgba(17,85,240,0.2)" size="70% 55%" />

      <Container className="relative flex max-w-2xl flex-col items-center gap-8">
        <BrandMark className="size-10 text-signal" />

        <div className="flex flex-col gap-4">
          <p className="font-display text-6xl font-bold text-white md:text-7xl">404</p>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">
            Aradığınız sayfayı bulamadık
          </h1>
          <p className="text-base leading-relaxed text-ink-on-dark-muted">
            Bağlantı taşınmış, adı değişmiş veya hiç var olmamış olabilir. Aşağıdaki bağlantılardan
            devam edebilirsiniz.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="size-4" aria-hidden />
              Ana Sayfa
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/teklif-al">
              Teklif Al
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <nav aria-label="Hızlı bağlantılar" className="mt-4">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-on-dark-muted">
            <li>
              <Link href="/hizmetler" className="underline-offset-4 hover:text-white hover:underline">
                Hizmetler
              </Link>
            </li>
            <li>
              <Link href="/projeler" className="underline-offset-4 hover:text-white hover:underline">
                Projeler
              </Link>
            </li>
            <li>
              <Link href="/blog" className="underline-offset-4 hover:text-white hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="underline-offset-4 hover:text-white hover:underline">
                İletişim
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </div>
  )
}
