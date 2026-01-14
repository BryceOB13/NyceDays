'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function PoshFollowSection() {
  return (
    <section className="py-16 lg:py-24 bg-[#0A0A0A] border-t border-white/10">
      <div className="container mx-auto px-6 text-center max-w-2xl">
        
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-nd-red font-sans text-xs uppercase tracking-[0.3em]"
        >
          Stay In The Loop
        </motion.span>
        
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl md:text-4xl text-white mt-4 mb-4"
        >
          Never Miss A Nyce Day
        </motion.h2>
        
        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-serif text-white/50 mb-8"
        >
          Follow us on Posh for instant access to events, RSVPs, 
          and exclusive drops before they hit social.
        </motion.p>
        
        {/* CTA Button */}
        <motion.a
          href="https://posh.vip/p/nycedays"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-nd-red text-white font-medium uppercase tracking-wider text-sm rounded-full hover:bg-[#B83D3D] transition-all"
        >
          Follow on Posh
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.a>
        
        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/40 text-sm font-serif"
        >
          <span className="flex items-center gap-2">
            <span className="text-nd-red">★</span> First to know
          </span>
          <span className="flex items-center gap-2">
            <span className="text-nd-red">★</span> Easy RSVPs
          </span>
          <span className="flex items-center gap-2">
            <span className="text-nd-red">★</span> Ticket access
          </span>
        </motion.div>
        
      </div>
    </section>
  )
}
