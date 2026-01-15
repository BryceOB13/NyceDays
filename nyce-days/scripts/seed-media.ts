import { createClient } from '@supabase/supabase-js'
import { parseManifest } from '../lib/media/parse-manifest'
import type { Manifest } from '../types/media'

// Load manifest - adjust path as needed
// eslint-disable-next-line @typescript-eslint/no-require-imports
const manifest: Manifest = require('../manifest.json')

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedMedia() {
  const items = parseManifest(manifest)

  console.log(`Seeding ${items.length} media items...`)

  for (const item of items) {
    const { error } = await supabase.from('media_items').upsert({
      id: item.id,
      position: item.position,
      thumb_url: item.variants.thumb.url,
      thumb_width: item.variants.thumb.width,
      thumb_height: item.variants.thumb.height,
      grid_url: item.variants.grid.url,
      grid_width: item.variants.grid.width,
      grid_height: item.variants.grid.height,
      full_url: item.variants.full.url,
      full_width: item.variants.full.width,
      full_height: item.variants.full.height,
    }, { onConflict: 'id' })

    if (error) {
      console.error(`Error seeding ${item.id}:`, error)
    } else {
      console.log(`Seeded: ${item.id}`)
    }
  }

  console.log('Done!')
}

seedMedia().catch(console.error)
