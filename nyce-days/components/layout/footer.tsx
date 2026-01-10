import Link from "next/link"
import Image from "next/image"
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
    <footer className={cn("bg-background border-t border-border/40", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Logo and Tagline */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block transition-opacity hover:opacity-70">
              {/* Full logo - dark mode */}
              <Image
                src="/logos/full-white.png"
                alt="Nyce Days"
                width={180}
                height={72}
                className="hidden dark:block object-contain h-16 w-auto"
              />
              {/* Full logo - light mode */}
              <Image
                src="/logos/full-black.png"
                alt="Nyce Days"
                width={180}
                height={72}
                className="dark:hidden object-contain h-16 w-auto"
              />
            </Link>
            <p className="mt-6 font-sans text-sm text-muted-foreground max-w-sm leading-relaxed">
              Event curation, community marketing, and content creation. 
              Building culture, one experience at a time.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h3 className="font-sans text-xs font-medium text-foreground uppercase tracking-widest">
              Navigation
            </h3>
            <ul className="mt-6 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter and Social */}
          <div className="md:col-span-4">
            <h3 className="font-sans text-xs font-medium text-foreground uppercase tracking-widest">
              Stay Connected
            </h3>
            <p className="mt-6 font-sans text-sm text-muted-foreground leading-relaxed">
              Subscribe to our newsletter for updates on events and community happenings.
            </p>
            {/* Newsletter form placeholder */}
            <div className="mt-4">
              {/* NewsletterForm will be added here */}
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="font-sans text-xs font-medium text-foreground uppercase tracking-widest">
                Follow Us
              </h4>
              <div className="mt-4 flex gap-4">
                <a
                  href="https://instagram.com/nycedays"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-border/40">
          <p className="font-sans text-xs text-muted-foreground text-center tracking-wide">
            © {currentYear} Nyce Days. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
