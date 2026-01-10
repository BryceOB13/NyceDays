import Link from "next/link"
import Image from "next/image"
import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { Button } from "@/components/ui/button"
import type { ProjectWithMedia } from "@/types/database"

interface FeaturedWorkProps {
  projects: ProjectWithMedia[]
}

export function FeaturedWork({ projects }: FeaturedWorkProps) {
  if (projects.length === 0) {
    return null
  }

  return (
    <Section className="bg-secondary">
      <FadeUp>
        <p className="text-center font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
          Portfolio
        </p>
        <h2 className="mt-3 text-center font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
          Featured Work
        </h2>
      </FadeUp>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <FadeUp key={project.id} delay={0.1 * (index + 1)}>
            <Link
              href={`/portfolio/${project.slug}`}
              className="group block overflow-hidden rounded-lg bg-card border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-border"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {project.hero_media?.public_url ? (
                  <Image
                    src={project.hero_media.public_url}
                    alt={project.hero_media.alt_text || project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
              </div>
              <div className="p-6">
                {project.category && (
                  <span className="text-xs font-medium uppercase tracking-widest text-nd-amber">
                    {project.category}
                  </span>
                )}
                <h3 className="mt-2 font-serif text-xl font-semibold text-foreground group-hover:text-nd-red transition-colors duration-200">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="mt-2 line-clamp-2 font-sans text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
              </div>
            </Link>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={0.4}>
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/portfolio">View All Work</Link>
          </Button>
        </div>
      </FadeUp>
    </Section>
  )
}
