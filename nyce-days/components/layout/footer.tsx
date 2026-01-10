import Link from "next/link"
import { Instagram } from "lucide-react"
import { cn } from "@/lib/utils"

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/media", label: "Media" },
  { href: "/community", label: "Community" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
]

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn("bg-nd-black border-t border-nd-gray-800", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold text-nd-white">
                NYCE DAYS
              </span>
            </Link>
            <p className="mt-2 font-sans text-nd-gray-400 max-w-md">
              Event curation, community marketing, and content creation. Have A Nyce Day!
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-serif text-sm font-semibold text-nd-white uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-nd-gray-400 hover:text-nd-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter and Social */}
          <div>
            <h3 className="font-serif text-sm font-semibold text-nd-white uppercase tracking-wider">
              Stay Connected
            </h3>
            {/* Newsletter form placeholder - will be replaced with NewsletterForm component */}
            <div className="mt-4">
              <p className="font-sans text-sm text-nd-gray-400 mb-4">
                Subscribe to our newsletter for updates.
              </p>
              {/* NewsletterForm will be added here in task 6 */}
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="font-serif text-sm font-semibold text-nd-white uppercase tracking-wider mb-3">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/nycedays"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nd-gray-400 hover:text-nd-white transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-nd-gray-800">
          <p className="font-sans text-sm text-nd-gray-500 text-center">
            © {currentYear} Nyce Days. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
