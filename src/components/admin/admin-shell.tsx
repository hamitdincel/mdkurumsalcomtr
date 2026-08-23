'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { adminNav } from '@/config/navigation'
import { roleLabels, type Role } from '@/lib/auth/roles'
import { logoutAction } from '@/actions/auth-actions'
import { BrandMark } from '@/components/layout/brand'
import { Icon } from '@/components/shared/icon'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { cn } from '@/lib/utils'

type AdminShellProps = {
  user: { name: string; email: string; role: Role }
  unreadLeads: number
  children: React.ReactNode
}

/** Yönetim paneli kabuğu: sidebar + üst bar. Mobilde sidebar drawer olur. */
export function AdminShell({ user, unreadLeads, children }: AdminShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Rota değiştiğinde drawer kapanır (render sırasında state ayarlama deseni).
  const [lastPath, setLastPath] = React.useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setMobileOpen(false)
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  /*
   * SIDEBAR ARTIK TEMAYA DUYARLIDIR.
   *
   * Önce her iki temada da sabit grafitti. Açık temada neredeyse siyah bir
   * sidebar ile açık içerik arasındaki sert kontrast, uzun panel kullanımında
   * yorucuydu. Artık sidebar açık temada nötr/yükseltilmiş bir yüzeye,
   * koyu temada kendi koyu yüzeyine oturur; içerikle arasındaki luminans farkı
   * her iki temada da ölçülüdür.
   */
  const sidebar = (
    <div className="relative flex h-full flex-col bg-surface-raised text-ink">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-line px-5">
        <BrandMark className="size-6 text-brand-600" />
        <span className="font-display text-sm font-semibold text-ink">Yönetim Paneli</span>
      </div>

      <nav aria-label="Panel menüsü" className="flex-1 overflow-y-auto px-3 py-5">
        {adminNav.map((group) => (
          <div key={group.title} className="mb-6">
            <h2 className="mb-2 px-3 text-2xs font-semibold tracking-[0.09em] text-ink-subtle uppercase">
              {group.title}
            </h2>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors',
                      // Aktif durum: hafif marka tinti + belirgin fakat sakin
                      // metin. Sol kenardaki accent çubuk kaldırıldı — dolgu
                      // farkı açık yüzeyde zaten yeterli.
                      isActive(item.href)
                        ? 'bg-brand-50 font-medium text-brand-700'
                        : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
                    )}
                  >
                    <Icon name={item.icon} className="size-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.href === '/admin/leads' && unreadLeads > 0 && (
                      <span className="rounded-full bg-action px-1.5 py-0.5 text-2xs font-semibold text-on-action">
                        {unreadLeads}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-line p-4">
        <div className="mb-3 flex items-center gap-3 px-1">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-sm font-semibold text-ink-muted">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
            <p className="truncate text-xs text-ink-subtle">{roleLabels[user.role]}</p>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between gap-2 rounded-sm px-3 py-2">
          <span className="text-sm text-ink-subtle">Görünüm</span>
          <ThemeToggle />
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
        >
          <ExternalLink className="size-4" aria-hidden />
          Siteyi Görüntüle
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-danger-soft hover:text-danger"
          >
            <LogOut className="size-4" aria-hidden />
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-dvh bg-surface">
      {/* Masaüstü sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-line bg-surface-raised lg:block">
        <div className="sticky top-0 h-dvh">{sidebar}</div>
      </aside>

      {/* Mobil drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-scrim/50" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-72 bg-surface-raised shadow-lg">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Menüyü kapat"
              className="absolute top-4 right-3 z-10 flex size-9 items-center justify-center rounded-sm text-ink-muted hover:bg-surface-sunken hover:text-ink"
            >
              <X className="size-5" aria-hidden />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface-raised/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Menüyü aç"
            className="flex size-10 items-center justify-center rounded-sm text-ink hover:bg-surface-sunken"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <span className="flex-1 font-display text-sm font-bold text-ink">Yönetim Paneli</span>
          <ThemeToggle variant="icon" />
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
