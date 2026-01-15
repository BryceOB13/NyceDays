# Media Pipeline Refactor - Kiro Implementation

## REPO
https://github.com/BryceOB13/NyceDays

## PROBLEM
- White screens during image loading
- Egress costs spiked from serving originals
- Shuffle causes hydration mismatches
- No lazy loading strategy
- Inconsistent image sizes cause layout shift

## GOALS
- Never serve original uploads to UI
- Deterministic ordering (no shuffle)
- Fast initial paint with skeletons
- Lazy, batched image loading
- Use only pre-generated WebP variants
- Zero layout shift

---

## IMAGE VARIANT CONTRACT

All images are pre-processed offline. Three variants per image:

| Variant | Width | Quality | Use Case |
|---------|-------|---------|----------|
| `thumb` | 400px | 75 | Thumbnails, UI chrome |
| `grid` | 1600px | 82 | Gallery grid |
| `full` | 3000px | 88 | Lightbox only |

**Naming convention:**
```
<basename>.thumb.webp
<basename>.grid.webp
<basename>.full.webp
```

**Note:** If original is smaller than target width, variant retains original dimensions.

---

## 1. CREATE TYPES

Create `types/media.ts`:

```ts
export type MediaVariant = {
  url: string
  width: number
  height: number
}

export type MediaItem = {
  id: string
  alt?: string
  caption?: string
  category?: string
  createdAt: string
  position: number
  variants: {
    thumb: MediaVariant
    grid: MediaVariant
    full: MediaVariant
  }
}

export type ManifestItem = {
  relative_source: string
  original: {
    width: number
    height: number
  }
  outputs: {
    thumb: {
      relative_path: string
      width: number
      height: number
    }
    grid: {
      relative_path: string
      width: number
      height: number
    }
    full: {
      relative_path: string
      width: number
      height: number
    }
  }
}

export type Manifest = {
  variants: Array<{ name: string; width: number; quality: number }>
  items: ManifestItem[]
}
```

---

## 2. CREATE MANIFEST PARSER

Create `lib/media/parse-manifest.ts`:

```ts
import type { MediaItem, Manifest } from '@/types/media'

const BASE_MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || ''

export function parseManifest(manifest: Manifest): MediaItem[] {
  return manifest.items.map((item, index) => {
    // Generate stable ID from filename
    const id = item.relative_source
      .replace(/\.[^.]+$/, '') // Remove extension
      .replace(/[^a-zA-Z0-9]/g, '-') // Sanitize
      .toLowerCase()

    return {
      id,
      position: index,
      createdAt: new Date().toISOString(),
      variants: {
        thumb: {
          url: `${BASE_MEDIA_URL}/${item.outputs.thumb.relative_path}`,
          width: item.outputs.thumb.width,
          height: item.outputs.thumb.height,
        },
        grid: {
          url: `${BASE_MEDIA_URL}/${item.outputs.grid.relative_path}`,
          width: item.outputs.grid.width,
          height: item.outputs.grid.height,
        },
        full: {
          url: `${BASE_MEDIA_URL}/${item.outputs.full.relative_path}`,
          width: item.outputs.full.width,
          height: item.outputs.full.height,
        },
      },
    }
  })
}

// Validation guard
export function isValidVariantUrl(url: string): boolean {
  return (
    url.endsWith('.webp') &&
    (url.includes('.thumb.') || url.includes('.grid.') || url.includes('.full.'))
  )
}
```

---

## 3. CREATE DB SEEDER

Create `scripts/seed-media.ts`:

```ts
import { createClient } from '@supabase/supabase-js'
import manifest from '../manifest.json'
import { parseManifest } from '../lib/media/parse-manifest'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedMedia() {
  const items = parseManifest(manifest)

  console.log(`Seeding ${items.length} media items...`)

  for (const item of items) {
    const { error } = await supabase.from('media_items').upsert({
      id: item.id,
      position: item.position,
      thumb_url: item.variants.thumb.url,
      thumb_width: item.variants.thumb.width,
      thumb_height: item.variants.thumb.height,
      grid_url: item.variants.grid.url,
      grid_width: item.variants.grid.width,
      grid_height: item.variants.grid.height,
      full_url: item.variants.full.url,
      full_width: item.variants.full.width,
      full_height: item.variants.full.height,
    }, { onConflict: 'id' })

    if (error) {
      console.error(`Error seeding ${item.id}:`, error)
    }
  }

  console.log('Done!')
}

seedMedia()
```

---

## 4. ADD DB TABLE

Run in Supabase SQL Editor:

```sql
CREATE TABLE media_items (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  position INT NOT NULL DEFAULT 0,
  alt_text TEXT,
  caption TEXT,
  category TEXT,
  
  -- Thumb variant
  thumb_url TEXT NOT NULL,
  thumb_width INT NOT NULL,
  thumb_height INT NOT NULL,
  
  -- Grid variant
  grid_url TEXT NOT NULL,
  grid_width INT NOT NULL,
  grid_height INT NOT NULL,
  
  -- Full variant
  full_url TEXT NOT NULL,
  full_width INT NOT NULL,
  full_height INT NOT NULL
);

CREATE INDEX idx_media_position ON media_items(position);
CREATE INDEX idx_media_category ON media_items(category);

-- RLS
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view media" ON media_items
  FOR SELECT USING (true);
```

---

## 5. CREATE GALLERY DATA HOOK

Create `lib/media/use-gallery.ts`:

```ts
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { MediaItem } from '@/types/media'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
  const loadMore = async () => {
    if (!hasMore || loading) return

    setLoading(true)
    
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
  }

  return { items, loading, hasMore, loadMore }
}

function mapDbToMediaItem(rows: any[]): MediaItem[] {
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
```

---

## 6. CREATE OPTIMIZED IMAGE COMPONENT

Create `components/media/optimized-image.tsx`:

```tsx
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
}

export function OptimizedImage({
  variant,
  alt = '',
  className,
  priority = false,
  onLoad,
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

  // Calculate aspect ratio for skeleton
  const aspectRatio = variant.height / variant.width

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden bg-foreground/5', className)}
      style={{ aspectRatio: `${variant.width} / ${variant.height}` }}
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
            'object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
```

---

## 7. CREATE GALLERY GRID COMPONENT

Create `components/media/gallery-grid.tsx`:

```tsx
'use client'

import { useGallery } from '@/lib/media/use-gallery'
import { OptimizedImage } from './optimized-image'
import type { MediaItem } from '@/types/media'

interface GalleryGridProps {
  category?: string
  onImageClick?: (item: MediaItem) => void
}

export function GalleryGrid({ category, onImageClick }: GalleryGridProps) {
  const { items, loading, hasMore, loadMore } = useGallery(category)

  return (
    <div className="space-y-8">
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {items.map((item, index) => (
          <button
            key={item.id} // Stable key from ID, not index
            onClick={() => onImageClick?.(item)}
            className="group relative overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94A4A]"
          >
            <OptimizedImage
              variant={item.variants.grid}
              alt={item.alt || `Gallery image ${item.position + 1}`}
              priority={index < 2} // Only first 2 images are priority
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}

        {/* Loading skeletons */}
        {loading && items.length === 0 && (
          <>
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="aspect-[3/2] rounded-lg bg-foreground/10 animate-pulse"
              />
            ))}
          </>
        )}
      </div>

      {/* Load More */}
      {hasMore && !loading && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="px-8 py-3 border border-foreground/20 rounded-full font-display text-sm uppercase tracking-wider text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loading && items.length > 0 && (
        <div className="text-center">
          <span className="text-foreground/40 text-sm">Loading...</span>
        </div>
      )}
    </div>
  )
}
```

---

## 8. CREATE LIGHTBOX COMPONENT

Create `components/media/lightbox.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OptimizedImage } from './optimized-image'
import type { MediaItem } from '@/types/media'

interface LightboxProps {
  item: MediaItem | null
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
}

export function Lightbox({ item, onClose, onNext, onPrev }: LightboxProps) {
  // Keyboard navigation
  useEffect(() => {
    if (!item) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext?.()
      if (e.key === 'ArrowLeft') onPrev?.()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [item, onClose, onNext, onPrev])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation */}
          {onPrev && (
            <button
              onClick={(e) => { e.stopPropagation(); onPrev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              aria-label="Previous"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {onNext && (
            <button
              onClick={(e) => { e.stopPropagation(); onNext() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              aria-label="Next"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image - FULL variant loaded only here */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <OptimizedImage
              variant={item.variants.full}
              alt={item.alt}
              priority
              className="max-w-full max-h-[90vh] w-auto h-auto"
            />
          </motion.div>

          {/* Caption */}
          {item.caption && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-serif">
              {item.caption}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

## 9. UPDATE ENV

Add to `.env.local`:

```env
NEXT_PUBLIC_MEDIA_URL=https://your-supabase-project.supabase.co/storage/v1/object/public/media
```

---

## 10. UPLOAD WEBP VARIANTS TO SUPABASE

After running your image pipeline locally:

```bash
# Upload all webp files to Supabase storage
# Structure: media bucket, flat file structure
cd /path/to/web/output
for f in *.webp; do
  supabase storage cp "$f" "media/$f"
done
```

---

## VARIANT USAGE RULES

| Context | Variant | When Loaded |
|---------|---------|-------------|
| Gallery grid | `grid` | Initial + paginated |
| Thumbnails / previews | `thumb` | On demand |
| Lightbox / modal | `full` | Only on open |

**Guardrails:**
- Never reference original files
- Only URLs ending in `.webp`
- Only URLs with `.thumb.`, `.grid.`, or `.full.` in path

---

## PERFORMANCE RULES

| Rule | Value |
|------|-------|
| Initial load | ≤ 18 images |
| Pagination batch | 12 images |
| Priority images | First 2 only |
| Lazy load margin | 600px |
| Preload full variants | ❌ Never |

---

## CHECKLIST

- [ ] Create `types/media.ts`
- [ ] Create `lib/media/parse-manifest.ts`
- [ ] Create `scripts/seed-media.ts`
- [ ] Run SQL to create `media_items` table
- [ ] Create `lib/media/use-gallery.ts`
- [ ] Create `components/media/optimized-image.tsx`
- [ ] Create `components/media/gallery-grid.tsx`
- [ ] Create `components/media/lightbox.tsx`
- [ ] Add `NEXT_PUBLIC_MEDIA_URL` to env
- [ ] Upload WebP variants to Supabase storage
- [ ] Run seed script to populate DB
- [ ] Replace existing gallery with new components
- [ ] Remove all shuffle/random logic
- [ ] Test: Initial load ≤ 18 images
- [ ] Test: No white screens on slow network
- [ ] Test: Lightbox loads `full` variant only on open
- [ ] Test: Stable hydration (no mismatches)
