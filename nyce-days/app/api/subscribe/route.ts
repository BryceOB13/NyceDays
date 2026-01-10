import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { subscribeSchema } from '@/lib/schemas'

export async function POST(request: Request) {
  try {
    // Parse request body
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

    // Create Supabase client
    const supabase = await createClient()

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

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
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
