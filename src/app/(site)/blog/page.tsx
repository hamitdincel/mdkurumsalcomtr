import type { Metadata } from 'next'
import Link from 'next/link'
import {
  listPublishedPosts,
  countPublishedPosts,
  listCategories,
} from '@/repositories/post-repository'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Section } from '@/components/shared/section'
import { BlogCard } from '@/components/cards/blog-card'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'

export const revalidate = 900

const crumbs = [{ label: 'Blog', href: '/blog' }]
const PAGE_SIZE = 9

export const metadata: Metadata = buildMetadata({
  title: 'Blog — Cephe Bakımı ve Temizlik Rehberleri',
  description:
    'Dış cephe temizliği, cam yüzey bakımı, güneş paneli temizliği ve bina yönetimi üzerine pratik rehberler.',
  path: '/blog',
})

type SearchParams = Promise<{ kategori?: string; sayfa?: string }>

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const { kategori, sayfa } = await searchParams
  const page = Math.max(1, Number(sayfa) || 1)

  const [posts, total, categories] = await Promise.all([
    listPublishedPosts({
      categorySlug: kategori,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    countPublishedPosts({ categorySlug: kategori }),
    listCategories(),
  ])

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const buildHref = (next: { kategori?: string; sayfa?: number }) => {
    const params = new URLSearchParams()
    const category = next.kategori ?? kategori
    if (category) params.set('kategori', category)
    if (next.sayfa && next.sayfa > 1) params.set('sayfa', String(next.sayfa))
    const query = params.toString()
    return query ? `/blog?${query}` : '/blog'
  }

  const visibleCategories = categories.filter((category) => category._count.posts > 0)

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="Yazılar"
        title="Cephe bakımı üzerine yazdıklarımız"
        description="Bina yönetimleri, tesis sorumluları ve teknik ekipler için hazırlanan uygulamaya dönük içerikler."
        crumbs={crumbs}
      />

      <Section spacing="md" tone="light">
        <Container>
          {visibleCategories.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              <CategoryChip href={buildHref({ kategori: '', sayfa: 1 })} active={!kategori}>
                Tümü
              </CategoryChip>
              {visibleCategories.map((category) => (
                <CategoryChip
                  key={category.slug}
                  href={buildHref({ kategori: category.slug, sayfa: 1 })}
                  active={kategori === category.slug}
                >
                  {category.name}
                  <span className="ml-1.5 text-xs opacity-60">{category._count.posts}</span>
                </CategoryChip>
              ))}
            </div>
          )}

          {posts.length === 0 ? (
            <EmptyState
              title="Henüz yayınlanmış yazı bulunmuyor"
              description="Blog içerikleri yönetim panelinden eklendiğinde bu sayfada listelenecektir."
              actionLabel="Hizmetleri İncele"
              actionHref="/hizmetler"
            />
          ) : (
            <>
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <li key={post.id}>
                    <BlogCard
                      title={post.title}
                      slug={post.slug}
                      excerpt={post.excerpt}
                      featuredImage={post.featuredImage}
                      publishedAt={post.publishedAt}
                      categoryName={post.category?.name}
                      readingMinutes={post.readingMinutes}
                      className="h-full"
                    />
                  </li>
                ))}
              </ul>

              {pageCount > 1 && (
                <nav aria-label="Sayfalama" className="mt-12 flex justify-center gap-2">
                  {Array.from({ length: pageCount }).map((_, index) => {
                    const target = index + 1
                    return (
                      <Link
                        key={target}
                        href={buildHref({ sayfa: target })}
                        aria-current={target === page ? 'page' : undefined}
                        className={cn(
                          'flex size-11 items-center justify-center rounded-sm border text-sm font-medium transition-colors',
                          target === page
                            ? 'border-ink bg-ink text-surface'
                            : 'border-line bg-surface-raised text-ink-muted hover:border-line-strong',
                        )}
                      >
                        {target}
                      </Link>
                    )
                  })}
                </nav>
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  )
}

function CategoryChip({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-sm border px-3.5 py-2 text-sm transition-colors',
        active
          ? 'border-ink bg-ink text-surface'
          : 'border-line bg-surface-raised text-ink-muted hover:border-line-strong hover:text-ink',
      )}
    >
      {children}
    </Link>
  )
}
