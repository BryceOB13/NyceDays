"use client"

import { useEffect, useRef, useState, useCallback } from "react"
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
  const [isLoaded, setIsLoaded] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

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

  const attemptPlay = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    try {
      // Reset video to start
      video.currentTime = 0
      await video.play()
      setIsLoaded(true)
    } catch {
      // Autoplay blocked - show poster fallback
      setShowFallback(true)
    }
  }, [])

  // Handle video playback on mount and source change
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Try to play when video can play
    const handleCanPlay = () => attemptPlay()
    
    // Also try on loadeddata for faster response
    const handleLoadedData = () => {
      setIsLoaded(true)
      attemptPlay()
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadeddata', handleLoadedData)

    // If video is already ready, play immediately
    if (video.readyState >= 2) {
      attemptPlay()
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [videoSrc, attemptPlay])

  // Retry play on visibility change (tab switch back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        attemptPlay()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [attemptPlay])

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Poster image (shown until video loads) */}
      {poster && (
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
            isLoaded && !showFallback ? "opacity-0" : "opacity-100"
          )}
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      {/* Video element */}
      {!showFallback && (
        <video
          ref={videoRef}
          key={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      <div className={cn("absolute inset-0", overlay)} />

      {/* Content */}
      {children && (
        <div className="relative z-10 w-full h-full">{children}</div>
      )}
    </div>
  )
}
