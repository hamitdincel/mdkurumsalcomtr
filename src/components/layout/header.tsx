'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Brand } from './brand'
import { TrackedLink } from '@/components/shared/tracked-link'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { mainNav, type NavItem } from '@/config/navigation'
import { cn, toTelHref } from '@/lib/utils'

type HeaderProps = {
  brandName: string
  logo?: string | null
  /** Koyu zemine uygun logo — overlay modunda tercih edilir. */
  logoDark?: string | null
  phone: string
  sectors: { title: string; slug: string }[]
}

/**
 * Header'ın şeffaf (overlay) başlayacağı rotalar.
 * Bu sayfalarda ilk ekran koyu ve tam kanamalı bir görsel olduğu için header
 * fotoğrafın üzerine biner ve navigasyon beyaz görünür. Diğer sayfalarda
 * header baştan opak ve koyu metinlidir.
 */
function usesOverlayHeader(pathname: string): boolean {
  if (pathname === '/') return true
  return /^\/(hizmetler|sektorler|projeler)\/[^/]+$/.test(pathname)
}

export function Header({ brandName, logo, logoDark, phone, sectors }: HeaderProps) {
  const pathname = usePathname()
  const [compact, setCompact] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Navigasyon içerik listeleri dinamik olarak beslenir.
  const nav = React.useMemo<NavItem[]>(
    () =>
      mainNav.map((item) => {
        // Hizmetler'e alt menü ENJEKTE EDİLMEZ: doğrudan hizmetler sayfasına
        // gider. Hizmet listesi o sayfada ve footer'da yer alır.
        if (item.href === '/sektorler') {
          return {
            ...item,
            children: sectors.map((s) => ({ label: s.title, href: `/sektorler/${s.slug}` })),
          }
        }
        return item
      }),
    [sectors],
  )

  React.useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Overlay modu yalnızca sayfa başındayken geçerlidir; kaydırınca opak olur.
  const overlay = usesOverlayHeader(pathname) && !compact

  // Rota değiştiğinde menüler kapanır.
  // Effect yerine render sırasında state ayarlama (React'in "adjusting state
  // when props change" deseni) kullanılır: fazladan render turu oluşmaz.
  const [lastPath, setLastPath] = React.useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setMobileOpen(false)
    setOpenMenu(null)
  }

  // Mobil menü açıkken arka plan kaydırması kilitlenir.
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        setOpenMenu(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120)
  }

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-sm focus:bg-action focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-on-action"
      >
        İçeriğe geç
      </a>

      <header
        className={cn(
          'no-print fixed top-0 z-50 w-full border-b transition-all duration-300',
          compact
            ? 'border-line bg-surface-overlay/85 shadow-md backdrop-blur-xl backdrop-saturate-150'
            : overlay
              ? 'border-transparent bg-transparent'
              : 'border-line bg-surface-raised',
        )}
      >
        <div
          className={cn(
            'container-site flex items-center justify-between transition-all duration-300',
            compact ? 'h-18' : 'h-22',
          )}
        >
          {/* Logo kaydırma durumuna göre küçülür; okunabilirliğini korur. */}
          <Brand
            name={brandName}
            logo={overlay ? (logoDark ?? logo) : logo}
            dark={overlay}
            size={compact ? 'sm' : 'md'}
            plate={overlay && !logoDark && Boolean(logo)}
            priority
          />

          {/* --- Desktop navigasyon --- */}
          <nav aria-label="Ana menü" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const hasChildren = Boolean(item.children?.length)
                const active = isActive(item.href)

                return (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => {
                      cancelClose()
                      if (hasChildren) setOpenMenu(item.href)
                    }}
                    onMouseLeave={scheduleClose}
                  >
                    {hasChildren ? (
                      <button
                        type="button"
                        aria-expanded={openMenu === item.href}
                        aria-haspopup="true"
                        onClick={() => setOpenMenu(openMenu === item.href ? null : item.href)}
                        className={cn(
                          'group/nav relative flex items-center gap-1 rounded-sm px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                          overlay
                            ? active
                              ? 'text-white'
                              : 'text-white/75 hover:text-white'
                            : active
                              ? 'text-brand-600'
                              : 'text-ink-muted hover:text-ink',
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden
                          className={cn(
                            'size-3.5 transition-transform duration-200',
                            openMenu === item.href && 'rotate-180',
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group/nav relative block rounded-sm px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                          overlay
                            ? active
                              ? 'text-white'
                              : 'text-white/75 hover:text-white'
                            : active
                              ? 'text-brand-600'
                              : 'text-ink-muted hover:text-ink',
                        )}
                      >
                        {item.label}
                        {/* Hover'da beliren minimal accent göstergesi */}
                        <span
                          aria-hidden
                          className={cn(
                            'absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 transition-transform duration-200 group-hover/nav:scale-x-100',
                            overlay ? 'bg-signal' : 'bg-brand-500',
                          )}
                        />
                      </Link>
                    )}

                    {hasChildren && openMenu === item.href && (
                      <div
                        className="absolute top-full left-0 pt-2"
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      >
                        <ul className="min-w-72 rounded-md border border-line bg-surface-overlay p-2 shadow-lg">
                          {item.children?.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="block rounded-sm px-3 py-2.5 transition-colors hover:bg-surface-sunken"
                              >
                                <span className="block text-sm font-medium text-ink">
                                  {child.label}
                                </span>
                                {child.description && (
                                  <span className="mt-0.5 block text-xs leading-snug text-ink-subtle">
                                    {child.description}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* --- Sağ aksiyonlar --- */}
          <div className="flex items-center gap-2">
            <ThemeToggle
              variant="icon"
              tone={overlay ? 'inverse' : 'auto'}
              className="hidden xl:inline-flex"
            />

            <TrackedLink
              href={`tel:${toTelHref(phone)}`}
              event="phone_click"
              eventParams={{ location: 'header' }}
              aria-label={`Telefon: ${phone}`}
              className={cn(
                'hidden items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors md:flex',
                overlay ? 'text-white/80 hover:text-white' : 'text-ink-muted hover:text-ink',
              )}
            >
              <Phone className="size-4" aria-hidden />
              <span className="hidden 2xl:inline">{phone}</span>
            </TrackedLink>

            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/teklif-al">Ücretsiz Keşif / Teklif Al</Link>
            </Button>

            <Button asChild size="sm" className="md:hidden">
              <Link href="/teklif-al">Teklif Al</Link>
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Menüyü aç"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className={cn(
                'flex size-11 items-center justify-center rounded-sm transition-colors lg:hidden',
                overlay ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-surface-sunken',
              )}
            >
              <Menu className="size-6" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/*
        Header fixed olduğu için, hero'suz sayfalarda içeriğin altına kaymasını
        önleyen sabit yükseklikte boşluk. Overlay sayfalarda hero zaten
        header'ın altına uzandığı için boşluk eklenmez.
      */}
      {!usesOverlayHeader(pathname) && <div aria-hidden className="h-22" />}

      {/* --- Mobil navigasyon (sağdan drawer) --- */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        nav={nav}
        brandName={brandName}
        logo={logo}
        phone={phone}
        isActive={isActive}
      />
    </>
  )
}

function MobileNav({
  open,
  onClose,
  nav,
  brandName,
  logo,
  phone,
  isActive,
}: {
  open: boolean
  onClose: () => void
  nav: NavItem[]
  brandName: string
  logo?: string | null
  phone: string
  isActive: (href: string) => boolean
}) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = React.useState<string | null>(null)

  // Focus trap — drawer açıkken odak panel içinde kalır.
  React.useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    const focusables = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    focusables[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    panel.addEventListener('keydown', onKeyDown)
    return () => panel.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (!open) return null

  return (
    <div className="no-print fixed inset-0 z-60 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobil menü">
      <div
        className="absolute inset-0 bg-scrim/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={panelRef}
        id="mobile-nav"
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-surface-overlay shadow-xl"
      >
        <div className="flex h-22 shrink-0 items-center justify-between border-b border-line px-5">
          <Brand name={brandName} logo={logo} size="sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="flex size-11 items-center justify-center rounded-sm text-ink transition-colors hover:bg-surface-sunken"
          >
            <X className="size-6" aria-hidden />
          </button>
        </div>

        <nav aria-label="Mobil ana menü" className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {nav.map((item) => {
              const hasChildren = Boolean(item.children?.length)
              const isOpen = expanded === item.href

              return (
                <li key={item.href}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={cn(
                        'flex-1 rounded-sm px-3 py-3.5 text-base font-medium transition-colors',
                        isActive(item.href) ? 'text-brand-600' : 'text-ink hover:bg-surface-sunken',
                      )}
                    >
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : item.href)}
                        aria-expanded={isOpen}
                        aria-label={`${item.label} alt menüsünü ${isOpen ? 'kapat' : 'aç'}`}
                        className="flex size-11 items-center justify-center rounded-sm text-ink-subtle hover:bg-surface-sunken"
                      >
                        <ChevronDown
                          aria-hidden
                          className={cn('size-4 transition-transform', isOpen && 'rotate-180')}
                        />
                      </button>
                    )}
                  </div>

                  {hasChildren && isOpen && (
                    <ul className="mb-2 ml-3 flex flex-col gap-0.5 border-l border-line pl-3">
                      {item.children?.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-sm px-3 py-3 text-sm text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div
          className="shrink-0 border-t border-line p-5"
          style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
        >
          <Button asChild full size="lg">
            <Link href="/teklif-al">Ücretsiz Keşif Talep Et</Link>
          </Button>
          <TrackedLink
            href={`tel:${toTelHref(phone)}`}
            event="phone_click"
            eventParams={{ location: 'mobile_nav' }}
            className="mt-3 flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-ink-muted"
          >
            <Phone className="size-4" aria-hidden />
            {phone}
          </TrackedLink>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="text-sm text-ink-subtle">Görünüm</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
