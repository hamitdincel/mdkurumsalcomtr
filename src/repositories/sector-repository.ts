import 'server-only'
import { prisma } from '@/lib/db/prisma'
import { safeQuery } from '@/lib/db/safe'
import type { Prisma, Sector } from '@prisma/client'

export type SectorListItem = Pick<
  Sector,
  'id' | 'title' | 'slug' | 'shortDescription' | 'heroImage' | 'icon' | 'sortOrder'
>

const listSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  heroImage: true,
  icon: true,
  sortOrder: true,
} satisfies Prisma.SectorSelect

export function listActiveSectors(): Promise<SectorListItem[]> {
  return safeQuery(
    () =>
      prisma.sector.findMany({
        where: { active: true },
        orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
        select: listSelect,
      }),
    [],
    'sector:list',
  )
}

export function getSectorBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.sector.findFirst({
        where: { slug, active: true },
        include: {
          services: { include: { service: { select: { title: true, slug: true, icon: true, shortDescription: true } } } },
          projects: {
            where: { published: true },
            orderBy: [{ featured: 'desc' }, { completionDate: 'desc' }],
            take: 3,
            select: {
              id: true,
              title: true,
              slug: true,
              city: true,
              summary: true,
              coverImage: true,
              surfaceType: true,
            },
          },
        },
      }),
    null,
    'sector:detail',
  )
}

export function listAllSectorSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  return safeQuery(
    () => prisma.sector.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    [],
    'sector:slugs',
  )
}

export function listSectorsForAdmin() {
  return safeQuery(
    () =>
      prisma.sector.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        select: { ...listSelect, active: true, updatedAt: true, _count: { select: { projects: true } } },
      }),
    [],
    'sector:admin-list',
  )
}

export function getSectorById(id: string) {
  return safeQuery(
    () => prisma.sector.findUnique({ where: { id }, include: { services: true } }),
    null,
    'sector:by-id',
  )
}

export function sectorOptions(): Promise<{ id: string; title: string; slug: string }[]> {
  return safeQuery(
    () =>
      prisma.sector.findMany({
        where: { active: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, title: true, slug: true },
      }),
    [],
    'sector:options',
  )
}
