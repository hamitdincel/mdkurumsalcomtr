import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/shared/section'
import { Reveal } from '@/components/shared/reveal'
import { SectionNumber } from '@/components/shared/technical'
import { MediaImage } from '@/components/shared/media-image'
import { Button } from '@/components/ui/button'
import type { PostCardData } from '@/repositories/post-repository'
import { formatDate } from '@/lib/utils'

/**
 * SECTION 15 — BLOG (editorial yayın düzeni)
 *
 * Hizmet kartlarıyla aynı görünmemesi için: ilk yazı büyük "featured",
 * diğerleri kompakt yatay satırlar. Tarih ve okuma süresi yalnızca gerçek
 * veri varsa gösterilir.
 */
export function BlogTeaser({ posts }: { posts: PostCardData[] }) {
  if (posts.length === 0) return null

  const [featured, ...rest] = posts
  if (!featured) return null

  return (
    <Section spacing="md" tone="light" className="border-t border-line">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-2xl">
            <SectionNumber number="09" label="YAZILAR" />
            <h2 className="mt-6 text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-bold tracking-[-0.03em] text-balance text-ink">
              Cephe bakımı üzerine yazdıklarımız
            </h2>
          </div>

          <Button asChild variant="secondary" className="shrink-0">
            <Link href="/blog">
              Tüm Yazılar
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <Reveal className="mt-14">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            {/* Öne çıkan yazı */}
            <article className="group flex flex-col gap-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-surface-sunken">
                <MediaImage
                  src={featured.featuredImage}
                  alt={featured.title}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                  placeholderLabel="Yazı görseli"
                />
              </div>

              <p className="tech-label flex flex-wrap items-center gap-x-3 text-ink-subtle">
                {featured.category?.name && (
                  <span className="text-brand-600">{featured.category.name}</span>
                )}
                {featured.publishedAt && <span>{formatDate(featured.publishedAt)}</span>}
                {featured.readingMinutes ? <span>{featured.readingMinutes} dk okuma</span> : null}
              </p>

              <h3 className="relative text-2xl leading-snug font-semibold text-ink transition-colors group-hover:text-brand-700 md:text-3xl">
                <Link href={`/blog/${featured.slug}`} className="after:absolute after:inset-0">
                  {featured.title}
                </Link>
              </h3>

              <p className="max-w-xl text-base leading-relaxed text-ink-muted">{featured.excerpt}</p>
            </article>

            {/* Diğer yazılar */}
            {rest.length > 0 && (
              <ul className="flex flex-col">
                {rest.slice(0, 4).map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col gap-2 border-t border-line py-6 last:border-b"
                    >
                      <span className="tech-label flex flex-wrap items-center gap-x-3 text-ink-subtle">
                        {post.category?.name && (
                          <span className="text-brand-600">{post.category.name}</span>
                        )}
                        {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                      </span>

                      <span className="text-lg leading-snug font-semibold text-ink transition-colors group-hover:text-brand-700">
                        {post.title}
                      </span>

                      <span className="line-clamp-2 text-sm leading-relaxed text-ink-muted">
                        {post.excerpt}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
