'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface EventPosterProps {
  src: string
}

export default function EventPoster({ src }: EventPosterProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <div className="w-full max-w-[320px] md:max-w-[360px] shrink-0">
        <button
          onClick={() => setLightboxOpen(true)}
          className="block w-full rounded-md overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.5)] md:cursor-default"
        >
          <Image
            src={src}
            alt="the yard — sunday may 24, rock creek park. caribbean cookout for jamaica hurricane relief."
            width={800}
            height={1000}
            priority
            className="w-full h-auto"
            sizes="(max-width: 768px) 80vw, 360px"
          />
        </button>
      </div>

      {/* Mobile lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:hidden"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white z-10"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <Image
              src={src}
              alt="the yard flyer"
              width={800}
              height={1000}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
