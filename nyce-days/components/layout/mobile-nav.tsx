"use client"

import Link from "next/link"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[300px] bg-nd-black border-nd-gray-800"
      >
        <SheetHeader>
          <SheetTitle className="font-serif text-xl text-nd-white">
            NYCE DAYS
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="font-sans text-lg text-nd-gray-300 transition-colors hover:text-nd-white py-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
