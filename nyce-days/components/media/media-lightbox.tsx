'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { OptimizedImage } from './optimized-image'
import type { MediaItem } from '@/types/media'

interface MediaLightboxProps {
  item: MediaItem | null
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
}

export function MediaLightbox({ item, onClose, onNext, onPrev }: MediaLightboxProps) {
  // Keyboard navigation
  useEffect(() => {
    if (!item) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext?.()
      if (e.key === 'ArrowLeft') onPrev?.()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [item, onClose, onNext, onPrev])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation - Previous */}
          {onPrev && (
            <button
              onClick={(e) => { e.stopPropagation(); onPrev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Navigation - Next */}
          {onNext && (
            <button
              onClick={(e) => { e.stopPropagation(); onNext() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Image - FULL variant loaded only here */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <OptimizedImage
              variant={item.variants.full}
              alt={item.alt}
              priority
              className="max-w-full max-h-[90vh] w-auto h-auto"
            />
          </motion.div>

          {/* Caption */}
          {item.caption && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-serif">
              {item.caption}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
