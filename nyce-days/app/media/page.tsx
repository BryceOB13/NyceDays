import { MediaGallery } from "@/components/media"
import { getRandomMedia } from "@/lib/queries"

export const metadata = {
  title: "Media | Nyce Days",
  description: "Browse photos and videos from Nyce Days events, behind the scenes, and community moments.",
}

// Disable caching to get fresh random results
export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const media = await getRandomMedia(60)

  return (
    <main className="bg-background min-h-screen pt-16">
      <MediaGallery media={media} enableShuffle />
    </main>
  )
}
