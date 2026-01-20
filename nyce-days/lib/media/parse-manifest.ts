import type { MediaItem, Manifest } from '@/types/media'
import { getPublicR2Url } from '@/lib/videos'

// Images are served from R2 under the web/ prefix (not images/)
const IMAGES_PREFIX = 'web'

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
          url: getPublicR2Url(`${IMAGES_PREFIX}/${item.outputs.thumb.relative_path}`),
          width: item.outputs.thumb.width,
          height: item.outputs.thumb.height,
        },
        grid: {
          url: getPublicR2Url(`${IMAGES_PREFIX}/${item.outputs.grid.relative_path}`),
          width: item.outputs.grid.width,
          height: item.outputs.grid.height,
        },
        full: {
          url: getPublicR2Url(`${IMAGES_PREFIX}/${item.outputs.full.relative_path}`),
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
