"use client"

import { VideoBackground } from "@/components/shared/video-background"
import { FadeUp } from "@/components/shared/fade-up"
import { videos } from "@/lib/videos"

export function EventsHeader() {
  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center">
      <VideoBackground
        desktopSrc={videos.events.header.desktop}
        mobileSrc={videos.events.header.mobile}
        overlay="bg-black/50"
      />
      <div className="relative z-10 text-center px-6">
        <FadeUp>
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
            Events
          </p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-wide">
            Community
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            Join us at our upcoming events and become part of the community.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
