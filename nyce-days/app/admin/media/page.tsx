import { createClient } from '@/lib/supabase/server'
import { MediaGrid } from '@/components/admin/media-grid'

async function getMedia() {
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching media:', error)
    return []
  }

  return data || []
}

export default async function MediaPage() {
  const media = await getMedia()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="text-muted-foreground mt-1">
          Upload and manage images and videos
        </p>
      </div>

      <MediaGrid media={media} />
    </div>
  )
}
