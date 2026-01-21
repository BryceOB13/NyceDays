import { NextResponse } from 'next/server'
import { filterValidManifestItems } from '@/lib/media/validate-images'
import type { Manifest } from '@/types/media'
import fs from 'fs'
import path from 'path'

const MEDIA_BASE_URL = 'https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web'

export async function GET() {
  try {
    // Load manifest from public directory
    const manifestPath = path.join(process.cwd(), 'public/manifest.json')
    const manifestData = fs.readFileSync(manifestPath, 'utf8')
    const manifest: Manifest = JSON.parse(manifestData)
    
    console.log(`🔍 Validating ${manifest.items.length} manifest items...`)
    const startTime = Date.now()
    
    // Validate all items
    const validItems = await filterValidManifestItems(manifest.items, MEDIA_BASE_URL)
    
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    
    const stats = {
      total: manifest.items.length,
      valid: validItems.length,
      invalid: manifest.items.length - validItems.length,
      validationTime: duration,
      successRate: ((validItems.length / manifest.items.length) * 100).toFixed(1) + '%'
    }
    
    console.log(`✅ Validation complete:`, stats)
    
    return NextResponse.json({
      success: true,
      stats,
      validItems: validItems.slice(0, 10), // Return first 10 for preview
      message: `Validated ${validItems.length}/${manifest.items.length} images successfully`
    })
    
  } catch (error) {
    console.error('❌ Validation API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to validate images'
    }, { status: 500 })
  }
}