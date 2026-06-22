"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingBag, Send, HelpCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Events" },
  { href: "/media", label: "Media" },
]

const iconLinks = [
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/contact", label: "Contact", icon: Send },
  { href: "/about", label: "About", icon: HelpCircle },
]

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links?: unknown
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  if (!isOpen) return null

  const isDark = mounted && resolvedTheme === "dark"
  const bgColor = isDark ? "#0D0D0D" : "#FAF9F7"
  const textColor = isDark ? "#FFFFFF" : "#0D0D0D"
  const mutedColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(13,13,13,0.4)"
  const activeIconBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(13,13,13,0.1)"
  const ctaBg = isDark ? "#FFFFFF" : "#0D0D0D"
  const ctaText = isDark ? "#0D0D0D" : "#FFFFFF"

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: bgColor,
          }}
        >
          {/* Close Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                color: mutedColor,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Links */}
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, textAlign: 'center' }}>
              {navLinks.map((link) => (
                <li key={link.href} style={{ marginBottom: '16px' }}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    style={{
                      display: 'block',
                      padding: '8px 0',
                      fontSize: '28px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: isActive(link.href) ? textColor : mutedColor,
                      textDecoration: 'none',
                      fontWeight: isActive(link.href) ? 500 : 400,
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Icon Links */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginTop: '40px' }}>
              {iconLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    style={{
                      padding: '12px',
                      borderRadius: '50%',
                      color: isActive(link.href) ? textColor : mutedColor,
                      backgroundColor: isActive(link.href) ? activeIconBg : 'transparent',
                    }}
                    aria-label={link.label}
                  >
                    <Icon size={28} />
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* CTA */}
          <div style={{ padding: '24px' }}>
            <Link
              href="/contact"
              onClick={onClose}
              style={{
                display: 'block',
                width: '100%',
                padding: '16px',
                textAlign: 'center',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                backgroundColor: ctaBg,
                color: ctaText,
                borderRadius: '9999px',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              reach out
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
