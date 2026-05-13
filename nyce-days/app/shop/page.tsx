import { InvitationalSignup } from "@/components/shop/invitational-signup"
import { VideoBackground } from "@/components/shared/video-background"
import { videos } from "@/lib/videos"
import Image from "next/image"

export const metadata = {
  title: "The Yard DJ Signup | Nyce Days",
  description: "Sign up to spin at The Yard — a Nyce Days cookout. Sunday, May 24 at Rock Creek Park.",
  openGraph: {
    title: "The Yard — Think You Got Next?",
    description: "A Nyce Days cookout. Sunday, May 24 at Rock Creek Park. 3–7 PM. 1-hour sets.",
  },
  twitter: {
    title: "The Yard — Think You Got Next?",
    description: "A Nyce Days cookout. Sunday, May 24 at Rock Creek Park. 3–7 PM. 1-hour sets.",
  },
}

const FLYER_URL =
  "https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web/TheYard_NyceDays_Updated.jpeg"

export default async function ShopPage() {
  return (
    <main className="relative h-[calc(100dvh-4rem)] overflow-hidden">
      {/* Ambient video background */}
      <VideoBackground
        desktopSrc={videos.hero.desktop}
        mobileSrc={videos.hero.mobile}
        poster={videos.hero.poster}
        overlay="bg-gradient-to-b from-[rgba(10,10,10,0.55)] to-[rgba(10,10,10,0.85)]"
      />

      {/* Content — two-pane on desktop, form-only on mobile */}
      <div className="relative z-10 h-[calc(100dvh-4rem)] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-4 sm:px-6 py-4 md:py-8">
        {/* Flyer — hidden on mobile, shown on desktop */}
        <div className="hidden md:block w-full max-w-[360px] shrink-0">
          <div className="w-full rounded-md overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            <Image
              src={FLYER_URL}
              alt="The Yard — a Nyce Days cookout. Sunday, May 24 at Rock Creek Park."
              width={800}
              height={1000}
              priority
              className="w-full h-auto"
              sizes="360px"
            />
          </div>
        </div>

        {/* Form panel — scrollable on mobile */}
        <div className="w-full md:w-auto overflow-y-auto max-h-[calc(100dvh-5rem)] md:max-h-none">
          <InvitationalSignup />
        </div>
      </div>
    </main>
  )
}
