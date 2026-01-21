'use client'

import { useState, useEffect, useCallback } from 'react'
import type { MediaItem } from '@/types/media'
import { parseManifestWithValidation } from './parse-manifest'

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
        const allItems = manifest.items.map((item: any, index: number) => {
          const id = item.relative_source
            .replace(/\.[^.]+$/, '') // Remove extension
            .replace(/[^a-zA-Z0-9]/g, '-') // Sanitize
            .toLowerCase()

          const baseUrl = 'https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web'
          
          return {
            id,
            position: index,
            createdAt: new Date().toISOString(),
            variants: {
              thumb: {
                url: `${baseUrl}/${encodeURIComponent(item.outputs.thumb.relative_path)}`,
                width: item.outputs.thumb.width,
                height: item.outputs.thumb.height,
              },
              grid: {
                url: `${baseUrl}/${encodeURIComponent(item.outputs.grid.relative_path)}`,
                width: item.outputs.grid.width,
                height: item.outputs.grid.height,
              },
              full: {
                url: `${baseUrl}/${encodeURIComponent(item.outputs.full.relative_path)}`,
                width: item.outputs.full.width,
                height: item.outputs.full.height,
              },
            },
          }
        })
        
        setValidatedItems(allItems) // Cache for later use
        
        // Shuffle the items for variety - use a more reliable shuffle
        const shuffled = [...allItems]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        
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
      // Use cached validated items if available
      let allItems = validatedItems
      
      if (allItems.length === 0) {
        // Fallback: load and validate manifest again
        const response = await fetch('/manifest.json')
        const manifest = await response.json()
        allItems = await parseManifestWithValidation(manifest)
        setValidatedItems(allItems)
      }
      
      // Apply same shuffle and filter logic
      const shuffled = [...allItems].sort(() => Math.random() - 0.5)
      const filtered = category 
        ? shuffled.filter(item => item.category === category)
        : shuffled
      
      // Get next batch
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