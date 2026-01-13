"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ContactForm } from "./contact-form"

export function ContactPageContent() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Full Screen Form Section */}
      <section className="flex-1 flex items-center justify-center bg-background px-6 pt-4 pb-12">
        <div className="w-full max-w-xl">
          {/* Stars Logo - Big with animation */}
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src="/logos/stars-black.png"
              alt="Nyce Days"
              width={200}
              height={60}
              className="dark:hidden h-16 md:h-20 w-auto object-contain"
            />
            <Image
              src="/logos/stars-white.png"
              alt="Nyce Days"
              width={200}
              height={60}
              className="hidden dark:block h-16 md:h-20 w-auto object-contain"
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
            <ContactForm />
          </motion.div>
        </div>
      </section>
    </main>
  )
}
