import type { MediaItem, Manifest, ManifestItem } from '@/types/media'

const MEDIA_BASE_URL = 'https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web'

function getMediaUrl(relativePath: string): string {
  return `${MEDIA_BASE_URL}/${encodeURIComponent(relativePath)}`
}

/**
 * Single source of truth for converting a ManifestItem into a MediaItem.
 * Used by both server-side initial load and client-side load-more.
 */
export function parseManifestItem(item: ManifestItem, index: number): MediaItem {
  const id = item.relative_source
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
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
}

/**
 * Parse all items from a manifest.
 */
export function parseManifest(manifest: Manifest): MediaItem[] {
  return manifest.items.map(parseManifestItem)
}

/**
 * Fisher-Yates shuffle. Returns a new array.
 */
export function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
