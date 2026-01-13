import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_name, event_data, page_path } = body

    if (!event_name) {
      return NextResponse.json({ error: 'event_name required' }, { status: 400 })
    }

    // Get device type from user agent
    const userAgent = request.headers.get('user-agent') || ''
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent)
    const device_type = isMobile ? 'mobile' : 'desktop'

    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('analytics_events').insert({
      event_name,
      event_data: event_data || {},
      page_path: page_path || null,
      referrer: request.headers.get('referer') || null,
      device_type,
      session_id: request.cookies.get('session_id')?.value || null,
    })

    if (error) {
      console.error('Analytics insert error:', error)
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
