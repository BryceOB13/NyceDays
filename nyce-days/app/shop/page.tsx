import { InvitationalSignup } from "@/components/shop/invitational-signup"
import { VideoBackground } from "@/components/shared/video-background"
import { videos } from "@/lib/videos"
import Image from "next/image"

export const metadata = {
  title: "Royalties DJ Signup | Nyce Days",
  description: "Sign up to spin at Royalties — the creative day party. Sunday, May 17 at Seta Oasis, DC.",
  openGraph: {
    title: "Royalties — Think You Got Next?",
    description: "The creative day party. Sunday, May 17 at Seta Oasis, DC. 3–10 PM. 1-hour sets.",
  },
  twitter: {
    title: "Royalties — Think You Got Next?",
    description: "The creative day party. Sunday, May 17 at Seta Oasis, DC. 3–10 PM. 1-hour sets.",
  },
}

const FLYER_URL =
  "https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web/royalties_nycedays_v5.jpeg"

export default async function ShopPage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      {/* Ambient video background */}
      <VideoBackground
        desktopSrc={videos.hero.desktop}
        mobileSrc={videos.hero.mobile}
        poster={videos.hero.poster}
        overlay="bg-gradient-to-b from-[rgba(10,10,10,0.55)] to-[rgba(10,10,10,0.85)]"
      />

      {/* Content — two-pane on desktop, stacked on mobile */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-4 sm:px-6 pt-8 pb-8 md:py-16">
        {/* Flyer */}
        <div className="w-full max-w-[260px] md:max-w-[360px] shrink-0">
          <div className="w-full rounded-md overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            <Image
              src={FLYER_URL}
              alt="Royalties — the creative day party. Sunday, May 17 at Seta Oasis."
              width={800}
              height={1000}
              priority
              className="w-full h-auto"
              sizes="(max-width: 768px) 260px, 360px"
            />
          </div>
        </div>

        {/* Form panel */}
        <InvitationalSignup />
      </div>
    </main>
  )
}
