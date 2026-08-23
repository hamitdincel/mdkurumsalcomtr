import 'server-only'
import { prisma } from '@/lib/db/prisma'
import { safeQuery } from '@/lib/db/safe'
import type { LeadStatus, Prisma } from '@prisma/client'

export type LeadListFilters = {
  status?: LeadStatus | 'ALL'
  search?: string
  assignedUserId?: string
  city?: string
  from?: Date
  to?: Date
  page?: number
  pageSize?: number
}

function buildWhere(filters: LeadListFilters): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {}

  if (filters.status && filters.status !== 'ALL') {
    where.status = filters.status
  } else if (!filters.status) {
    // Varsayılan listede SPAM gizlenir.
    where.status = { not: 'SPAM' }
  }

  if (filters.search) {
    const term = filters.search.trim()
    where.OR = [
      { fullName: { contains: term, mode: 'insensitive' } },
      { companyName: { contains: term, mode: 'insensitive' } },
      { phone: { contains: term } },
      { email: { contains: term, mode: 'insensitive' } },
      { city: { contains: term, mode: 'insensitive' } },
    ]
  }

  if (filters.assignedUserId) where.assignedUserId = filters.assignedUserId
  if (filters.city) where.city = { equals: filters.city, mode: 'insensitive' }
  if (filters.from || filters.to) {
    where.createdAt = {
      ...(filters.from ? { gte: filters.from } : {}),
      ...(filters.to ? { lte: filters.to } : {}),
    }
  }

  return where
}

export function listLeads(filters: LeadListFilters) {
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.min(100, filters.pageSize ?? 25)

  return safeQuery(
    async () => {
      const where = buildWhere(filters)
      const [items, total] = await Promise.all([
        prisma.lead.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
          select: {
            id: true,
            fullName: true,
            companyName: true,
            phone: true,
            email: true,
            city: true,
            status: true,
            isRead: true,
            createdAt: true,
            estimatedArea: true,
            serviceLabel: true,
            service: { select: { title: true } },
            assignedUser: { select: { id: true, name: true } },
            _count: { select: { attachments: true, notes: true } },
          },
        }),
        prisma.lead.count({ where }),
      ])

      return { items, total, page, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)) }
    },
    { items: [], total: 0, page, pageSize, pageCount: 1 },
    'lead:list',
  )
}

export function getLeadById(id: string) {
  return safeQuery(
    () =>
      prisma.lead.findUnique({
        where: { id },
        include: {
          service: { select: { title: true, slug: true } },
          assignedUser: { select: { id: true, name: true } },
          attachments: { orderBy: { createdAt: 'asc' } },
          notes: {
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } },
          },
        },
      }),
    null,
    'lead:detail',
  )
}

/** Dashboard metrikleri — yalnızca gerçek veriler. */
export function getLeadStats() {
  return safeQuery(
    async () => {
      const now = new Date()
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startOfWeek = new Date(startOfToday)
      startOfWeek.setDate(startOfToday.getDate() - 6)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const [today, week, month, unread, byStatus, bySource, total] = await Promise.all([
        prisma.lead.count({ where: { createdAt: { gte: startOfToday }, status: { not: 'SPAM' } } }),
        prisma.lead.count({ where: { createdAt: { gte: startOfWeek }, status: { not: 'SPAM' } } }),
        prisma.lead.count({ where: { createdAt: { gte: startOfMonth }, status: { not: 'SPAM' } } }),
        prisma.lead.count({ where: { isRead: false, status: { not: 'SPAM' } } }),
        prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
        prisma.lead.groupBy({
          by: ['utmSource'],
          _count: { _all: true },
          where: { status: { not: 'SPAM' } },
          orderBy: { _count: { utmSource: 'desc' } },
          take: 6,
        }),
        prisma.lead.count({ where: { status: { not: 'SPAM' } } }),
      ])

      return { today, week, month, unread, total, byStatus, bySource }
    },
    {
      today: 0,
      week: 0,
      month: 0,
      unread: 0,
      total: 0,
      byStatus: [] as { status: LeadStatus; _count: { _all: number } }[],
      bySource: [] as { utmSource: string | null; _count: { _all: number } }[],
    },
    'lead:stats',
  )
}

export function listRecentLeads(limit = 8) {
  return safeQuery(
    () =>
      prisma.lead.findMany({
        where: { status: { not: 'SPAM' } },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          fullName: true,
          companyName: true,
          city: true,
          status: true,
          isRead: true,
          createdAt: true,
          service: { select: { title: true } },
          serviceLabel: true,
        },
      }),
    [],
    'lead:recent',
  )
}

/** CSV export için tüm alanlar. */
export function listLeadsForExport(filters: LeadListFilters) {
  return safeQuery(
    () =>
      prisma.lead.findMany({
        where: buildWhere(filters),
        orderBy: { createdAt: 'desc' },
        take: 5000,
        include: { service: { select: { title: true } }, assignedUser: { select: { name: true } } },
      }),
    [],
    'lead:export',
  )
}

export function listAssignableUsers() {
  return safeQuery(
    () =>
      prisma.user.findMany({
        where: { active: true, role: { in: ['ADMIN', 'SALES'] } },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, role: true },
      }),
    [],
    'user:assignable',
  )
}
