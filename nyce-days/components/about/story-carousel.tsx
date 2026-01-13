"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { RefreshCw } from "lucide-react"
import type { Media } from "@/types/database"

// Fallback images if no media in database
const fallbackImages = [
  { src: "/images/story/story-1.jpg", alt: "Nyce Days event" },
  { src: "/images/story/story-2.jpg", alt: "Community gathering" },
  { src: "/images/story/story-3.jpg", alt: "Behind the scenes" },
  { src: "/images/story/story-4.jpg", alt: "Team moment" },
  { src: "/images/story/story-5.jpg", alt: "Event production" },
  { src: "/images/story/story-6.jpg", alt: "Community vibes" },
]

interface StoryCarouselProps {
  initialMedia?: Media[]
}

export function StoryCarousel({ initialMedia }: StoryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<{ src: string; alt: string }[]>([])
  const [isShuffling, setIsShuffling] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -200])

  // Initialize images from props or fetch
  useEffect(() => {
    if (initialMedia && initialMedia.length > 0) {
      setImages(initialMedia.map(m => ({
        src: m.public_url!,
        alt: m.alt_text || m.filename
      })))
    } else {
      // Fetch random media on mount
      fetchRandomMedia()
    }
  }, [initialMedia])

  const fetchRandomMedia = useCallback(async () => {
    setIsShuffling(true)
    try {
      const res = await fetch('/api/media/random?count=8')
      if (res.ok) {
        const data: Media[] = await res.json()
        if (data.length > 0) {
          setImages(data.map(m => ({
            src: m.public_url!,
            alt: m.alt_text || m.filename
          })))
        } else {
          setImages(fallbackImages)
        }
      } else {
        setImages(fallbackImages)
      }
    } catch {
      setImages(fallbackImages)
    } finally {
      setIsShuffling(false)
    }
  }, [])

  // Use fallback if no images loaded yet
  const displayImages = images.length > 0 ? images : fallbackImages

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Shuffle Button */}
      <div className="absolute top-4 right-8 z-20">
        <button
          onClick={fetchRandomMedia}
          disabled={isShuffling}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-foreground/60 hover:text-foreground bg-secondary/80 backdrop-blur-sm border border-border rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isShuffling ? 'animate-spin' : ''}`} />
          Shuffle
        </button>
      </div>

      {/* Patchwork Grid */}
      <motion.div 
        className="flex gap-3 md:gap-4"
        style={{ x }}
      >
        {/* First column - tall + square */}
        <div className="flex flex-col gap-3 md:gap-4 shrink-0">
          <motion.div 
            className="relative w-48 md:w-64 h-72 md:h-96 rounded-lg overflow-hidden bg-muted"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {displayImages[0] && (
              <Image
                src={displayImages[0].src}
                alt={displayImages[0].alt}
                fill
                className="object-cover"
              />
            )}
          </motion.div>
          <motion.div 
            className="relative w-48 md:w-64 h-48 md:h-64 rounded-lg overflow-hidden bg-muted"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {displayImages[2] && (
              <Image
                src={displayImages[2].src}
                alt={displayImages[2].alt}
                fill
                className="object-cover"
              />
            )}
          </motion.div>
        </div>

        {/* Second column - wide + tall */}
        <div className="flex flex-col gap-3 md:gap-4 shrink-0">
          <motion.div 
            className="relative w-64 md:w-80 h-40 md:h-52 rounded-lg overflow-hidden bg-muted"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {displayImages[1] && (
              <Image
                src={displayImages[1].src}
                alt={displayImages[1].alt}
                fill
                className="object-cover"
              />
            )}
          </motion.div>
          <motion.div 
            className="relative w-64 md:w-80 h-80 md:h-[26rem] rounded-lg overflow-hidden bg-muted"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {displayImages[4 % displayImages.length] && (
              <Image
                src={displayImages[4 % displayImages.length].src}
                alt={displayImages[4 % displayImages.length].alt}
                fill
                className="object-cover"
              />
            )}
          </motion.div>
        </div>

        {/* Third column - square + wide */}
        <div className="flex flex-col gap-3 md:gap-4 shrink-0">
          <motion.div 
            className="relative w-48 md:w-64 h-48 md:h-64 rounded-lg overflow-hidden bg-muted"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {displayImages[3 % displayImages.length] && (
              <Image
                src={displayImages[3 % displayImages.length].src}
                alt={displayImages[3 % displayImages.length].alt}
                fill
                className="object-cover"
              />
            )}
          </motion.div>
          <motion.div 
            className="relative w-64 md:w-80 h-40 md:h-52 rounded-lg overflow-hidden bg-muted"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {displayImages[5 % displayImages.length] && (
              <Image
                src={displayImages[5 % displayImages.length].src}
                alt={displayImages[5 % displayImages.length].alt}
                fill
                className="object-cover"
              />
            )}
          </motion.div>
        </div>

        {/* Fourth column - repeat pattern */}
        <div className="flex flex-col gap-3 md:gap-4 shrink-0">
          <motion.div 
            className="relative w-48 md:w-64 h-72 md:h-96 rounded-lg overflow-hidden bg-muted"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {displayImages[6 % displayImages.length] && (
              <Image
                src={displayImages[6 % displayImages.length].src}
                alt={displayImages[6 % displayImages.length].alt}
                fill
                className="object-cover"
              />
            )}
          </motion.div>
          <motion.div 
            className="relative w-48 md:w-64 h-48 md:h-64 rounded-lg overflow-hidden bg-muted"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {displayImages[7 % displayImages.length] && (
              <Image
                src={displayImages[7 % displayImages.length].src}
                alt={displayImages[7 % displayImages.length].alt}
                fill
                className="object-cover"
              />
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Gradient overlays for fade effect */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-secondary to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-secondary to-transparent pointer-events-none z-10" />
    </div>
  )
}
