import { StatusBadge } from './status-badge'
import { format, isToday } from 'date-fns'
import { cn } from '@/lib/utils'

export type Booking = {
  id: string
  booking_date: string
  full_name: string | null
  instagram_handle: string | null
  status: 'open' | 'pending' | 'confirmed'
}

interface CalendarDayCardProps {
  booking: Booking | null
  date: Date
  onClick?: () => void
}

export function CalendarDayCard({ booking, date, onClick }: CalendarDayCardProps) {
  const today = isToday(date)
  const isOpen = booking?.status === 'open'
  const isWeekend = date.getDay() === 0 || date.getDay() === 6

  return (
    <button
      onClick={isOpen ? onClick : undefined}
      disabled={!isOpen}
      className={cn(
        'relative flex flex-col items-start rounded-xl border p-3 md:p-4 min-h-[100px] md:min-h-[120px] transition-all text-left w-full',
        today && 'ring-1 ring-nd-red/40',
        isOpen
          ? 'border-border/40 bg-card/80 hover:border-nd-red/50 hover:bg-card cursor-pointer group'
          : booking
            ? 'border-border/20 bg-muted/20'
            : 'border-border/10 bg-transparent opacity-40',
        !booking && 'cursor-default'
      )}
    >
      {/* Day number + name */}
      <div className="flex items-baseline gap-1.5 mb-auto">
        <span className={cn(
          'text-lg md:text-xl font-serif font-bold',
          today ? 'text-nd-red' : 'text-foreground'
        )}>
          {format(date, 'd')}
        </span>
        <span className={cn(
          'text-[10px] uppercase tracking-wider',
          isWeekend ? 'text-muted-foreground/40' : 'text-muted-foreground/60'
        )}>
          {format(date, 'EEE')}
        </span>
      </div>

      {/* Content */}
      {booking ? (
        <div className="mt-auto w-full">
          {booking.full_name && (
            <p className="text-[11px] font-medium text-foreground/80 truncate mb-1">
              {booking.full_name}
            </p>
          )}
          {booking.instagram_handle && booking.status !== 'open' && (
            <p className="text-[10px] text-muted-foreground/60 truncate mb-1.5">
              {booking.instagram_handle}
            </p>
          )}
          <StatusBadge status={booking.status} />
        </div>
      ) : (
        <div className="mt-auto">
          <span className="text-[10px] text-muted-foreground/30">—</span>
        </div>
      )}

      {/* Hover indicator for open slots */}
      {isOpen && (
        <div className="absolute inset-0 rounded-xl border-2 border-nd-red/0 group-hover:border-nd-red/30 transition-all pointer-events-none" />
      )}
    </button>
  )
}
