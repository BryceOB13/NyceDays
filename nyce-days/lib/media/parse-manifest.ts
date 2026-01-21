import type { MediaItem, Manifest } from '@/types/media'

// Images are served from Supabase storage
const getMediaUrl = (relativePath: string): string => {
  // Use the hardcoded URL since env vars might not be available client-side in this context
  const baseUrl = 'https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web'
  // Properly encode the path to handle spaces and special characters
  const encodedPath = encodeURIComponent(relativePath)
  const fullUrl = `${baseUrl}/${encodedPath}`
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

// Validation guard
export function isValidVariantUrl(url: string): boolean {
  return (
    url.endsWith('.webp') &&
    (url.includes('.thumb.') || url.includes('.grid.') || url.includes('.full.'))
  )
}
