import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Admin endpoint to free up a slot when a DJ cancels via DM
// PATCH /api/invitational/admin — body: { booking_id, action: 'cancel' }
export async function PATCH(request: Request) {
  try {
    const { booking_id, action } = await request.json()

    if (!booking_id || action !== 'cancel') {
      return NextResponse.json({ error: 'booking_id and action=cancel required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Delete the signup to free the slot
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('invitational_signups')
      .delete()
      .eq('id', booking_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Slot freed up' })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET all signups for the current event (admin view)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventDate = searchParams.get('event_date') || '2026-05-17'

    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('invitational_signups')
      .select('*')
      .eq('event_date', eventDate)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ signups: data })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
