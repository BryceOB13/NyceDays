import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { subscribeSchema } from '@/lib/schemas'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate with Zod schema
    const result = subscribeSchema.safeParse(body)

    if (!result.success) {
      const errors = result.error.flatten()
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors.fieldErrors,
        },
        { status: 400 }
      )
    }

    const { email, source } = result.data

    const supabase = await createClient()

    // Check if already subscribed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('subscribers')
      .select('id, subscribed')
      .eq('email', email.toLowerCase().trim())
      .single()

    const isNewSubscriber = !existing

    // Upsert subscriber (handle duplicates gracefully)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('subscribers')
      .upsert(
        {
          email: email.toLowerCase().trim(),
          source: source || 'footer',
          subscribed: true,
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false,
        }
      )

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save subscription. Please try again.',
        },
        { status: 500 }
      )
    }

    // Send welcome email only for new subscribers
    if (resend && isNewSubscriber) {
      try {
        await resend.emails.send({
          from: 'Nyce Days <hello@nycedays.com>',
          to: email,
          subject: "Welcome to Nyce Days! 🎉",
          html: `
            <h1>You're in!</h1>
            <p>Thanks for joining the Nyce Days community.</p>
            <p>Here's what you can expect:</p>
            <ul>
              <li>First access to event announcements</li>
              <li>Behind-the-scenes content</li>
              <li>Exclusive drops and merch</li>
            </ul>
            <p>Check out our upcoming events at <a href="https://nycedays.com/community">nycedays.com/community</a></p>
            <p>Have a Nyce Day! ✨</p>
            <p>– The Nyce Days Team</p>
          `,
        })
      } catch (emailError) {
        console.error('Welcome email error:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: isNewSubscriber ? 'Successfully subscribed!' : 'You\'re already subscribed!',
    })
  } catch (error) {
    console.error('Subscribe API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    )
  }
}
