"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ArrowUp } from "lucide-react"
import { Instagram, Twitter } from "lucide-react"

const pages = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/media', label: 'Media' },
  { href: '/community', label: 'Events' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
]

const socials = [
  { href: 'https://instagram.com/nycedays', label: 'IG', icon: Instagram },
  { href: 'https://x.com/nycedaysx', label: 'TW', icon: Twitter },
  { href: 'https://tiktok.com/@nycedays', label: 'TT', icon: null },
]

const cities = ['Baltimore', 'NYC', 'Philly', 'Charlotte', 'LA', 'SF', 'Bos', 'SD']

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

export function Footer() {
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.replace(/\D/g, '').length !== 10) return

    setIsSubmitting(true)
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          source: 'footer',
          sms_consent: true,
        }),
      })
      setIsSuccess(true)
      setPhone("")
      setTimeout(() => setIsSuccess(false), 3000)
    } catch {
      // Silent fail
    }
    setIsSubmitting(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      
      <motion.footer 
        className="bg-secondary pt-16 pb-8 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="absolute top-6 right-6 lg:top-8 lg:right-8 p-3 border border-foreground/20 rounded-full text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-all duration-300 hover:scale-105"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>

        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-12 text-center md:text-left">
            
            {/* Brand Column */}
            <div className="flex flex-col items-center md:items-start">
              <Link href="/about" className="inline-block mb-4">
                <Image
                  src="/logos/full-black.png"
                  alt="Nyce Days"
                  width={200}
                  height={80}
                  className="dark:hidden h-16 w-auto"
                />
                <Image
                  src="/logos/full-white.png"
                  alt="Nyce Days"
                  width={200}
                  height={80}
                  className="hidden dark:block h-16 w-auto"
                />
              </Link>
              <p className="font-serif text-foreground/60 text-sm leading-relaxed mb-4">
                We start movements.<br />
                We build community.
              </p>
              <p className="font-serif text-foreground/40 text-xs italic">
                Have A Nyce Day.
              </p>
            </div>

            {/* Pages & Socials Column */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/40 mb-4">
                Pages
              </h4>
              <nav className="flex flex-col gap-2 mb-8">
                {pages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="font-serif text-foreground/70 hover:text-foreground transition-colors text-sm"
                  >
                    {page.label}
                  </Link>
                ))}
              </nav>
              
              {/* Socials */}
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-foreground/20 text-foreground/50 hover:text-nd-red hover:border-nd-red transition-colors"
                  >
                    {social.icon ? (
                      <social.icon className="w-4 h-4" />
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
              <p className="font-serif text-foreground/40 text-sm">@nycedays</p>
            </div>

            {/* Get On The List Column */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/40 mb-4">
                Get On The List
              </h4>

              {/* Phone Input */}
              <form onSubmit={handleSubmit} className="flex gap-2 mb-6 w-full max-w-xs">
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="flex-1 px-4 py-3 bg-background border border-foreground/10 rounded-lg text-sm font-serif focus:outline-none focus:border-nd-red/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              
              {isSuccess && (
                <p className="text-nd-red text-xs mb-4 font-serif">You&apos;re on the list.</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-foreground/10 pt-8">
            <div className="text-center">
              <p className="font-sans text-xs uppercase tracking-wider text-foreground/40 mb-2">
                Based in the DMV
              </p>
              <p className="font-serif text-foreground/40 text-sm mb-4">
                {cities.join(' · ')}
              </p>
              <p className="font-serif text-foreground/30 text-xs">
                © {new Date().getFullYear()} Nyce Days. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </motion.footer>
    </>
  )
}
