export const dynamic = 'force-dynamic'

import type { Metadata } from 'next/types'
import Image from 'next/image'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import styles from './posts.module.css'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 12,
    sort: '-publishedAt',
    depth: 2,
    overrideAccess: true,
  })

  return (
    <div className={styles.page}>
      <PageClient />

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroLine} />
            <p className={styles.heroEyebrowText}>Blog</p>
            <span className={styles.heroLine} />
          </div>
          <h1 className={styles.heroTitle}>
            Latest <span className={styles.heroTitleItalic}>News</span>
          </h1>
          <p className={styles.heroSub}>Stories from the kitchen, events & more</p>
        </div>
      </div>

      {/* Grid */}
      <section className={styles.section}>
        <div className={styles.container}>
          {posts.docs.length === 0 ? (
            <p className={styles.empty}>No articles published yet. Check back soon.</p>
          ) : (
            <div className={styles.grid}>
              {posts.docs.map((post: any) => {
                const hash = Array.from(String(post.id ?? '')).reduce(
                  (h: number, c: string) => (h * 31 + c.charCodeAt(0)) & 0xffff, 0
                )
                const hue = hash % 360
                const category = post.categories?.[0]
                const categoryTitle = typeof category === 'object' ? category?.title : null
                const excerpt = post.excerpt || post.meta?.description
                const imageUrl = post.heroImage?.url ?? post.meta?.image?.url

                return (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className={styles.card}
                    style={{
                      '--card-bg': `hsl(${hue}, 22%, 7%)`,
                      '--card-glow': `hsla(${hue}, 60%, 45%, 0.22)`,
                    } as React.CSSProperties}
                  >
                    <div className={styles.cardImageWrap}>
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={post.title || ''}
                          fill
                          className={styles.cardImage}
                        />
                      )}
                      {categoryTitle && (
                        <span className={styles.cardCategory}>{categoryTitle}</span>
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      <p className={styles.cardDate}>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-FI', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })
                          : ''}
                      </p>
                      <h2 className={styles.cardTitle}>{post.title}</h2>
                      {excerpt && <p className={styles.cardExcerpt}>{excerpt}</p>}
                      <span className={styles.cardReadMore}>
                        Read article
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Blog',
    description: 'Latest articles and updates.',
  }
}
