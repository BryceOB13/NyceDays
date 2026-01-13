"use client"

import Link from "next/link"
import Image from "next/image"
import { VideoBackground } from "@/components/shared/video-background"
import { FadeUp } from "@/components/shared/fade-up"
import { Button } from "@/components/ui/button"
import { videos } from "@/lib/videos"

export function Hero() {
  return (
    <section className="relative h-screen w-full">
      <VideoBackground
        desktopSrc={videos.hero.desktop}
        mobileSrc={videos.hero.mobile}
        tabletSrc={videos.hero.square}
        overlay="bg-black/40"
      />
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Full Logo */}
        <FadeUp>
          <Image
            src="/logos/full-white.png"
            alt="Nyce Days - Have A Nyce Day"
            width={600}
            height={240}
            className="h-36 md:h-48 lg:h-60 w-auto object-contain drop-shadow-2xl"
            priority
          />
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <p className="mt-6 font-serif text-lg md:text-xl text-white/80 italic tracking-wide">
            Building culture, one experience at a time.
          </p>
        </FadeUp>
        
        <FadeUp delay={0.3}>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="xl"
              className="bg-white text-black hover:bg-white/90 hover:scale-[1.02] shadow-lg"
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-white/50 text-white hover:bg-white/10 hover:border-white"
            >
              <Link href="/portfolio">View Our Work</Link>
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
