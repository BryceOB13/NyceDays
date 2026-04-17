import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const DJ_CAP = 20

const baseSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  instagram_handle: z.string().min(1, 'Instagram handle is required').max(50),
})

const djSchema = baseSchema.extend({
  signup_type: z.literal('dj'),
  phone: z.string().optional(),
  contact_preference: z.enum(['instagram', 'sms']).default('instagram'),
  time_slot_preference: z.array(z.string()).min(1, 'Select a time slot').max(1, 'Select only one slot'),
})

const waitlistSchema = baseSchema.extend({
  signup_type: z.literal('waitlist'),
})

const signupSchema = z.discriminatedUnion('signup_type', [djSchema, waitlistSchema])

export async function GET() {
  try {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count, error } = await (supabase as any)
      .from('invitational_signups')
      .select('*', { count: 'exact', head: true })
      .eq('signup_type', 'dj')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch count' }, { status: 500 })
    }

    // Fetch claimed slots
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: claimedData } = await (supabase as any)
      .from('invitational_signups')
      .select('time_slot_preference')
      .eq('signup_type', 'dj')

    const claimedSlots: string[] = []
    if (claimedData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const row of claimedData as any[]) {
        if (Array.isArray(row.time_slot_preference)) {
          claimedSlots.push(...row.time_slot_preference)
        }
      }
    }

    return NextResponse.json({ djCount: count || 0, cap: DJ_CAP, claimedSlots })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = signupSchema.safeParse(body)

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

    if (data.signup_type === 'dj') {
      // Validate phone is provided when contact_preference is sms
      if (data.contact_preference === 'sms' && (!data.phone || data.phone.replace(/\D/g, '').length < 10)) {
        return NextResponse.json(
          { success: false, error: 'Phone number is required when choosing text notifications' },
          { status: 400 }
        )
      }

      // Race condition guard — check DJ cap
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count, error: countError } = await (supabase as any)
        .from('invitational_signups')
        .select('*', { count: 'exact', head: true })
        .eq('signup_type', 'dj')

      if (countError) {
        return NextResponse.json({ success: false, error: 'Failed to verify availability' }, { status: 500 })
      }

      if ((count || 0) >= DJ_CAP) {
        return NextResponse.json({
          success: false, error: 'dj_cap_reached',
          message: 'DJ spots are full. You can still join the waitlist.',
        }, { status: 409 })
      }

      // Race condition guard — check slot not already claimed
      const chosenSlot = data.time_slot_preference[0]
      if (chosenSlot && chosenSlot !== 'No preference / any slot') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: existing } = await (supabase as any)
          .from('invitational_signups')
          .select('id')
          .eq('signup_type', 'dj')
          .contains('time_slot_preference', [chosenSlot])
          .limit(1)

        if (existing && existing.length > 0) {
          return NextResponse.json({
            success: false, error: 'slot_taken',
            message: `The ${chosenSlot} slot was just claimed. Please pick a different one.`,
          }, { status: 409 })
        }
      }
    }

    const insertData: Record<string, unknown> = {
      full_name: data.full_name.trim(),
      email: data.email.toLowerCase().trim(),
      instagram_handle: handle,
      signup_type: data.signup_type,
    }

    if (data.signup_type === 'dj') {
      insertData.time_slot_preference = data.time_slot_preference
      insertData.phone = data.phone?.trim() || null
      insertData.contact_preference = data.contact_preference
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from('invitational_signups')
      .insert(insertData)

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ success: false, error: 'Failed to save signup' }, { status: 500 })
    }

    return NextResponse.json({ success: true, signup_type: data.signup_type })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
