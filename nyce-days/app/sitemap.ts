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

  // Note: events are surfaced on /community (no standalone /events/[slug] route),
  // so they are intentionally not emitted here.

  return [...staticPages, ...projectPages]
}
