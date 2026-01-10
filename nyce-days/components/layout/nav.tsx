"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
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
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-md",
        "border-b border-border/50",
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
              className="hidden dark:block object-contain h-10 w-auto"
              priority
            />
            {/* Light mode: black stars */}
            <Image
              src="/logos/stars-black.png"
              alt="Nyce Days"
              width={180}
              height={48}
              className="dark:hidden object-contain h-10 w-auto"
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
                  "relative px-3 py-2 font-sans text-sm tracking-wide",
                  "transition-colors duration-200",
                  "after:absolute after:bottom-1 after:left-3 after:right-3",
                  "after:h-px after:bg-nd-red after:origin-left",
                  "after:transition-transform after:duration-200",
                  isActive(link.href)
                    ? "text-foreground after:scale-x-100"
                    : "text-muted-foreground hover:text-foreground after:scale-x-0 hover:after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <div className="ml-3 pl-3 border-l border-border/50">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-foreground/70 hover:text-foreground"
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
