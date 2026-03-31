"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface VideoBackgroundProps {
  desktopSrc: string
  mobileSrc: string
  tabletSrc?: string
  poster?: string
  overlay?: string
  children?: React.ReactNode
  className?: string
}

export function VideoBackground({
  desktopSrc,
  mobileSrc,
  tabletSrc,
  poster,
  overlay = "bg-black/50",
  children,
  className,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoSrc, setVideoSrc] = useState(desktopSrc)
  const [isPlaying, setIsPlaying] = useState(false)

  // Set video source based on screen size
  useEffect(() => {
    const updateSource = () => {
      const width = window.innerWidth
      if (width < 640) {
        setVideoSrc(mobileSrc)
      } else if (width < 1024 && tabletSrc) {
        setVideoSrc(tabletSrc)
      } else {
        setVideoSrc(desktopSrc)
      }
    }

    updateSource()
    window.addEventListener('resize', updateSource)
    return () => window.removeEventListener('resize', updateSource)
  }, [desktopSrc, mobileSrc, tabletSrc])

  // Simple play handler - aggressive for mobile
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tryPlay = async () => {
      try {
        // Reset video state for mobile
        video.load()
        await video.play()
        setIsPlaying(true)
      } catch {
        // Autoplay blocked, poster will show
        // Try again on any user interaction
        const playOnInteraction = () => {
          video.play()
            .then(() => {
              setIsPlaying(true)
              document.removeEventListener('touchstart', playOnInteraction)
              document.removeEventListener('click', playOnInteraction)
            })
            .catch(() => {})
        }
        document.addEventListener('touchstart', playOnInteraction, { once: true })
        document.addEventListener('click', playOnInteraction, { once: true })
      }
    }

    // Small delay to ensure video element is ready
    const timer = setTimeout(tryPlay, 100)
    
    return () => clearTimeout(timer)
  }, [videoSrc])

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-black", className)}>
      {/* Poster fallback */}
      {poster && !isPlaying && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      {/* Video */}
      <video
        ref={videoRef}
        key={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={cn(
          "absolute inset-0 w-full h-full object-cover",
          isPlaying ? "opacity-100" : "opacity-0"
        )}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className={cn("absolute inset-0", overlay)} />

      {/* Content */}
      {children && (
        <div className="relative z-10 w-full h-full">{children}</div>
      )}
    </div>
  )
}
