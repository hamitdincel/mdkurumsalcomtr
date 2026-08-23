'use client'

import * as React from 'react'
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  CONSENT_VERSION,
  parseConsent,
  serializeConsent,
  toGoogleConsent,
  type ConsentState,
} from '@/lib/analytics/consent'

type ConsentContextValue = {
  consent: ConsentState | null
  /** Onay bannerı gösterilsin mi (henüz karar verilmemişse) */
  needsDecision: boolean
  acceptAll: () => void
  rejectAll: () => void
  save: (choice: { analytics: boolean; marketing: boolean }) => void
  openPreferences: () => void
  preferencesOpen: boolean
  closePreferences: () => void
}

const ConsentContext = React.createContext<ConsentContextValue | null>(null)

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1]
}

function writeCookie(state: ConsentState) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(state)}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax${secure}`
}

/** gtag consent update sinyali — script yüklü olmasa da dataLayer'a yazılır. */
function pushConsentUpdate(state: ConsentState) {
  window.dataLayer = window.dataLayer ?? []
  const gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args)
  }
  gtag('consent', 'update', toGoogleConsent(state))
  window.dataLayer.push({ event: 'consent_update', ...toGoogleConsent(state) })
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = React.useState<ConsentState | null>(null)
  const [hydrated, setHydrated] = React.useState(false)
  const [preferencesOpen, setPreferencesOpen] = React.useState(false)

  // Çerez yalnızca tarayıcıda okunabilir; SSR çıktısıyla uyumsuzluk olmaması
  // için okuma hydration sonrasına bırakılır.
  React.useEffect(() => {
    const stored = parseConsent(readCookie(CONSENT_COOKIE))
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- çerezden ilk okuma
      setConsent(stored)
      pushConsentUpdate(stored)
    }
     
    setHydrated(true)
  }, [])

  const commit = React.useCallback((choice: { analytics: boolean; marketing: boolean }) => {
    const next: ConsentState = {
      necessary: true,
      analytics: choice.analytics,
      marketing: choice.marketing,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    }
    setConsent(next)
    writeCookie(next)
    pushConsentUpdate(next)
    setPreferencesOpen(false)
  }, [])

  const value = React.useMemo<ConsentContextValue>(
    () => ({
      consent,
      needsDecision: hydrated && consent === null,
      acceptAll: () => commit({ analytics: true, marketing: true }),
      rejectAll: () => commit({ analytics: false, marketing: false }),
      save: commit,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      preferencesOpen,
    }),
    [consent, hydrated, commit, preferencesOpen],
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent(): ConsentContextValue {
  const context = React.useContext(ConsentContext)
  if (!context) {
    throw new Error('useConsent, ConsentProvider içinde kullanılmalıdır.')
  }
  return context
}
