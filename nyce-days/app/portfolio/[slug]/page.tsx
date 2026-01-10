import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { ProjectGallery } from "@/components/portfolio"
import { Button } from "@/components/ui/button"
import { getProjectBySlug, getProjectGallery, getAdjacentProjects } from "@/lib/queries"
import { formatDate } from "@/lib/utils"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: "Project Not Found | Nyce Days",
    }
  }

  return {
    title: `${project.title} | Nyce Days`,
    description: project.description || `View ${project.title} project by Nyce Days`,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const [gallery, adjacentProjects] = await Promise.all([
    getProjectGallery(project.id),
    getAdjacentProjects(slug),
  ])

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full">
        {project.hero_media?.public_url ? (
          <Image
            src={project.hero_media.public_url}
            alt={project.hero_media.alt_text || project.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-nd-gray-900">
            <span className="text-nd-gray-500">No hero image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-nd-black via-nd-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="mx-auto max-w-6xl">
            <FadeUp>
              {project.category && (
                <span className="text-sm font-medium uppercase tracking-wider text-nd-amber">
                  {project.category}
                </span>
              )}
              <h1 className="mt-2 font-serif text-4xl font-bold text-nd-white md:text-5xl lg:text-6xl">
                {project.title}
              </h1>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <Section className="bg-nd-black">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Metadata Sidebar */}
          <FadeUp className="lg:col-span-1">
            <div className="space-y-6 rounded-lg bg-nd-gray-900 p-6">
              {project.client && (
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider text-nd-gray-400">
                    Client
                  </h3>
                  <p className="mt-1 text-nd-white">{project.client}</p>
                </div>
              )}
              {project.date && (
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider text-nd-gray-400">
                    Date
                  </h3>
                  <p className="mt-1 text-nd-white">{formatDate(project.date)}</p>
                </div>
              )}
              {project.location && (
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider text-nd-gray-400">
                    Location
                  </h3>
                  <p className="mt-1 text-nd-white">{project.location}</p>
                </div>
              )}
              {project.services && project.services.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider text-nd-gray-400">
                    Services
                  </h3>
                  <ul className="mt-1 space-y-1">
                    {project.services.map((service, index) => (
                      <li key={index} className="text-nd-white">
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </FadeUp>

          {/* Content */}
          <FadeUp delay={0.1} className="lg:col-span-2">
            {project.description && (
              <p className="text-lg leading-relaxed text-nd-gray-300">
                {project.description}
              </p>
            )}
            {project.content && (
              <div
                className="prose prose-invert mt-8 max-w-none prose-headings:font-serif prose-headings:text-nd-white prose-p:text-nd-gray-300 prose-a:text-nd-amber prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            )}
          </FadeUp>
        </div>
      </Section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <Section className="bg-nd-gray-900">
          <FadeUp>
            <ProjectGallery media={gallery} />
          </FadeUp>
        </Section>
      )}

      {/* Navigation */}
      <Section className="bg-nd-black">
        <FadeUp>
          <div className="flex items-center justify-between border-t border-nd-gray-800 pt-8">
            {adjacentProjects.prev ? (
              <Link
                href={`/portfolio/${adjacentProjects.prev.slug}`}
                className="group flex items-center gap-2 text-nd-gray-400 transition-colors hover:text-nd-white"
              >
                <svg
                  className="h-5 w-5 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <div className="text-left">
                  <span className="block text-xs uppercase tracking-wider">Previous</span>
                  <span className="block font-serif text-nd-white">
                    {adjacentProjects.prev.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            <Button
              asChild
              variant="outline"
              className="border-nd-gray-700 text-nd-gray-400 hover:border-nd-white hover:text-nd-white"
            >
              <Link href="/portfolio">All Projects</Link>
            </Button>

            {adjacentProjects.next ? (
              <Link
                href={`/portfolio/${adjacentProjects.next.slug}`}
                className="group flex items-center gap-2 text-nd-gray-400 transition-colors hover:text-nd-white"
              >
                <div className="text-right">
                  <span className="block text-xs uppercase tracking-wider">Next</span>
                  <span className="block font-serif text-nd-white">
                    {adjacentProjects.next.title}
                  </span>
                </div>
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </FadeUp>
      </Section>
    </main>
  )
}
