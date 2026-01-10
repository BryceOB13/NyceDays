import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { MediaGallery } from "@/components/media"
import { getMediaByCategory } from "@/lib/queries"

export const metadata = {
  title: "Media | Nyce Days",
  description: "Browse photos and videos from Nyce Days events, behind the scenes, and community moments.",
}

export default async function MediaPage() {
  const media = await getMediaByCategory()

  return (
    <main>
      <Section className="bg-nd-black pt-32">
        <FadeUp>
          <h1 className="text-center font-serif text-4xl font-bold text-nd-white md:text-5xl lg:text-6xl">
            Media Gallery
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-nd-gray-400">
            Photos and videos from our events, behind the scenes, and community moments.
          </p>
        </FadeUp>

        <div className="mt-12">
          <MediaGallery media={media} />
        </div>
      </Section>
    </main>
  )
}
