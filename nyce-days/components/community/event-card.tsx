import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"
import type { EventWithFlyer } from "@/types/database"

function formatTime(time: string | null | undefined): string | null {
  if (!time) return null
  // Postgres TIME comes back as "HH:MM:SS"
  const m = time.match(/^(\d{1,2}):(\d{2})/)
  if (!m) return time
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  if (Number.isNaN(h)) return time
  const period = h >= 12 ? 'pm' : 'am'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return min === 0 ? `${hour12}${period}` : `${hour12}:${m[2]}${period}`
}

interface EventCardProps {
  event: EventWithFlyer
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg bg-card border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-border">
      {/* Flyer Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {event.flyer?.public_url ? (
          <Image
            src={event.flyer.public_url}
            alt={event.flyer.alt_text || event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No flyer</span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
      </div>

      {/* Event Details */}
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-nd-red transition-colors duration-200">
          {event.title}
        </h3>

        <div className="mt-4 space-y-2">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-nd-red" />
            <span>
              {formatDate(event.date, { weekday: 'short', month: 'short', day: 'numeric' })}
              {formatTime(event.time) && ` · ${formatTime(event.time)}`}
            </span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-nd-red" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
            {event.description}
          </p>
        )}

        {/* Ticket Link */}
        {event.ticket_url && (
          <Button
            asChild
            variant="primary"
            className="mt-5 w-full"
          >
            <Link href={event.ticket_url} target="_blank" rel="noopener noreferrer">
              Get Tickets
              {event.ticket_price && ` • ${event.ticket_price}`}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
