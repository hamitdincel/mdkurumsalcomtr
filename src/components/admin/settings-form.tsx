'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { AlertCircle, CheckCircle2, Info, Plus, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Field } from '@/components/ui/field'
import { MediaPickerField } from './media-picker'
import { saveSettingsAction } from '@/actions/settings-actions'
import type { SiteSettingsValues } from '@/lib/validation/content'
import type { ActionState } from '@/lib/validation/common'

const initialState: ActionState = { status: 'idle' }

export function SettingsForm({ defaultValues }: { defaultValues: SiteSettingsValues }) {
  const [state, formAction, pending] = useActionState(saveSettingsAction, initialState)
  const [serviceAreas, setServiceAreas] = React.useState<string[]>(defaultValues.serviceAreas ?? [])
  const [areaDraft, setAreaDraft] = React.useState('')

  const fieldErrors = state.status === 'error' ? state.fieldErrors : undefined

  const addArea = () => {
    const value = areaDraft.trim()
    if (!value || serviceAreas.includes(value)) return
    setServiceAreas([...serviceAreas, value])
    setAreaDraft('')
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="serviceAreas" value={JSON.stringify(serviceAreas)} />

      {state.status === 'error' && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-md border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </div>
      )}

      {state.status === 'success' && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-md border border-success/30 bg-success-soft p-4 text-sm text-success"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </div>
      )}

      <Panel title="Marka" description="Logo yüklenmezse geçici wordmark kullanılır.">
        <TextField name="brandName" label="Marka Adı" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="tagline" label="Slogan" defaultValues={defaultValues} errors={fieldErrors} />
        <MediaPickerField
          name="logoLight"
          label="Logo (açık zemin)"
          defaultValue={defaultValues.logoLight}
          error={fieldErrors?.logoLight}
        />
        <MediaPickerField
          name="logoDark"
          label="Logo (koyu zemin)"
          defaultValue={defaultValues.logoDark}
          error={fieldErrors?.logoDark}
        />
      </Panel>

      <Panel title="İletişim">
        <TextField name="phone" label="Telefon" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField
          name="whatsapp"
          label="WhatsApp Numarası"
          hint="Ülke kodu ile, boşluksuz. Örn: 905321234567"
          defaultValues={defaultValues}
          errors={fieldErrors}
        />
        <TextField name="email" label="Genel E-posta" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="salesEmail" label="Teklif E-postası" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="addressStreet" label="Adres" defaultValues={defaultValues} errors={fieldErrors} span2 />
        <TextField name="addressDistrict" label="İlçe" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="addressCity" label="Şehir" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="addressPostalCode" label="Posta Kodu" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="workingHours" label="Çalışma Saatleri" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField
          name="mapEmbedUrl"
          label="Harita Embed URL"
          hint="Google Maps > Paylaş > Haritayı yerleştir bağlantısı. Boşsa harita gösterilmez."
          defaultValues={defaultValues}
          errors={fieldErrors}
          span2
        />
      </Panel>

      <Panel title="Hizmet Bölgeleri" description="Yalnızca gerçekten hizmet verilen lokasyonları ekleyin.">
        <div className="md:col-span-2">
          {serviceAreas.length > 0 && (
            <ul className="mb-3 flex flex-wrap gap-2">
              {serviceAreas.map((area) => (
                <li
                  key={area}
                  className="flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-1.5 text-sm text-ink"
                >
                  {area}
                  <button
                    type="button"
                    onClick={() => setServiceAreas(serviceAreas.filter((a) => a !== area))}
                    aria-label={`${area} kaldır`}
                    className="text-ink-subtle hover:text-danger"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <Input
              value={areaDraft}
              onChange={(event) => setAreaDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addArea()
                }
              }}
              placeholder="Şehir adı"
              aria-label="Hizmet bölgesi ekle"
            />
            <Button type="button" variant="secondary" onClick={addArea}>
              <Plus className="size-4" aria-hidden />
              Ekle
            </Button>
          </div>
        </div>
      </Panel>

      <Panel title="Sosyal Medya" description="Boş bırakılan hesaplar footer'da gösterilmez.">
        <TextField name="linkedin" label="LinkedIn" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="instagram" label="Instagram" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="youtube" label="YouTube" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="facebook" label="Facebook" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="x" label="X" defaultValues={defaultValues} errors={fieldErrors} />
      </Panel>

      <Panel title="Ana Sayfa Hero">
        <TextField name="heroEyebrow" label="Üst Etiket" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="heroTitle" label="Başlık (H1)" defaultValues={defaultValues} errors={fieldErrors} />
        <TextAreaField
          name="heroSubtitle"
          label="Alt Metin"
          defaultValues={defaultValues}
          errors={fieldErrors}
        />
        <MediaPickerField
          name="heroImage"
          label="Hero Görseli"
          defaultValue={defaultValues.heroImage}
          error={fieldErrors?.heroImage}
        />
        <MediaPickerField
          name="heroPosterUrl"
          label="Video Poster Görseli"
          hint="Video kullanılacaksa ilk kare olarak gösterilir."
          defaultValue={defaultValues.heroPosterUrl}
          error={fieldErrors?.heroPosterUrl}
        />
        <TextField
          name="heroVideoUrl"
          label="Hero Video URL"
          hint="CDN üzerindeki mp4 adresi. Mobilde yüklenmez."
          defaultValues={defaultValues}
          errors={fieldErrors}
        />
      </Panel>

      <Panel
        title="İstatistikler"
        description="Yalnızca doğrulanabilir gerçek verileri girin. Tüm alanlar boşsa ana sayfadaki istatistik bölümü hiç gösterilmez."
      >
        <div className="flex items-start gap-3 rounded-sm border border-line bg-surface-sunken p-3.5 text-sm text-ink-muted md:col-span-2">
          <Info className="mt-0.5 size-4 shrink-0 text-ink-subtle" aria-hidden />
          Sahte sayaç üretilmez. Bir alanı boş bırakırsanız o metrik gösterilmez.
        </div>
        <NumberField name="statProjects" label="Tamamlanan Proje" defaultValues={defaultValues} errors={fieldErrors} />
        <NumberField name="statSquareMeters" label="Temizlenen Yüzey (m²)" defaultValues={defaultValues} errors={fieldErrors} />
        <NumberField name="statClients" label="Kurumsal Müşteri" defaultValues={defaultValues} errors={fieldErrors} />
        <NumberField name="statCities" label="Hizmet Verilen Şehir" defaultValues={defaultValues} errors={fieldErrors} />
        <NumberField name="statOperationHours" label="Operasyon Saati" defaultValues={defaultValues} errors={fieldErrors} />
      </Panel>

      <Panel title="SEO Varsayılanları">
        <TextField name="defaultSeoTitle" label="Varsayılan Başlık" defaultValues={defaultValues} errors={fieldErrors} />
        <MediaPickerField
          name="defaultOgImage"
          label="Varsayılan OG Görseli"
          defaultValue={defaultValues.defaultOgImage}
          error={fieldErrors?.defaultOgImage}
        />
        <TextAreaField
          name="defaultMetaDescription"
          label="Varsayılan Meta Açıklama"
          defaultValues={defaultValues}
          errors={fieldErrors}
        />
      </Panel>

      <Panel
        title="Analytics"
        description="ID girilmezse hiçbir üçüncü taraf script'i yüklenmez ve çerez bandı gösterilmez."
      >
        <TextField name="gaMeasurementId" label="GA4 Measurement ID" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="gtmId" label="Google Tag Manager ID" defaultValues={defaultValues} errors={fieldErrors} />
        <TextField name="metaPixelId" label="Meta Pixel ID" defaultValues={defaultValues} errors={fieldErrors} />
      </Panel>

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-line bg-surface/95 py-4 backdrop-blur">
        <Button type="submit" loading={pending} disabled={pending}>
          <Save className="size-4" aria-hidden />
          Ayarları Kaydet
        </Button>
      </div>
    </form>
  )
}

function Panel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <fieldset className="panel rounded-md">
      <legend className="sr-only">{title}</legend>
      <div className="border-b border-line px-5 py-3.5">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {description && <p className="mt-1 text-xs text-ink-subtle">{description}</p>}
      </div>
      <div className="grid gap-5 p-5 md:grid-cols-2">{children}</div>
    </fieldset>
  )
}

type FieldProps = {
  name: keyof SiteSettingsValues & string
  label: string
  hint?: string
  span2?: boolean
  defaultValues: SiteSettingsValues
  errors?: Record<string, string>
}

function TextField({ name, label, hint, span2, defaultValues, errors }: FieldProps) {
  const value = defaultValues[name]

  return (
    <div className={span2 ? 'md:col-span-2' : undefined}>
      <Field id={`setting-${name}`} label={label} hint={hint} error={errors?.[name]}>
        {(props) => (
          <Input {...props} name={name} defaultValue={typeof value === 'string' ? value : ''} />
        )}
      </Field>
    </div>
  )
}

function NumberField({ name, label, hint, defaultValues, errors }: FieldProps) {
  const value = defaultValues[name]

  return (
    <Field id={`setting-${name}`} label={label} hint={hint} error={errors?.[name]}>
      {(props) => (
        <Input
          {...props}
          name={name}
          type="number"
          min={0}
          defaultValue={typeof value === 'number' ? String(value) : ''}
        />
      )}
    </Field>
  )
}

function TextAreaField({ name, label, hint, defaultValues, errors }: FieldProps) {
  const value = defaultValues[name]

  return (
    <div className="md:col-span-2">
      <Field id={`setting-${name}`} label={label} hint={hint} error={errors?.[name]}>
        {(props) => (
          <Textarea {...props} name={name} rows={3} defaultValue={typeof value === 'string' ? value : ''} />
        )}
      </Field>
    </div>
  )
}
