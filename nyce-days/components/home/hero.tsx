"use client"

import Link from "next/link"
import Image from "next/image"
import { VideoBackground } from "@/components/shared/video-background"
import { FadeUp } from "@/components/shared/fade-up"
import { Button } from "@/components/ui/button"

interface HeroProps {
  videoSrc?: string
  posterSrc?: string
}

export function Hero({
  videoSrc = "/videos/hero-bg.mp4",
  posterSrc = "/images/hero-poster.jpg",
}: HeroProps) {
  return (
    <section className="relative h-screen w-full">
      <VideoBackground
        src={videoSrc}
        poster={posterSrc}
        overlay="bg-black/40"
        className="h-full"
      >
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
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
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                <Link href="/portfolio">View Our Work</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </VideoBackground>
    </section>
  )
}
