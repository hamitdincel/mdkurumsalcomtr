import 'server-only'
import { prisma } from '@/lib/db/prisma'
import { safeQuery } from '@/lib/db/safe'
import type { Prisma, Service } from '@prisma/client'

/**
 * Veri erişim katmanı.
 * UI bileşenleri prisma'yı doğrudan çağırmaz; tüm sorgular buradan geçer.
 */

export type ServiceListItem = Pick<
  Service,
  'id' | 'title' | 'slug' | 'shortDescription' | 'heroImage' | 'icon' | 'sortOrder' | 'featured'
>

const listSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  heroImage: true,
  icon: true,
  sortOrder: true,
  featured: true,
} satisfies Prisma.ServiceSelect

export function listActiveServices(): Promise<ServiceListItem[]> {
  return safeQuery(
    () =>
      prisma.service.findMany({
        where: { active: true },
        orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
        select: listSelect,
      }),
    [],
    'service:list',
  )
}

export function listFeaturedServices(limit = 6): Promise<ServiceListItem[]> {
  return safeQuery(
    () =>
      prisma.service.findMany({
        where: { active: true },
        orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
        take: limit,
        select: listSelect,
      }),
    [],
    'service:featured',
  )
}

export function getServiceBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.service.findFirst({
        where: { slug, active: true },
        include: {
          faqs: { where: { active: true }, orderBy: { sortOrder: 'asc' } },
          sectors: { include: { sector: { select: { title: true, slug: true, icon: true } } } },
          beforeAfterSets: {
            where: { active: true },
            orderBy: { sortOrder: 'asc' },
            take: 4,
          },
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
    'service:detail',
  )
}

export function listAllServiceSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  return safeQuery(
    () => prisma.service.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    [],
    'service:slugs',
  )
}

/** Admin — pasif kayıtlar dahil. */
export function listServicesForAdmin() {
  return safeQuery(
    () =>
      prisma.service.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        select: {
          ...listSelect,
          active: true,
          updatedAt: true,
          _count: { select: { projects: true, leads: true } },
        },
      }),
    [],
    'service:admin-list',
  )
}

export function getServiceById(id: string) {
  return safeQuery(
    () => prisma.service.findUnique({ where: { id }, include: { sectors: true } }),
    null,
    'service:by-id',
  )
}

export function serviceOptions(): Promise<{ id: string; title: string; slug: string }[]> {
  return safeQuery(
    () =>
      prisma.service.findMany({
        where: { active: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, title: true, slug: true },
      }),
    [],
    'service:options',
  )
}
