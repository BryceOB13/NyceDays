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
        overlay="bg-black/50"
        className="h-full"
      >
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          {/* Full Logo */}
          <FadeUp>
            <Image
              src="/logos/full-white.png"
              alt="Nyce Days - Have A Nyce Day"
              width={500}
              height={200}
              className="h-32 md:h-44 lg:h-56 w-auto object-contain"
              priority
            />
          </FadeUp>
          
          <FadeUp delay={0.2}>
            <Button
              asChild
              size="lg"
              className="mt-12 bg-white text-black px-10 py-6 text-sm font-sans font-medium tracking-wide uppercase hover:bg-white/90 transition-all duration-200"
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </FadeUp>
        </div>
      </VideoBackground>
    </section>
  )
}
