'use client'

import { useState, useEffect, useCallback } from 'react'
import type { MediaItem } from '@/types/media'

const INITIAL_LOAD = 18
const LOAD_MORE = 12

// Test data to verify the component works
const createTestItem = (index: number): MediaItem => ({
  id: `test-${index}`,
  position: index,
  createdAt: new Date().toISOString(),
  variants: {
    thumb: {
      url: `https://videos.nycedays.com/web/nyce days family-${String(index + 1).padStart(3, '0')}.thumb.webp`,
      width: 400,
      height: 533,
    },
    grid: {
      url: `https://videos.nycedays.com/web/nyce days family-${String(index + 1).padStart(3, '0')}.grid.webp`,
      width: 1600,
      height: 2131,
    },
    full: {
      url: `https://videos.nycedays.com/web/nyce days family-${String(index + 1).padStart(3, '0')}.full.webp`,
      width: 3000,
      height: 3995,
    },
  },
})

export function useGallery(category?: string) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  // Initial load - create test items first to verify component works
  useEffect(() => {
    async function fetchInitial() {
      setLoading(true)
      console.log('Starting gallery load...')
      
      try {
        // Create test items for the first few images
        const testItems = Array.from({ length: INITIAL_LOAD }, (_, i) => createTestItem(i))
        console.log('Created test items:', testItems.length)
        
        setItems(testItems)
        setHasMore(true)
      } catch (error) {
        console.error('Gallery fetch error:', error)
      }
      
      setLoading(false)
    }

    fetchInitial()
  }, [category])

  // Load more
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return

    setLoading(true)
    console.log('Loading more items...')
    
    try {
      const nextItems = Array.from({ length: LOAD_MORE }, (_, i) => 
        createTestItem(items.length + i)
      )
      
      setItems(prev => [...prev, ...nextItems])
      setHasMore(items.length + nextItems.length < 50) // Limit to 50 for testing
    } catch (error) {
      console.error('Load more error:', error)
    }
    
    setLoading(false)
  }, [hasMore, loading, items.length])

  return { items, loading, hasMore, loadMore }
}