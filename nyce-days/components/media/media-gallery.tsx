"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbox } from "@/components/shared/lightbox"
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
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    setLoadedImages(new Set())
    setIsLoaded(false)
    const timer = setTimeout(() => setIsLoaded(true), 50)
    return () => clearTimeout(timer)
  }, [media])

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => new Set(prev).add(id))
  }

  const handleShuffle = useCallback(async () => {
    setIsShuffling(true)
    setIsLoaded(false)
    try {
      const res = await fetch('/api/media/random?count=60')
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  }

  return (
    <div className="relative w-full">
      {enableShuffle && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-20 right-4 z-40"
        >
          <button
            onClick={handleShuffle}
            disabled={isShuffling}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-background/80 backdrop-blur-sm text-foreground/70 hover:text-foreground border border-border rounded-full transition-all hover:bg-background disabled:opacity-50 shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
            Shuffle
          </button>
        </motion.div>
      )}

      {filteredMedia.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
          <p className="text-muted-foreground">No media found.</p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            key={media.map(m => m.id).join('-').slice(0, 100)}
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            style={{
              columnGap: 0,
            }}
            className="w-full [column-count:2] md:[column-count:3] lg:[column-count:4] xl:[column-count:5] 2xl:[column-count:6]"
          >
            {filteredMedia.map((item, index) => (
              <motion.div 
                key={item.id} 
                variants={itemVariants} 
                style={{ breakInside: 'avoid', lineHeight: 0 }}
              >
                <button
                  onClick={() => handleImageClick(index)}
                  className="group w-full block focus:outline-none"
                  style={{ lineHeight: 0, fontSize: 0 }}
                >
                  <Image
                    src={item.public_url!}
                    alt={item.alt_text || item.filename}
                    width={600}
                    height={600}
                    className="w-full h-auto block transition-all duration-300 group-hover:brightness-110"
                    style={{ display: 'block', width: '100%', height: 'auto' }}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    onLoad={() => handleImageLoad(item.id)}
                    priority={index < 20}
                  />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
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
