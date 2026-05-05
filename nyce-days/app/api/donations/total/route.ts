import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export async function GET() {
  try {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('donations')
      .select('amount_cents')
      .eq('campaign', 'bbq_may_24')

    if (error) {
      return NextResponse.json({ total_cents: 0 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const total_cents = (data ?? []).reduce((sum: number, row: any) => sum + row.amount_cents, 0)
    return NextResponse.json({ total_cents })
  } catch {
    return NextResponse.json({ total_cents: 0 })
  }
}
