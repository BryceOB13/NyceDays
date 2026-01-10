"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavLink {
  href: string
  label: string
}

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: NavLink[]
}

export function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[300px]",
          "bg-background border-l border-border/50",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border/50">
          {/* Stars logo */}
          <Image
            src="/logos/stars-white.png"
            alt="Nyce Days"
            width={100}
            height={32}
            className="hidden dark:block object-contain h-8 w-auto"
          />
          <Image
            src="/logos/stars-black.png"
            alt="Nyce Days"
            width={100}
            height={32}
            className="dark:hidden object-contain h-8 w-auto"
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 text-foreground/70 hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="px-6 py-8">
          <ul className="space-y-1">
            {links.map((link, index) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "block py-3 px-4 rounded-md font-sans text-base tracking-wide",
                    "transition-all duration-200",
                    isActive(link.href)
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                  style={{
                    transitionDelay: isOpen ? `${index * 30}ms` : "0ms",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <div className="absolute bottom-8 left-6 right-6">
          <Button
            asChild
            variant="primary"
            className="w-full"
          >
            <Link href="/contact" onClick={onClose}>
              Get In Touch
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}
