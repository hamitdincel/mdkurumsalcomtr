import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { getPostById, listCategories } from '@/repositories/post-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { PostForm } from '@/components/admin/post-form'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Yazıyı Düzenle' }
export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, categories] = await Promise.all([getPostById(id), listCategories()])

  if (!post) notFound()

  return (
    <>
      <AdminPageHeader
        title={post.title}
        backHref="/admin/blog"
        backLabel="Blog"
        actions={
          post.status === 'PUBLISHED' ? (
            <Button asChild variant="secondary" size="sm">
              <Link href={`/blog/${post.slug}`} target="_blank">
                <ExternalLink className="size-4" aria-hidden />
                Yazıyı Gör
              </Link>
            </Button>
          ) : null
        }
      />

      <AdminContent>
        <PostForm
          postId={post.id}
          categories={categories.map((c) => ({ value: c.id, label: c.name }))}
          defaultValues={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            contentHtml: post.contentHtml ?? '',
            featuredImage: post.featuredImage ?? '',
            status: post.status,
            publishedAt: post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : '',
            categoryId: post.categoryId ?? '',
            tagNames: post.tags.map((t) => t.tag.name),
            seoTitle: post.seoTitle ?? '',
            metaDescription: post.metaDescription ?? '',
            ogImage: post.ogImage ?? '',
            canonical: post.canonical ?? '',
          }}
        />
      </AdminContent>
    </>
  )
}
