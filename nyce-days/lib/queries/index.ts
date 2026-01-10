// lib/queries/index.ts
// Database query functions for Nyce Days

import { createClient } from '@/lib/supabase/server'
import type { 
  ProjectWithMedia, 
  EventWithFlyer, 
  ProductWithImages,
  Media
} from '@/types/database'

// ============================================
// PROJECTS
// ============================================

export async function getFeaturedProjects(): Promise<ProjectWithMedia[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      hero_media:media!projects_hero_media_id_fkey(*)
    `)
    .eq('featured', true)
    .eq('published', true)
    .order('sort_order')
    .limit(3)

  if (error) throw error
  return data as ProjectWithMedia[]
}

export async function getAllProjects(category?: string): Promise<ProjectWithMedia[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('projects')
    .select(`
      *,
      hero_media:media!projects_hero_media_id_fkey(*)
    `)
    .eq('published', true)
    .order('sort_order')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) throw error
  return data as ProjectWithMedia[]
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithMedia | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      hero_media:media!projects_hero_media_id_fkey(*)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data as ProjectWithMedia
}

export async function getProjectGallery(projectId: string): Promise<Media[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order')

  if (error) throw error
  return data
}

type AdjacentProject = { slug: string; title: string } | null

export async function getAdjacentProjects(currentSlug: string): Promise<{ prev: AdjacentProject; next: AdjacentProject }> {
  const supabase = await createClient()
  
  // Get all published projects ordered
  const { data: projects, error } = await supabase
    .from('projects')
    .select('slug, title')
    .eq('published', true)
    .order('sort_order')

  if (error) throw error
  if (!projects) return { prev: null, next: null }

  const currentIndex = projects.findIndex((p: { slug: string; title: string }) => p.slug === currentSlug)
  
  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] as AdjacentProject : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] as AdjacentProject : null
  }
}

// ============================================
// EVENTS
// ============================================

export async function getUpcomingEvents(): Promise<EventWithFlyer[]> {
  const supabase = await createClient()
  
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      flyer:media(*)
    `)
    .eq('published', true)
    .gte('date', today)
    .order('date')

  if (error) throw error
  return data as EventWithFlyer[]
}

export async function getFeaturedEvent(): Promise<EventWithFlyer | null> {
  const supabase = await createClient()
  
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      flyer:media(*)
    `)
    .eq('published', true)
    .eq('featured', true)
    .gte('date', today)
    .order('date')
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as EventWithFlyer
}

// ============================================
// PRODUCTS
// ============================================

export async function getAllProducts(category?: string): Promise<ProductWithImages[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select(`
      *,
      images:product_images(
        *,
        media(*)
      )
    `)
    .eq('published', true)
    .order('sort_order')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) throw error
  return data as ProductWithImages[]
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(
        *,
        media(*)
      )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as ProductWithImages
}

export async function getProductCount(): Promise<number> {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)

  if (error) throw error
  return count ?? 0
}

// ============================================
// MEDIA
// ============================================

export async function getMediaByCategory(category?: string): Promise<Media[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('media')
    .select('*')
    .eq('type', 'image')
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

// ============================================
// SITE SETTINGS
// ============================================

export async function getSiteSetting<T = unknown>(key: string): Promise<T | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  if (!data) return null
  return (data as { value: T }).value
}

export async function getAllSiteSettings(): Promise<Record<string, unknown>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')

  if (error) throw error
  if (!data) return {}
  
  return data.reduce((acc: Record<string, unknown>, item: { key: string; value: unknown }) => {
    acc[item.key] = item.value
    return acc
  }, {} as Record<string, unknown>)
}

// ============================================
// FORM SUBMISSIONS
// ============================================

export async function submitContactForm(submission: {
  name: string
  email: string
  company?: string
  inquiry_type: 'partnership' | 'event' | 'content' | 'general'
  message: string
  referral?: string
}) {
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('contact_submissions')
    .insert(submission)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function subscribeEmail(email: string, source?: string) {
  const supabase = await createClient()
  
  const insertData = {
    email,
    source: source as 'footer' | 'community' | 'shop' | 'contact' | null,
    subscribed: true
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('subscribers')
    .upsert(insertData, { onConflict: 'email' })
    .select()
    .single()

  if (error) throw error
  return data
}
