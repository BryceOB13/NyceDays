"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronDown } from "lucide-react"
import { VideoBackground } from "@/components/shared/video-background"
import { FadeUp } from "@/components/shared/fade-up"
import { videos } from "@/lib/videos"
import { motion } from "framer-motion"

export function Hero() {
  const [scrollUnlocked, setScrollUnlocked] = useState(false)

  // Lock scroll on mount, unlock when button clicked
  useEffect(() => {
    if (!scrollUnlocked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [scrollUnlocked])

  const scrollToContent = () => {
    setScrollUnlocked(true)
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      })
    }, 50)
  }

  return (
    <section className="relative h-screen w-full overflow-visible">
      <VideoBackground
        desktopSrc={videos.hero.desktop}
        mobileSrc={videos.hero.mobile}
        tabletSrc={videos.hero.square}
        overlay="bg-black/40"
      />
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center pb-32">
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
            <Link 
              href="/community"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 hover:gap-3 hover:px-10 transition-all duration-300 shadow-lg"
            >
              Join The Movement
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 text-white/70 font-medium text-sm hover:text-white transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </FadeUp>

        {/* Learn More - Scroll Down */}
        <FadeUp delay={0.5}>
          <button
            onClick={scrollToContent}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <span className="text-sm uppercase tracking-widest font-medium">Learn More</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-8 h-8" />
            </motion.div>
          </button>
        </FadeUp>
      </div>
    </section>
  )
}
