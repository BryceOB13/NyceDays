'use client'

import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'

const values = [
  {
    number: '01',
    title: 'Community First',
    description: "We don't build audiences. We build families.",
  },
  {
    number: '02',
    title: 'No Shortcuts',
    description: "If it's not memorable, we don't ship it.",
  },
  {
    number: '03',
    title: 'Culture Over Clout',
    description: 'We move with the culture, not behind it.',
  },
  {
    number: '04',
    title: 'Real Ones Only',
    description: 'We partner with people, not logos.',
  },
]

export function ValuesSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0A0A]">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-nd-red font-sans text-xs uppercase tracking-[0.3em]"
          >
            What We Stand On
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mt-4 mb-6"
          >
            The Principles That Guide Us
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-serif text-lg text-white/50 max-w-xl mx-auto"
          >
            These aren&apos;t corporate values we put on a wall. 
            They&apos;re the reasons people keep coming back.
          </motion.p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-8 lg:p-10 border border-white/10 rounded-lg hover:border-nd-red/50 hover:bg-nd-red/5 transition-all duration-300"
            >
              {/* Number - Large background */}
              <span className="absolute top-6 right-6 font-sans text-6xl lg:text-7xl font-bold text-white/5 group-hover:text-nd-red/20 transition-colors duration-300">
                {value.number}
              </span>
              
              {/* Content */}
              <div className="relative z-10">
                <span className="font-sans text-xs text-nd-red uppercase tracking-wider">
                  {value.number}
                </span>
                <h3 className="font-sans text-xl lg:text-2xl uppercase tracking-wide text-white mt-2 mb-4">
                  {value.title}
                </h3>
                <p className="font-serif text-white/60 leading-relaxed">
                  {value.description}
                </p>
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-nd-red scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-lg" />
            </motion.div>
          ))}
        </div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Divider */}
          <div className="w-16 h-[1px] bg-white/20 mx-auto mb-8" />
          
          <p className="font-serif text-white/40 mb-4">
            See it in action.
          </p>
          
          <a
            href="https://instagram.com/nycedays"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3"
          >
            {/* Instagram Icon */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 group-hover:border-nd-red group-hover:bg-nd-red transition-all duration-300">
              <Instagram className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            </div>
            
            <span className="font-sans text-lg uppercase tracking-wide text-white/60 group-hover:text-white transition-colors">
              @nycedays
            </span>
            
            <svg className="w-4 h-4 text-white/40 group-hover:text-nd-red group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  )
}
