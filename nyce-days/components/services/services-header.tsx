"use client"

import { VideoBackground } from "@/components/shared/video-background"
import { FadeUp } from "@/components/shared/fade-up"
import { videos } from "@/lib/videos"

export function ServicesHeader() {
  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center">
      <VideoBackground
        desktopSrc={videos.services.desktop}
        mobileSrc={videos.services.mobile}
        poster={videos.services.poster}
        overlay="bg-black/60"
      />
      <div className="relative z-10 text-center px-6">
        <FadeUp>
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
            What We Do
          </p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-wide">
            Services
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            Full-service creative solutions for brands looking to connect with culture and community.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
