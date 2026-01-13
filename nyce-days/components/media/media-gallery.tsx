"use client"

import { useState, useMemo, useCallback } from "react"
import Image from "next/image"
import { Lightbox } from "@/components/shared/lightbox"
import { FadeUp } from "@/components/shared/fade-up"
import { RefreshCw } from "lucide-react"
import type { Media } from "@/types/database"

interface MediaGalleryProps {
  media: Media[]
  enableShuffle?: boolean
}

export function MediaGallery({ media: initialMedia, enableShuffle = true }: MediaGalleryProps) {
  const [media, setMedia] = useState<Media[]>(initialMedia)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isShuffling, setIsShuffling] = useState(false)

  const handleShuffle = useCallback(async () => {
    setIsShuffling(true)
    try {
      const res = await fetch('/api/media/random?count=24')
      if (res.ok) {
        const data = await res.json()
        setMedia(data)
      }
    } catch (error) {
      console.error('Failed to shuffle media:', error)
    } finally {
      setIsShuffling(false)
    }
  }, [])

  const filteredMedia = useMemo(() => {
    return media.filter((item) => item.type === "image" && item.public_url)
  }, [media])

  const lightboxImages = useMemo(() => {
    return filteredMedia.map((item) => ({
      src: item.public_url!,
      alt: item.alt_text || item.filename,
    }))
  }, [filteredMedia])

  const handleImageClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div>
      {enableShuffle && (
        <FadeUp>
          <div className="flex justify-end mb-8">
            <button
              onClick={handleShuffle}
              disabled={isShuffling}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground border border-border rounded-full transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
              Shuffle
            </button>
          </div>
        </FadeUp>
      )}

      {filteredMedia.length === 0 ? (
        <FadeUp>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No media found.</p>
          </div>
        </FadeUp>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredMedia.map((item, index) => (
            <FadeUp key={item.id} delay={0.05 * (index % 12)}>
              <button
                onClick={() => handleImageClick(index)}
                className="group relative aspect-square w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-nd-amber focus:ring-offset-2 focus:ring-offset-background"
              >
                <Image
                  src={item.public_url!}
                  alt={item.alt_text || item.filename}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-sm text-white line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                )}
              </button>
            </FadeUp>
          ))}
        </div>
      )}

      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
