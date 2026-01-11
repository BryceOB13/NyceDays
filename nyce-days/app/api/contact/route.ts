import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { contactFormSchema } from '@/lib/schemas'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: Request) {
  try {
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

    const supabase = await createClient()

    // Insert contact submission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
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
      .select()
      .single()

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

    // Send email notifications (non-blocking)
    if (resend && process.env.CONTACT_EMAIL) {
      try {
        // Notify admin
        await resend.emails.send({
          from: 'Nyce Days <notifications@nycedays.com>',
          to: process.env.CONTACT_EMAIL,
          subject: `New ${inquiry_type || 'general'} inquiry from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Company:</strong> ${company || 'Not provided'}</p>
            <p><strong>Type:</strong> ${inquiry_type || 'General'}</p>
            ${referral ? `<p><strong>Referral:</strong> ${referral}</p>` : ''}
            <hr/>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br/>')}</p>
            <hr/>
            <p><small>Received at ${new Date().toLocaleString()}</small></p>
          `,
        })

        // Auto-reply to user
        await resend.emails.send({
          from: 'Nyce Days <hello@nycedays.com>',
          to: email,
          subject: "We got your message!",
          html: `
            <h2>Thanks for reaching out, ${name.split(' ')[0]}!</h2>
            <p>We've received your message and will get back to you within 48 hours.</p>
            <p>In the meantime, check out our latest work at <a href="https://nycedays.com/portfolio">nycedays.com/portfolio</a></p>
            <p>Have a Nyce Day! ✨</p>
            <p>– The Nyce Days Team</p>
          `,
        })
      } catch (emailError) {
        console.error('Email error:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      id: data?.id,
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
