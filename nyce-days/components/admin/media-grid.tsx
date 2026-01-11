'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Image as ImageIcon, Video, Trash2, X } from 'lucide-react'

interface MediaItem {
  id: string
  created_at: string
  filename: string
  storage_path: string
  public_url: string | null
  type: 'image' | 'video'
  category: string | null
  alt_text: string | null
}

interface MediaGridProps {
  media: MediaItem[]
}

export function MediaGrid({ media: initialMedia }: MediaGridProps) {
  const [media, setMedia] = useState(initialMedia)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const supabase = createClient()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const uploadFiles = useCallback(async (files: File[]) => {
    setUploading(true)

    for (const file of files) {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      
      if (!isImage && !isVideo) continue

      const filename = `${Date.now()}-${file.name}`
      const storagePath = `uploads/${filename}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(storagePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(storagePath)

      // Insert into media table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('media')
        .insert({
          filename: file.name,
          storage_path: storagePath,
          public_url: publicUrl,
          type: isImage ? 'image' : 'video',
          mime_type: file.type,
          size_bytes: file.size,
        })
        .select()
        .single()

      if (!error && data) {
        setMedia(prev => [data, ...prev])
      }
    }

    setUploading(false)
  }, [supabase])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    await uploadFiles(files)
  }, [uploadFiles])

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await uploadFiles(files)
  }

  const deleteMedia = async (item: MediaItem) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    // Delete from storage
    await supabase.storage.from('media').remove([item.storage_path])

    // Delete from database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('media').delete().eq('id', item.id)

    setMedia(prev => prev.filter(m => m.id !== item.id))
    setSelectedMedia(null)
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className={`h-10 w-10 ${uploading ? 'animate-pulse' : ''} text-muted-foreground`} />
          <p className="text-muted-foreground">
            {uploading ? 'Uploading...' : 'Drag and drop files here, or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports images and videos
          </p>
        </label>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedMedia(item)}
            className="aspect-square bg-muted rounded-lg overflow-hidden relative group"
          >
            {item.type === 'image' && item.public_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.public_url}
                alt={item.alt_text || item.filename}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {item.type === 'video' ? (
                  <Video className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs px-2 py-1 bg-black/50 rounded truncate max-w-[90%]">
                {item.filename}
              </span>
            </div>
          </button>
        ))}
      </div>

      {media.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No media uploaded yet
        </p>
      )}

      {/* Media Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold truncate">{selectedMedia.filename}</h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              {selectedMedia.type === 'image' && selectedMedia.public_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedMedia.public_url}
                  alt={selectedMedia.alt_text || selectedMedia.filename}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="mt-4 space-y-2 text-sm">
                <p><span className="text-muted-foreground">Type:</span> {selectedMedia.type}</p>
                <p><span className="text-muted-foreground">Category:</span> {selectedMedia.category || 'None'}</p>
                <p><span className="text-muted-foreground">Uploaded:</span> {new Date(selectedMedia.created_at).toLocaleString()}</p>
                {selectedMedia.public_url && (
                  <p className="truncate">
                    <span className="text-muted-foreground">URL:</span>{' '}
                    <a href={selectedMedia.public_url} target="_blank" className="text-primary hover:underline">
                      {selectedMedia.public_url}
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div className="p-4 border-t flex justify-between">
              <button
                onClick={() => deleteMedia(selectedMedia)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
              <button
                onClick={() => {
                  if (selectedMedia.public_url) {
                    navigator.clipboard.writeText(selectedMedia.public_url)
                  }
                }}
                className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
