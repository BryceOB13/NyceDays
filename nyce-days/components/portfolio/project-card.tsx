import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import type { ProjectWithMedia } from "@/types/database"

interface ProjectCardProps {
  project: ProjectWithMedia
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block overflow-hidden rounded-lg bg-secondary"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3">
          {project.category && (
            <span className="text-sm font-medium uppercase tracking-wider text-nd-amber">
              {project.category}
            </span>
          )}
          {project.date && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-sm text-muted-foreground">
                {formatDate(project.date, { month: 'short', year: 'numeric' })}
              </span>
            </>
          )}
        </div>
        <h3 className="mt-2 font-serif text-xl font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
          {project.title}
        </h3>
        {project.description && (
          <p className="mt-2 line-clamp-2 font-sans text-sm text-muted-foreground">
            {project.description}
          </p>
        )}
      </div>
    </Link>
  )
}
