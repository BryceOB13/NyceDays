"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { VideoBackground } from "@/components/shared/video-background"
import { FadeUp } from "@/components/shared/fade-up"
import { videos } from "@/lib/videos"
import { ArrowRight, ChevronDown } from "lucide-react"
import type { EventWithFlyer } from "@/types/database"

function formatEventDate(date: string): string {
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface EventsHeaderProps {
  activeEvents?: EventWithFlyer[]
}

export function EventsHeader({ activeEvents = [] }: EventsHeaderProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const handleScrollToGrid = () => {
    const target = document.getElementById('events-grid')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (sectionRef.current) {
      window.scrollTo({ top: sectionRef.current.offsetHeight, behavior: 'smooth' })
    }
  }

  const featured = activeEvents[0] ?? null
  const rest = activeEvents.slice(1)

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center py-16 md:py-24"
    >
      <VideoBackground
        desktopSrc={videos.events.header.desktop}
        mobileSrc={videos.events.header.mobile}
        poster={videos.events.header.poster}
        overlay="bg-gradient-to-b from-black/55 via-black/40 to-black/80"
      />

      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <p className="text-center text-[11px] uppercase tracking-[0.32em] text-nd-red font-medium">
            Active Events
          </p>
          <h1 className="mt-3 text-center font-serif text-5xl md:text-7xl text-white italic leading-[1.05]">
            What&rsquo;s next.
          </h1>
        </FadeUp>

        {activeEvents.length > 0 ? (
          <FadeUp delay={0.15}>
            <div className="mt-10 md:mt-14 space-y-4">
              {/* Featured (first/upcoming) event - large card */}
              {featured && (
                <Link
                  href={featured.ticket_url || '#events-grid'}
                  target={featured.ticket_url ? '_blank' : undefined}
                  rel={featured.ticket_url ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-4 sm:gap-5 bg-black/55 backdrop-blur-md border border-white/15 hover:border-nd-red/70 rounded-xl p-3 sm:p-4 transition-all"
                >
                  {featured.flyer?.public_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.flyer.public_url}
                      alt={featured.flyer.alt_text || featured.title}
                      className="h-20 w-16 sm:h-28 sm:w-22 rounded-md object-cover border border-white/15 shrink-0"
                    />
                  ) : (
                    <div className="h-20 w-16 sm:h-28 sm:w-22 rounded-md bg-nd-red/30 shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-nd-red font-medium">
                      Up next
                    </p>
                    <h2 className="mt-1 font-serif text-2xl sm:text-3xl md:text-4xl text-white leading-tight truncate">
                      {featured.title}
                    </h2>
                    <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.18em] text-white/70 truncate">
                      {formatEventDate(featured.date)}
                      {featured.location ? ` · ${featured.location.split(',')[0]}` : ''}
                      {featured.time ? ` · ${formatTime12(featured.time)}` : ''}
                    </p>
                  </div>

                  <span className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white group-hover:text-nd-red font-medium shrink-0 pr-2">
                    {featured.ticket_url ? 'Tickets' : 'Details'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <ArrowRight className="sm:hidden w-4 h-4 text-white/70 shrink-0 mr-1" />
                </Link>
              )}

              {/* Other active events - secondary pill row */}
              {rest.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 pt-1">
                  {rest.map((evt) => (
                    <Link
                      key={evt.id}
                      href={evt.ticket_url || '#events-grid'}
                      target={evt.ticket_url ? '_blank' : undefined}
                      rel={evt.ticket_url ? 'noopener noreferrer' : undefined}
                      className="group flex items-center gap-3 bg-black/45 backdrop-blur-md border border-white/15 hover:border-nd-red/60 rounded-full pl-1.5 pr-4 py-1.5 transition-all"
                    >
                      {evt.flyer?.public_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={evt.flyer.public_url}
                          alt={evt.flyer.alt_text || evt.title}
                          className="h-9 w-9 rounded-full object-cover border border-white/20"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-nd-red/30" />
                      )}
                      <div className="flex flex-col leading-tight pr-1">
                        <span className="text-white text-sm font-semibold tracking-wide">
                          {evt.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.16em] text-white/60">
                          {formatEventDate(evt.date)}
                          {evt.location ? ` · ${evt.location.split(',')[0]}` : ''}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/50 group-hover:text-nd-red group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </FadeUp>
        ) : (
          <FadeUp delay={0.15}>
            <p className="mt-10 text-center text-white/60 font-serif text-base max-w-md mx-auto">
              No active events right now. Join the Nyce List to hear first when we drop
              something new.
            </p>
          </FadeUp>
        )}

        {/* Scroll affordance */}
        <FadeUp delay={0.3}>
          <motion.button
            onClick={handleScrollToGrid}
            className="mt-12 mx-auto flex flex-col items-center gap-1 text-white/55 hover:text-white transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-[10px] uppercase tracking-[0.32em]">All Events</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </FadeUp>
      </div>
    </section>
  )
}

function formatTime12(time: string | null | undefined): string | null {
  if (!time) return null
  const m = time.match(/^(\d{1,2}):(\d{2})/)
  if (!m) return time
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  if (Number.isNaN(h)) return time
  const period = h >= 12 ? 'pm' : 'am'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return min === 0 ? `${hour12}${period}` : `${hour12}:${m[2]}${period}`
}
