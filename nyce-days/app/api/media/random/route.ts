import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const count = parseInt(searchParams.get('count') || '12', 10)
  
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('type', 'image')
    .not('public_url', 'is', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  if (!data || data.length === 0) {
    return NextResponse.json([])
  }
  
  // Fisher-Yates shuffle
  const shuffled = [...data]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return NextResponse.json(shuffled.slice(0, count))
}
