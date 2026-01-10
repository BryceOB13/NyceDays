// lib/supabase/admin.ts
// Admin client with service role for server-side operations
// Use this for operations that need to bypass RLS

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// This client should ONLY be used server-side
// Never expose the service role key to the client

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper to get public URL for storage files
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// Upload file to storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  options?: {
    contentType?: string
    upsert?: boolean
  }
) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      contentType: options?.contentType,
      upsert: options?.upsert ?? false
    })

  if (error) throw error

  return {
    path: data.path,
    publicUrl: getPublicUrl(bucket, data.path)
  }
}

// Delete file from storage
export async function deleteFile(bucket: string, paths: string[]) {
  const { error } = await supabaseAdmin.storage.from(bucket).remove(paths)
  if (error) throw error
}
