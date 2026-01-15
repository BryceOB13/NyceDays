import type { MediaItem, Manifest } from '@/types/media'

// Default to images bucket if NEXT_PUBLIC_MEDIA_URL not set
const BASE_MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images`

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
