import { Section } from "@/components/shared/section"
import { MediaGallery } from "@/components/media"
import { MediaHeader } from "@/components/media/media-header"
import { getRandomMedia } from "@/lib/queries"

export const metadata = {
  title: "Media | Nyce Days",
  description: "Browse photos and videos from Nyce Days events, behind the scenes, and community moments.",
}

// Disable caching to get fresh random results
export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const media = await getRandomMedia(24)

  return (
    <main>
      {/* Video Header */}
      <MediaHeader />

      <Section className="bg-background">
        <MediaGallery media={media} enableShuffle />
      </Section>
    </main>
  )
}
