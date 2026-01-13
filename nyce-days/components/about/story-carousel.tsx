'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { RefreshCw } from 'lucide-react'
import type { Media } from '@/types/database'

interface GalleryImage {
  src: string
  alt: string
}

interface StoryCarouselProps {
  initialMedia?: Media[]
}

// Random rotation between -6 and 6 degrees
const getRandomRotation = () => Math.random() * 12 - 6

// Tape styles - randomly positioned
const tapeStyles = [
  'top-[-8px] left-[20%] rotate-[-5deg]',
  'top-[-8px] right-[20%] rotate-[8deg]',
  'top-[-6px] left-[40%] rotate-[3deg]',
  'top-[-10px] right-[30%] rotate-[-3deg]',
  'top-[-7px] left-[15%] rotate-[2deg]',
  'top-[-9px] right-[25%] rotate-[-4deg]',
]

const getRandomTape = () => tapeStyles[Math.floor(Math.random() * tapeStyles.length)]

export function StoryCarousel({ initialMedia }: StoryCarouselProps) {
  const [displayImages, setDisplayImages] = useState<GalleryImage[]>([])
  const [rotations, setRotations] = useState<number[]>([])
  const [tapes, setTapes] = useState<string[]>([])
  const [isShuffling, setIsShuffling] = useState(false)

  const shuffleGallery = useCallback(async (images?: GalleryImage[]) => {
    setIsShuffling(true)
    
    let imagesToUse = images
    
    if (!imagesToUse) {
      try {
        const res = await fetch('/api/media/random?count=12')
        if (res.ok) {
          const data: Media[] = await res.json()
          if (data.length > 0) {
            imagesToUse = data.map(m => ({
              src: m.public_url!,
              alt: m.alt_text || m.filename
            }))
          }
        }
      } catch {
        // Silent fail
      }
    }
    
    if (imagesToUse && imagesToUse.length > 0) {
      const shuffled = [...imagesToUse].sort(() => Math.random() - 0.5).slice(0, 8)
      setDisplayImages(shuffled)
      setRotations(shuffled.map(() => getRandomRotation()))
      setTapes(shuffled.map(() => getRandomTape()))
    }
    
    setIsShuffling(false)
  }, [])

  useEffect(() => {
    if (initialMedia && initialMedia.length > 0) {
      const images = initialMedia.map(m => ({
        src: m.public_url!,
        alt: m.alt_text || m.filename
      }))
      shuffleGallery(images)
    } else {
      shuffleGallery()
    }
  }, [initialMedia, shuffleGallery])

  if (displayImages.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <section className="py-8 lg:py-12 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50">
            Moments
          </h3>
          <button
            onClick={() => shuffleGallery()}
            disabled={isShuffling}
            className="flex items-center gap-2 px-4 py-2 text-sm font-sans uppercase tracking-wide text-foreground/50 hover:text-foreground border border-foreground/20 rounded-full hover:border-foreground/40 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
            Shuffle
          </button>
        </div>

        {/* Scrapbook Grid - Desktop */}
        <div className="hidden md:grid grid-cols-4 gap-4 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {displayImages.map((image, index) => (
              <motion.div
                key={`${image.src}-${index}-${rotations[index]}`}
                initial={{ opacity: 0, scale: 0.8, rotate: rotations[index] - 10 }}
                animate={{ opacity: 1, scale: 1, rotate: rotations[index] }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`
                  relative group
                  ${index % 3 === 0 ? 'mt-8' : ''}
                  ${index % 4 === 1 ? '-mt-4' : ''}
                  ${index % 5 === 2 ? 'mt-12' : ''}
                `}
                style={{ zIndex: index }}
              >
                {/* Polaroid Frame */}
                <div className="bg-white dark:bg-gray-100 p-2 pb-10 shadow-lg hover:shadow-xl transition-shadow">
                  
                  {/* Tape */}
                  <div 
                    className={`absolute ${tapes[index]} w-12 h-4 z-10`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(232, 220, 196, 0.9) 0%, rgba(232, 220, 196, 0.7) 50%, rgba(232, 220, 196, 0.9) 100%)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  />
                  
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Scrapbook - Mobile: Stacked polaroids */}
        <div className="md:hidden space-y-6">
          <AnimatePresence mode="popLayout">
            {displayImages.slice(0, 6).map((image, index) => (
              <motion.div
                key={`mobile-${image.src}-${index}-${rotations[index]}`}
                initial={{ opacity: 0, y: 20, rotate: rotations[index] }}
                animate={{ opacity: 1, y: 0, rotate: rotations[index] }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`
                  relative mx-auto
                  ${index % 2 === 0 ? 'ml-4' : 'mr-4'}
                `}
                style={{ maxWidth: '85%' }}
              >
                {/* Polaroid Frame */}
                <div className="bg-white dark:bg-gray-100 p-2 pb-8 shadow-lg">
                  
                  {/* Tape */}
                  <div 
                    className={`absolute ${tapes[index]} w-10 h-3 z-10`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(232, 220, 196, 0.9) 0%, rgba(232, 220, 196, 0.7) 50%, rgba(232, 220, 196, 0.9) 100%)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  />
                  
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
