import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { subscribeSchema } from '@/lib/schemas'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate with Zod schema
    const result = subscribeSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten()
      return NextResponse.json(
        { success: false, message: errors.formErrors[0] || 'Invalid input', errors: errors.fieldErrors },
        { status: 400 }
      )
    }

    const { phone, email, first_name, source = 'modal', sms_consent, email_consent } = result.data

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
