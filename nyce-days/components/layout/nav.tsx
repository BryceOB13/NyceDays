"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
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
  const { resolvedTheme } = useTheme()

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-background/80 backdrop-blur-md",
        "border-b border-border/40",
        "transition-all duration-300",
        className
      )}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Stars */}
          <Link 
            href="/" 
            className="flex items-center transition-opacity hover:opacity-70"
            aria-label="Nyce Days - Home"
          >
            {/* Dark mode: white stars */}
            <Image
              src="/logos/stars-white.png"
              alt="Nyce Days"
              width={180}
              height={48}
              className="hidden dark:block object-contain h-12 w-auto"
              priority
            />
            {/* Light mode: black stars */}
            <Image
              src="/logos/stars-black.png"
              alt="Nyce Days"
              width={180}
              height={48}
              className="dark:hidden object-contain h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 font-sans text-sm tracking-wide",
                  "text-foreground/70 transition-colors duration-200",
                  "hover:text-foreground",
                  "after:absolute after:bottom-1 after:left-4 after:right-4",
                  "after:h-px after:bg-foreground after:origin-left",
                  "after:scale-x-0 after:transition-transform after:duration-200",
                  "hover:after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <div className="ml-2 pl-2 border-l border-border/40">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-foreground/70 hover:text-foreground hover:bg-transparent"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
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
