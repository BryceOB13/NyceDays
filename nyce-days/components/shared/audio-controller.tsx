'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function AudioController() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Check saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('nd-audio-enabled')
    if (saved === 'true' && audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }, [])

  const toggleAudio = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      localStorage.setItem('nd-audio-enabled', 'false')
      setIsPlaying(false)
    } else {
      audioRef.current.volume = 0.3
      audioRef.current.play()
      localStorage.setItem('nd-audio-enabled', 'true')
      setIsPlaying(true)
    }
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/audio/ambient.mp3"
        loop
        preload="auto"
      />

      {/* Minimal floating button - bottom right */}
      <motion.button
        onClick={toggleAudio}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
      >
        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300">
          
          {/* Sound wave bars animation - only visible when playing */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div 
                className="flex items-end justify-center gap-[3px] h-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {[1, 2, 3, 4].map((bar) => (
                  <motion.span
                    key={bar}
                    className="w-[3px] bg-white rounded-full"
                    animate={{
                      height: ['4px', '16px', '8px', '14px', '4px'],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: bar * 0.1,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Muted indicator - speaker with X */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={1.5}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M17 9l-4 6m0-6l4 6" 
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-white bg-black/90 backdrop-blur-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/20">
          {isPlaying ? 'Mute' : 'Play sound'}
        </span>
      </motion.button>
    </>
  )
}
