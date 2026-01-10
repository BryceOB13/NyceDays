"use client"

import Link from "next/link"
import Image from "next/image"
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
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[280px]",
          "bg-background border-l border-border/40",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border/40">
          {/* Stars logo */}
          <Image
            src="/logos/stars-white.png"
            alt="Nyce Days"
            width={80}
            height={26}
            className="hidden dark:block object-contain h-6 w-auto"
          />
          <Image
            src="/logos/stars-black.png"
            alt="Nyce Days"
            width={80}
            height={26}
            className="dark:hidden object-contain h-6 w-auto"
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 text-foreground/70 hover:text-foreground hover:bg-transparent"
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
                    "block py-3 font-sans text-base tracking-wide",
                    "text-foreground/70 transition-colors duration-200",
                    "hover:text-foreground hover:pl-2"
                  )}
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
