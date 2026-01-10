"use client"

import Link from "next/link"
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
        overlay="bg-nd-black/60"
        className="h-full"
      >
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <FadeUp>
            <h1 className="font-serif text-5xl font-bold text-nd-white md:text-7xl lg:text-8xl">
              NYCE DAYS
            </h1>
          </FadeUp>
          
          <FadeUp delay={0.2}>
            <p className="mt-6 font-sans text-xl text-nd-white/90 md:text-2xl lg:text-3xl">
              Have A Nyce Day!
            </p>
          </FadeUp>
          
          <FadeUp delay={0.4}>
            <Button
              asChild
              size="lg"
              className="mt-10 bg-nd-red px-8 py-6 text-lg font-semibold text-nd-white hover:bg-nd-red/90"
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </FadeUp>
        </div>
      </VideoBackground>
    </section>
  )
}
