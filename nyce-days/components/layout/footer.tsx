"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Linkedin, Twitter, ArrowUp, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"

const navLinksCol1 = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/media", label: "Media" },
]

const navLinksCol2 = [
  { href: "/community", label: "Community" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
]

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setEmail("")
    setIsSubmitting(false)
  }

  return (
    <>
      {/* Gradient Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-background/10 to-transparent" />
      
      <motion.footer 
        className={cn("bg-foreground text-background relative", className)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="absolute top-6 right-6 lg:top-8 lg:right-8 p-3 border border-background/20 rounded-full text-background/60 hover:text-background hover:border-background/40 transition-all duration-300 hover:scale-105"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>

        <div className="mx-auto max-w-7xl px-8 lg:px-12 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Logo and Tagline */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block transition-opacity hover:opacity-70">
                <Image
                  src="/logos/full-white.png"
                  alt="Nyce Days"
                  width={280}
                  height={112}
                  className="dark:hidden object-contain h-24 w-auto"
                />
                <Image
                  src="/logos/full-black.png"
                  alt="Nyce Days"
                  width={280}
                  height={112}
                  className="hidden dark:block object-contain h-24 w-auto"
                />
              </Link>
              <p className="mt-6 font-sans text-sm text-background/60 max-w-xs leading-relaxed">
                Event curation, community marketing, and content creation. 
                Building culture, one experience at a time.
              </p>
            </div>

            {/* Navigation Column 1 */}
            <div>
              <h3 className="text-xs tracking-[0.2em] text-background/40 uppercase mb-6">
                Navigation
              </h3>
              <ul className="space-y-1">
                {navLinksCol1.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-block py-2 font-sans text-sm text-background/70 hover:text-background transition-colors duration-200"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute left-0 -bottom-0.5 w-full h-px bg-background origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation Column 2 */}
            <div>
              <h3 className="text-xs tracking-[0.2em] text-background/40 uppercase mb-6">
                Explore
              </h3>
              <ul className="space-y-1">
                {navLinksCol2.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-block py-2 font-sans text-sm text-background/70 hover:text-background transition-colors duration-200"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute left-0 -bottom-0.5 w-full h-px bg-background origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter and Social */}
            <div>
              <h3 className="text-xs tracking-[0.2em] text-background/40 uppercase mb-6">
                Stay Connected
              </h3>
              
              {/* Newsletter Form */}
              <form onSubmit={handleNewsletterSubmit} className="mb-8">
                <div className="flex items-center border-b border-background/30 focus-within:border-background/60 transition-colors duration-300">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent py-3 text-sm text-background placeholder:text-background/40 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="p-2 text-background/60 hover:text-[#C94A4A] transition-colors duration-300 disabled:opacity-50"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>

              {/* Social Links */}
              <div className="flex gap-5">
                <a
                  href="https://instagram.com/nycedays"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/60 hover:text-[#C94A4A] transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://x.com/nycedaysx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/60 hover:text-[#C94A4A] transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on X"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="https://www.tiktok.com/@nycedays"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/60 hover:text-[#C94A4A] transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on TikTok"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/nyce-days/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/60 hover:text-[#C94A4A] transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 pt-8 border-t border-background/10">
            {/* Home Base */}
            <p className="text-center text-sm text-background/70 tracking-wide mb-2">
              Based in the DMV
            </p>
            {/* Locations */}
            <p className="text-center text-xs text-background/50 tracking-wide mb-4">
              Baltimore · NYC · Philly · Charlotte · LA · SF · Bos · SD
            </p>
            {/* Copyright */}
            <p className="font-sans text-xs text-background/40 text-center tracking-wide">
              © {currentYear} Nyce Days. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </>
  )
}
