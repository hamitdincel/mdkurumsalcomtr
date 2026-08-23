'use client'

/**
 * ANALYTICS EVENT KATMANI
 * ---------------------------------------------------------------------------
 * Tüm event'ler tek noktadan gönderilir. Analytics yüklü değilse veya kullanıcı
 * onay vermemişse çağrılar sessizce yok sayılır — sayfa hiçbir durumda hata
 * vermez.
 */

export type AnalyticsEvent =
  | 'quote_form_start'
  | 'quote_form_step'
  | 'quote_form_submit'
  | 'quote_form_error'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'service_view'
  | 'project_view'
  | 'before_after_interaction'
  | 'faq_expand'
  | 'contact_form_submit'

type EventParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export function trackEvent(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === 'undefined') return

  try {
    // GA4 / GTM
    window.dataLayer?.push({ event, ...params })
    window.gtag?.('event', event, params)

    // Meta Pixel — yalnızca dönüşüm event'leri
    if (event === 'quote_form_submit') {
      window.fbq?.('track', 'Lead', params)
    }
  } catch {
    // Analytics hatası kullanıcı akışını etkilemez.
  }
}

/** Sayfa görüntüleme (client-side navigasyonda). */
export function trackPageView(url: string): void {
  if (typeof window === 'undefined') return
  window.dataLayer?.push({ event: 'page_view', page_path: url })
}
