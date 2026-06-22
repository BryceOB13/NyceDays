'use client'

import { useState, useCallback } from 'react'
import { MediaLightbox } from './media-lightbox'
import { parseManifestItem, shuffleItems } from '@/lib/media/parse-manifest'
import type { MediaItem, Manifest } from '@/types/media'

const LOAD_MORE = 18

interface GalleryGridProps {
  initialItems: MediaItem[]
  totalCount: number
}

export function GalleryGrid({ initialItems, totalCount }: GalleryGridProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems)
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set())
  const [allItems, setAllItems] = useState<MediaItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const hasMore = items.length < totalCount

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      let pool = allItems
      if (!pool) {
        // First load-more: fetch full manifest once, parse, shuffle, cache
        const res = await fetch('/manifest.json')
        const manifest: Manifest = await res.json()
        pool = shuffleItems(manifest.items.map(parseManifestItem))
        setAllItems(pool)
      }

      const nextItems = pool.slice(items.length, items.length + LOAD_MORE)
      setItems(prev => [...prev, ...nextItems])
    } catch (error) {
      console.error('Load more error:', error)
    }

    setLoading(false)
  }, [loading, hasMore, allItems, items.length])

  const handleImageClick = (item: MediaItem, index: number) => {
    setLightboxItem(item)
    setLightboxIndex(index)
  }

  const handleNext = () => {
    if (lightboxIndex < items.length - 1) {
      const next = lightboxIndex + 1
      setLightboxIndex(next)
      setLightboxItem(items[next])
    }
  }

  const handlePrev = () => {
    if (lightboxIndex > 0) {
      const prev = lightboxIndex - 1
      setLightboxIndex(prev)
      setLightboxItem(items[prev])
    }
  }

  return (
    <>
      {/* Masonry grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-0 w-full">
        {items.filter(item => !failedIds.has(item.id)).map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleImageClick(item, index)}
            className="group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-nd-red block w-full border-0 p-0 m-0"
            style={{ display: 'block', lineHeight: 0 }}
          >
            <img
              src={item.variants.thumb.url}
              alt={item.alt || `Gallery image ${item.position + 1}`}
              width={item.variants.thumb.width}
              height={item.variants.thumb.height}
              loading={index < 4 ? 'eager' : 'lazy'}
              decoding="async"
              className="w-full h-auto block transition-opacity duration-300"
              style={{ aspectRatio: `${item.variants.thumb.width} / ${item.variants.thumb.height}` }}
              onError={() => setFailedIds(prev => new Set(prev).add(item.id))}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-8 text-black dark:text-white">
          <p>No media yet.</p>
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

      {loading && (
        <div className="text-center py-8">
          <span className="text-black/40 dark:text-white/40 text-sm">Loading...</span>
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
