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
    <section className="relative h-screen w-full">
      <VideoBackground
        desktopSrc={videos.hero.desktop}
        mobileSrc={videos.hero.mobile}
        tabletSrc={videos.hero.square}
        poster={videos.hero.poster}
        overlay="bg-black/40"
      />
      
      <div className="relative z-30 flex h-full flex-col items-center justify-center px-6 text-center">
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
            Building community, one experience at a time.
          </p>
        </FadeUp>
        
        <FadeUp delay={0.3}>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:gap-4 items-center">
            <Link 
              href="/community"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 hover:gap-3 hover:px-10 transition-all duration-300 shadow-lg touch-manipulation w-full sm:w-auto"
            >
              Join The Movement
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white/70 font-medium text-base hover:text-white transition-colors touch-manipulation min-h-[48px] w-full sm:w-auto border border-white/20 rounded-full hover:border-white/40"
            >
              Get In Touch
            </Link>
          </div>
        </FadeUp>
      </div>

      {/* Learn More - Scroll Down - Fixed at bottom */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors touch-manipulation min-h-[48px] min-w-[48px]"
      >
        <span className="text-sm uppercase tracking-widest font-medium text-center">Learn More</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-7 h-7" />
        </motion.div>
      </motion.button>
    </section>
  )
}
