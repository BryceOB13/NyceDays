import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Use service role key for full storage access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets()
    
    if (bucketsError) {
      return NextResponse.json({ 
        error: 'Failed to list buckets',
        message: bucketsError.message 
      })
    }
    
    // Try to list files in each bucket
    const bucketContents: Record<string, unknown> = {}
    
    for (const bucket of buckets || []) {
      const { data: files, error: filesError } = await supabase
        .storage
        .from(bucket.name)
        .list('', { limit: 10 })
      
      bucketContents[bucket.name] = {
        files: files?.map(f => f.name) || [],
        error: filesError?.message
      }
      
      // If media bucket, also check images folder
      if (bucket.name === 'media') {
        const { data: imageFiles, error: imagesError } = await supabase
          .storage
          .from('media')
          .list('images', { limit: 10 })
        
        bucketContents['media/images'] = {
          files: imageFiles?.map(f => f.name) || [],
          count: imageFiles?.length || 0,
          error: imagesError?.message
        }
      }
    }
    
    return NextResponse.json({
      buckets: buckets?.map(b => b.name) || [],
      contents: bucketContents
    })
  } catch (err) {
    return NextResponse.json({ 
      error: 'Server error',
      message: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}
