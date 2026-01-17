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

  // Handle video playback
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playVideo = async () => {
      try {
        await video.play()
      } catch {
        // Autoplay blocked - show poster fallback
        setShowFallback(true)
      }
    }

    if (video.readyState >= 3) {
      playVideo()
    } else {
      video.addEventListener('canplay', playVideo, { once: true })
    }

    return () => {
      video.removeEventListener('canplay', playVideo)
    }
  }, [videoSrc])

  const handleLoadedData = () => {
    setIsLoaded(true)
  }

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
          poster={poster}
          onLoadedData={handleLoadedData}
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
