'use client'

import * as React from 'react'
import Link from 'next/link'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { CheckboxField, Field } from '@/components/ui/field'
import { TurnstileWidget } from './turnstile-widget'
import { submitContactAction } from '@/actions/lead-actions'
import { contactFormSchema, type ContactFormValues } from '@/lib/validation/lead'
import { trackEvent } from '@/lib/analytics/events'
import type { ActionState } from '@/lib/validation/common'

/** İletişim formu — teklif formundan farklı olarak lead kaydı oluşturmaz. */
export function ContactForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const [state, setState] = React.useState<ActionState>({ status: 'idle' })
  const [submitting, setSubmitting] = React.useState(false)
  const [turnstileToken, setTurnstileToken] = React.useState('')

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: { fullName: '', email: '', message: '', kvkkConsent: false, website: '' },
  })

  const onSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    if (submitting) return
    setSubmitting(true)
    setState({ status: 'idle' })

    const formData = new FormData()
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === null) continue
      formData.append(key, typeof value === 'boolean' ? String(value) : String(value))
    }
    formData.append('turnstileToken', turnstileToken)

    const result = await submitContactAction({ status: 'idle' }, formData)
    setSubmitting(false)
    setState(result)

    if (result.status === 'success') {
      trackEvent('contact_form_submit')
      reset()
    } else if (result.status === 'error' && result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof ContactFormValues, { type: 'server', message })
      }
    }
  }

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-line bg-surface-raised p-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <h3 className="text-xl font-semibold text-ink">Mesajınız iletildi</h3>
        <p className="max-w-sm text-sm leading-relaxed text-ink-muted">{state.message}</p>
        <Button variant="secondary" onClick={() => setState({ status: 'idle' })}>
          Yeni mesaj gönder
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {state.status === 'error' && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-md border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </div>
      )}

      <div aria-hidden className="absolute size-0 overflow-hidden opacity-0">
        <label htmlFor="contact-website">Bu alanı boş bırakın</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-fullName" label="Ad Soyad" required error={errors.fullName?.message}>
          {(props) => <Input {...props} {...register('fullName')} autoComplete="name" />}
        </Field>

        <Field id="contact-email" label="E-posta" required error={errors.email?.message}>
          {(props) => <Input {...props} {...register('email')} type="email" autoComplete="email" />}
        </Field>

        <Field id="contact-phone" label="Telefon" error={errors.phone?.message}>
          {(props) => <Input {...props} {...register('phone')} type="tel" autoComplete="tel" />}
        </Field>

        <Field id="contact-subject" label="Konu" error={errors.subject?.message}>
          {(props) => <Input {...props} {...register('subject')} />}
        </Field>
      </div>

      <Field id="contact-message" label="Mesajınız" required error={errors.message?.message}>
        {(props) => <Textarea {...props} {...register('message')} rows={6} />}
      </Field>

      <CheckboxField
        id="contact-kvkk"
        {...register('kvkkConsent')}
        error={errors.kvkkConsent?.message}
      >
        <Link href="/aydinlatma-metni" target="_blank" className="text-brand-600 underline">
          KVKK Aydınlatma Metni
        </Link>
        &apos;ni okudum; mesajımın değerlendirilmesi amacıyla iletişim bilgilerimin işlenmesini
        kabul ediyorum. <span className="text-danger">*</span>
      </CheckboxField>

      {turnstileSiteKey && (
        <TurnstileWidget siteKey={turnstileSiteKey} onToken={setTurnstileToken} />
      )}

      <Button type="submit" size="lg" loading={submitting} disabled={submitting} className="self-start">
        <Send className="size-4" aria-hidden />
        Mesajı Gönder
      </Button>
    </form>
  )
}
