'use client'

import Image from 'next/image'
import { useState } from 'react'
import styles from './post.module.css'
import { GalleryLightbox } from './GalleryLightbox'

type GalleryImage = { url: string; caption?: string }

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <div className={styles.galleryGrid}>
        {images.map((g, i) => (
          <div key={i}>
            <button
              className={styles.galleryItem}
              onClick={() => setLightboxIndex(i)}
              aria-label={`Open image ${i + 1}`}
            >
              <Image
                src={g.url}
                alt={g.caption || `Gallery image ${i + 1}`}
                fill
                className={styles.galleryImg}
              />
              <div className={styles.galleryHint}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2h5M2 2v5M16 2h-5M16 2v5M2 16h5M2 16v-5M16 16h-5M16 16v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </button>
            {g.caption && <p className={styles.galleryCaption}>{g.caption}</p>}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
