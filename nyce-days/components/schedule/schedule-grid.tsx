'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { startOfWeek, endOfWeek, addWeeks, eachDayOfInterval, format } from 'date-fns'
import { CalendarDayCard, type Booking } from './day-card'
import { WeekNavigator } from './week-navigator'
import { BookingModal } from './booking-modal'

export function ScheduleGrid() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/schedule')
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch (err) {
      console.error('Failed to fetch schedule:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  // Week calculation
  const today = useMemo(() => new Date(), [])
  const currentWeekStart = useMemo(() => {
    const base = weekOffset === 0 ? today : addWeeks(today, weekOffset)
    return startOfWeek(base, { weekStartsOn: 1 }) // Monday start
  }, [today, weekOffset])
  const currentWeekEnd = useMemo(() => endOfWeek(currentWeekStart, { weekStartsOn: 1 }), [currentWeekStart])
  const weekDays = useMemo(() => eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd }), [currentWeekStart, currentWeekEnd])

  // Map bookings by date for fast lookup
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking>()
    for (const b of bookings) {
      map.set(b.booking_date, b)
    }
    return map
  }, [bookings])

  const openCount = bookings.filter(b => b.status === 'open').length

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 rounded-lg bg-muted/20 animate-pulse" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted/20 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <WeekNavigator
        weekStart={currentWeekStart}
        weekEnd={currentWeekEnd}
        onPrev={() => setWeekOffset(o => o - 1)}
        onNext={() => setWeekOffset(o => o + 1)}
        onToday={() => setWeekOffset(0)}
      />

      {/* Desktop: 7-column grid */}
      <div className="hidden md:grid grid-cols-7 gap-2">
        {weekDays.map(day => {
          const key = format(day, 'yyyy-MM-dd')
          const booking = bookingsByDate.get(key) || null
          return (
            <CalendarDayCard
              key={key}
              date={day}
              booking={booking}
              onClick={() => booking?.status === 'open' && setSelectedDate(key)}
            />
          )
        })}
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-2">
        {weekDays.map(day => {
          const key = format(day, 'yyyy-MM-dd')
          const booking = bookingsByDate.get(key) || null
          return (
            <CalendarDayCard
              key={key}
              date={day}
              booking={booking}
              onClick={() => booking?.status === 'open' && setSelectedDate(key)}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-muted-foreground/60">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500/40" /> Open
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500/40" /> Claimed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-500/40" /> Locked
        </span>
      </div>

      {openCount > 0 && (
        <p className="text-center text-[11px] text-muted-foreground/50 mt-2">
          {openCount} open date{openCount !== 1 ? 's' : ''} remaining
        </p>
      )}

      {selectedDate && (
        <BookingModal
          bookingDate={selectedDate}
          onClose={() => setSelectedDate(null)}
          onBooked={() => {
            setSelectedDate(null)
            fetchBookings()
          }}
        />
      )}
    </>
  )
}
