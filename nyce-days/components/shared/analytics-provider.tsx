'use client'

import { useAnalytics, useTrackScroll } from '@/hooks/use-analytics'
import { useEffect } from 'react'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Initialize analytics (tracks page views automatically)
  useAnalytics()
  
  // Track scroll depth
  useTrackScroll()

  // Generate session ID on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.cookie.includes('session_id')) {
      const sessionId = crypto.randomUUID()
      document.cookie = `session_id=${sessionId}; path=/; max-age=${60 * 60 * 24}` // 24 hours
    }
  }, [])

  return <>{children}</>
}
