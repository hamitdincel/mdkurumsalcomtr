'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
import { checkPermission } from '@/lib/auth/guard'
import { toFieldErrors, type ActionState } from '@/lib/validation/common'
import {
  beforeAfterSchema,
  categorySchema,
  faqSchema,
  postSchema,
  projectSchema,
  redirectSchema,
  referenceSchema,
  sectorSchema,
  serviceSchema,
  testimonialSchema,
} from '@/lib/validation/content'
import { sanitizeHtml } from '@/lib/security/sanitize'
import { readingTime, slugify, stripHtml } from '@/lib/utils'

/**
 * İÇERİK CRUD SERVER ACTION'LARI
 * ---------------------------------------------------------------------------
 * Tüm işlemler:
 *  1) yetki kontrolünden geçer,
 *  2) Zod ile server-side doğrulanır,
 *  3) audit log'a yazılır,
 *  4) ilgili public sayfaları revalidate eder.
 */

type SaveResult = ActionState<{ id: string }>

/** FormData'yı şema öncesi normalize eder (checkbox, JSON alanları, boş stringler). */
function normalizeFormData(
  formData: FormData,
  options: { booleans?: string[]; jsonFields?: string[]; arrays?: string[] } = {},
): Record<string, unknown> {
  const raw: Record<string, unknown> = {}

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue
    raw[key] = value
  }

  for (const key of options.booleans ?? []) {
    raw[key] = formData.get(key) === 'on' || formData.get(key) === 'true'
  }

  for (const key of options.jsonFields ?? []) {
    const value = formData.get(key)
    if (typeof value === 'string' && value.trim() !== '') {
      try {
        raw[key] = JSON.parse(value)
      } catch {
        raw[key] = undefined
      }
    } else {
      raw[key] = undefined
    }
  }

  for (const key of options.arrays ?? []) {
    const values = formData.getAll(key).filter((v): v is string => typeof v === 'string' && v !== '')
    raw[key] = values
  }

  return raw
}

async function audit(
  userId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  entity: string,
  entityId: string,
): Promise<void> {
  await prisma.auditLog.create({ data: { userId, action, entity, entityId } }).catch(() => undefined)
}

function fail(error: z.ZodError, message = 'Lütfen işaretli alanları kontrol edin.'): SaveResult {
  return { status: 'error', message, fieldErrors: toFieldErrors(error) }
}

function handleError(error: unknown, entityLabel: string): SaveResult {
  console.error(`[${entityLabel}] Kayıt hatası:`, error)

  if (
    error instanceof Error &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  ) {
    return {
      status: 'error',
      message: 'Bu slug zaten kullanılıyor. Lütfen farklı bir slug girin.',
      fieldErrors: { slug: 'Bu slug zaten kullanılıyor.' },
    }
  }

  return { status: 'error', message: `${entityLabel} kaydedilemedi. Lütfen tekrar deneyin.` }
}

// ---------------------------------------------------------------------------
// HİZMET
// ---------------------------------------------------------------------------

export async function saveServiceAction(
  _prevState: SaveResult,
  formData: FormData,
): Promise<SaveResult> {
  const auth = await checkPermission('content:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const raw = normalizeFormData(formData, {
    booleans: ['active', 'featured'],
    jsonFields: ['advantages', 'processSteps', 'problems', 'surfaces'],
  })

  const parsed = serviceSchema.safeParse(raw)
  if (!parsed.success) return fail(parsed.error)

  const { id, ...data } = parsed.data
  const payload = {
    ...data,
    slug: slugify(data.slug),
    content: data.content ? sanitizeHtml(data.content) : null,
    advantages: data.advantages ?? undefined,
    processSteps: data.processSteps ?? undefined,
    problems: data.problems ?? undefined,
    surfaces: data.surfaces ?? undefined,
  }

  try {
    const record = id
      ? await prisma.service.update({ where: { id }, data: payload })
      : await prisma.service.create({ data: payload })

    await audit(auth.user.id, id ? 'UPDATE' : 'CREATE', 'Service', record.id)

    revalidatePath('/')
    revalidatePath('/hizmetler')
    revalidatePath(`/hizmetler/${record.slug}`)
    revalidatePath('/admin/services')

    return { status: 'success', message: 'Hizmet kaydedildi.', data: { id: record.id } }
  } catch (error) {
    return handleError(error, 'Hizmet')
  }
}

// ---------------------------------------------------------------------------
// SEKTÖR
// ---------------------------------------------------------------------------

export async function saveSectorAction(
  _prevState: SaveResult,
  formData: FormData,
): Promise<SaveResult> {
  const auth = await checkPermission('content:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const raw = normalizeFormData(formData, {
    booleans: ['active'],
    jsonFields: ['needs', 'approach'],
    arrays: ['serviceIds'],
  })

  const parsed = sectorSchema.safeParse(raw)
  if (!parsed.success) return fail(parsed.error)

  const { id, serviceIds, ...data } = parsed.data
  const payload = {
    ...data,
    slug: slugify(data.slug),
    content: data.content ? sanitizeHtml(data.content) : null,
    needs: data.needs ?? undefined,
    approach: data.approach ?? undefined,
  }

  try {
    const record = id
      ? await prisma.sector.update({ where: { id }, data: payload })
      : await prisma.sector.create({ data: payload })

    // Hizmet ilişkileri yeniden kurulur.
    if (serviceIds) {
      await prisma.sectorService.deleteMany({ where: { sectorId: record.id } })
      if (serviceIds.length > 0) {
        await prisma.sectorService.createMany({
          data: serviceIds.map((serviceId) => ({ sectorId: record.id, serviceId })),
          skipDuplicates: true,
        })
      }
    }

    await audit(auth.user.id, id ? 'UPDATE' : 'CREATE', 'Sector', record.id)

    revalidatePath('/')
    revalidatePath('/sektorler')
    revalidatePath(`/sektorler/${record.slug}`)
    revalidatePath('/admin/sectors')

    return { status: 'success', message: 'Çalışma alanı kaydedildi.', data: { id: record.id } }
  } catch (error) {
    return handleError(error, 'Çalışma alanı')
  }
}

// ---------------------------------------------------------------------------
// PROJE
// ---------------------------------------------------------------------------

export async function saveProjectAction(
  _prevState: SaveResult,
  formData: FormData,
): Promise<SaveResult> {
  const auth = await checkPermission('content:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const raw = normalizeFormData(formData, { booleans: ['featured', 'published', 'anonymized'] })

  // Boş sayısal alanlar undefined'a çevrilir.
  for (const key of ['area', 'height'] as const) {
    if (raw[key] === '') raw[key] = undefined
  }

  const parsed = projectSchema.safeParse(raw)
  if (!parsed.success) return fail(parsed.error)

  const { id, serviceId, sectorId, ...data } = parsed.data
  const payload = {
    ...data,
    slug: slugify(data.slug),
    serviceId: serviceId || null,
    sectorId: sectorId || null,
    completionDate: data.completionDate ?? null,
  }

  try {
    const record = id
      ? await prisma.project.update({ where: { id }, data: payload })
      : await prisma.project.create({ data: payload })

    await audit(auth.user.id, id ? 'UPDATE' : 'CREATE', 'Project', record.id)

    revalidatePath('/')
    revalidatePath('/projeler')
    revalidatePath(`/projeler/${record.slug}`)
    revalidatePath('/admin/projects')

    return { status: 'success', message: 'Proje kaydedildi.', data: { id: record.id } }
  } catch (error) {
    return handleError(error, 'Proje')
  }
}

// ---------------------------------------------------------------------------
// ÖNCESİ / SONRASI
// ---------------------------------------------------------------------------

export async function saveBeforeAfterAction(
  _prevState: SaveResult,
  formData: FormData,
): Promise<SaveResult> {
  const auth = await checkPermission('content:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const raw = normalizeFormData(formData, { booleans: ['active', 'featured'] })
  const parsed = beforeAfterSchema.safeParse(raw)
  if (!parsed.success) return fail(parsed.error)

  const { id, projectId, serviceId, ...data } = parsed.data
  const payload = { ...data, projectId: projectId || null, serviceId: serviceId || null }

  try {
    const record = id
      ? await prisma.beforeAfterSet.update({ where: { id }, data: payload })
      : await prisma.beforeAfterSet.create({ data: payload })

    await audit(auth.user.id, id ? 'UPDATE' : 'CREATE', 'BeforeAfterSet', record.id)

    revalidatePath('/')
    revalidatePath('/once-sonra')
    revalidatePath('/admin/before-after')

    return { status: 'success', message: 'Kayıt kaydedildi.', data: { id: record.id } }
  } catch (error) {
    return handleError(error, 'Öncesi/sonrası kaydı')
  }
}

// ---------------------------------------------------------------------------
// REFERANS / YORUM / SSS
// ---------------------------------------------------------------------------

export async function saveReferenceAction(
  _prevState: SaveResult,
  formData: FormData,
): Promise<SaveResult> {
  const auth = await checkPermission('content:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const parsed = referenceSchema.safeParse(normalizeFormData(formData, { booleans: ['active'] }))
  if (!parsed.success) return fail(parsed.error)

  const { id, ...data } = parsed.data

  try {
    const record = id
      ? await prisma.reference.update({ where: { id }, data })
      : await prisma.reference.create({ data })

    await audit(auth.user.id, id ? 'UPDATE' : 'CREATE', 'Reference', record.id)
    revalidatePath('/')
    revalidatePath('/admin/references')

    return { status: 'success', message: 'Referans kaydedildi.', data: { id: record.id } }
  } catch (error) {
    return handleError(error, 'Referans')
  }
}

export async function saveTestimonialAction(
  _prevState: SaveResult,
  formData: FormData,
): Promise<SaveResult> {
  const auth = await checkPermission('content:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const parsed = testimonialSchema.safeParse(normalizeFormData(formData, { booleans: ['active'] }))
  if (!parsed.success) return fail(parsed.error)

  const { id, projectId, ...data } = parsed.data
  const payload = { ...data, projectId: projectId || null }

  try {
    const record = id
      ? await prisma.testimonial.update({ where: { id }, data: payload })
      : await prisma.testimonial.create({ data: payload })

    await audit(auth.user.id, id ? 'UPDATE' : 'CREATE', 'Testimonial', record.id)
    revalidatePath('/')
    revalidatePath('/admin/testimonials')

    return { status: 'success', message: 'Yorum kaydedildi.', data: { id: record.id } }
  } catch (error) {
    return handleError(error, 'Müşteri yorumu')
  }
}

export async function saveFaqAction(
  _prevState: SaveResult,
  formData: FormData,
): Promise<SaveResult> {
  const auth = await checkPermission('content:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const parsed = faqSchema.safeParse(normalizeFormData(formData, { booleans: ['active'] }))
  if (!parsed.success) return fail(parsed.error)

  const { id, serviceId, ...data } = parsed.data
  const payload = { ...data, serviceId: serviceId || null }

  try {
    const record = id
      ? await prisma.faq.update({ where: { id }, data: payload })
      : await prisma.faq.create({ data: payload })

    await audit(auth.user.id, id ? 'UPDATE' : 'CREATE', 'Faq', record.id)
    revalidatePath('/')
    revalidatePath('/sss')
    revalidatePath('/admin/faq')

    return { status: 'success', message: 'Soru kaydedildi.', data: { id: record.id } }
  } catch (error) {
    return handleError(error, 'SSS kaydı')
  }
}

// ---------------------------------------------------------------------------
// BLOG
// ---------------------------------------------------------------------------

export async function savePostAction(
  _prevState: SaveResult,
  formData: FormData,
): Promise<SaveResult> {
  const auth = await checkPermission('content:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const raw = normalizeFormData(formData, {
    jsonFields: ['contentJson', 'tagNames'],
  })

  const parsed = postSchema.safeParse(raw)
  if (!parsed.success) return fail(parsed.error)

  const { id, categoryId, tagNames, contentHtml, contentJson, ...data } = parsed.data

  // Editörden gelen HTML her koşulda sanitize edilir (stored-XSS koruması).
  const safeHtml = contentHtml ? sanitizeHtml(contentHtml) : null

  const payload = {
    ...data,
    slug: slugify(data.slug),
    categoryId: categoryId || null,
    contentHtml: safeHtml,
    contentJson: (contentJson as object | undefined) ?? undefined,
    readingMinutes: safeHtml ? readingTime(stripHtml(safeHtml)) : 1,
    authorId: auth.user.id,
    publishedAt:
      data.status === 'PUBLISHED' ? (data.publishedAt ?? new Date()) : (data.publishedAt ?? null),
  }

  try {
    const record = id
      ? await prisma.post.update({ where: { id }, data: payload })
      : await prisma.post.create({ data: payload })

    // Etiketler
    if (tagNames) {
      await prisma.postTag.deleteMany({ where: { postId: record.id } })
      for (const name of tagNames) {
        const slug = slugify(name)
        const tag = await prisma.tag.upsert({
          where: { slug },
          update: {},
          create: { name, slug },
        })
        await prisma.postTag.create({ data: { postId: record.id, tagId: tag.id } })
      }
    }

    await audit(auth.user.id, id ? 'UPDATE' : 'CREATE', 'Post', record.id)

    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath(`/blog/${record.slug}`)
    revalidatePath('/admin/blog')

    return { status: 'success', message: 'Yazı kaydedildi.', data: { id: record.id } }
  } catch (error) {
    return handleError(error, 'Blog yazısı')
  }
}

export async function saveCategoryAction(
  _prevState: SaveResult,
  formData: FormData,
): Promise<SaveResult> {
  const auth = await checkPermission('content:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const parsed = categorySchema.safeParse(normalizeFormData(formData))
  if (!parsed.success) return fail(parsed.error)

  const { id, ...data } = parsed.data
  const payload = { ...data, slug: slugify(data.slug) }

  try {
    const record = id
      ? await prisma.category.update({ where: { id }, data: payload })
      : await prisma.category.create({ data: payload })

    await audit(auth.user.id, id ? 'UPDATE' : 'CREATE', 'Category', record.id)
    revalidatePath('/blog')
    revalidatePath('/admin/blog/categories')

    return { status: 'success', message: 'Kategori kaydedildi.', data: { id: record.id } }
  } catch (error) {
    return handleError(error, 'Kategori')
  }
}

// ---------------------------------------------------------------------------
// YÖNLENDİRME
// ---------------------------------------------------------------------------

export async function saveRedirectAction(
  _prevState: SaveResult,
  formData: FormData,
): Promise<SaveResult> {
  const auth = await checkPermission('content:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const parsed = redirectSchema.safeParse(normalizeFormData(formData, { booleans: ['active'] }))
  if (!parsed.success) return fail(parsed.error)

  const { id, ...data } = parsed.data

  try {
    const record = id
      ? await prisma.redirect.update({ where: { id }, data })
      : await prisma.redirect.create({ data })

    await audit(auth.user.id, id ? 'UPDATE' : 'CREATE', 'Redirect', record.id)
    revalidatePath('/admin/settings/redirects')

    return { status: 'success', message: 'Yönlendirme kaydedildi.', data: { id: record.id } }
  } catch (error) {
    return handleError(error, 'Yönlendirme')
  }
}

// ---------------------------------------------------------------------------
// SİLME (tüm içerik türleri için tek giriş noktası)
// ---------------------------------------------------------------------------

const deletableEntities = {
  service: () => prisma.service,
  sector: () => prisma.sector,
  project: () => prisma.project,
  beforeAfter: () => prisma.beforeAfterSet,
  reference: () => prisma.reference,
  testimonial: () => prisma.testimonial,
  faq: () => prisma.faq,
  post: () => prisma.post,
  category: () => prisma.category,
  redirect: () => prisma.redirect,
  media: () => prisma.mediaAsset,
} as const

export type DeletableEntity = keyof typeof deletableEntities

const entityLabels: Record<DeletableEntity, string> = {
  service: 'Hizmet',
  sector: 'Çalışma alanı',
  project: 'Proje',
  beforeAfter: 'Öncesi/sonrası kaydı',
  reference: 'Referans',
  testimonial: 'Müşteri yorumu',
  faq: 'SSS kaydı',
  post: 'Blog yazısı',
  category: 'Kategori',
  redirect: 'Yönlendirme',
  media: 'Medya dosyası',
}

const revalidateTargets: Record<DeletableEntity, string[]> = {
  service: ['/', '/hizmetler', '/admin/services'],
  sector: ['/', '/sektorler', '/admin/sectors'],
  project: ['/', '/projeler', '/admin/projects'],
  beforeAfter: ['/', '/once-sonra', '/admin/before-after'],
  reference: ['/', '/admin/references'],
  testimonial: ['/', '/admin/testimonials'],
  faq: ['/', '/sss', '/admin/faq'],
  post: ['/', '/blog', '/admin/blog'],
  category: ['/blog', '/admin/blog/categories'],
  redirect: ['/admin/settings/redirects'],
  media: ['/admin/media'],
}

export async function deleteEntityAction(
  entity: DeletableEntity,
  id: string,
): Promise<ActionState> {
  const auth = await checkPermission('content:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const label = entityLabels[entity]

  try {
    const model = deletableEntities[entity]()
    // @ts-expect-error — delegate tipleri birleşimde ortak imzayı kaybediyor;
    // entity anahtarı sabit listeden geldiği için çalışma zamanında güvenli.
    await model.delete({ where: { id } })

    await audit(auth.user.id, 'DELETE', entity, id)
    for (const path of revalidateTargets[entity]) revalidatePath(path)

    return { status: 'success', message: `${label} silindi.` }
  } catch (error) {
    console.error(`[${entity}] Silme hatası:`, error)
    return {
      status: 'error',
      message: `${label} silinemedi. Bu kayda bağlı başka içerikler olabilir.`,
    }
  }
}
