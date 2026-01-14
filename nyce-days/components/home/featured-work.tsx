import Image from "next/image"
import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
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
          Our Work
        </p>
        <h2 className="mt-3 text-center font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
          Featured Work
        </h2>
      </FadeUp>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <FadeUp key={project.id} delay={0.1 * (index + 1)}>
            <div className="group block overflow-hidden rounded-lg bg-card border border-border/50">
              <div className="relative aspect-[4/3] overflow-hidden">
                {project.hero_media?.public_url ? (
                  <Image
                    src={project.hero_media.public_url}
                    alt={project.hero_media.alt_text || project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                {project.category && (
                  <span className="text-xs font-medium uppercase tracking-widest text-nd-amber">
                    {project.category}
                  </span>
                )}
                <h3 className="mt-2 font-serif text-xl font-semibold text-foreground">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="mt-2 line-clamp-2 font-sans text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </Section>
  )
}
