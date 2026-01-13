import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type SubscribeBody = {
  phone?: string
  email?: string
  first_name?: string
  source?: string
  sms_consent?: boolean
  email_consent?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeBody = await request.json()
    const { phone, email, first_name, source = 'modal', sms_consent, email_consent } = body

    // Need at least email or phone
    if (!email && !phone) {
      return NextResponse.json(
        { success: false, message: 'Email or phone required' },
        { status: 400 }
      )
    }

    // If phone provided with SMS consent, add to sms_subscribers
    if (phone && sms_consent) {
      const cleanPhone = phone.replace(/\D/g, '')
      const formattedPhone = cleanPhone.length === 10 ? `+1${cleanPhone}` : phone

      await supabase
        .from('sms_subscribers')
        .upsert({
          phone: formattedPhone,
          first_name: first_name || null,
          email: email || null,
          source,
          subscribed: true,
          subscribed_at: new Date().toISOString(),
        }, { onConflict: 'phone' })
    }

    // If email provided, add to subscribers
    if (email) {
      const { error } = await supabase
        .from('subscribers')
        .upsert({
          email: email.toLowerCase().trim(),
          first_name: first_name || null,
          phone: phone || null,
          source,
          email_consent: email_consent ?? true,
          sms_consent: sms_consent ?? false,
          subscribed: true,
          subscribed_at: new Date().toISOString(),
        }, { onConflict: 'email' })

      if (error) throw error
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list!",
    })

  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
