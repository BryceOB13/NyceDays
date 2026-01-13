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
        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/10 hover:bg-foreground/20 hover:border-foreground/20 transition-all duration-300">
          
          {/* Sound wave bars animation */}
          <div className="flex items-end justify-center gap-[3px] h-4">
            {[1, 2, 3, 4].map((bar) => (
              <motion.span
                key={bar}
                className="w-[3px] bg-foreground/70 rounded-full"
                animate={isPlaying ? {
                  height: ['4px', '16px', '8px', '14px', '4px'],
                } : {
                  height: '4px',
                }}
                transition={isPlaying ? {
                  duration: 1,
                  repeat: Infinity,
                  delay: bar * 0.1,
                  ease: 'easeInOut',
                } : {
                  duration: 0.3,
                }}
              />
            ))}
          </div>

          {/* Muted indicator */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-6 h-[2px] bg-foreground/50 rotate-45 absolute" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-foreground/60 bg-background/80 backdrop-blur-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isPlaying ? 'Mute' : 'Play sound'}
        </span>
      </motion.button>
    </>
  )
}
