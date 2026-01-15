'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { MediaVariant } from '@/types/media'

interface OptimizedImageProps {
  variant: MediaVariant
  alt?: string
  className?: string
  priority?: boolean
  onLoad?: () => void
  aspectRatio?: 'square' | 'original'
}

export function OptimizedImage({
  variant,
  alt = '',
  className,
  priority = false,
  onLoad,
  aspectRatio = 'original',
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [inView, setInView] = useState(priority)
  const ref = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [priority, inView])

  const handleLoad = () => {
    setLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
  }

  const aspectStyle = aspectRatio === 'square' 
    ? { aspectRatio: '1 / 1' }
    : { aspectRatio: `${variant.width} / ${variant.height}` }

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden bg-foreground/5', className)}
      style={aspectStyle}
    >
      {/* Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-foreground/10" />
      )}

      {/* Image */}
      {inView && !error && (
        <Image
          src={variant.url}
          alt={alt}
          width={variant.width}
          height={variant.height}
          className={cn(
            'object-cover w-full h-full transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/5">
          <span className="text-foreground/30 text-sm">Failed to load</span>
        </div>
      )}
    </div>
  )
}
