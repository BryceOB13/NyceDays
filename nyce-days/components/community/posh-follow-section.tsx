'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function PoshFollowSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#0A0A0A] border-t border-white/10">
      <div className="container mx-auto px-6 text-center">
        
        {/* Posh Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Image
            src="/logos/posh-logo.png"
            alt="Posh"
            width={64}
            height={64}
            className="mx-auto opacity-60"
          />
        </motion.div>
        
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-2xl md:text-3xl text-white mb-8"
        >
          The List Lives Here
        </motion.h2>
        
        {/* CTA */}
        <motion.a
          href="https://posh.vip/g/nyce-days"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="group inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <span className="font-serif text-sm tracking-wide">
            Follow on Posh
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.a>
        
      </div>
    </section>
  )
}
