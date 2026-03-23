import Image from 'next/image'
import React from 'react'
import type { Post } from '@/payload-types'
import { formatAuthors } from '@/utilities/formatAuthors'
import styles from './postHero.module.css'

export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const imageUrl =
    heroImage && typeof heroImage !== 'string' && (heroImage as any).url
      ? (heroImage as any).url
      : null

  return (
    <div className={styles.hero}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority
          className={styles.heroBg}
        />
      )}
      <div className={styles.heroOverlay} />

      <div className={styles.heroContent}>
        {categories && categories.length > 0 && (
          <div className={styles.heroCategories}>
            {categories.map((cat: any, i: number) => {
              if (typeof cat !== 'object' || !cat) return null
              return (
                <span key={i} className={styles.heroCategoryPill}>
                  {(cat as any).title ?? 'Category'}
                </span>
              )
            })}
          </div>
        )}

        <h1 className={styles.heroTitle}>{title}</h1>

        <div className={styles.heroMeta}>
          {hasAuthors && (
            <>
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>Author</span>
                <span className={styles.heroMetaValue}>{formatAuthors(populatedAuthors!)}</span>
              </div>
              <div className={styles.heroMetaDot} />
            </>
          )}
          {publishedAt && (
            <div className={styles.heroMetaItem}>
              <span className={styles.heroMetaLabel}>Published</span>
              <time className={styles.heroMetaValue} dateTime={publishedAt}>
                {new Date(publishedAt).toLocaleDateString('en-FI', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </time>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
