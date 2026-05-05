import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

const MIN_CENTS = 100
const MAX_CENTS = 1_000_000

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    if (!Number.isInteger(amount) || amount < MIN_CENTS || amount > MAX_CENTS) {
      return NextResponse.json({ error: 'invalid amount' }, { status: 400 })
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      submit_type: 'donate',
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: amount,
          product_data: {
            name: 'Jamaica Hurricane Relief',
            description: '100% forwarded to supportjamaica.gov.jm — not tax-deductible',
          },
        },
        quantity: 1,
      }],
      metadata: { type: 'jamaica_relief', campaign: 'bbq_may_24', event_slug: 'the-yard-may-24' },
      success_url: `${origin}/donate/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[donate] checkout session error', err)
    return NextResponse.json({ error: 'checkout failed' }, { status: 500 })
  }
}
