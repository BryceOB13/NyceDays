'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { MediaItem } from '@/types/media'

const INITIAL_LOAD = 18
const LOAD_MORE = 12

export function useGallery(category?: string) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  // Initial load
  useEffect(() => {
    async function fetchInitial() {
      setLoading(true)
      const supabase = createClient()
      
      let query = supabase
        .from('media_items')
        .select('*')
        .order('position', { ascending: true })
        .limit(INITIAL_LOAD)
      
      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        console.error('Gallery fetch error:', error)
        setLoading(false)
        return
      }

      const mapped = mapDbToMediaItem(data || [])
      setItems(mapped)
      setHasMore((data?.length || 0) >= INITIAL_LOAD)
      setLoading(false)
    }

    fetchInitial()
  }, [category])

  // Load more
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return

    setLoading(true)
    const supabase = createClient()
    
    let query = supabase
      .from('media_items')
      .select('*')
      .order('position', { ascending: true })
      .range(items.length, items.length + LOAD_MORE - 1)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Load more error:', error)
      setLoading(false)
      return
    }

    const mapped = mapDbToMediaItem(data || [])
    setItems(prev => [...prev, ...mapped])
    setHasMore((data?.length || 0) >= LOAD_MORE)
    setLoading(false)
  }, [hasMore, loading, items.length, category])

  return { items, loading, hasMore, loadMore }
}

interface DbMediaItem {
  id: string
  position: number
  alt_text?: string
  caption?: string
  category?: string
  created_at: string
  thumb_url: string
  thumb_width: number
  thumb_height: number
  grid_url: string
  grid_width: number
  grid_height: number
  full_url: string
  full_width: number
  full_height: number
}

function mapDbToMediaItem(rows: DbMediaItem[]): MediaItem[] {
  return rows.map(row => ({
    id: row.id,
    position: row.position,
    alt: row.alt_text,
    caption: row.caption,
    category: row.category,
    createdAt: row.created_at,
    variants: {
      thumb: { url: row.thumb_url, width: row.thumb_width, height: row.thumb_height },
      grid: { url: row.grid_url, width: row.grid_width, height: row.grid_height },
      full: { url: row.full_url, width: row.full_width, height: row.full_height },
    },
  }))
}
