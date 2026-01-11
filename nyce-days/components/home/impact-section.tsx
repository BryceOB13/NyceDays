"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion"

interface Stat {
  value: number
  suffix: string
  label: string
  detail: string
}

const stats: Stat[] = [
  {
    value: 100,
    suffix: "K+",
    label: "Monthly Impressions",
    detail: "Social reach across platforms",
  },
  {
    value: 10,
    suffix: "+",
    label: "Team Members",
    detail: "Creatives & collaborators",
  },
  {
    value: 3,
    suffix: "",
    label: "Markets",
    detail: "DMV, NYC, ATL",
  },
]

const capabilities = [
  "Event Curation",
  "Brand Activations",
  "Community Marketing",
  "VHS Content Creation",
  "Interview Series",
  "Social Strategy",
]

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion) {
      setCount(value)
      return
    }

    let start = 0
    const duration = 2000
    const increment = value / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [inView, value, prefersReducedMotion])

  return (
    <span className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}


function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const prefersReducedMotion = useReducedMotion()

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.15, y: y * 0.15 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

export function ImpactSectionPremium() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" })
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Lazy load video
  const videoInView = useInView(videoRef, { once: true, margin: "200px" })

  useEffect(() => {
    if (videoInView && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked, that's fine
      })
    }
  }, [videoInView])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-nd-black"
    >
      {/* Video Background with Parallax */}
      <motion.div
        style={{ y: prefersReducedMotion ? 0 : videoY }}
        className="absolute inset-0 z-0"
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          poster="/images/founder.jpg"
          className="h-full w-full object-cover opacity-40"
        >
          <source src="/videos/events-reel.webm" type="video/webm" />
          <source src="/videos/events-reel.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-nd-black/60 via-nd-black/40 to-nd-black" />
      </motion.div>

      {/* VHS Grain Texture */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]">
        <div
          className="animate-grain h-[200%] w-[200%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity: prefersReducedMotion ? 1 : opacity }}
        className="relative z-20 mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32"
      >
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 lg:mb-24"
        >
          <span className="label-caps mb-4 block text-nd-red">Our Impact</span>
          <h2 className="heading-lg max-w-3xl text-nd-cream">
            Building moments that people carry with them
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div ref={statsRef} className="mb-20 grid gap-6 md:grid-cols-3 lg:mb-28">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-nd-red/50 hover:bg-white/10"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-nd-red/0 to-nd-red/0 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
              
              <p className="font-serif text-5xl font-bold text-nd-cream md:text-6xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={statsInView} />
              </p>
              <p className="mt-2 font-sans text-sm font-medium uppercase tracking-widest text-nd-cream/90">
                {stat.label}
              </p>
              <p className="mt-1 font-sans text-sm text-nd-cream/60">
                {stat.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Story */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="heading-md text-nd-cream">The Story</h3>
            <div className="space-y-4 text-nd-cream/80">
              <p className="body-lg">
                What started as local events in the DMV has grown into a creative platform 
                spanning three markets. We don&apos;t just throw parties — we build moments that 
                people carry with them.
              </p>
              <p className="body-md">
                From intimate gatherings to large-scale activations, every Nyce Days experience 
                is crafted with intention. Our community-first approach has helped us build 
                authentic connections with brands and audiences alike.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <MagneticButton className="rounded-full bg-nd-red px-6 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-nd-red/90">
                Our Story
              </MagneticButton>
              <MagneticButton className="rounded-full border border-nd-cream/30 px-6 py-3 font-sans text-sm font-medium text-nd-cream transition-colors hover:border-nd-cream/60 hover:bg-nd-cream/10">
                View Portfolio
              </MagneticButton>
            </div>
          </motion.div>


          {/* Right: Capabilities */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="heading-md mb-6 text-nd-cream">What We Do</h3>
            <ul className="space-y-3">
              {capabilities.map((item, i) => (
                <motion.li
                  key={item}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                  className="group flex items-center gap-3 border-b border-white/10 py-3 transition-colors hover:border-nd-red/50"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-nd-red transition-transform group-hover:scale-150" />
                  <span className="font-sans text-nd-cream/80 transition-colors group-hover:text-nd-cream">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Featured Series Teaser */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-sm lg:mt-28 lg:p-12"
        >
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <span className="label-caps mb-2 block text-nd-red">Featured Series</span>
              <h3 className="heading-md text-nd-cream">Rolling with Nyce Days</h3>
              <p className="mt-2 max-w-xl text-nd-cream/70">
                Our interview series capturing authentic conversations with creatives, 
                entrepreneurs, and culture-makers across the DMV and beyond.
              </p>
            </div>
            <MagneticButton className="shrink-0 rounded-full bg-nd-cream px-6 py-3 font-sans text-sm font-medium text-nd-black transition-colors hover:bg-nd-cream/90">
              Watch Episodes
            </MagneticButton>
          </div>
        </motion.div>
      </motion.div>

      {/* VHS Scanlines */}
      <div className="vhs-scanlines pointer-events-none absolute inset-0 z-30" />
    </section>
  )
}
