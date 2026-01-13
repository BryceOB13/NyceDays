import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('events')
    .select('title, date, location, slug, ticket_url')
    .eq('published', true)
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json(null)
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
