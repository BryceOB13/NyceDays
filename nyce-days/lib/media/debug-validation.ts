/**
 * Development utility to debug image validation
 * Run this in the browser console to test validation
 */

import { validateImageUrl, filterValidManifestItems, getValidationCacheStats } from './validate-images'
import type { Manifest } from '@/types/media'

const MEDIA_BASE_URL = 'https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web'

/**
 * Test validation for a few sample images
 */
export async function testValidation() {
  console.log('🧪 Testing image validation...')
  
  try {
    // Load manifest
    const response = await fetch('/manifest.json')
    const manifest: Manifest = await response.json()
    
    console.log(`📦 Loaded manifest with ${manifest.items.length} items`)
    
    // Test first 5 items
    const sampleItems = manifest.items.slice(0, 5)
    
    for (const item of sampleItems) {
      console.log(`\n🔍 Testing: ${item.relative_source}`)
      
      const thumbUrl = `${MEDIA_BASE_URL}/${encodeURIComponent(item.outputs.thumb.relative_path)}`
      const gridUrl = `${MEDIA_BASE_URL}/${encodeURIComponent(item.outputs.grid.relative_path)}`
      const fullUrl = `${MEDIA_BASE_URL}/${encodeURIComponent(item.outputs.full.relative_path)}`
      
      const [thumbValid, gridValid, fullValid] = await Promise.all([
        validateImageUrl(thumbUrl),
        validateImageUrl(gridUrl),
        validateImageUrl(fullUrl)
      ])
      
      console.log(`  Thumb: ${thumbValid ? '✅' : '❌'} ${thumbUrl}`)
      console.log(`  Grid:  ${gridValid ? '✅' : '❌'} ${gridUrl}`)
      console.log(`  Full:  ${fullValid ? '✅' : '❌'} ${fullUrl}`)
      
      const allValid = thumbValid && gridValid && fullValid
      console.log(`  Overall: ${allValid ? '✅ VALID' : '❌ INVALID'}`)
    }
    
    // Show cache stats
    const cacheStats = getValidationCacheStats()
    console.log(`\n📊 Cache stats: ${cacheStats.size} entries`)
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

/**
 * Test the full validation pipeline
 */
export async function testFullValidation() {
  console.log('🧪 Testing full validation pipeline...')
  
  try {
    const response = await fetch('/manifest.json')
    const manifest: Manifest = await response.json()
    
    console.log(`📦 Starting validation of ${manifest.items.length} items...`)
    const startTime = Date.now()
    
    const validItems = await filterValidManifestItems(manifest.items, MEDIA_BASE_URL)
    
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    
    console.log(`✅ Validation complete in ${duration.toFixed(2)}s`)
    console.log(`📊 Results: ${validItems.length}/${manifest.items.length} items valid (${((validItems.length / manifest.items.length) * 100).toFixed(1)}%)`)
    
    const cacheStats = getValidationCacheStats()
    console.log(`📊 Cache: ${cacheStats.size} entries`)
    
    return validItems
    
  } catch (error) {
    console.error('❌ Full validation test failed:', error)
  }
}

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).testValidation = testValidation;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).testFullValidation = testFullValidation;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).getValidationCacheStats = getValidationCacheStats;
}