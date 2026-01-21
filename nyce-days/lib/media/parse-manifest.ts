import type { MediaItem, Manifest } from '@/types/media'
import { filterValidManifestItems } from './validate-images'

// Images are served from Supabase storage
const MEDIA_BASE_URL = 'https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web'

const getMediaUrl = (relativePath: string): string => {
  // Properly encode the path to handle spaces and special characters
  const encodedPath = encodeURIComponent(relativePath)
  const fullUrl = `${MEDIA_BASE_URL}/${encodedPath}`
  return fullUrl
}

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
          url: getMediaUrl(item.outputs.thumb.relative_path),
          width: item.outputs.thumb.width,
          height: item.outputs.thumb.height,
        },
        grid: {
          url: getMediaUrl(item.outputs.grid.relative_path),
          width: item.outputs.grid.width,
          height: item.outputs.grid.height,
        },
        full: {
          url: getMediaUrl(item.outputs.full.relative_path),
          width: item.outputs.full.width,
          height: item.outputs.full.height,
        },
      },
    }
  })
}

/**
 * Parse manifest with validation - only returns items with accessible images
 */
export async function parseManifestWithValidation(manifest: Manifest): Promise<MediaItem[]> {
  console.log('🔍 Validating manifest items...')
  
  // Filter to only valid items first
  const validItems = await filterValidManifestItems(manifest.items, MEDIA_BASE_URL)
  
  // Then parse the valid items
  const mediaItems = validItems.map((item, index) => {
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
          url: getMediaUrl(item.outputs.thumb.relative_path),
          width: item.outputs.thumb.width,
          height: item.outputs.thumb.height,
        },
        grid: {
          url: getMediaUrl(item.outputs.grid.relative_path),
          width: item.outputs.grid.width,
          height: item.outputs.grid.height,
        },
        full: {
          url: getMediaUrl(item.outputs.full.relative_path),
          width: item.outputs.full.width,
          height: item.outputs.full.height,
        },
      },
    }
  })
  
  console.log(`✅ Parsed ${mediaItems.length} validated media items`)
  return mediaItems
}

// Validation guard
export function isValidVariantUrl(url: string): boolean {
  return (
    url.endsWith('.webp') &&
    (url.includes('.thumb.') || url.includes('.grid.') || url.includes('.full.'))
  )
}
