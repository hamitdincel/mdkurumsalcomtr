'use client'

import * as React from 'react'

/**
 * Root layout dahil her şeyin çöktüğü durum.
 * Kendi <html>/<body> etiketlerini render etmek zorundadır ve global CSS'e
 * güvenemez — bu nedenle stiller satır içidir.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error('[global-error]', error)
  }, [error])

  return (
    <html lang="tr">
      <head>
        {/*
          Bu ekran, kök layout çöktüğünde uygulama CSS'i olmadan render edilir.
          Bu yüzden renkler satır içi tanımlanır; yine de sistem tema tercihine
          uyar, aksi halde koyu tema kullanan birine aniden beyaz sayfa açılır.
        */}
        <style>{`
          :root { color-scheme: light dark; }
          body { background: #e9edf3; color: #0d1116; }
          .ge-text { color: #4b5560; }
          .ge-button { background: #1155f0; color: #fff; }
          @media (prefers-color-scheme: dark) {
            body { background: #0c1014; color: #eff3f7; }
            .ge-text { color: #9caabb; }
            .ge-button { background: #2563eb; color: #fff; }
          }
        `}</style>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <main style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Beklenmeyen bir sorun oluştu
          </h1>
          <p className="ge-text" style={{ lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Sayfa yüklenirken bir hata meydana geldi. Lütfen tekrar deneyin.
          </p>
          <button
            type="button"
            onClick={reset}
            className="ge-button"
            style={{
              border: 'none',
              borderRadius: '4px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Tekrar Dene
          </button>
        </main>
      </body>
    </html>
  )
}
