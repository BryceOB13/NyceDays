import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nycedays.com'
  const supabase = await createClient()

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/services',
    '/portfolio',
    '/media',
    '/community',
    '/shop',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic project pages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: projects } = await (supabase as any)
    .from('projects')
    .select('slug, updated_at')
    .eq('published', true)

  const projectPages = (projects || []).map((project: { slug: string; updated_at: string }) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic event pages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: events } = await (supabase as any)
    .from('events')
    .select('slug, created_at')
    .eq('published', true)

  const eventPages = (events || []).map((event: { slug: string; created_at: string }) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(event.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...projectPages, ...eventPages]
}
