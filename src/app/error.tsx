'use client'

import * as React from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/shared/section'

/**
 * Sayfa seviyesinde hata sınırı.
 * Kullanıcıya stack trace GÖSTERİLMEZ; teknik detay yalnızca sunucu log'una
 * ve (yapılandırılmışsa) hata izleme servisine gider.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error('[error-boundary]', error)
    // TODO: Sentry vb. servise iletilebilir — Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-20">
      <Container className="flex max-w-xl flex-col items-center gap-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-warning-soft text-warning">
          <AlertTriangle className="size-7" aria-hidden />
        </span>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-ink">Beklenmeyen bir sorun oluştu</h1>
          <p className="text-base leading-relaxed text-ink-muted">
            Sayfa yüklenirken bir hata meydana geldi. Tekrar denemek isterseniz aşağıdaki düğmeyi
            kullanabilir veya ana sayfaya dönebilirsiniz.
          </p>
          {error.digest && (
            <p className="text-xs text-ink-subtle">
              Hata referansı: <code>{error.digest}</code>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset}>
            <RotateCcw className="size-4" aria-hidden />
            Tekrar Dene
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
        </div>
      </Container>
    </div>
  )
}
