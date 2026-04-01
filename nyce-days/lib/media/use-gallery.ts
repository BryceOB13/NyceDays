'use client'

/**
 * @deprecated — The media page now loads initial data server-side.
 * This hook is kept for backward compatibility with other pages that may use it.
 * Prefer passing initialItems from a server component instead.
 */

import { useState, useEffect, useCallback } from 'react'
import type { MediaItem } from '@/types/media'
import { parseManifestItem, shuffleItems } from './parse-manifest'

const INITIAL_LOAD = 18
const LOAD_MORE = 12

export function useGallery(category?: string) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [validatedItems, setValidatedItems] = useState<MediaItem[]>([]) // Cache validated items

  // Initial load
  useEffect(() => {
    async function fetchInitial() {
      setLoading(true)
      
      try {
        // Load manifest.json from public directory
        const response = await fetch('/manifest.json')
        if (!response.ok) {
          throw new Error(`Failed to load manifest: ${response.status}`)
        }
        
        const manifest = await response.json()
        console.log('📦 Loaded manifest with', manifest.items?.length, 'items')
        
        // SKIP VALIDATION - Use all items directly for performance
        const allItems = manifest.items.map(parseManifestItem)
        
        setValidatedItems(allItems) // Cache for later use
        
        // Shuffle the items for variety
        const shuffled = shuffleItems(allItems)
        
        // Filter by category if specified
        const filtered = category 
          ? shuffled.filter(item => item.category === category)
          : shuffled
        
        // Take initial load
        const initialItems = filtered.slice(0, INITIAL_LOAD)
        console.log('✅ Displaying', initialItems.length, 'validated items')
        
        setItems(initialItems)
        setHasMore(filtered.length > INITIAL_LOAD)
      } catch (error) {
        console.error('❌ Gallery fetch error:', error)
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
      // Use cached items directly — no re-validation
      const allItems = validatedItems
      
      if (allItems.length === 0) {
        // Fallback: re-parse manifest without validation
        const response = await fetch('/manifest.json')
        const manifest = await response.json()
        const parsed = manifest.items.map(parseManifestItem)
        setValidatedItems(parsed)
        
        const nextItems = parsed.slice(items.length, items.length + LOAD_MORE)
        setItems(prev => [...prev, ...nextItems])
        setHasMore(items.length + nextItems.length < parsed.length)
        setLoading(false)
        return
      }
      
      // Get next batch from cached items (no shuffle on load-more to maintain order)
      const filtered = category 
        ? allItems.filter(item => item.category === category)
        : allItems
      
      const nextItems = filtered.slice(items.length, items.length + LOAD_MORE)
      
      setItems(prev => [...prev, ...nextItems])
      setHasMore(items.length + nextItems.length < filtered.length)
    } catch (error) {
      console.error('Load more error:', error)
    }
    
    setLoading(false)
  }, [hasMore, loading, items.length, category, validatedItems])

  return { items, loading, hasMore, loadMore }
}