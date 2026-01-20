import { MediaHeader } from "@/components/media/media-header"
import { GalleryGrid } from "@/components/media/gallery-grid"

export const metadata = {
  title: "Media | Nyce Days",
  description: "Browse photos and videos from Nyce Days events, behind the scenes, and community moments.",
}

export default function MediaPage() {
  return (
    <main className="bg-background min-h-screen">
      <MediaHeader />
      <div className="container mx-auto px-6 py-16">
        <GalleryGrid />
      </div>
    </main>
  )
}
