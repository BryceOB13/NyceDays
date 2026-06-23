"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUp, ArrowUpRight, Instagram } from "lucide-react"

const makes = [
  { href: "/community", label: "Events", note: "the nights" },
  { href: "/shop", label: "Shop", note: "the pieces" },
  { href: "/media", label: "Media", note: "shot on film" },
]

const world = [
  { href: "/about", label: "The Story" },
  { href: "/contact", label: "Work With Us" },
]

const socials = [
  { href: "https://instagram.com/nycedays", label: "Instagram", icon: Instagram },
]

const cities = ["DMV", "Baltimore", "NYC", "Philly", "Charlotte", "LA", "SF", "Boston", "SD"]

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <motion.footer
      className="relative overflow-hidden bg-[#0A0A0A] text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-nd-red/10 blur-[120px]" />

      <button
        onClick={scrollToTop}
        className="absolute right-6 top-8 z-10 rounded-full border border-white/15 p-3 text-white/50 transition-all hover:scale-105 hover:border-white/40 hover:text-white lg:right-10"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="max-w-xl">
          <Image
            src="/logos/full-white.png"
            alt="Nyce Days"
            width={280}
            height={112}
            className="h-16 w-auto lg:h-20"
          />
          <p className="mt-5 font-serif text-xl italic text-white/70 lg:text-2xl">
            the hub. everything we make lives here.
          </p>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-nd-red">What we make</p>
            <ul className="mt-4 space-y-3">
              {makes.map((m) => (
                <li key={m.href}>
                  <Link href={m.href} className="flex items-baseline gap-2 text-white/80 transition-colors hover:text-white">
                    <span className="font-serif text-lg">{m.label}</span>
                    <span className="font-sans text-xs text-white/40">{m.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-nd-red">The world</p>
            <ul className="mt-4 space-y-3">
              {world.map((w) => (
                <li key={w.href}>
                  <Link href={w.href} className="font-serif text-lg text-white/80 transition-colors hover:text-white">
                    {w.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-nd-red">Hear first</p>
            <p className="mt-4 font-serif text-lg text-white/80">The Nyce List</p>
            <p className="mt-1 max-w-[200px] text-sm text-white/40">
              Pieces and events before they go public.
            </p>
            <Link
              href="/community#nyce-list"
              className="mt-4 inline-flex items-center gap-2 font-sans text-sm uppercase tracking-wider text-white transition-colors hover:text-nd-red"
            >
              Join
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-nd-red">Follow</p>
            <div className="mt-4 flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-white/50 transition-colors hover:text-white"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="font-serif text-2xl italic text-white lg:text-3xl">Have a nyce day.</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-serif">{cities.join(" · ")}</p>
            <p className="font-sans text-xs">community first, coast to coast.</p>
          </div>
          <p className="mt-4 font-sans text-xs text-white/30">
&copy; {new Date().getFullYear()} Nyce Days. all rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
