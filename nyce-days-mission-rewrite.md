# Mission Section Rewrite - Screenplay Brand Voice

## BRAND VOICE REFERENCE

From "ALL THE DAYS WERE NYCE" screenplay:
- Dreamy, seductive, slightly mysterious
- Second person ("you") - direct address
- Short punchy sentences mixed with flowing prose
- Sense of arrival, belonging, discovery
- Warm but enigmatic

Key phrases to channel:
- "Don't you wish every day was Nyce... forever?"
- "You came seeking. Enjoy the banquet of your conquest."
- "You belong here."
- "These are the Nyce Days that were promised."

## CURRENT COPY (REPLACE)

```
THE MISSION
We Don't Just Throw Events. We Build Culture.
From intimate gatherings to large-scale productions, we create 
moments that matter—experiences that bring communities together 
and push boundaries.
```

## NEW COPY (USE THIS)

```
YOU FOUND US

We Don't Just Throw Events.
We Build Culture.

You came seeking something real. Something that pulls you in and 
doesn't let go. From intimate gatherings to large-scale productions, 
we create the moments you'll carry forever. The ones that matter.

This is what you were looking for.

[SEE WHAT'S NEXT →]  [JOIN THE MOVEMENT]
```

## ALTERNATIVE VERSIONS

**Version A - Mystical**
```
THE INVITATION

You Made It.

Don't you wish every day was Nyce? We create spaces where strangers 
become family. Where the music hits different. Where you finally 
feel like you belong.

You came seeking. Now stay awhile.
```

**Version B - Direct**
```
WHY WE DO THIS

Events End. Culture Lives Forever.

We build experiences that outlast the night. Intimate gatherings. 
Large-scale productions. Moments that rewire how you see community.

You're not a guest here. You're part of it.
```

**Version C - Poetic**
```
THIS IS IT

We Don't Just Throw Events.
We Build Culture.

To live forever in beauty, you must surrender to it. We create 
spaces that welcome you not as guests, but as pieces of something 
larger. Interwoven. Eternal.

These are the Nyce Days that were promised.
```

## IMPLEMENTATION

Update the mission section component:

```tsx
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { VideoBackground } from '@/components/shared/video-background'
import { videos } from '@/lib/videos'

export function MissionSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100])

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <VideoBackground
        desktopSrc={videos.about.mission.desktop}
        mobileSrc={videos.about.mission.mobile}
        overlay="bg-black/60"
      />

      {/* Content */}
      <motion.div 
        style={{ opacity, y }}
        className="relative z-10 container mx-auto px-6 text-center max-w-4xl"
      >
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-block text-[#C94A4A] font-display text-sm uppercase tracking-[0.3em] mb-8"
        >
          You Found Us
        </motion.span>

        {/* Headline - Staggered words */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6"
        >
          We Don't Just Throw Events.
          <br />
          <span className="text-[#C94A4A]">We Build Culture.</span>
        </motion.h2>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-16 h-[2px] bg-[#C94A4A] mx-auto mb-8"
        />

        {/* Body Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-serif text-lg md:text-xl text-white/80 leading-relaxed mb-4 max-w-2xl mx-auto"
        >
          You came seeking something real. Something that pulls you in and 
          doesn't let go. From intimate gatherings to large-scale productions, 
          we create the moments you'll carry forever.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-serif text-lg md:text-xl text-white/60 italic mb-12"
        >
          This is what you were looking for.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#C94A4A] text-white font-display uppercase tracking-wider text-sm rounded-full hover:bg-[#B83D3D] transition-colors"
          >
            See What's Next
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-display uppercase tracking-wider text-sm rounded-full hover:bg-white/10 hover:border-white/50 transition-all"
          >
            Join The Movement
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
```

## INTERACTIVITY ADDED

1. **Scroll-linked opacity/position** - Section fades and moves with scroll
2. **Staggered entrance animations** - Each element animates in sequence
3. **Animated divider** - Red line scales in from center
4. **Hover effects on CTAs** - Arrow moves, backgrounds shift
5. **Parallax video background** - Video moves slower than content

## TYPOGRAPHY RULES

- Eyebrow: `font-display` (Helvetica Condensed), uppercase, tracked out
- Headline: `font-serif` (Georgia), large, mixed case
- "Culture" word: Red accent color
- Body: `font-serif`, slightly muted white, relaxed leading
- Closing line: Italic, more muted
- CTAs: `font-display`, uppercase, tracked

## NO EM DASHES

Replace all instances of `—` with:
- Period and new sentence
- Comma
- "and" or "that"

Before: "moments that matter—experiences that bring"
After: "moments you'll carry forever. The ones that matter."
