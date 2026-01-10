"use client"

import { cn } from "@/lib/utils"

interface VideoBackgroundProps {
  src: string
  poster: string
  overlay?: string
  children: React.ReactNode
  className?: string
}

export function VideoBackground({
  src,
  poster,
  overlay = "bg-black/50",
  children,
  className,
}: VideoBackgroundProps) {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* Video element */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
        {/* Fallback to poster image if video doesn't load */}
      </video>

      {/* Overlay */}
      <div className={cn("absolute inset-0", overlay)} />

      {/* Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  )
}
