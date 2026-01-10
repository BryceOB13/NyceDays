import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { contactFormSchema } from '@/lib/schemas'

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate with Zod schema
    const result = contactFormSchema.safeParse(body)

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

    const { name, email, company, inquiry_type, message, referral } = result.data

    // Create Supabase client
    const supabase = await createClient()

    // Insert contact submission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        company: company?.trim() || null,
        inquiry_type,
        message: message.trim(),
        referral: referral?.trim() || null,
        read: false,
        archived: false,
      })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save submission. Please try again.',
        },
        { status: 500 }
      )
    }

    // Send email notification (placeholder for Resend integration)
    // TODO: Integrate with Resend for email notifications
    // await sendContactNotification({ name, email, company, inquiry_type, message, referral })
    console.log('Contact submission received:', { name, email, inquiry_type })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    )
  }
}
