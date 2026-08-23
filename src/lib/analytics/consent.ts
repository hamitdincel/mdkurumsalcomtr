/**
 * ÇEREZ ONAYI — Google Consent Mode v2 uyumlu.
 *
 * Kategoriler:
 *  - necessary : her zaman açık, kapatılamaz (oturum, güvenlik, form)
 *  - analytics : GA4 / GTM ölçümü
 *  - marketing : Meta Pixel, remarketing
 *
 * Kullanıcı onay vermeden HİÇBİR analytics/marketing scripti yüklenmez.
 * Onay durumu değiştiğinde gtag('consent','update', …) çağrılır.
 */

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing'

export type ConsentState = {
  necessary: true
  analytics: boolean
  marketing: boolean
  /** ISO tarih — onayın ne zaman verildiğinin kanıtı */
  timestamp: string
  /** Politika sürümü değişirse yeniden onay istenir */
  version: number
}

export const CONSENT_COOKIE = 'drone_consent'
export const CONSENT_VERSION = 1
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180 // 180 gün

export const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: '',
  version: CONSENT_VERSION,
}

export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentState>
    if (parsed.version !== CONSENT_VERSION) return null

    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      timestamp: typeof parsed.timestamp === 'string' ? parsed.timestamp : '',
      version: CONSENT_VERSION,
    }
  } catch {
    return null
  }
}

export function serializeConsent(state: ConsentState): string {
  return encodeURIComponent(JSON.stringify(state))
}

/** Consent Mode v2 sinyal eşlemesi. */
export function toGoogleConsent(state: ConsentState) {
  return {
    ad_storage: state.marketing ? 'granted' : 'denied',
    ad_user_data: state.marketing ? 'granted' : 'denied',
    ad_personalization: state.marketing ? 'granted' : 'denied',
    analytics_storage: state.analytics ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  } as const
}
