'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useCallback, useRef } from 'react'

type EventData = Record<string, string | number | boolean | null | undefined>

export function useAnalytics() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  const track = useCallback(async (event_name: string, event_data?: EventData) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name,
          event_data,
          page_path: typeof window !== 'undefined' ? window.location.pathname : null,
        }),
      })
    } catch (error) {
      // Silently fail - analytics shouldn't break the app
      console.error('Analytics error:', error)
    }
  }, [])

  // Track page views automatically (only once per path change)
  useEffect(() => {
    if (pathname && pathname !== lastTrackedPath.current) {
      lastTrackedPath.current = pathname
      track('page_view', { 
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer : null,
      })
    }
  }, [pathname, track])

  return { track }
}

// Predefined event helpers
export function useTrackCTA() {
  const { track } = useAnalytics()
  
  return useCallback((ctaId: string, destination?: string) => {
    track('cta_click', { cta_id: ctaId, destination })
  }, [track])
}

export function useTrackScroll() {
  const { track } = useAnalytics()
  const trackedDepths = useRef<Set<number>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100)
      
      const depths = [25, 50, 75, 100]
      for (const depth of depths) {
        if (scrollPercent >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth)
          track('scroll_depth', { depth })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [track])
}
