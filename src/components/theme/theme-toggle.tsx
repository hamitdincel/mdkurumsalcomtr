'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { Monitor, Moon, Sun } from 'lucide-react'
import { themeKeyForPath } from './theme-script'
import { cn } from '@/lib/utils'

type ThemeChoice = 'light' | 'dark' | 'system'

type ThemeOption = { value: ThemeChoice; label: string; Icon: typeof Sun }

const SYSTEM_OPTION: ThemeOption = { value: 'system', label: 'Sistem teması', Icon: Monitor }

const options: ThemeOption[] = [
  { value: 'light', label: 'Açık tema', Icon: Sun },
  SYSTEM_OPTION,
  { value: 'dark', label: 'Koyu tema', Icon: Moon },
]

/**
 * Tema tercihi React'in dışında yaşar: değeri localStorage tutar, etkisini
 * <html> üzerindeki `data-theme` uygular. Bu yüzden bir "harici durum" olarak
 * useSyncExternalStore ile okunur — efekt içinde setState çağırmak yerine.
 * Yan fayda: aynı sitenin açık başka sekmesinde tema değişirse burası da
 * `storage` olayıyla kendiliğinden güncellenir.
 *
 * ANAHTAR BAĞLAMA GÖRE DEĞİŞİR: public site ve yönetim paneli ayrı tema
 * tutar (bkz. theme-script.tsx). Bu yüzden okuma/yazma fonksiyonları
 * anahtarı parametre olarak alır.
 */
const THEME_CHANGE_EVENT = 'md-theme-change'

function subscribe(onChange: () => void): () => void {
  window.addEventListener('storage', onChange)
  window.addEventListener(THEME_CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(THEME_CHANGE_EVENT, onChange)
  }
}

function readChoice(storageKey: string): ThemeChoice {
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage erişilemiyor (gizli sekme / kısıtlı tarayıcı) — sistem takip edilir.
  }
  return 'system'
}

/**
 * Sunucuda ve hydration turunda tercih bilinemez; her zaman "system" döner.
 * React hydration'ı bu değerle yapıp hemen ardından istemci değeriyle yeniden
 * render ettiği için HTML uyuşmazlığı oluşmaz.
 */
function getServerSnapshot(): ThemeChoice {
  return 'system'
}

function applyChoice(choice: ThemeChoice, storageKey: string) {
  const root = document.documentElement

  // Geçiş animasyonu yalnızca kullanıcı eylemi sonrası açılır; sayfa ilk
  // yüklenirken renk kaymasının görünmemesi için globals.css'te kapalıdır.
  root.setAttribute('data-theme-ready', '')

  try {
    if (choice === 'system') localStorage.removeItem(storageKey)
    else localStorage.setItem(storageKey, choice)
  } catch {
    // Kalıcı yazılamasa bile geçerli sayfada tema uygulanır.
  }

  if (choice === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', choice)

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
}

/**
 * TEMA SEÇİCİ
 *
 * Üç durumlu segment kontrolü: Açık / Sistem / Koyu.
 * "Sistem" ayrı bir seçenek olarak durur; iki durumlu bir düğmede kullanıcı
 * işletim sistemi tercihine geri dönemez.
 *
 * `variant`:
 *   segmented → başlık/altbilgi için tam segment kontrolü
 *   icon      → dar alanlar (mobil menü, admin üst barı) için tek düğme
 */
export function ThemeToggle({
  className,
  variant = 'segmented',
  tone = 'auto',
}: {
  className?: string
  /** segmented: üç düğmeli kontrol, icon: sırayla ilerleyen tek düğme */
  variant?: 'segmented' | 'icon'
  /** auto: yüzey token'larını kullanır, inverse: koyu zemin (hero/footer) */
  tone?: 'auto' | 'inverse'
}) {
  // Panelde ve sitede ayrı tema tutulur; anahtar bulunduğumuz alana göre seçilir.
  const storageKey = themeKeyForPath(usePathname() ?? '/')
  const getSnapshot = React.useCallback(() => readChoice(storageKey), [storageKey])
  const choice = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const select = React.useCallback(
    (next: ThemeChoice) => applyChoice(next, storageKey),
    [storageKey],
  )

  const inverse = tone === 'inverse'

  if (variant === 'icon') {
    // Sırayla ilerler: açık → koyu → sistem
    const next: ThemeChoice = choice === 'light' ? 'dark' : choice === 'dark' ? 'system' : 'light'
    const current = options.find((option) => option.value === choice) ?? SYSTEM_OPTION

    return (
      <button
        type="button"
        onClick={() => select(next)}
        aria-label={`Tema: ${current.label}. Değiştirmek için tıklayın.`}
        title={current.label}
        className={cn(
          'inline-flex size-9 items-center justify-center rounded-sm border transition-colors',
          inverse
            ? 'border-white/20 text-white/80 hover:border-white/45 hover:bg-white/10 hover:text-white'
            : 'border-line text-ink-muted hover:border-line-strong hover:bg-surface-sunken hover:text-ink',
          className,
        )}
      >
        {/* Hydration öncesi ikon sabit tutulur; mismatch olmaması için */}
        <current.Icon className="size-4" aria-hidden />
      </button>
    )
  }

  return (
    <div
      role="radiogroup"
      aria-label="Tema seçimi"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-sm border p-0.5',
        inverse ? 'border-white/15 bg-white/5' : 'border-line bg-surface-sunken',
        className,
      )}
    >
      {options.map(({ value, label, Icon }) => {
        const active = choice === value

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => select(value)}
            className={cn(
              'inline-flex size-7 items-center justify-center rounded-xs transition-colors',
              active
                ? inverse
                  ? 'bg-white/15 text-white'
                  : 'bg-surface-overlay text-ink shadow-xs'
                : inverse
                  ? 'text-white/55 hover:text-white'
                  : 'text-ink-subtle hover:text-ink',
            )}
          >
            <Icon className="size-3.5" aria-hidden />
          </button>
        )
      })}
    </div>
  )
}
