"use client"

import { VideoBackground } from "@/components/shared/video-background"
import { FadeUp } from "@/components/shared/fade-up"
import { videos } from "@/lib/videos"

export function AboutMission() {
  return (
    <section className="relative min-h-[80vh] flex items-center py-24">
      <VideoBackground
        desktopSrc={videos.about.mission.desktop}
        mobileSrc={videos.about.mission.mobile}
        overlay="bg-black/60"
      />
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
              Our Mission
            </p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl font-bold text-white">
              Creating Spaces Where Culture Thrives
            </h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              We exist to bridge the gap between brands and communities through authentic 
              experiences. Our mission is to create moments that matter—events that inspire, 
              content that resonates, and partnerships that feel genuine.
            </p>
            <p className="mt-4 text-lg text-white/80 leading-relaxed">
              Every project we take on is an opportunity to bring people together and 
              push culture forward. That&apos;s what drives us.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
