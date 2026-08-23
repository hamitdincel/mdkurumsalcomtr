import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock } from 'lucide-react'
import { getPostBySlug, listAllPostSlugs, listPublishedPosts } from '@/repositories/post-repository'
import { buildMetadata } from '@/lib/seo/metadata'
import { articleSchema, breadcrumbSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { Container, Section, SectionHeader } from '@/components/shared/section'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { MediaImage } from '@/components/shared/media-image'
import { BlogCard } from '@/components/cards/blog-card'
import { formatDate } from '@/lib/utils'

export const revalidate = 900
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await listAllPostSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return buildMetadata({
      title: 'Yazı bulunamadı',
      description: 'Aradığınız blog yazısı bulunamadı.',
      path: `/blog/${slug}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    ogImage: post.ogImage ?? post.featuredImage,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authorName: post.author?.name,
    canonicalOverride: post.canonical,
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const related = await listPublishedPosts({
    take: 3,
    excludeSlug: post.slug,
    categorySlug: post.category?.slug,
  })

  const crumbs = [
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: `/blog/${post.slug}` },
  ]


  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          articleSchema({
            title: post.title,
            description: post.metaDescription ?? post.excerpt,
            slug: post.slug,
            image: post.ogImage ?? post.featuredImage,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            authorName: post.author?.name,
          }),
        ]}
      />

      <article>
        <Section spacing="md" tone="raised" className="border-b border-line">
          <Container className="max-w-4xl">
            <Breadcrumb items={crumbs} className="mb-8" />

            {post.category && (
              <Link
                href={`/blog?kategori=${post.category.slug}`}
                className="eyebrow hover:underline"
              >
                {post.category.name}
              </Link>
            )}

            <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">{post.title}</h1>

            <p className="mt-5 text-lg leading-relaxed text-ink-muted">{post.excerpt}</p>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-subtle">
              {post.author?.name && <span>{post.author.name}</span>}
              {post.publishedAt && (
                <>
                  <span aria-hidden>·</span>
                  <time dateTime={new Date(post.publishedAt).toISOString()}>
                    {formatDate(post.publishedAt)}
                  </time>
                </>
              )}
              {post.readingMinutes ? (
                <>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden />
                    {post.readingMinutes} dakikalık okuma
                  </span>
                </>
              ) : null}
            </div>
          </Container>
        </Section>

        {post.featuredImage && (
          <Container className="max-w-4xl">
            <div className="relative -mt-0 aspect-[16/9] overflow-hidden rounded-lg bg-surface-sunken md:mt-10">
              <MediaImage
                src={post.featuredImage}
                alt={post.title}
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>
          </Container>
        )}

        <Section spacing="md" tone="light">
          <Container className="max-w-4xl">
            {/* İçerik editörden gelir ve kaydedilirken sanitize edilir. */}
            <div
              className="prose-site max-w-none"
              dangerouslySetInnerHTML={{ __html: post.contentHtml ?? '' }}
            />

            {post.tags.length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
                {post.tags.map(({ tag }) => (
                  <li
                    key={tag.slug}
                    className="rounded-xs bg-surface-sunken px-2.5 py-1 text-sm text-ink-muted"
                  >
                    #{tag.name}
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </Section>
      </article>

      {related.length > 0 && (
        <Section spacing="md" tone="light" className="border-t border-line">
          <Container>
            <SectionHeader eyebrow="Devamı" title="İlgili yazılar" />
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <BlogCard
                    title={item.title}
                    slug={item.slug}
                    excerpt={item.excerpt}
                    featuredImage={item.featuredImage}
                    publishedAt={item.publishedAt}
                    categoryName={item.category?.name}
                    readingMinutes={item.readingMinutes}
                    className="h-full"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

    </>
  )
}
