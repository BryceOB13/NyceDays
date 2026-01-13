"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"
import type { Media } from "@/types/database"

interface StoryCarouselProps {
  initialMedia?: Media[]
}

export function StoryCarousel({ initialMedia }: StoryCarouselProps) {
  const [images, setImages] = useState<{ src: string; alt: string }[]>([])
  const [isShuffling, setIsShuffling] = useState(false)
  const [scrollOffset, setScrollOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialMedia && initialMedia.length > 0) {
      setImages(initialMedia.map(m => ({
        src: m.public_url!,
        alt: m.alt_text || m.filename
      })))
    } else {
      fetchRandomMedia()
    }
  }, [initialMedia])

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const elementCenter = rect.top + rect.height / 2
        const viewportCenter = windowHeight / 2
        const offset = (viewportCenter - elementCenter) * 0.08
        setScrollOffset(offset)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchRandomMedia = useCallback(async () => {
    setIsShuffling(true)
    try {
      const res = await fetch('/api/media/random?count=24')
      if (res.ok) {
        const data: Media[] = await res.json()
        if (data.length > 0) {
          setImages(data.map(m => ({
            src: m.public_url!,
            alt: m.alt_text || m.filename
          })))
        }
      }
    } catch {
      // Silent fail
    } finally {
      setIsShuffling(false)
    }
  }, [])

  if (images.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Split images into 6 columns for denser coverage
  const cols = [
    images.filter((_, i) => i % 6 === 0),
    images.filter((_, i) => i % 6 === 1),
    images.filter((_, i) => i % 6 === 2),
    images.filter((_, i) => i % 6 === 3),
    images.filter((_, i) => i % 6 === 4),
    images.filter((_, i) => i % 6 === 5),
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  // Stagger offsets for visual interest
  const offsets = [0, 20, 8, 24, 4, 16]

  return (
    <div 
      ref={containerRef} 
      className="relative overflow-hidden"
      style={{ 
        marginLeft: 'calc(-50vw + 50%)', 
        marginRight: 'calc(-50vw + 50%)',
        width: '100vw'
      }}
    >
      {/* Shuffle Button */}
      <div className="absolute top-4 right-8 z-20">
        <button
          onClick={fetchRandomMedia}
          disabled={isShuffling}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-foreground/60 hover:text-foreground bg-background/80 backdrop-blur-sm border border-border rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isShuffling ? 'animate-spin' : ''}`} />
          Shuffle
        </button>
      </div>

      {/* Full-width masonry grid with parallax */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
        style={{ transform: `translateX(${scrollOffset}px)` }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {cols.map((col, colIndex) => (
          <div 
            key={`col-${colIndex}`} 
            className="flex flex-col"
            style={{ marginTop: `${offsets[colIndex]}px` }}
          >
            {col.map((img, i) => (
              <motion.div 
                key={`col${colIndex}-${i}`}
                variants={itemVariants}
                className="relative overflow-hidden group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={500}
                  height={700}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
