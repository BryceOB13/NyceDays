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
  genre: z.string().min(1, 'Genre is required'),
  genre_other: z.string().optional(),
  time_slot_preference: z.array(z.string()).min(1, 'Select at least one time slot'),
})

const waitlistSchema = baseSchema.extend({
  signup_type: z.literal('waitlist'),
})

const signupSchema = z.discriminatedUnion('signup_type', [djSchema, waitlistSchema])

export async function GET() {
  try {
    const supabase = await createClient()
    const { count, error } = await supabase
      .from('invitational_signups')
      .select('*', { count: 'exact', head: true })
      .eq('signup_type', 'dj')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch count' }, { status: 500 })
    }

    return NextResponse.json({ djCount: count || 0, cap: DJ_CAP })
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

    // Race condition guard for DJ signups
    if (data.signup_type === 'dj') {
      const { count, error: countError } = await supabase
        .from('invitational_signups')
        .select('*', { count: 'exact', head: true })
        .eq('signup_type', 'dj')

      if (countError) {
        return NextResponse.json({ success: false, error: 'Failed to verify availability' }, { status: 500 })
      }

      if ((count || 0) >= DJ_CAP) {
        return NextResponse.json({
          success: false,
          error: 'dj_cap_reached',
          message: 'DJ spots are full. You can still join the waitlist.',
        }, { status: 409 })
      }
    }

    const insertData: Record<string, unknown> = {
      full_name: data.full_name.trim(),
      email: data.email.toLowerCase().trim(),
      instagram_handle: handle,
      signup_type: data.signup_type,
    }

    if (data.signup_type === 'dj') {
      insertData.genre = data.genre
      insertData.genre_other = data.genre === 'Other' ? data.genre_other?.trim() || null : null
      insertData.time_slot_preference = data.time_slot_preference
    }

    const { error: insertError } = await supabase
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
