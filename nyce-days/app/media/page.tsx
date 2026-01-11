import Image from "next/image"
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
      <Section className="bg-background pt-32">
        <FadeUp>
          <p className="text-center font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
            Media
          </p>
          <div className="mt-6 flex justify-center">
            <Image
              src="/logos/stars-white.png"
              alt="Nyce Days"
              width={320}
              height={96}
              className="hidden dark:block object-contain h-24 md:h-28 w-auto"
            />
            <Image
              src="/logos/stars-black.png"
              alt="Nyce Days"
              width={320}
              height={96}
              className="dark:hidden object-contain h-24 md:h-28 w-auto"
            />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground">
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
