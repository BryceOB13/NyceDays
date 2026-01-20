"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { Instagram, Twitter } from "lucide-react"

const pages = [
  { href: '/community', label: 'Events' },
  { href: '/media', label: 'Media' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

const socials = [
  { href: 'https://instagram.com/nycedays', label: 'IG', icon: Instagram },
  { href: 'https://x.com/nycedaysx', label: 'TW', icon: Twitter },
  { href: 'https://tiktok.com/@nycedays', label: 'TT', icon: null },
]

const cities = ['Baltimore', 'NYC', 'Philly', 'Charlotte', 'LA', 'SF', 'Bos', 'SD']

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      
      <motion.footer 
        className="bg-secondary py-12 lg:py-16 relative"
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

        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          
          {/* Centered Content */}
          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Logo */}
            <Link href="/about" className="inline-block">
              <Image
                src="/logos/full-black.png"
                alt="Nyce Days"
                width={320}
                height={128}
                className="dark:hidden h-24 lg:h-28 w-auto"
              />
              <Image
                src="/logos/full-white.png"
                alt="Nyce Days"
                width={320}
                height={128}
                className="hidden dark:block h-24 lg:h-28 w-auto"
              />
            </Link>

            {/* Pages Navigation */}
            <nav className="flex flex-wrap items-center justify-center gap-2 text-foreground/70">
              {pages.map((page, index) => (
                <div key={page.href} className="flex items-center gap-2">
                  <Link
                    href={page.href}
                    className="font-serif hover:text-foreground transition-colors text-sm lg:text-base"
                  >
                    {page.label}
                  </Link>
                  {index < pages.length - 1 && (
                    <span className="text-foreground/30 text-xs">·</span>
                  )}
                </div>
              ))}
            </nav>

            {/* Socials */}
            <div className="flex items-center gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/50 hover:text-foreground transition-colors"
                >
                  {social.icon ? (
                    <social.icon className="w-5 h-5" />
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-foreground/10 mt-8 pt-6">
            <div className="text-center space-y-2">
              <p className="font-sans text-xs uppercase tracking-wider text-foreground/40">
                Based in the DMV
              </p>
              <p className="font-serif text-foreground/40 text-sm">
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
