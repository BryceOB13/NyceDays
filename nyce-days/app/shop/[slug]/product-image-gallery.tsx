"use client"

import { useState } from "react"
import Image from "next/image"
import { Lightbox } from "@/components/shared/lightbox"
import { cn } from "@/lib/utils"

interface ProductImageGalleryProps {
  images: { src: string; alt: string }[]
  productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-secondary">
        <span className="text-muted-foreground">No image available</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-secondary cursor-zoom-in"
      >
        <Image
          src={images[selectedIndex].src}
          alt={images[selectedIndex].alt || productName}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority
        />
      </button>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md bg-secondary transition-all",
                selectedIndex === index
                  ? "ring-2 ring-nd-amber"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={image.src}
                alt={image.alt || `${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        images={images}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
