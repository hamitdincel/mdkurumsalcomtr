import 'server-only'
import { prisma } from '@/lib/db/prisma'
import { safeQuery } from '@/lib/db/safe'
import type { Prisma } from '@prisma/client'

const cardSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  featuredImage: true,
  publishedAt: true,
  readingMinutes: true,
  category: { select: { name: true, slug: true } },
  author: { select: { name: true } },
} satisfies Prisma.PostSelect

export type PostCardData = Prisma.PostGetPayload<{ select: typeof cardSelect }>

function publishedWhere(extra?: Prisma.PostWhereInput): Prisma.PostWhereInput {
  return {
    status: 'PUBLISHED',
    publishedAt: { lte: new Date() },
    ...extra,
  }
}

export function listPublishedPosts(options?: {
  take?: number
  skip?: number
  categorySlug?: string
  tagSlug?: string
  excludeSlug?: string
}): Promise<PostCardData[]> {
  const extra: Prisma.PostWhereInput = {}
  if (options?.categorySlug) extra.category = { slug: options.categorySlug }
  if (options?.tagSlug) extra.tags = { some: { tag: { slug: options.tagSlug } } }
  if (options?.excludeSlug) extra.slug = { not: options.excludeSlug }

  return safeQuery(
    () =>
      prisma.post.findMany({
        where: publishedWhere(extra),
        orderBy: { publishedAt: 'desc' },
        take: options?.take,
        skip: options?.skip,
        select: cardSelect,
      }),
    [],
    'post:list',
  )
}

export function countPublishedPosts(options?: { categorySlug?: string; tagSlug?: string }) {
  const extra: Prisma.PostWhereInput = {}
  if (options?.categorySlug) extra.category = { slug: options.categorySlug }
  if (options?.tagSlug) extra.tags = { some: { tag: { slug: options.tagSlug } } }

  return safeQuery(() => prisma.post.count({ where: publishedWhere(extra) }), 0, 'post:count')
}

export function getPostBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.post.findFirst({
        where: publishedWhere({ slug }),
        include: {
          author: { select: { name: true } },
          category: { select: { name: true, slug: true } },
          tags: { include: { tag: { select: { name: true, slug: true } } } },
        },
      }),
    null,
    'post:detail',
  )
}

export function listAllPostSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  return safeQuery(
    () => prisma.post.findMany({ where: publishedWhere(), select: { slug: true, updatedAt: true } }),
    [],
    'post:slugs',
  )
}

export function listCategories() {
  return safeQuery(
    () =>
      prisma.category.findMany({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
        },
      }),
    [],
    'category:list',
  )
}

export function listPostsForAdmin() {
  return safeQuery(
    () =>
      prisma.post.findMany({
        orderBy: [{ updatedAt: 'desc' }],
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          updatedAt: true,
          category: { select: { name: true } },
          author: { select: { name: true } },
        },
      }),
    [],
    'post:admin-list',
  )
}

export function getPostById(id: string) {
  return safeQuery(
    () => prisma.post.findUnique({ where: { id }, include: { tags: { include: { tag: true } } } }),
    null,
    'post:by-id',
  )
}
