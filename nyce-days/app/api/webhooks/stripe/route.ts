import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[webhook] signature verification failed', err)
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.metadata?.type === 'jamaica_relief') {
      const supabase = await createClient()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('donations').insert({
        stripe_session_id: session.id,
        stripe_payment_intent_id: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null,
        amount_cents: session.amount_total ?? 0,
        currency: session.currency ?? 'usd',
        campaign: session.metadata.campaign ?? 'bbq_may_24',
        donor_email: session.customer_details?.email ?? null,
        donor_name: session.customer_details?.name ?? null,
      })

      // Upsert to mailing list
      if (session.customer_details?.email) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('subscribers').upsert({
          email: session.customer_details.email,
          source: 'community',
          email_consent: true,
          subscribed: true,
        }, { onConflict: 'email' })
      }

      return NextResponse.json({ received: true })
    }
  }

  return NextResponse.json({ received: true })
}
