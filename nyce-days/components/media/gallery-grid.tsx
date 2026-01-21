'use client'

import { useState } from 'react'
import { useGallery } from '@/lib/media/use-gallery'
import { OptimizedImage } from './optimized-image'
import { MediaLightbox } from './media-lightbox'
import type { MediaItem } from '@/types/media'

interface GalleryGridProps {
  category?: string
}

export function GalleryGrid({ category }: GalleryGridProps) {
  const { items, loading, hasMore, loadMore } = useGallery(category)
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const handleImageClick = (item: MediaItem, index: number) => {
    setLightboxItem(item)
    setLightboxIndex(index)
  }

  const handleNext = () => {
    if (lightboxIndex < items.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
      setLightboxItem(items[lightboxIndex + 1])
    }
  }

  const handlePrev = () => {
    if (lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
      setLightboxItem(items[lightboxIndex - 1])
    }
  }

  return (
    <>
      {/* Full-bleed Masonry Grid - no gaps, touches all edges */}
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-0 w-full">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleImageClick(item, index)}
            className="group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-nd-red block w-full border-0 p-0 m-0"
            style={{ display: 'block', lineHeight: 0 }}
          >
            <OptimizedImage
              variant={item.variants.grid}
              alt={item.alt || `Gallery image ${item.position + 1}`}
              priority={index < 12}
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}

        {/* Loading skeletons */}
        {loading && items.length === 0 && (
          <>
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="aspect-[3/4] bg-black/10 dark:bg-white/10 animate-pulse block w-full"
                style={{ lineHeight: 0 }}
              />
            ))}
          </>
        )}
      </div>

      {/* Debug info */}
      {!loading && items.length === 0 && (
        <div className="text-center py-8 text-black dark:text-white">
          <p>No validated images available.</p>
          <p className="text-sm text-black/60 dark:text-white/60 mt-2">
            Images are being validated against the manifest. Check console for details.
          </p>
          <p className="text-xs text-black/40 dark:text-white/40 mt-1">
            Category: {category || 'all'}
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && !loading && (
        <div className="text-center py-8">
          <button
            onClick={loadMore}
            className="px-8 py-3 border border-black/20 dark:border-white/20 rounded-full font-sans text-sm uppercase tracking-wider text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:border-black/40 dark:hover:border-white/40 transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loading && items.length > 0 && (
        <div className="text-center py-8">
          <span className="text-black/40 dark:text-white/40 text-sm">
            Validating images...
          </span>
        </div>
      )}

      {/* Initial loading */}
      {loading && items.length === 0 && (
        <div className="text-center py-8">
          <span className="text-black/40 dark:text-white/40 text-sm">
            Loading and validating gallery...
          </span>
        </div>
      )}

      {/* Lightbox */}
      <MediaLightbox
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
        onNext={lightboxIndex < items.length - 1 ? handleNext : undefined}
        onPrev={lightboxIndex > 0 ? handlePrev : undefined}
      />
    </>
  )
}
