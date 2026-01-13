// app/api/subscribe/route.ts
// Nyce List Subscribe API - SMS Priority

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import type { Database, NyceListFormData, SubscribeResponse } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for inserts
)

export async function POST(request: NextRequest) {
  try {
    const body: NyceListFormData = await request.json()
    
    const { phone, email, first_name, sms_consent, email_consent } = body

    // Validate required fields
    if (!phone) {
      return NextResponse.json<SubscribeResponse>(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      )
    }

    if (!sms_consent) {
      return NextResponse.json<SubscribeResponse>(
        { success: false, message: 'SMS consent is required' },
        { status: 400 }
      )
    }

    // Clean phone number (digits only)
    const cleanPhone = phone.replace(/\D/g, '')
    
    // Validate phone format (10 digits for US)
    if (cleanPhone.length !== 10) {
      return NextResponse.json<SubscribeResponse>(
        { success: false, message: 'Please enter a valid 10-digit phone number' },
        { status: 400 }
      )
    }

    // Format for storage: +1XXXXXXXXXX
    const formattedPhone = `+1${cleanPhone}`

    // Insert into sms_subscribers table (primary)
    const { data: smsSubscriber, error: smsError } = await supabase
      .from('sms_subscribers')
      .upsert(
        {
          phone: formattedPhone,
          first_name: first_name || null,
          email: email || null,
          source: 'modal',
          subscribed: true,
          subscribed_at: new Date().toISOString(),
        },
        { onConflict: 'phone' }
      )
      .select('id')
      .single()

    if (smsError) {
      console.error('SMS subscriber error:', smsError)
      return NextResponse.json<SubscribeResponse>(
        { success: false, message: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      )
    }

    // If email provided and email consent given, also add to subscribers table
    if (email && email_consent) {
      const { error: emailError } = await supabase
        .from('subscribers')
        .upsert(
          {
            email: email.toLowerCase().trim(),
            first_name: first_name || null,
            phone: formattedPhone,
            source: 'modal',
            email_consent: true,
            sms_consent: true,
            subscribed: true,
            subscribed_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        )

      if (emailError) {
        // Log but don't fail - SMS was successful
        console.error('Email subscriber error:', emailError)
      }
    }

    // TODO: Send welcome SMS via Twilio/your SMS provider
    // await sendWelcomeSms(formattedPhone, first_name)

    return NextResponse.json<SubscribeResponse>({
      success: true,
      message: "You're on the list!",
      subscriber_id: smsSubscriber?.id,
    })

  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json<SubscribeResponse>(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
