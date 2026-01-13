"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Instagram, Twitter } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Events" },
  { href: "/media", label: "Media" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

const socials = [
  { href: "https://instagram.com/nycedays", label: "IG", icon: Instagram },
  { href: "https://twitter.com/nycedays", label: "TW", icon: Twitter },
  { href: "https://tiktok.com/@nycedays", label: "TT" },
]

interface FeaturedEvent {
  title: string
  date: string
  location: string | null
  slug: string
  ticket_url: string | null
}

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const [featuredEvent, setFeaturedEvent] = useState<FeaturedEvent | null>(null)

  // Fetch featured event on mount
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch('/api/events/featured')
        if (res.ok) {
          const data = await res.json()
          if (data) setFeaturedEvent(data)
        }
      } catch {
        // Silently fail
      }
    }
    if (isOpen) fetchEvent()
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-xs bg-nd-black z-[9999] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-end p-5 border-b border-white/10">
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-white/60 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Featured Event Card */}
            {featuredEvent && (
              <div className="p-5 border-b border-white/10">
                <Link
                  href={featuredEvent.ticket_url || `/community`}
                  onClick={onClose}
                  className="block p-4 bg-nd-red rounded-lg text-white"
                >
                  <span className="text-[10px] uppercase tracking-wider opacity-70">
                    Next Event
                  </span>
                  <h3 className="font-serif text-lg mt-0.5 leading-tight">
                    {featuredEvent.title}
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(featuredEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {featuredEvent.location && ` · ${featuredEvent.location}`}
                  </p>
                </Link>
              </div>
            )}

            {/* Nav Links */}
            <nav className="flex-1 py-4 overflow-y-auto">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.03 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`
                        block px-5 py-3 text-base transition-colors
                        ${isActive 
                          ? "text-white font-medium bg-white/10" 
                          : "text-white/60 hover:text-white hover:bg-white/5"
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-5 border-t border-white/10">
              {/* Social Links */}
              <div className="flex items-center gap-2 mb-4">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors text-xs font-medium"
                  >
                    {social.label}
                  </a>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/community"
                onClick={onClose}
                className="block w-full py-3 text-center text-sm font-medium bg-white text-nd-black rounded-full hover:opacity-90 transition-opacity"
              >
                View Events
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
