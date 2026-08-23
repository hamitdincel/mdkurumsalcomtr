import type { Metadata } from 'next'

/**
 * Yönetim paneli kök layout'u.
 * Oturum kontrolü (panel) route group'undaki layout'ta yapılır; giriş sayfası
 * bu kontrolün dışında kalmalıdır.
 */
export const metadata: Metadata = {
  title: { default: 'Yönetim Paneli', template: '%s | Yönetim Paneli' },
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children
}
