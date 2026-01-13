import { Section } from "@/components/shared/section"
import { MediaGallery } from "@/components/media"
import { MediaHeader } from "@/components/media/media-header"
import { getMediaByCategory } from "@/lib/queries"

export const metadata = {
  title: "Media | Nyce Days",
  description: "Browse photos and videos from Nyce Days events, behind the scenes, and community moments.",
}

export default async function MediaPage() {
  const media = await getMediaByCategory()

  return (
    <main>
      {/* Video Header */}
      <MediaHeader />

      <Section className="bg-background">
        <MediaGallery media={media} />
      </Section>
    </main>
  )
}
