export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode, headers } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ShareButtons } from '@/components/PostDetail/ShareButtons'
import { GalleryGrid } from '@/components/PostDetail/GalleryGrid'
import styles from '@/components/PostDetail/post.module.css'

export async function generateStaticParams() {
  return []
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const fullUrl = `${protocol}://${host}${url}`

  const postAny = post as any
  const tags: { tag: string }[] = postAny.tags ?? []
  const gallery: { image: { url: string }; caption?: string }[] =
    (postAny.gallery ?? []).filter((g: any) => g.image?.url)

  return (
    <article className={styles.article}>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className={styles.inner}>
        {/* Tags */}
        {tags.length > 0 && (
          <div className={styles.tags}>
            <span className={styles.tagsLabel}>Tags</span>
            {tags.map((t, i) => (
              <span key={i} className={styles.tag}>{t.tag}</span>
            ))}
          </div>
        )}

        {/* Share buttons */}
        <ShareButtons title={post.title} url={fullUrl} />

        {/* Rich text content */}
        <div className={styles.content}>
          <RichText data={post.content} enableGutter={false} />
        </div>

        {/* Photo gallery */}
        {gallery.length > 0 && (
          <div className={styles.gallerySection}>
            <p className={styles.gallerySectionTitle}>Photo Gallery</p>
            <GalleryGrid
              images={gallery.map((g) => ({ url: g.image.url, caption: g.caption }))}
            />
          </div>
        )}

        {/* Share again at bottom */}
        <div className={styles.divider} />
        <ShareButtons title={post.title} url={fullUrl} />

        {/* Related posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className={styles.relatedSection}>
            <p className={styles.relatedTitle}>Related Articles</p>
            <RelatedPosts
              docs={post.relatedPosts.filter((p: any) => typeof p === 'object')}
            />
          </div>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 2,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
