import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const bookingSchema = z.object({
  booking_date: z.string().min(1),
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone_number: z.string().min(1, 'Phone is required'),
  instagram_handle: z.string().min(1, 'Instagram is required'),
  media_link: z.string().url('Must be a valid URL'),
  is_ready: z.literal(true, { message: 'You must confirm your content is ready' }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = bookingSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = result.data
    const supabase = await createClient()

    // Normalize instagram handle
    let handle = data.instagram_handle.trim()
    if (!handle.startsWith('@')) handle = `@${handle}`

    // Check the slot is still open (race condition guard)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing, error: fetchError } = await (supabase as any)
      .from('schedule_bookings')
      .select('status')
      .eq('booking_date', data.booking_date)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ success: false, error: 'Date not found' }, { status: 404 })
    }

    if (existing.status !== 'open') {
      return NextResponse.json({ success: false, error: 'This date is no longer available' }, { status: 409 })
    }

    // Update the booking
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('schedule_bookings')
      .update({
        full_name: data.full_name.trim(),
        email: data.email.toLowerCase().trim(),
        phone_number: data.phone_number.trim(),
        instagram_handle: handle,
        media_link: data.media_link.trim(),
        is_ready: true,
        status: 'pending',
      })
      .eq('booking_date', data.booking_date)
      .eq('status', 'open') // Double-check still open

    if (updateError) {
      console.error('Booking update error:', updateError)
      return NextResponse.json({ success: false, error: 'Failed to book date' }, { status: 500 })
    }

    // Upsert into subscribers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('subscribers')
      .upsert({
        email: data.email.toLowerCase().trim(),
        phone: data.phone_number.trim(),
        source: 'community',
        email_consent: true,
        sms_consent: true,
        subscribed: true,
      }, { onConflict: 'email' })

    // Upsert into sms_subscribers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('sms_subscribers')
      .upsert({
        phone: data.phone_number.trim(),
        email: data.email.toLowerCase().trim(),
        sms_consent: true,
        source: 'community',
        subscribed: true,
      }, { onConflict: 'phone' })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
