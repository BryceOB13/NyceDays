import { GalleryGrid } from "@/components/media/gallery-grid"

export const metadata = {
  title: "Media | Nyce Days",
  description: "Browse photos and videos from Nyce Days events, behind the scenes, and community moments.",
}

export default function MediaPage() {
  return (
    <div className="bg-white dark:bg-black -mt-16 pt-16">
      <GalleryGrid />
    </div>
  )
}
