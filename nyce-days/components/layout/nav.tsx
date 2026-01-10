"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "./mobile-nav"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/media", label: "Media" },
  { href: "/community", label: "Community" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
]

interface NavProps {
  className?: string
}

export function Nav({ className }: NavProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 bg-nd-black/90 backdrop-blur-sm", className)}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-serif text-xl font-bold text-nd-white">
              NYCE DAYS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm text-nd-gray-300 transition-colors hover:text-nd-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-nd-white hover:bg-nd-gray-800"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        links={navLinks}
      />
    </header>
  )
}
