import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: Request) {
  try {
    const { booking_date } = await request.json()
    if (!booking_date) {
      return NextResponse.json({ error: 'booking_date required' }, { status: 400 })
    }

    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('schedule_bookings')
      .update({ status: 'confirmed' })
      .eq('booking_date', booking_date)
      .eq('status', 'pending')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
