'use client'

import { useState, useEffect, useCallback } from 'react'
import { DayCard, type Booking } from './day-card'
import { BookingModal } from './booking-modal'

export function ScheduleGrid() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
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

  const openCount = bookings.filter(b => b.status === 'open').length

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-muted/30 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <>
      {openCount > 0 && (
        <p className="text-xs text-muted-foreground mb-4">
          {openCount} date{openCount !== 1 ? 's' : ''} available
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {bookings.map(booking => (
          <DayCard
            key={booking.id}
            booking={booking}
            onClick={() => booking.status === 'open' && setSelectedDate(booking.booking_date)}
          />
        ))}
      </div>

      {bookings.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">No dates available yet.</p>
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
