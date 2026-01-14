'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export function PoshFollowSection() {
  return (
    <section className="py-16 lg:py-24 bg-[#0A0A0A] border-t border-white/10">
      <div className="container mx-auto px-6 text-center max-w-2xl">
        
        {/* Posh Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <Image
            src="/logos/posh-logo.png"
            alt="Posh"
            width={80}
            height={80}
            className="mx-auto"
          />
        </motion.div>
        
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl md:text-4xl text-white mb-4"
        >
          Never Miss A Nyce Day
        </motion.h2>
        
        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-serif text-white/50 mb-8 max-w-md mx-auto"
        >
          Follow us on Posh for instant access to events, RSVPs, 
          and exclusive drops before they hit social.
        </motion.p>
        
        {/* CTA Button - Sleek */}
        <motion.a
          href="https://posh.vip/p/nycedays"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="group inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors"
        >
          <span className="font-serif text-lg border-b border-white/30 group-hover:border-white pb-1 transition-colors">
            Follow on Posh
          </span>
          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </motion.a>
        
        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/30 text-sm font-serif"
        >
          <span className="flex items-center gap-2">
            <span className="text-nd-red text-xs">★</span> First to know
          </span>
          <span className="flex items-center gap-2">
            <span className="text-nd-red text-xs">★</span> Easy RSVPs
          </span>
          <span className="flex items-center gap-2">
            <span className="text-nd-red text-xs">★</span> Ticket access
          </span>
        </motion.div>
        
      </div>
    </section>
  )
}
