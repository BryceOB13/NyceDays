'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { parseManifest } from '@/lib/media/parse-manifest'
import type { MediaItem } from '@/types/media'

const INITIAL_LOAD = 18
const LOAD_MORE = 12

export function useGallery(category?: string) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  // Initial load - use manifest for now since we have the processed images
  useEffect(() => {
    async function fetchInitial() {
      setLoading(true)
      
      try {
        console.log('Fetching manifest...')
        // Fetch the manifest and parse it
        const response = await fetch('/manifest.json')
        if (!response.ok) {
          throw new Error(`Failed to fetch manifest: ${response.status}`)
        }
        const manifest = await response.json()
        console.log('Manifest loaded:', manifest.items?.length, 'items')
        
        const mediaItems = parseManifest(manifest)
        console.log('Parsed media items:', mediaItems.length)
        
        // Apply category filter if specified
        const filteredItems = category 
          ? mediaItems.filter(item => item.category === category)
          : mediaItems
        
        console.log('Filtered items:', filteredItems.length)
        
        // Apply pagination
        const paginatedItems = filteredItems.slice(0, INITIAL_LOAD)
        console.log('Paginated items:', paginatedItems.length)
        
        setItems(paginatedItems)
        setHasMore(filteredItems.length > INITIAL_LOAD)
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
    
    try {
      // Fetch the manifest and parse it
      const response = await fetch('/manifest.json')
      const manifest = await response.json()
      const mediaItems = parseManifest(manifest)
      
      // Apply category filter if specified
      const filteredItems = category 
        ? mediaItems.filter(item => item.category === category)
        : mediaItems
      
      // Get next batch
      const nextItems = filteredItems.slice(items.length, items.length + LOAD_MORE)
      
      setItems(prev => [...prev, ...nextItems])
      setHasMore(filteredItems.length > items.length + nextItems.length)
    } catch (error) {
      console.error('Load more error:', error)
    }
    
    setLoading(false)
  }, [hasMore, loading, items.length, category])

  return { items, loading, hasMore, loadMore }
}
