"use client"

import { useEffect, useState } from "react"
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
  const [videoSrc, setVideoSrc] = useState(desktopSrc)

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

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <video
        key={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
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
