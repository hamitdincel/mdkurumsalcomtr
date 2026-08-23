'use client'

import { Button } from '@/components/ui/button'
import { useConsent } from './consent-provider'

/** Çerez politikası sayfasından tercih penceresini açar. */
export function CookiePreferencesTrigger() {
  const { openPreferences } = useConsent()

  return (
    <Button type="button" variant="secondary" onClick={openPreferences}>
      Çerez Tercihlerimi Yönet
    </Button>
  )
}
