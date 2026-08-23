'use client'

import * as React from 'react'
import Link from 'next/link'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Paperclip,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/input'
import { CheckboxField, Field } from '@/components/ui/field'
import { TurnstileWidget } from './turnstile-widget'
import { submitQuoteAction, type QuoteSuccess } from '@/actions/lead-actions'
import { quoteFormSchema, quoteFormSteps, type QuoteFormValues } from '@/lib/validation/lead'
import { buildingTypes, dirtLevels, surfaceTypes, timeframes } from '@/config/content'
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_COUNT } from '@/lib/security/upload-constants'
import { trackEvent } from '@/lib/analytics/events'
import { cn, formatBytes } from '@/lib/utils'
import type { ActionState } from '@/lib/validation/common'
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon'

type QuoteFormProps = {
  services: { value: string; label: string }[]
  turnstileSiteKey: string
  whatsapp: string
  phone: string
  /** Hizmet sayfasından gelindiğinde ön seçili hizmet */
  defaultService?: string
  compact?: boolean
}

/**
 * TEKLİF FORMU — 3 adımlı, nitelikli lead toplama.
 *
 * Tasarım kararları:
 *  - Adım adım ilerlenir; her adımda yalnızca o adımın alanları doğrulanır.
 *  - Kullanıcının girdiği değerler adımlar arasında ve hata durumunda KAYBOLMAZ.
 *  - Optimistic success YOK — başarı ekranı yalnızca backend onayından sonra.
 *  - Çift gönderim engellenir (isSubmitting + disabled).
 *  - Otomatik fiyat hesaplanmaz; yalnızca teklif talebi toplanır.
 */
export function QuoteForm({
  services,
  turnstileSiteKey,
  whatsapp,
  phone,
  defaultService,
  compact,
}: QuoteFormProps) {
  const [step, setStep] = React.useState(0)
  const [files, setFiles] = React.useState<File[]>([])
  const [fileError, setFileError] = React.useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = React.useState('')
  const [state, setState] = React.useState<ActionState<QuoteSuccess>>({ status: 'idle' })
  const [submitting, setSubmitting] = React.useState(false)
  const startTracked = React.useRef(false)
  const formTopRef = React.useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    mode: 'onBlur',
    defaultValues: {
      serviceSlug: defaultService ?? '',
      city: '',
      fullName: '',
      phone: '',
      kvkkConsent: false,
      marketingOptIn: false,
      website: '',
    },
  })

  // UTM ve referrer bilgileri — landing sırasında yakalanır.
  const [tracking, setTracking] = React.useState<Record<string, string>>({})

  // UTM/referrer bilgisi yalnızca tarayıcıda okunabilir (SSR'da window yok).
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stored = sessionStorage.getItem('utm-data')
    const fromStorage: Record<string, string> = stored ? JSON.parse(stored) : {}

    const current: Record<string, string> = {
      utmSource: params.get('utm_source') ?? fromStorage.utmSource ?? '',
      utmMedium: params.get('utm_medium') ?? fromStorage.utmMedium ?? '',
      utmCampaign: params.get('utm_campaign') ?? fromStorage.utmCampaign ?? '',
      utmTerm: params.get('utm_term') ?? fromStorage.utmTerm ?? '',
      utmContent: params.get('utm_content') ?? fromStorage.utmContent ?? '',
      referrer: fromStorage.referrer ?? document.referrer ?? '',
      landingPage: fromStorage.landingPage ?? window.location.pathname,
    }

    sessionStorage.setItem('utm-data', JSON.stringify(current))
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tarayıcı verisinden ilk okuma
    setTracking(current)
  }, [])

  const trackStart = () => {
    if (startTracked.current) return
    startTracked.current = true
    trackEvent('quote_form_start')
  }

  const goToStep = (next: number) => {
    setStep(next)
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNext = async () => {
    const stepConfig = quoteFormSteps[step]
    if (!stepConfig) return

    const valid = await trigger([...stepConfig.fields] as (keyof QuoteFormValues)[])
    if (!valid) return

    trackEvent('quote_form_step', { step: step + 1, step_id: stepConfig.id })
    goToStep(step + 1)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? [])
    setFileError(null)

    const combined = [...files, ...selected]
    if (combined.length > MAX_UPLOAD_COUNT) {
      setFileError(`En fazla ${MAX_UPLOAD_COUNT} dosya ekleyebilirsiniz.`)
      return
    }

    const tooLarge = combined.find((file) => file.size > MAX_UPLOAD_BYTES)
    if (tooLarge) {
      setFileError(`"${tooLarge.name}" 15 MB sınırını aşıyor.`)
      return
    }

    setFiles(combined)
    event.target.value = ''
  }

  const onSubmit: SubmitHandler<QuoteFormValues> = async (values) => {
    if (submitting) return // çift gönderim koruması
    setSubmitting(true)
    setState({ status: 'idle' })

    const formData = new FormData()
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === null) continue
      formData.append(key, typeof value === 'boolean' ? String(value) : String(value))
    }
    for (const [key, value] of Object.entries(tracking)) {
      if (value) formData.append(key, value)
    }
    formData.append('turnstileToken', turnstileToken)
    for (const file of files) formData.append('files', file)

    const result = await submitQuoteAction({ status: 'idle' }, formData)
    setSubmitting(false)
    setState(result)

    if (result.status === 'success') {
      trackEvent('quote_form_submit', {
        service: values.serviceSlug,
        city: values.city,
        has_attachment: files.length > 0,
      })
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (result.status === 'error') {
      trackEvent('quote_form_error', { message: result.message })

      // Sunucudan gelen alan hatalarını forma yansıt — kullanıcı verisi korunur.
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof QuoteFormValues, { type: 'server', message })
        }
        const firstField = Object.keys(result.fieldErrors)[0]
        const targetStep = quoteFormSteps.findIndex((s) =>
          (s.fields as readonly string[]).includes(firstField ?? ''),
        )
        if (targetStep >= 0) goToStep(targetStep)
      }
    }
  }

  // --- BAŞARI EKRANI
  if (state.status === 'success' && state.data) {
    return (
      <div ref={formTopRef} className="flex flex-col items-center gap-6 py-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>

        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-semibold text-ink">Talebiniz bize ulaştı</h3>
          <p className="max-w-md text-base leading-relaxed text-ink-muted">
            Ekibimiz talebinizi inceleyip en kısa sürede sizinle iletişime geçecek. Doğru bir teklif
            için keşif planlamamız gerekebilir.
          </p>
        </div>

        <div className="rounded-md border border-line bg-surface-sunken px-5 py-3">
          <p className="text-xs text-ink-subtle">Talep Referans No</p>
          <p className="font-display text-lg font-bold tracking-wider text-ink">
            {state.data.referenceNo}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                `Merhaba, ${state.data.referenceNo} referans numaralı teklif talebim hakkında bilgi almak istiyorum.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { location: 'quote_success' })}
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp üzerinden devam et
            </a>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/projeler">Projeleri İncele</Link>
          </Button>
        </div>
      </div>
    )
  }

  const currentStep = quoteFormSteps[step]

  return (
    <div ref={formTopRef} className="flex flex-col gap-8">
      {/* Adım göstergesi */}
      <ol className="flex items-center gap-2" aria-label="Form adımları">
        {quoteFormSteps.map((item, index) => (
          <li key={item.id} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => index < step && goToStep(index)}
              disabled={index > step}
              aria-current={index === step ? 'step' : undefined}
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                index < step && 'cursor-pointer bg-action text-on-action',
                index === step && 'bg-ink text-surface',
                index > step && 'cursor-default bg-surface-sunken text-ink-subtle',
              )}
            >
              {index < step ? <CheckCircle2 className="size-4" aria-hidden /> : index + 1}
            </button>
            <span
              className={cn(
                'hidden text-sm font-medium sm:block',
                index === step ? 'text-ink' : 'text-ink-subtle',
              )}
            >
              {item.title}
            </span>
            {index < quoteFormSteps.length - 1 && (
              <span aria-hidden className="h-px flex-1 bg-line" />
            )}
          </li>
        ))}
      </ol>

      {state.status === 'error' && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-md border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p>{state.message}</p>
            <p className="mt-1 text-ink-muted">
              Sorun devam ederse bizi{' '}
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="underline">
                {phone}
              </a>{' '}
              numaradan arayabilirsiniz.
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event)
        }}
        onChange={trackStart}
        noValidate
        className="flex flex-col gap-6"
      >
        {/* Honeypot — ekran okuyuculardan ve kullanıcıdan gizli */}
        <div aria-hidden className="absolute size-0 overflow-hidden opacity-0">
          <label htmlFor="website">Bu alanı boş bırakın</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </div>

        {/* --- ADIM 1: PROJE BİLGİLERİ --- */}
        <fieldset className={cn('flex flex-col gap-5', step !== 0 && 'hidden')}>
          <legend className="sr-only">{quoteFormSteps[0].title}</legend>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="serviceSlug" label="Hizmet Türü" required error={errors.serviceSlug?.message}>
              {(props) => (
                <Select {...props} {...register('serviceSlug')} defaultValue={defaultService ?? ''}>
                  <option value="">Seçiniz</option>
                  {services.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field id="city" label="Şehir" required error={errors.city?.message}>
              {(props) => (
                <Input
                  {...props}
                  {...register('city')}
                  autoComplete="address-level2"
                  placeholder="Örn: İstanbul"
                />
              )}
            </Field>

            <Field id="buildingType" label="Yapı / Tesis Türü" error={errors.buildingType?.message}>
              {(props) => (
                <Select {...props} {...register('buildingType')}>
                  <option value="">Seçiniz</option>
                  {buildingTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field id="surfaceType" label="Yüzey Türü" error={errors.surfaceType?.message}>
              {(props) => (
                <Select {...props} {...register('surfaceType')}>
                  <option value="">Seçiniz</option>
                  {surfaceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field
              id="estimatedArea"
              label="Yaklaşık Cephe / Yüzey Alanı"
              hint="m² cinsinden, tahmini değer yeterli"
              error={errors.estimatedArea?.message}
            >
              {(props) => (
                <Input
                  {...props}
                  {...register('estimatedArea')}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  placeholder="Örn: 2500"
                />
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field
                id="floorCount"
                label="Kat Sayısı"
                error={errors.floorCount?.message}
              >
                {(props) => (
                  <Input
                    {...props}
                    {...register('floorCount')}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    placeholder="Örn: 12"
                  />
                )}
              </Field>

              <Field
                id="estimatedHeight"
                label="Yükseklik (m)"
                error={errors.estimatedHeight?.message}
              >
                {(props) => (
                  <Input
                    {...props}
                    {...register('estimatedHeight')}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    placeholder="Örn: 45"
                  />
                )}
              </Field>
            </div>

            <Field id="dirtLevel" label="Kirlilik Durumu" error={errors.dirtLevel?.message}>
              {(props) => (
                <Select {...props} {...register('dirtLevel')}>
                  <option value="">Seçiniz</option>
                  {dirtLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field id="timeframe" label="İstenen Zaman Aralığı" error={errors.timeframe?.message}>
              {(props) => (
                <Select {...props} {...register('timeframe')}>
                  <option value="">Seçiniz</option>
                  {timeframes.map((frame) => (
                    <option key={frame.value} value={frame.value}>
                      {frame.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
        </fieldset>

        {/* --- ADIM 2: İLETİŞİM --- */}
        <fieldset className={cn('flex flex-col gap-5', step !== 1 && 'hidden')}>
          <legend className="sr-only">{quoteFormSteps[1].title}</legend>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="fullName" label="Ad Soyad" required error={errors.fullName?.message}>
              {(props) => <Input {...props} {...register('fullName')} autoComplete="name" />}
            </Field>

            <Field id="companyName" label="Firma Adı" error={errors.companyName?.message}>
              {(props) => (
                <Input {...props} {...register('companyName')} autoComplete="organization" />
              )}
            </Field>

            <Field
              id="phone"
              label="Telefon"
              required
              hint="Size en hızlı telefonla dönüş yapıyoruz."
              error={errors.phone?.message}
            >
              {(props) => (
                <Input
                  {...props}
                  {...register('phone')}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0532 123 45 67"
                />
              )}
            </Field>

            <Field id="email" label="E-posta" error={errors.email?.message}>
              {(props) => (
                <Input {...props} {...register('email')} type="email" autoComplete="email" />
              )}
            </Field>
          </div>
        </fieldset>

        {/* --- ADIM 3: FOTOĞRAF VE NOT --- */}
        <fieldset className={cn('flex flex-col gap-5', step !== 2 && 'hidden')}>
          <legend className="sr-only">{quoteFormSteps[2].title}</legend>

          <Field
            id="message"
            label="Açıklama"
            hint="Cephede dikkat edilmesi gereken noktalar, erişim kısıtları veya sorularınız."
            error={errors.message?.message}
          >
            {(props) => <Textarea {...props} {...register('message')} rows={5} />}
          </Field>

          {/* Dosya yükleme */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">Fotoğraf / Video (opsiyonel)</span>
            <p className="text-xs text-ink-subtle">
              Cephenin fotoğrafı, doğru değerlendirme yapmamızı kolaylaştırır. En fazla{' '}
              {MAX_UPLOAD_COUNT} dosya, dosya başına 15 MB.
            </p>

            <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line-strong bg-surface-sunken/60 p-5 text-center transition-colors hover:border-brand-500 hover:bg-brand-50/40">
              <Paperclip className="size-5 text-ink-subtle" aria-hidden />
              <span className="text-sm text-ink-muted">
                Dosya seçmek için tıklayın
              </span>
              <input
                type="file"
                multiple
                accept="image/*,video/mp4,video/quicktime,application/pdf"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>

            {fileError && (
              <p role="alert" className="flex items-center gap-1.5 text-sm text-danger">
                <AlertCircle className="size-3.5" aria-hidden />
                {fileError}
              </p>
            )}

            {files.length > 0 && (
              <ul className="flex flex-col gap-2">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-sm border border-line bg-surface-raised px-3 py-2"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm text-ink">{file.name}</span>
                    <span className="text-xs text-ink-subtle">{formatBytes(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      aria-label={`${file.name} dosyasını kaldır`}
                      className="rounded-sm p-1 text-ink-subtle hover:bg-surface-sunken hover:text-danger"
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Onaylar */}
          <div className="flex flex-col gap-4 rounded-md border border-line bg-surface-sunken/50 p-5">
            <CheckboxField id="kvkkConsent" {...register('kvkkConsent')} error={errors.kvkkConsent?.message}>
              <Link href="/aydinlatma-metni" target="_blank" className="text-brand-600 underline">
                KVKK Aydınlatma Metni
              </Link>
              &apos;ni okudum; talebimin değerlendirilmesi amacıyla iletişim bilgilerimin
              işlenmesini kabul ediyorum. <span className="text-danger">*</span>
            </CheckboxField>

            {/* Pazarlama izni AYRI ve OPSİYONEL — hizmet talebine bağlanmaz (KVKK). */}
            <CheckboxField id="marketingOptIn" {...register('marketingOptIn')}>
              Kampanya ve bilgilendirme iletileri almak istiyorum. (Opsiyonel — teklif almak için
              gerekli değildir.)
            </CheckboxField>
          </div>

          {turnstileSiteKey && (
            <TurnstileWidget siteKey={turnstileSiteKey} onToken={setTurnstileToken} />
          )}

          <p className="text-xs leading-relaxed text-ink-subtle">
            Bu form üzerinden otomatik fiyat verilmez. Talebiniz incelendikten sonra, gerekiyorsa
            keşif yapılarak tarafınıza teklif iletilir.
          </p>
        </fieldset>

        {/* Navigasyon */}
        <div
          className={cn(
            'flex items-center gap-3 border-t border-line pt-6',
            compact ? 'flex-col-reverse sm:flex-row' : '',
          )}
        >
          {step > 0 && (
            <Button type="button" variant="ghost" onClick={() => goToStep(step - 1)}>
              <ArrowLeft className="size-4" aria-hidden />
              Geri
            </Button>
          )}

          <div className="flex-1" />

          {step < quoteFormSteps.length - 1 ? (
            <Button type="button" onClick={handleNext} size="lg">
              Devam Et
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button type="submit" size="lg" loading={submitting} disabled={submitting}>
              Teklif Talebini Gönder
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          )}
        </div>

        <p className="text-xs text-ink-subtle">
          {currentStep?.description}
        </p>
      </form>
    </div>
  )
}
