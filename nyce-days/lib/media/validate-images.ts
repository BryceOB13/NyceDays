/**
 * Image validation utilities to ensure only available images are displayed
 */

import type { MediaItem, ManifestItem } from '@/types/media'

// Cache for validated URLs to avoid repeated checks
const validationCache = new Map<string, boolean>()

/**
 * Check if an image URL is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  // Check cache first
  if (validationCache.has(url)) {
    return validationCache.get(url)!
  }

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'force-cache', // Cache the validation result
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    const contentType = response.headers.get('content-type')
    const isValid = response.ok && contentType?.startsWith('image/') === true
    validationCache.set(url, isValid)
    
    return isValid
  } catch (error) {
    // Handle timeout and other errors gracefully
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`Image validation timeout for ${url}`)
    } else {
      console.warn(`Image validation failed for ${url}:`, error)
    }
    
    validationCache.set(url, false)
    return false
  }
}

/**
 * Validate all variants of a media item
 */
export async function validateMediaItem(item: MediaItem): Promise<boolean> {
  try {
    // Check all three variants - all must be valid
    const [thumbValid, gridValid, fullValid] = await Promise.all([
      validateImageUrl(item.variants.thumb.url),
      validateImageUrl(item.variants.grid.url),
      validateImageUrl(item.variants.full.url)
    ])

    const isValid = thumbValid && gridValid && fullValid
    
    if (!isValid) {
      console.warn(`Invalid media item ${item.id}:`, {
        thumb: thumbValid,
        grid: gridValid,
        full: fullValid
      })
    }

    return isValid
  } catch (error) {
    console.error(`Error validating media item ${item.id}:`, error)
    return false
  }
}

/**
 * Filter manifest items to only include those with valid images
 */
export async function filterValidManifestItems(
  items: ManifestItem[], 
  baseUrl: string
): Promise<ManifestItem[]> {
  const validItems: ManifestItem[] = []
  
  // Process in batches to avoid overwhelming the server
  const batchSize = 10
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    
    const batchResults = await Promise.allSettled(
      batch.map(async (item) => {
        // Check if all three variants exist
        const thumbUrl = `${baseUrl}/${encodeURIComponent(item.outputs.thumb.relative_path)}`
        const gridUrl = `${baseUrl}/${encodeURIComponent(item.outputs.grid.relative_path)}`
        const fullUrl = `${baseUrl}/${encodeURIComponent(item.outputs.full.relative_path)}`
        
        const [thumbValid, gridValid, fullValid] = await Promise.all([
          validateImageUrl(thumbUrl),
          validateImageUrl(gridUrl),
          validateImageUrl(fullUrl)
        ])
        
        if (thumbValid && gridValid && fullValid) {
          return item
        } else {
          console.warn(`Skipping invalid item: ${item.relative_source}`, {
            thumb: thumbValid,
            grid: gridValid,
            full: fullValid
          })
          return null
        }
      })
    )
    
    // Add successful validations to results
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        validItems.push(result.value)
      }
    })
    
    // Small delay between batches to be respectful
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  console.log(`✅ Validated ${validItems.length}/${items.length} images`)
  return validItems
}

/**
 * Clear validation cache (useful for development/testing)
 */
export function clearValidationCache(): void {
  validationCache.clear()
}

/**
 * Get validation cache stats
 */
export function getValidationCacheStats(): { size: number; entries: Array<[string, boolean]> } {
  return {
    size: validationCache.size,
    entries: Array.from(validationCache.entries())
  }
}