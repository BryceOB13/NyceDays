"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { VideoBackground } from "@/components/shared/video-background"
import { videos } from "@/lib/videos"
import { ArrowRight } from "lucide-react"

export function AboutMission() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center py-32 overflow-hidden">
      <VideoBackground
        desktopSrc={videos.about.mission.desktop}
        mobileSrc={videos.about.mission.mobile}
        overlay="bg-black/60"
      />
      
      <motion.div 
        className="relative z-10 container mx-auto px-6"
        style={{ y, opacity }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.p 
            className="font-sans text-sm font-medium uppercase tracking-[0.3em] text-nd-red mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            You Found Us
          </motion.p>

          {/* Headline */}
          <motion.h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            We Don&apos;t Just Throw Events.
            <br />
            <span className="text-nd-red">We Build Culture.</span>
          </motion.h2>

          {/* Animated line */}
          <motion.div 
            className="w-16 h-[2px] bg-nd-red mx-auto mb-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Body Copy */}
          <motion.p 
            className="font-serif text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            You came seeking something real. Something that pulls you in and 
            doesn&apos;t let go. From intimate gatherings to large-scale productions, 
            we create the moments you&apos;ll carry forever. The ones that matter.
          </motion.p>

          <motion.p
            className="font-serif text-lg md:text-xl text-white/60 italic mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            This is what you were looking for.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href="/community"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-nd-red text-white font-medium uppercase tracking-wider text-sm rounded-full hover:bg-nd-red/90 transition-all"
            >
              See What&apos;s Next
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-medium uppercase tracking-wider text-sm rounded-full hover:bg-white/10 hover:border-white/50 transition-all"
            >
              Join The Movement
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
