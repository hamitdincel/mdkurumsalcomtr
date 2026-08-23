'use client'

import * as React from 'react'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics/events'

type TrackedLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: AnalyticsEvent
  eventParams?: Record<string, string | number | boolean | undefined>
}

/**
 * İletişim eylemlerini (telefon, WhatsApp, e-posta) ölçen bağlantı.
 * Analytics yüklü değilse hiçbir şey olmaz; bağlantı her koşulda çalışır.
 */
export const TrackedLink = React.forwardRef<HTMLAnchorElement, TrackedLinkProps>(
  ({ event, eventParams, onClick, children, ...props }, ref) => (
    <a
      ref={ref}
      onClick={(e) => {
        trackEvent(event, eventParams)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </a>
  ),
)
TrackedLink.displayName = 'TrackedLink'
