'use client'

import * as React from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useConsent } from './consent-provider'

/**
 * Çerez onay bandı.
 * - "Tümünü Reddet" seçeneği "Kabul Et" ile eşit görünürlükte sunulur (KVKK/GDPR).
 * - Zorunlu çerezler kapatılamaz; bu durum arayüzde açıkça belirtilir.
 */
export function CookieConsent() {
  const { needsDecision, acceptAll, rejectAll, save, preferencesOpen, openPreferences, closePreferences } =
    useConsent()

  const [analytics, setAnalytics] = React.useState(false)
  const [marketing, setMarketing] = React.useState(false)

  if (!needsDecision && !preferencesOpen) return null

  return (
    <>
      {needsDecision && !preferencesOpen && (
        <div
          role="dialog"
          aria-label="Çerez tercihleri"
          aria-live="polite"
          className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface-overlay shadow-xl"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="container-site flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="flex items-start gap-3">
              <Cookie className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
              <p className="text-sm leading-relaxed text-ink-muted">
                Sitemizin çalışması için zorunlu çerezleri kullanıyoruz. Ölçümleme ve pazarlama
                çerezleri yalnızca onayınızla çalışır.{' '}
                <Link href="/cerez-politikasi" className="text-brand-600 underline underline-offset-2">
                  Çerez Politikası
                </Link>
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 lg:shrink-0">
              <Button variant="ghost" size="sm" onClick={openPreferences}>
                Ayarları Düzenle
              </Button>
              <Button variant="secondary" size="sm" onClick={rejectAll}>
                Tümünü Reddet
              </Button>
              <Button size="sm" onClick={acceptAll}>
                Tümünü Kabul Et
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={preferencesOpen} onOpenChange={(open) => !open && closePreferences()}>
        <DialogContent className="max-w-xl">
          <DialogTitle className="text-xl font-semibold text-ink">Çerez Tercihleri</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-ink-muted">
            Hangi çerez kategorilerine izin verdiğinizi buradan yönetebilirsiniz. Tercihiniz
            tarayıcınızda saklanır ve dilediğiniz zaman değiştirebilirsiniz.
          </DialogDescription>

          <div className="mt-6 flex flex-col gap-4">
            <CategoryRow
              title="Zorunlu Çerezler"
              description="Oturum yönetimi, güvenlik ve form gönderimi için gereklidir. Kapatılamaz."
              checked
              disabled
            />
            <CategoryRow
              title="Ölçümleme (Analytics)"
              description="Sayfa ziyaretlerini anonim olarak ölçmemizi ve siteyi iyileştirmemizi sağlar."
              checked={analytics}
              onChange={setAnalytics}
            />
            <CategoryRow
              title="Pazarlama"
              description="Reklam ölçümü ve yeniden pazarlama amacıyla kullanılır."
              checked={marketing}
              onChange={setMarketing}
            />
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-2.5">
            <Button variant="secondary" size="sm" onClick={rejectAll}>
              Tümünü Reddet
            </Button>
            <Button size="sm" onClick={() => save({ analytics, marketing })}>
              Tercihleri Kaydet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CategoryRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange?: (value: boolean) => void
}) {
  const id = React.useId()

  return (
    <div className="flex items-start gap-3 rounded-md border border-line p-4">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-0.5 size-5 shrink-0 accent-brand-500 disabled:opacity-60"
      />
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {title}
          {disabled && <span className="ml-2 text-xs font-normal text-ink-subtle">(her zaman açık)</span>}
        </label>
        <p className="text-sm text-ink-muted">{description}</p>
      </div>
    </div>
  )
}

/** Footer'dan çerez tercihlerini yeniden açmak için. */
export function CookiePreferencesButton() {
  const { openPreferences } = useConsent()

  return (
    <button
      type="button"
      onClick={openPreferences}
      className="text-sm text-ink-inverse-muted underline-offset-4 transition-colors hover:text-white hover:underline"
    >
      Çerez Tercihleri
    </button>
  )
}
