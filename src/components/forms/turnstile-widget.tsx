'use client'

import * as React from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

/**
 * Cloudflare Turnstile widget'ı.
 * Site key tanımlı değilse hiçbir şey render edilmez ve script yüklenmez —
 * geliştirme ortamında form yine çalışır (server tarafı bunu bilir).
 */
export function TurnstileWidget({
  siteKey,
  onToken,
}: {
  siteKey: string
  onToken: (token: string) => void
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const widgetId = React.useRef<string | null>(null)
  const [scriptReady, setScriptReady] = React.useState(false)

  React.useEffect(() => {
    if (!scriptReady || !siteKey || !containerRef.current || widgetId.current) return

    widgetId.current =
      window.turnstile?.render(containerRef.current, {
        sitekey: siteKey,
        language: 'tr',
        theme: 'light',
        callback: (token: string) => onToken(token),
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      }) ?? null

    return () => {
      if (widgetId.current) {
        window.turnstile?.remove(widgetId.current)
        widgetId.current = null
      }
    }
  }, [scriptReady, siteKey, onToken])

  if (!siteKey) return null

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="min-h-[65px]" />
    </>
  )
}
