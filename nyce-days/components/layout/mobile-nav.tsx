"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[9999] bg-foreground min-h-screen w-screen overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-background/70 hover:text-background z-10"
            aria-label="Close menu"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <X className="h-6 w-6" />
          </motion.button>

          {/* Full height container with proper centering */}
          <div className="h-screen w-full flex flex-col items-center justify-center px-8 pb-8">
            {/* Navigation Links */}
            <nav>
              <ul className="flex flex-col items-center gap-3">
                {links.map((link, index) => (
                  <motion.li 
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.1 + index * 0.05,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "block py-2 px-6 text-lg text-center",
                        "transition-colors duration-200",
                        isActive(link.href)
                          ? "text-background font-medium"
                          : "text-background/60 hover:text-background"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* CTA */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
            >
              <Link
                href="/contact"
                onClick={onClose}
                className="inline-block px-8 py-3 bg-nd-red text-white font-medium rounded-full hover:bg-nd-red/90 transition-colors"
              >
                Get In Touch
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
