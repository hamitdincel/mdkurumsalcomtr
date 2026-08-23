'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, X } from 'lucide-react'
import { TrackedLink } from '@/components/shared/tracked-link'
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon'
import { cn, toTelHref } from '@/lib/utils'

type FloatingContactProps = {
  phone: string
  whatsapp: string
  defaultMessage: string
}

/**
 * Yüzen iletişim bileşeni.
 *
 * Tasarım kararları:
 *  - Rahatsız edici olmaması için sayfa biraz kaydırılmadan görünmez.
 *  - Kullanıcı kapatabilir (tercih oturum boyunca hatırlanır).
 *  - Mobilde alt sticky CTA bar, masaüstünde sağ altta tek buton.
 *  - WhatsApp mesajı bulunulan sayfaya göre zenginleşir.
 */
export function FloatingContact({ phone, whatsapp, defaultMessage }: FloatingContactProps) {
  const pathname = usePathname()
  const [visible, setVisible] = React.useState(false)
  const [dismissed, setDismissed] = React.useState(false)

  // sessionStorage yalnızca tarayıcıda mevcuttur; SSR çıktısıyla uyumsuzluk
  // olmaması için okuma hydration sonrasına bırakılır.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tarayıcı depolamasından ilk okuma
    setDismissed(sessionStorage.getItem('floating-contact-dismissed') === '1')
  }, [])

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const message = React.useMemo(() => {
    const serviceMatch = pathname.match(/^\/hizmetler\/([^/]+)/)
    if (serviceMatch?.[1]) {
      const readable = serviceMatch[1].replace(/-/g, ' ')
      return `Merhaba, web siteniz üzerinden "${readable}" hizmeti hakkında bilgi almak istiyorum.`
    }
    const projectMatch = pathname.match(/^\/projeler\/([^/]+)/)
    if (projectMatch?.[1]) {
      return 'Merhaba, web sitenizdeki proje örneklerini inceledim. Kendi binam için bilgi almak istiyorum.'
    }
    return defaultMessage
  }, [pathname, defaultMessage])

  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

  // Teklif sayfasında kullanıcı zaten dönüşüm akışında — CTA bar gösterilmez.
  const hiddenOnPage = pathname.startsWith('/teklif-al') || pathname.startsWith('/admin')

  if (dismissed || hiddenOnPage) return null

  const dismiss = () => {
    sessionStorage.setItem('floating-contact-dismissed', '1')
    setDismissed(true)
  }

  return (
    <>
      {/* --- Mobil: alt sticky CTA bar --- */}
      <div
        className={cn(
          'no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-raised/95 backdrop-blur transition-transform duration-300 md:hidden',
          visible ? 'translate-y-0' : 'translate-y-full',
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-3 divide-x divide-line">
          <TrackedLink
            href={`tel:${toTelHref(phone)}`}
            event="phone_click"
            eventParams={{ location: 'mobile_sticky_bar' }}
            className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-xs font-medium text-ink"
          >
            <Phone className="size-5" aria-hidden />
            Ara
          </TrackedLink>

          <TrackedLink
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            event="whatsapp_click"
            eventParams={{ location: 'mobile_sticky_bar' }}
            className="flex min-h-12 flex-col items-center justify-center gap-0.5 bg-whatsapp text-xs font-semibold text-ink-on-whatsapp"
          >
            <WhatsAppIcon className="size-5" />
            WhatsApp
          </TrackedLink>

          <Link
            href="/teklif-al"
            className="flex min-h-12 flex-col items-center justify-center gap-0.5 bg-action text-xs font-semibold text-on-action"
          >
            Teklif Al
          </Link>
        </div>
      </div>

      {/* --- Masaüstü: sağ alt WhatsApp --- */}
      <div
        className={cn(
          'no-print fixed right-6 bottom-6 z-40 hidden transition-all duration-300 md:block',
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        <div className="group relative">
          <button
            type="button"
            onClick={dismiss}
            aria-label="İletişim butonunu gizle"
            className="absolute -top-2 -left-2 z-10 flex size-6 items-center justify-center rounded-full border border-line bg-surface-raised text-ink-subtle opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <X className="size-3" aria-hidden />
          </button>

          <TrackedLink
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            event="whatsapp_click"
            eventParams={{ location: 'floating_button' }}
            className="flex items-center gap-2 rounded-sm bg-whatsapp px-3.5 py-3 text-sm font-semibold text-ink-on-whatsapp shadow-sm transition-colors hover:bg-whatsapp-hover"
          >
            <WhatsAppIcon className="size-5" />
            WhatsApp ile yazın
          </TrackedLink>
        </div>
      </div>
    </>
  )
}
