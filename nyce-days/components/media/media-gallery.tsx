"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbox } from "@/components/shared/lightbox"
import { FadeUp } from "@/components/shared/fade-up"
import type { Media } from "@/types/database"

interface MediaGalleryProps {
  media: Media[]
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "event", label: "Events" },
  { value: "bts", label: "Behind The Scenes" },
  { value: "merch", label: "Merch" },
  { value: "community", label: "Community" },
] as const

export function MediaGallery({ media }: MediaGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const filteredMedia = useMemo(() => {
    const images = media.filter(
      (item) => item.type === "image" && item.public_url
    )
    
    if (activeCategory === "all") {
      return images
    }
    return images.filter((item) => item.category === activeCategory)
  }, [media, activeCategory])

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
      <FadeUp>
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-8"
        >
          <TabsList className="bg-secondary border border-border">
            {CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="data-[state=active]:bg-nd-amber data-[state=active]:text-black text-muted-foreground hover:text-foreground"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </FadeUp>

      {filteredMedia.length === 0 ? (
        <FadeUp>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No media found in this category.</p>
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
