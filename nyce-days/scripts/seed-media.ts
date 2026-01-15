import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load manifest - check multiple locations
const possiblePaths = [
  './manifest.json',
  './nyce-days/manifest.json',
  './data/manifest.json',
  path.join(__dirname, '../manifest.json'),
]

const manifestPath = possiblePaths.find(p => fs.existsSync(p))

if (!manifestPath) {
  console.error('❌ manifest.json not found!')
  console.error('Checked:', possiblePaths.join(', '))
  process.exit(1)
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BASE_MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/images`

async function seedMedia() {
  console.log(`\n📦 Seeding ${manifest.items.length} media items...`)
  console.log(`📍 Base URL: ${BASE_MEDIA_URL}\n`)

  let success = 0
  let failed = 0

  for (let i = 0; i < manifest.items.length; i++) {
    const item = manifest.items[i]
    
    // Generate stable ID from filename
    const id = item.relative_source
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase()

    const record = {
      id,
      position: i,
      thumb_url: `${BASE_MEDIA_URL}/${item.outputs.thumb.relative_path}`,
      thumb_width: item.outputs.thumb.width,
      thumb_height: item.outputs.thumb.height,
      grid_url: `${BASE_MEDIA_URL}/${item.outputs.grid.relative_path}`,
      grid_width: item.outputs.grid.width,
      grid_height: item.outputs.grid.height,
      full_url: `${BASE_MEDIA_URL}/${item.outputs.full.relative_path}`,
      full_width: item.outputs.full.width,
      full_height: item.outputs.full.height,
    }

    const { error } = await supabase
      .from('media_items')
      .upsert(record, { onConflict: 'id' })

    if (error) {
      console.error(`❌ ${id}: ${error.message}`)
      failed++
    } else {
      console.log(`✓ ${i + 1}/${manifest.items.length} - ${id}`)
      success++
    }
  }

  console.log(`\n✅ Done! ${success} succeeded, ${failed} failed`)
}

seedMedia().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
