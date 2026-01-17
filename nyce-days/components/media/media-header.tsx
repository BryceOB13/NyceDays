"use client"

import { VideoBackground } from "@/components/shared/video-background"
import { FadeUp } from "@/components/shared/fade-up"
import { videos } from "@/lib/videos"

export function MediaHeader() {
  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center">
      <VideoBackground
        desktopSrc={videos.media.header.desktop}
        mobileSrc={videos.media.header.mobile}
        poster={videos.media.header.poster}
        overlay="bg-black/50"
      />
      <div className="relative z-10 text-center px-6">
        <FadeUp>
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
            Gallery
          </p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-wide">
            Media
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            Photos and videos from our events, behind the scenes, and community moments.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
