import { GalleryGrid } from "@/components/media/gallery-grid"
import { parseManifest, shuffleItems } from "@/lib/media/parse-manifest"
import type { Manifest } from "@/types/media"
import fs from "fs"
import path from "path"

export const metadata = {
  title: "Media | Nyce Days",
  description: "Photos and videos from Nyce Days events, behind the scenes, and community moments.",
}

const INITIAL_LOAD = 24

function loadInitialMedia() {
  const manifestPath = path.join(process.cwd(), 'public/manifest.json')
  const raw = fs.readFileSync(manifestPath, 'utf8')
  const manifest: Manifest = JSON.parse(raw)
  const allItems = parseManifest(manifest)
  const shuffled = shuffleItems(allItems)
  return {
    initialItems: shuffled.slice(0, INITIAL_LOAD),
    totalCount: allItems.length,
  }
}

export default function MediaPage() {
  const { initialItems, totalCount } = loadInitialMedia()

  return (
    <div className="bg-white dark:bg-black -mt-16 pt-16">
      <GalleryGrid
        initialItems={initialItems}
        totalCount={totalCount}
      />
    </div>
  )
}
