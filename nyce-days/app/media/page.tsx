import { GalleryGrid } from "@/components/media/gallery-grid"

export const metadata = {
  title: "Media | Nyce Days",
  description: "Browse photos and videos from Nyce Days events, behind the scenes, and community moments.",
}

export default function MediaPage() {
  return (
    <main className="bg-background min-h-screen">
      <GalleryGrid />
    </main>
  )
}
