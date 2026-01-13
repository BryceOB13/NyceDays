"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ContactForm } from "./contact-form"
import { VideoBackground } from "@/components/shared/video-background"
import { videos } from "@/lib/videos"

export function ContactPageContent() {
  return (
    <main className="min-h-screen flex flex-col relative">
      {/* Video Background */}
      <VideoBackground
        desktopSrc={videos.media.header.desktop}
        mobileSrc={videos.media.header.mobile}
        overlay="bg-black/40"
      />

      {/* Full Screen Form Section */}
      <section className="relative z-10 flex-1 flex items-center justify-center px-0 sm:px-4 py-0 sm:py-8">
        {/* Dark card container - full screen on mobile */}
        <motion.div 
          className="w-full h-full sm:h-auto sm:max-w-xl bg-black/80 sm:bg-black/70 backdrop-blur-md sm:rounded-2xl p-6 sm:p-8 md:p-10 sm:border sm:border-white/10 flex flex-col justify-center min-h-screen sm:min-h-0"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Stars Logo - Big with animation */}
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <Image
              src="/logos/stars-white.png"
              alt="Nyce Days"
              width={200}
              height={60}
              className="h-14 sm:h-16 md:h-20 w-auto object-contain"
            />
          </motion.div>

          {/* Get In Touch text */}
          <motion.p 
            className="text-center font-sans text-xs font-medium uppercase tracking-widest text-nd-red mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Get In Touch
          </motion.p>

          {/* Form with stagger animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ContactForm variant="dark" />
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
