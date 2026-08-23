'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import dynamic from 'next/dynamic'
import { AlertCircle, CheckCircle2, Plus, Save, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/input'
import { Field } from '@/components/ui/field'
import { MediaPickerField } from './media-picker'
import { savePostAction, deleteEntityAction } from '@/actions/content-actions'
import { slugify } from '@/lib/utils'
import type { ActionState } from '@/lib/validation/common'

/** Editör ağır bir client bileşeni — yalnızca gerektiğinde yüklenir. */
const RichTextEditor = dynamic(
  () => import('./rich-text-editor').then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-96 rounded-sm border border-line bg-surface-sunken/40 p-4 text-sm text-ink-subtle">
        Editör yükleniyor…
      </div>
    ),
  },
)

type PostFormProps = {
  postId?: string
  categories: { value: string; label: string }[]
  defaultValues?: {
    title?: string
    slug?: string
    excerpt?: string
    contentHtml?: string
    featuredImage?: string
    status?: 'DRAFT' | 'PUBLISHED'
    publishedAt?: string
    categoryId?: string
    tagNames?: string[]
    seoTitle?: string
    metaDescription?: string
    ogImage?: string
    canonical?: string
  }
}

const initialState: ActionState<{ id: string }> = { status: 'idle' }

export function PostForm({ postId, categories, defaultValues = {} }: PostFormProps) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(savePostAction, initialState)

  const [title, setTitle] = React.useState(defaultValues.title ?? '')
  const [slug, setSlug] = React.useState(defaultValues.slug ?? '')
  const [slugTouched, setSlugTouched] = React.useState(Boolean(defaultValues.slug))
  const [content, setContent] = React.useState({
    html: defaultValues.contentHtml ?? '',
    json: null as unknown,
  })
  const [tags, setTags] = React.useState<string[]>(defaultValues.tagNames ?? [])
  const [tagDraft, setTagDraft] = React.useState('')
  const [deleting, setDeleting] = React.useState(false)

  const fieldErrors = state.status === 'error' ? state.fieldErrors : undefined

  React.useEffect(() => {
    if (state.status === 'success') router.refresh()
  }, [state, router])

  const handleDelete = async () => {
    if (!postId) return
    if (!window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return

    setDeleting(true)
    const result = await deleteEntityAction('post', postId)
    setDeleting(false)

    if (result.status === 'success') {
      router.push('/admin/blog')
      router.refresh()
    } else if (result.status === 'error') {
      window.alert(result.message)
    }
  }

  const addTag = () => {
    const value = tagDraft.trim()
    if (!value || tags.includes(value)) return
    setTags([...tags, value])
    setTagDraft('')
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {postId && <input type="hidden" name="id" value={postId} />}
      <input type="hidden" name="contentHtml" value={content.html} />
      <input type="hidden" name="contentJson" value={JSON.stringify(content.json ?? {})} />
      <input type="hidden" name="tagNames" value={JSON.stringify(tags)} />

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

      <div className="grid gap-8 xl:grid-cols-[1.5fr_0.5fr]">
        {/* Ana içerik */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 panel rounded-md p-5">
            <Field id="title" label="Başlık" required error={fieldErrors?.title}>
              {(props) => (
                <Input
                  {...props}
                  name="title"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value)
                    if (!slugTouched) setSlug(slugify(event.target.value))
                  }}
                  className="text-lg"
                />
              )}
            </Field>

            <Field
              id="slug"
              label="Slug"
              required
              hint="URL'de görünür. Yayına alındıktan sonra değiştirilirse yönlendirme tanımlayın."
              error={fieldErrors?.slug}
            >
              {(props) => (
                <Input
                  {...props}
                  name="slug"
                  value={slug}
                  onChange={(event) => {
                    setSlugTouched(true)
                    setSlug(slugify(event.target.value))
                  }}
                  className="font-mono text-sm"
                />
              )}
            </Field>

            <Field
              id="excerpt"
              label="Özet"
              required
              hint="Liste kartlarında ve meta açıklamada kullanılır."
              error={fieldErrors?.excerpt}
            >
              {(props) => <Textarea {...props} name="excerpt" rows={3} defaultValue={defaultValues.excerpt} />}
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">İçerik</span>
            <RichTextEditor initialHtml={defaultValues.contentHtml} onChange={setContent} />
            <p className="text-xs text-ink-subtle">
              İçerik kaydedilirken güvenlik için temizlenir (HTML sanitization).
            </p>
          </div>
        </div>

        {/* Yan panel */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 panel rounded-md p-5">
            <h2 className="text-sm font-semibold text-ink">Yayın</h2>

            <Field id="status" label="Durum" error={fieldErrors?.status}>
              {(props) => (
                <Select {...props} name="status" defaultValue={defaultValues.status ?? 'DRAFT'}>
                  <option value="DRAFT">Taslak</option>
                  <option value="PUBLISHED">Yayında</option>
                </Select>
              )}
            </Field>

            <Field
              id="publishedAt"
              label="Yayın Tarihi"
              hint="Boş bırakılırsa yayına alındığı an kullanılır."
              error={fieldErrors?.publishedAt}
            >
              {(props) => (
                <Input {...props} name="publishedAt" type="date" defaultValue={defaultValues.publishedAt} />
              )}
            </Field>

            <Field id="categoryId" label="Kategori" error={fieldErrors?.categoryId}>
              {(props) => (
                <Select {...props} name="categoryId" defaultValue={defaultValues.categoryId ?? ''}>
                  <option value="">Seçiniz</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            {/* Etiketler */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ink">Etiketler</span>
              {tags.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="flex items-center gap-1.5 rounded-xs bg-surface-sunken px-2 py-1 text-sm text-ink"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        aria-label={`${tag} etiketini kaldır`}
                        className="text-ink-subtle hover:text-danger"
                      >
                        <X className="size-3" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2">
                <Input
                  value={tagDraft}
                  onChange={(event) => setTagDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="Etiket"
                  aria-label="Yeni etiket"
                  className="h-10"
                />
                <Button type="button" variant="secondary" size="sm" onClick={addTag}>
                  <Plus className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 panel rounded-md p-5">
            <h2 className="text-sm font-semibold text-ink">Görsel</h2>
            <MediaPickerField
              name="featuredImage"
              label="Öne Çıkan Görsel"
              defaultValue={defaultValues.featuredImage}
              error={fieldErrors?.featuredImage}
            />
          </div>

          <div className="flex flex-col gap-5 panel rounded-md p-5">
            <h2 className="text-sm font-semibold text-ink">SEO</h2>

            <Field id="seoTitle" label="SEO Başlığı" error={fieldErrors?.seoTitle}>
              {(props) => <Input {...props} name="seoTitle" defaultValue={defaultValues.seoTitle} />}
            </Field>

            <Field id="metaDescription" label="Meta Açıklama" error={fieldErrors?.metaDescription}>
              {(props) => (
                <Textarea {...props} name="metaDescription" rows={3} defaultValue={defaultValues.metaDescription} />
              )}
            </Field>

            <Field
              id="canonical"
              label="Canonical URL"
              hint="Yalnızca içerik başka bir adreste de yayımlanıyorsa doldurun."
              error={fieldErrors?.canonical}
            >
              {(props) => <Input {...props} name="canonical" defaultValue={defaultValues.canonical} />}
            </Field>

            <MediaPickerField
              name="ogImage"
              label="Paylaşım Görseli (OG)"
              defaultValue={defaultValues.ogImage}
              error={fieldErrors?.ogImage}
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-line bg-surface/95 py-4 backdrop-blur">
        <Button type="submit" loading={pending} disabled={pending}>
          <Save className="size-4" aria-hidden />
          Kaydet
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/blog')}>
          Listeye Dön
        </Button>

        <div className="flex-1" />

        {postId && (
          <Button type="button" variant="danger" onClick={handleDelete} loading={deleting} disabled={deleting}>
            <Trash2 className="size-4" aria-hidden />
            Sil
          </Button>
        )}
      </div>
    </form>
  )
}
