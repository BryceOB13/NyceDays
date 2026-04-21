import { StatusBadge } from './status-badge'
import { format } from 'date-fns'

export type Booking = {
  id: string
  booking_date: string
  full_name: string | null
  status: 'open' | 'pending' | 'confirmed'
}

interface DayCardProps {
  booking: Booking
  onClick: () => void
}

export function DayCard({ booking, onClick }: DayCardProps) {
  const isOpen = booking.status === 'open'
  const date = new Date(booking.booking_date + 'T12:00:00')

  return (
    <button
      onClick={onClick}
      disabled={!isOpen}
      className={`w-full text-left rounded-xl border p-4 transition-all ${
        isOpen
          ? 'border-border/40 bg-card hover:border-nd-red/40 hover:shadow-md cursor-pointer'
          : 'border-border/20 bg-muted/30 cursor-not-allowed opacity-70'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {format(date, 'EEEE, MMM d')}
          </p>
          {booking.full_name && (
            <p className="text-xs text-muted-foreground mt-1">{booking.full_name}</p>
          )}
        </div>
        <StatusBadge status={booking.status} />
      </div>
    </button>
  )
}
