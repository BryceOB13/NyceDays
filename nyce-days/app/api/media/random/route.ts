import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const count = parseInt(searchParams.get('count') || '24', 10)
  
  try {
    // Use service role for storage access
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // List files from storage bucket
    const { data: files, error } = await supabase
      .storage
      .from('media')
      .list('images', {
        limit: 500,
      })

    if (error) {
      // Try root folder if images doesn't exist
      const rootResult = await supabase
        .storage
        .from('media')
        .list('', { limit: 500 })
      
      if (rootResult.error) {
        return NextResponse.json({ 
          error: rootResult.error.message,
        }, { status: 500 })
      }
      
      // Check if 'images' is a folder in root
      const imagesFolder = rootResult.data?.find(f => f.name === 'images')
      if (imagesFolder) {
        // It's a folder, list its contents
        const imagesResult = await supabase
          .storage
          .from('media')
          .list('images', { limit: 500 })
        
        if (imagesResult.data && imagesResult.data.length > 0) {
          return processFiles(supabase, imagesResult.data, 'images/', count)
        }
      }
      
      // Use root files
      if (rootResult.data && rootResult.data.length > 0) {
        return processFiles(supabase, rootResult.data, '', count)
      }
      
      return NextResponse.json([])
    }

    if (!files || files.length === 0) {
      return NextResponse.json([])
    }

    return processFiles(supabase, files, 'images/', count)
  } catch (err) {
    return NextResponse.json({ 
      error: 'Server error',
      message: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processFiles(supabase: any, files: { name: string; id?: string }[], prefix: string, count: number) {
  // Filter for image files only
  const imageFiles = files.filter(file => 
    file.name && 
    !file.name.startsWith('.') &&
    (file.name.toLowerCase().endsWith('.jpg') || 
     file.name.toLowerCase().endsWith('.jpeg') || 
     file.name.toLowerCase().endsWith('.png') || 
     file.name.toLowerCase().endsWith('.webp') ||
     file.name.toLowerCase().endsWith('.gif') ||
     file.name.toLowerCase().endsWith('.heic'))
  )
  
  if (imageFiles.length === 0) {
    return NextResponse.json([])
  }
  
  // Fisher-Yates shuffle
  const shuffled = [...imageFiles]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  // Get public URLs
  const selectedFiles = shuffled.slice(0, count)
  const mediaItems = selectedFiles.map(file => {
    const { data: { publicUrl } } = supabase
      .storage
      .from('media')
      .getPublicUrl(`${prefix}${file.name}`)
    
    return {
      id: file.id || file.name,
      filename: file.name,
      public_url: publicUrl,
      type: 'image',
      alt_text: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
    }
  })
  
  return NextResponse.json(mediaItems)
}
