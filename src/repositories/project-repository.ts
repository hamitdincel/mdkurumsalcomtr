import 'server-only'
import { prisma } from '@/lib/db/prisma'
import { safeQuery } from '@/lib/db/safe'
import type { Prisma } from '@prisma/client'

const cardSelect = {
  id: true,
  title: true,
  slug: true,
  city: true,
  summary: true,
  coverImage: true,
  surfaceType: true,
  buildingType: true,
  area: true,
  completionDate: true,
  clientName: true,
  anonymized: true,
  service: { select: { title: true, slug: true } },
  sector: { select: { title: true, slug: true } },
} satisfies Prisma.ProjectSelect

export type ProjectCardData = Prisma.ProjectGetPayload<{ select: typeof cardSelect }>

export function listPublishedProjects(options?: {
  serviceSlug?: string
  sectorSlug?: string
  city?: string
  take?: number
  skip?: number
}): Promise<ProjectCardData[]> {
  const where: Prisma.ProjectWhereInput = { published: true }
  if (options?.serviceSlug) where.service = { slug: options.serviceSlug }
  if (options?.sectorSlug) where.sector = { slug: options.sectorSlug }
  if (options?.city) where.city = { equals: options.city, mode: 'insensitive' }

  return safeQuery(
    () =>
      prisma.project.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { completionDate: 'desc' }],
        take: options?.take,
        skip: options?.skip,
        select: cardSelect,
      }),
    [],
    'project:list',
  )
}

export function countPublishedProjects(options?: {
  serviceSlug?: string
  sectorSlug?: string
  city?: string
}): Promise<number> {
  const where: Prisma.ProjectWhereInput = { published: true }
  if (options?.serviceSlug) where.service = { slug: options.serviceSlug }
  if (options?.sectorSlug) where.sector = { slug: options.sectorSlug }
  if (options?.city) where.city = { equals: options.city, mode: 'insensitive' }

  return safeQuery(() => prisma.project.count({ where }), 0, 'project:count')
}

export function listFeaturedProjects(limit = 3): Promise<ProjectCardData[]> {
  return safeQuery(
    () =>
      prisma.project.findMany({
        where: { published: true },
        orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { completionDate: 'desc' }],
        take: limit,
        select: cardSelect,
      }),
    [],
    'project:featured',
  )
}

export function getProjectBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.project.findFirst({
        where: { slug, published: true },
        include: {
          service: { select: { id: true, title: true, slug: true } },
          sector: { select: { id: true, title: true, slug: true } },
          media: { orderBy: { sortOrder: 'asc' } },
          beforeAfterSets: { where: { active: true }, orderBy: { sortOrder: 'asc' } },
          testimonial: true,
        },
      }),
    null,
    'project:detail',
  )
}

export function listAllProjectSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  return safeQuery(
    () => prisma.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    [],
    'project:slugs',
  )
}

export function listProjectCities(): Promise<string[]> {
  return safeQuery(
    async () => {
      const rows = await prisma.project.findMany({
        where: { published: true },
        distinct: ['city'],
        select: { city: true },
        orderBy: { city: 'asc' },
      })
      return rows.map((r) => r.city)
    },
    [],
    'project:cities',
  )
}

export function listProjectsForAdmin() {
  return safeQuery(
    () =>
      prisma.project.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          title: true,
          slug: true,
          city: true,
          published: true,
          featured: true,
          updatedAt: true,
          completionDate: true,
          service: { select: { title: true } },
        },
      }),
    [],
    'project:admin-list',
  )
}

export function getProjectById(id: string) {
  return safeQuery(
    () => prisma.project.findUnique({ where: { id }, include: { media: { orderBy: { sortOrder: 'asc' } } } }),
    null,
    'project:by-id',
  )
}

export function listBeforeAfterSets(options?: { take?: number; featuredOnly?: boolean }) {
  return safeQuery(
    () =>
      prisma.beforeAfterSet.findMany({
        where: { active: true, ...(options?.featuredOnly ? { featured: true } : {}) },
        orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
        take: options?.take,
        include: {
          service: { select: { title: true, slug: true } },
          project: { select: { title: true, slug: true } },
        },
      }),
    [],
    'before-after:list',
  )
}

export function listBeforeAfterForAdmin() {
  return safeQuery(
    () =>
      prisma.beforeAfterSet.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: { service: { select: { title: true } }, project: { select: { title: true } } },
      }),
    [],
    'before-after:admin-list',
  )
}
