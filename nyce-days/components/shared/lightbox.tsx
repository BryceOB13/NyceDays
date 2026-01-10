"use client"

import YARLightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

interface LightboxImage {
  src: string
  alt?: string
}

interface LightboxProps {
  images: LightboxImage[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export function Lightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: LightboxProps) {
  const slides = images.map((image) => ({
    src: image.src,
    alt: image.alt || "",
  }))

  return (
    <YARLightbox
      open={isOpen}
      close={onClose}
      index={initialIndex}
      slides={slides}
      styles={{
        container: { backgroundColor: "rgba(13, 13, 13, 0.95)" },
      }}
      controller={{ closeOnBackdropClick: true }}
      carousel={{ finite: false }}
      animation={{ fade: 300 }}
    />
  )
}
