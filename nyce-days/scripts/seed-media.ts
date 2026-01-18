import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

// Load .env.local
config({ path: '.env.local' })

// Load manifest
const possiblePaths = [
  './manifest.json',
  './nyce-days/manifest.json',
  path.join(__dirname, '../manifest.json'),
]

const manifestPath = possiblePaths.find(p => fs.existsSync(p))

if (!manifestPath) {
  console.error('❌ manifest.json not found!')
  process.exit(1)
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Images served from R2 via custom domain
const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || 'https://videos.nycedays.com'
const IMAGES_PREFIX = 'images'

function getR2Url(relativePath: string): string {
  return `${R2_BASE_URL}/${IMAGES_PREFIX}/${relativePath}`
}

async function seedMedia() {
  console.log(`\n📦 Seeding ${manifest.items.length} media items...`)
  console.log(`📍 R2 Base: ${R2_BASE_URL}/${IMAGES_PREFIX}/\n`)

  let success = 0
  let failed = 0

  for (let i = 0; i < manifest.items.length; i++) {
    const item = manifest.items[i]
    
    // Use the grid variant as the main public_url (good balance of quality/size)
    const record = {
      id: randomUUID(),
      filename: item.relative_source,
      storage_path: `${IMAGES_PREFIX}/${item.outputs.grid.relative_path}`,
      public_url: getR2Url(item.outputs.grid.relative_path),
      type: 'image' as const,
      mime_type: 'image/webp',
      width: item.outputs.grid.width,
      height: item.outputs.grid.height,
      sort_order: i,
    }

    const { error } = await supabase
      .from('media')
      .insert(record)

    if (error) {
      console.error(`❌ ${item.relative_source}: ${error.message}`)
      failed++
    } else {
      console.log(`✓ ${i + 1}/${manifest.items.length} - ${item.relative_source}`)
      success++
    }
  }

  console.log(`\n✅ Done! ${success} succeeded, ${failed} failed`)
}

seedMedia().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
