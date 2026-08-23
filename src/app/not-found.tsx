import Link from 'next/link'
import { ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/shared/section'
import { BrandMark } from '@/components/layout/brand'
import { RadialLight } from '@/components/shared/technical'

/** Markaya uygun 404 sayfası. */
export default function NotFound() {
  return (
    // `relative`: blueprint dokusu bu kutuya göre konumlanır, viewport'a değil.
    <div className="section-deep grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div aria-hidden className="blueprint-grid absolute inset-0 opacity-40" />
      <RadialLight position="50% 15%" color="rgba(17,85,240,0.2)" size="70% 55%" />

      <Container className="relative flex max-w-2xl flex-col items-center gap-8">
        <BrandMark className="size-10 text-brand-600" />

        <div className="flex flex-col gap-4">
          <p className="font-display text-6xl font-bold text-ink-inverse md:text-7xl">404</p>
          <h1 className="text-2xl font-semibold text-ink-inverse md:text-3xl">
            Aradığınız sayfayı bulamadık
          </h1>
          <p className="text-base leading-relaxed text-ink-inverse-muted">
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
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-inverse-muted">
            <li>
              <Link href="/hizmetler" className="underline-offset-4 hover:text-ink-inverse hover:underline">
                Hizmetler
              </Link>
            </li>
            <li>
              <Link href="/projeler" className="underline-offset-4 hover:text-ink-inverse hover:underline">
                Projeler
              </Link>
            </li>
            <li>
              <Link href="/blog" className="underline-offset-4 hover:text-ink-inverse hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="underline-offset-4 hover:text-ink-inverse hover:underline">
                İletişim
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </div>
  )
}
