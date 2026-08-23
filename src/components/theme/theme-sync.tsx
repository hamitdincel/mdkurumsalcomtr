'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { themeKeyForPath } from './theme-script'

/**
 * TEMA SENKRONİZASYONU (site ↔ panel geçişleri)
 * ---------------------------------------------------------------------------
 * Flash önleyici inline script yalnızca TAM SAYFA YÜKLEMESİNDE çalışır.
 * App Router'da rota geçişleri istemci tarafında olduğu için, site ile panel
 * arasında istemci-taraflı bir geçiş yapıldığında script tekrar çalışmaz ve
 * <html data-theme> önceki alanın temasında kalırdı.
 *
 * Bu bileşen rota değişimini izler ve o alana ait tema tercihini yeniden
 * uygular. Hiçbir şey render etmez.
 */
export function ThemeSync() {
  const pathname = usePathname()

  React.useEffect(() => {
    const root = document.documentElement
    const key = themeKeyForPath(pathname ?? '/')

    let stored: string | null = null
    try {
      stored = localStorage.getItem(key)
    } catch {
      // localStorage erişilemiyor — sistem tercihi geçerli kalır.
    }

    if (stored === 'light' || stored === 'dark') root.setAttribute('data-theme', stored)
    else root.removeAttribute('data-theme')
  }, [pathname])

  return null
}
