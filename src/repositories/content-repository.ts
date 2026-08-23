import 'server-only'
import { prisma } from '@/lib/db/prisma'
import { safeQuery } from '@/lib/db/safe'

/** Referans logoları, müşteri yorumları, SSS ve medya için ortak repository. */

export function listActiveReferences() {
  return safeQuery(
    () =>
      prisma.reference.findMany({
        where: { active: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: { id: true, name: true, logo: true, website: true },
      }),
    [],
    'reference:list',
  )
}

export function listReferencesForAdmin() {
  return safeQuery(
    () => prisma.reference.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
    [],
    'reference:admin-list',
  )
}

export function listActiveTestimonials(limit?: number) {
  return safeQuery(
    () =>
      prisma.testimonial.findMany({
        where: { active: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take: limit,
        select: {
          id: true,
          personName: true,
          company: true,
          jobTitle: true,
          text: true,
          avatar: true,
          logo: true,
        },
      }),
    [],
    'testimonial:list',
  )
}

export function listTestimonialsForAdmin() {
  return safeQuery(
    () =>
      prisma.testimonial.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: { project: { select: { title: true } } },
      }),
    [],
    'testimonial:admin-list',
  )
}

export function listActiveFaqs(options?: { serviceId?: string | null; limit?: number }) {
  return safeQuery(
    () =>
      prisma.faq.findMany({
        where: {
          active: true,
          ...(options?.serviceId !== undefined ? { serviceId: options.serviceId } : {}),
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        take: options?.limit,
        select: { id: true, question: true, answer: true },
      }),
    [],
    'faq:list',
  )
}

export function listFaqsForAdmin() {
  return safeQuery(
    () =>
      prisma.faq.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        include: { service: { select: { title: true } } },
      }),
    [],
    'faq:admin-list',
  )
}

export function listMediaAssets(options?: { folder?: string; take?: number; skip?: number }) {
  return safeQuery(
    async () => {
      const where = options?.folder && options.folder !== 'all' ? { folder: options.folder } : {}
      const [items, total] = await Promise.all([
        prisma.mediaAsset.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: options?.take ?? 60,
          skip: options?.skip ?? 0,
        }),
        prisma.mediaAsset.count({ where }),
      ])
      return { items, total }
    },
    { items: [], total: 0 },
    'media:list',
  )
}

export function listMediaFolders() {
  return safeQuery(
    async () => {
      const rows = await prisma.mediaAsset.findMany({
        distinct: ['folder'],
        select: { folder: true },
        orderBy: { folder: 'asc' },
      })
      return rows.map((r) => r.folder).filter((f): f is string => Boolean(f))
    },
    [],
    'media:folders',
  )
}

export function listActiveRedirects() {
  return safeQuery(
    () =>
      prisma.redirect.findMany({
        where: { active: true },
        select: { oldPath: true, newPath: true, statusCode: true },
      }),
    [],
    'redirect:list',
  )
}

export function listRedirectsForAdmin() {
  return safeQuery(
    () => prisma.redirect.findMany({ orderBy: { createdAt: 'desc' } }),
    [],
    'redirect:admin-list',
  )
}

export function findRedirect(path: string) {
  return safeQuery(
    () => prisma.redirect.findFirst({ where: { oldPath: path, active: true } }),
    null,
    'redirect:find',
  )
}
