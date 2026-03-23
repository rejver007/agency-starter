'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import styles from './lightbox.module.css'

type GalleryImage = { url: string; caption?: string }

type Props = {
  images: GalleryImage[]
  initialIndex: number
  onClose: () => void
}

export function GalleryLightbox({ images, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex)
  const current = images[index]

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    },
    [onClose, prev, next],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!current) return null

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      {/* Close */}
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {/* Counter */}
      <p className={styles.counter}>{index + 1} / {images.length}</p>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className={`${styles.navBtn} ${styles.navPrev}`}
          onClick={(e) => { e.stopPropagation(); prev() }}
          aria-label="Previous image"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 3L5 9l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Main image */}
      <div className={styles.imageWrap} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageInner}>
          <Image
            key={current.url}
            src={current.url}
            alt={current.caption || `Gallery image ${index + 1}`}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 85vw"
            priority
          />
        </div>
        {current.caption && <p className={styles.caption}>{current.caption}</p>}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          className={`${styles.navBtn} ${styles.navNext}`}
          onClick={(e) => { e.stopPropagation(); next() }}
          aria-label="Next image"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 3l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className={styles.thumbStrip} onClick={(e) => e.stopPropagation()}>
          {images.map((img, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${i === index ? styles.thumbActive : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Image ${i + 1}`}
              style={{ backgroundImage: `url(${img.url})` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
