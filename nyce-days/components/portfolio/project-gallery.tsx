"use client"

import { useState } from "react"
import Image from "next/image"
import { Lightbox } from "@/components/shared/lightbox"
import type { Media } from "@/types/database"

interface ProjectGalleryProps {
  media: Media[]
}

export function ProjectGallery({ media }: ProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Filter to only images with public URLs
  const images = media.filter(
    (item) => item.type === "image" && item.public_url
  )

  if (images.length === 0) {
    return null
  }

  const lightboxImages = images.map((item) => ({
    src: item.public_url!,
    alt: item.alt_text || item.filename,
  }))

  const handleImageClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl font-bold text-nd-white">
        Gallery
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleImageClick(index)}
            className="group relative aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-nd-amber focus:ring-offset-2 focus:ring-offset-nd-black"
          >
            <Image
              src={item.public_url!}
              alt={item.alt_text || item.filename}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-nd-black/0 transition-colors duration-300 group-hover:bg-nd-black/20" />
          </button>
        ))}
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
