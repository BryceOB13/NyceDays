import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { EventWithFlyer } from "@/types/database"

interface EventCardProps {
  event: EventWithFlyer
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg bg-nd-gray-900">
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
          <div className="flex h-full w-full items-center justify-center bg-nd-gray-800">
            <span className="text-nd-gray-500">No flyer</span>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-nd-white group-hover:text-nd-cream transition-colors">
          {event.title}
        </h3>

        <div className="mt-3 space-y-2">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-nd-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-nd-amber"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {formatDate(event.date, { weekday: 'short', month: 'short', day: 'numeric' })}
              {event.time && ` • ${event.time}`}
            </span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-nd-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-nd-amber"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="mt-3 line-clamp-2 text-sm text-nd-gray-400">
            {event.description}
          </p>
        )}

        {/* Ticket Link */}
        {event.ticket_url && (
          <Button
            asChild
            className="mt-4 w-full bg-nd-red hover:bg-nd-red/90 text-nd-white"
          >
            <Link href={event.ticket_url} target="_blank" rel="noopener noreferrer">
              Get Tickets
              {event.ticket_price && ` • $${event.ticket_price}`}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
