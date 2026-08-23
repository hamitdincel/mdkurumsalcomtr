'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { AlertCircle, CheckCircle2, Plus, Save, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/input'
import { Field } from '@/components/ui/field'
import { MediaPickerField } from './media-picker'
import { deleteEntityAction, type DeletableEntity } from '@/actions/content-actions'
import { slugify } from '@/lib/utils'
import type { ActionState } from '@/lib/validation/common'

/**
 * GENEL AMAÇLI İÇERİK FORMU
 * ---------------------------------------------------------------------------
 * Tüm CRUD ekranları aynı form motorunu kullanır; her varlık için ayrı form
 * kodu yazılmaz (kod tekrarından kaçınma). Alan tipleri aşağıda tanımlıdır.
 */
export type FieldConfig =
  | { type: 'text'; name: string; label: string; required?: boolean; hint?: string; placeholder?: string; span?: 1 | 2 }
  | { type: 'slug'; name: string; label: string; sourceField: string; required?: boolean; hint?: string; span?: 1 | 2 }
  | { type: 'textarea'; name: string; label: string; rows?: number; required?: boolean; hint?: string; span?: 1 | 2 }
  | { type: 'html'; name: string; label: string; rows?: number; hint?: string; span?: 1 | 2 }
  | { type: 'number'; name: string; label: string; min?: number; max?: number; hint?: string; span?: 1 | 2 }
  | { type: 'date'; name: string; label: string; hint?: string; span?: 1 | 2 }
  | { type: 'checkbox'; name: string; label: string; hint?: string; span?: 1 | 2 }
  | {
      type: 'select'
      name: string
      label: string
      options: { value: string; label: string }[]
      required?: boolean
      hint?: string
      span?: 1 | 2
    }
  | {
      type: 'multiselect'
      name: string
      label: string
      options: { value: string; label: string }[]
      hint?: string
      span?: 1 | 2
    }
  | { type: 'image'; name: string; label: string; hint?: string; span?: 1 | 2 }
  | { type: 'stringList'; name: string; label: string; hint?: string; itemLabel?: string; span?: 1 | 2 }
  | { type: 'itemList'; name: string; label: string; hint?: string; span?: 1 | 2 }
  | { type: 'tagList'; name: string; label: string; hint?: string; span?: 1 | 2 }

export type FieldSection = {
  title: string
  description?: string
  fields: FieldConfig[]
}

type EntityFormProps = {
  sections: FieldSection[]
  action: (state: ActionState<{ id: string }>, formData: FormData) => Promise<ActionState<{ id: string }>>
  defaultValues?: Record<string, unknown>
  entityId?: string
  deleteEntity?: DeletableEntity
  /** Kayıt sonrası dönülecek liste sayfası */
  returnHref: string
  submitLabel?: string
}

const initialState: ActionState<{ id: string }> = { status: 'idle' }

export function EntityForm({
  sections,
  action,
  defaultValues = {},
  entityId,
  deleteEntity,
  returnHref,
  submitLabel = 'Kaydet',
}: EntityFormProps) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action, initialState)
  const [deleting, setDeleting] = React.useState(false)

  const fieldErrors = state.status === 'error' ? state.fieldErrors : undefined

  React.useEffect(() => {
    if (state.status === 'success') {
      router.refresh()
    }
  }, [state, router])

  const handleDelete = async () => {
    if (!deleteEntity || !entityId) return
    if (!window.confirm('Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return

    setDeleting(true)
    const result = await deleteEntityAction(deleteEntity, entityId)
    setDeleting(false)

    if (result.status === 'success') {
      router.push(returnHref)
      router.refresh()
    } else if (result.status === 'error') {
      window.alert(result.message)
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {entityId && <input type="hidden" name="id" value={entityId} />}

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

      {sections.map((section) => (
        <fieldset
          key={section.title}
          className="panel rounded-md"
        >
          <legend className="sr-only">{section.title}</legend>
          <div className="border-b border-line px-5 py-3.5">
            <h2 className="text-sm font-semibold text-ink">{section.title}</h2>
            {section.description && (
              <p className="mt-1 text-xs text-ink-subtle">{section.description}</p>
            )}
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-2">
            {section.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                defaultValue={defaultValues[field.name]}
                error={fieldErrors?.[field.name]}
                allValues={defaultValues}
              />
            ))}
          </div>
        </fieldset>
      ))}

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-line bg-surface/95 py-4 backdrop-blur">
        <Button type="submit" loading={pending} disabled={pending}>
          <Save className="size-4" aria-hidden />
          {submitLabel}
        </Button>

        <Button type="button" variant="ghost" onClick={() => router.push(returnHref)}>
          Listeye Dön
        </Button>

        <div className="flex-1" />

        {deleteEntity && entityId && (
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            loading={deleting}
            disabled={deleting}
          >
            <Trash2 className="size-4" aria-hidden />
            Sil
          </Button>
        )}
      </div>
    </form>
  )
}

function FormField({
  field,
  defaultValue,
  error,
  allValues,
}: {
  field: FieldConfig
  defaultValue: unknown
  error?: string
  allValues: Record<string, unknown>
}) {
  const span = field.span === 2 ? 'md:col-span-2' : ''
  const id = `field-${field.name}`

  switch (field.type) {
    case 'checkbox':
      return (
        <div className={`flex items-start gap-3 ${span}`}>
          <input
            id={id}
            name={field.name}
            type="checkbox"
            defaultChecked={Boolean(defaultValue)}
            className="mt-0.5 size-5 shrink-0 accent-brand-500"
          />
          <label htmlFor={id} className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-ink">{field.label}</span>
            {field.hint && <span className="text-xs text-ink-subtle">{field.hint}</span>}
          </label>
        </div>
      )

    case 'slug':
      return (
        <div className={span}>
          <SlugField field={field} defaultValue={defaultValue} error={error} allValues={allValues} />
        </div>
      )

    case 'image':
      return (
        <div className={span}>
          <MediaPickerField
            name={field.name}
            label={field.label}
            hint={field.hint}
            defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
            error={error}
          />
        </div>
      )

    case 'stringList':
      return (
        <div className={span}>
          <StringListField field={field} defaultValue={defaultValue} error={error} />
        </div>
      )

    case 'tagList':
      return (
        <div className={span}>
          <StringListField field={field} defaultValue={defaultValue} error={error} />
        </div>
      )

    case 'itemList':
      return (
        <div className={span}>
          <ItemListField field={field} defaultValue={defaultValue} error={error} />
        </div>
      )

    case 'multiselect':
      return (
        <div className={span}>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">{field.label}</legend>
            {field.hint && <p className="mb-2 text-xs text-ink-subtle">{field.hint}</p>}
            <div className="flex flex-wrap gap-2">
              {field.options.map((option) => {
                const selected = Array.isArray(defaultValue)
                  ? (defaultValue as string[]).includes(option.value)
                  : false
                return (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 rounded-sm border border-line px-3 py-2 text-sm text-ink-muted transition-colors hover:border-line-strong has-checked:border-brand-500 has-checked:bg-brand-50 has-checked:text-brand-700"
                  >
                    <input
                      type="checkbox"
                      name={field.name}
                      value={option.value}
                      defaultChecked={selected}
                      className="size-4 accent-brand-500"
                    />
                    {option.label}
                  </label>
                )
              })}
            </div>
          </fieldset>
        </div>
      )

    default:
      break
  }

  return (
    <div className={span}>
      <Field
        id={id}
        label={field.label}
        required={'required' in field ? field.required : undefined}
        hint={field.hint}
        error={error}
      >
        {(props) => {
          switch (field.type) {
            case 'textarea':
            case 'html':
              return (
                <Textarea
                  {...props}
                  name={field.name}
                  rows={field.rows ?? (field.type === 'html' ? 10 : 4)}
                  defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
                  className={field.type === 'html' ? 'font-mono text-sm' : undefined}
                />
              )
            case 'number':
              return (
                <Input
                  {...props}
                  name={field.name}
                  type="number"
                  min={field.min}
                  max={field.max}
                  defaultValue={
                    typeof defaultValue === 'number' || typeof defaultValue === 'string'
                      ? String(defaultValue)
                      : ''
                  }
                />
              )
            case 'date':
              return (
                <Input
                  {...props}
                  name={field.name}
                  type="date"
                  defaultValue={formatDateInput(defaultValue)}
                />
              )
            case 'select':
              return (
                <Select
                  {...props}
                  name={field.name}
                  defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
                >
                  <option value="">Seçiniz</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              )
            default:
              return (
                <Input
                  {...props}
                  name={field.name}
                  placeholder={'placeholder' in field ? field.placeholder : undefined}
                  defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
                />
              )
          }
        }}
      </Field>
    </div>
  )
}

/** Başlıktan otomatik slug üretir; kullanıcı manuel değiştirebilir. */
function SlugField({
  field,
  defaultValue,
  error,
  allValues,
}: {
  field: Extract<FieldConfig, { type: 'slug' }>
  defaultValue: unknown
  error?: string
  allValues: Record<string, unknown>
}) {
  const [value, setValue] = React.useState(
    typeof defaultValue === 'string' ? defaultValue : '',
  )
  const [touched, setTouched] = React.useState(Boolean(defaultValue))

  React.useEffect(() => {
    if (touched) return

    const form = document.querySelector('form')
    const source = form?.querySelector<HTMLInputElement>(`[name="${field.sourceField}"]`)
    if (!source) return

    const handler = () => setValue(slugify(source.value))
    source.addEventListener('input', handler)
    return () => source.removeEventListener('input', handler)
  }, [field.sourceField, touched, allValues])

  return (
    <Field
      id={`field-${field.name}`}
      label={field.label}
      required={field.required}
      hint={field.hint ?? 'URL’de görünen bölüm. Yayına alındıktan sonra değiştirilirse yönlendirme tanımlayın.'}
      error={error}
    >
      {(props) => (
        <Input
          {...props}
          name={field.name}
          value={value}
          onChange={(event) => {
            setTouched(true)
            setValue(slugify(event.target.value))
          }}
          className="font-mono text-sm"
        />
      )}
    </Field>
  )
}

/** Basit metin listesi — JSON dizi olarak gönderilir. */
function StringListField({
  field,
  defaultValue,
  error,
}: {
  field: Extract<FieldConfig, { type: 'stringList' | 'tagList' }>
  defaultValue: unknown
  error?: string
}) {
  const [items, setItems] = React.useState<string[]>(
    Array.isArray(defaultValue) ? (defaultValue as string[]) : [],
  )
  const [draft, setDraft] = React.useState('')

  const add = () => {
    const value = draft.trim()
    if (!value) return
    setItems([...items, value])
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink">{field.label}</span>
      {field.hint && <p className="text-xs text-ink-subtle">{field.hint}</p>}

      <input type="hidden" name={field.name} value={JSON.stringify(items)} readOnly />

      {items.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-1.5 text-sm text-ink"
            >
              {item}
              <button
                type="button"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
                aria-label={`${item} kaldır`}
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
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              add()
            }
          }}
          placeholder={
            field.type === 'stringList' && field.itemLabel
              ? field.itemLabel
              : 'Yeni madde yazın ve Enter’a basın'
          }
        />
        <Button type="button" variant="secondary" onClick={add}>
          <Plus className="size-4" aria-hidden />
          Ekle
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

/** Başlık + açıklama çiftlerinden oluşan liste (avantajlar, süreç adımları). */
function ItemListField({
  field,
  defaultValue,
  error,
}: {
  field: Extract<FieldConfig, { type: 'itemList' }>
  defaultValue: unknown
  error?: string
}) {
  type Item = { title: string; description: string }

  const [items, setItems] = React.useState<Item[]>(
    Array.isArray(defaultValue) ? (defaultValue as Item[]) : [],
  )

  const update = (index: number, patch: Partial<Item>) => {
    setItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-ink">{field.label}</span>
      {field.hint && <p className="text-xs text-ink-subtle">{field.hint}</p>}

      <input type="hidden" name={field.name} value={JSON.stringify(items)} readOnly />

      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={index} className="flex flex-col gap-2 rounded-sm border border-line p-3">
            <div className="flex gap-2">
              <Input
                value={item.title}
                onChange={(event) => update(index, { title: event.target.value })}
                placeholder="Başlık"
                aria-label={`${index + 1}. madde başlığı`}
              />
              <Button
                type="button"
                variant="ghost"
                size="iconSm"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
                aria-label={`${index + 1}. maddeyi kaldır`}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </div>
            <Textarea
              value={item.description}
              onChange={(event) => update(index, { description: event.target.value })}
              rows={2}
              placeholder="Açıklama"
              aria-label={`${index + 1}. madde açıklaması`}
            />
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setItems([...items, { title: '', description: '' }])}
        className="self-start"
      >
        <Plus className="size-4" aria-hidden />
        Madde Ekle
      </Button>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

function formatDateInput(value: unknown): string {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}
