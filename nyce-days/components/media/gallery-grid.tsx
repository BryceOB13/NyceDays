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
      <div className="space-y-8">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleImageClick(item, index)}
              className="group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-nd-red"
            >
              <OptimizedImage
                variant={item.variants.grid}
                alt={item.alt || `Gallery image ${item.position + 1}`}
                priority={index < 2}
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
                  className="aspect-square bg-foreground/10 animate-pulse"
                />
              ))}
            </>
          )}
        </div>

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center py-8">
            <button
              onClick={loadMore}
              className="px-8 py-3 border border-foreground/20 rounded-full font-sans text-sm uppercase tracking-wider text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors"
            >
              Load More
            </button>
          </div>
        )}

        {/* Loading indicator */}
        {loading && items.length > 0 && (
          <div className="text-center py-8">
            <span className="text-foreground/40 text-sm">Loading...</span>
          </div>
        )}
      </div>

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
