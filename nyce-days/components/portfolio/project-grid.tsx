"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectCard } from "./project-card"
import { FadeUp } from "@/components/shared/fade-up"
import type { ProjectWithMedia } from "@/types/database"

interface ProjectGridProps {
  projects: ProjectWithMedia[]
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "event", label: "Events" },
  { value: "content", label: "Content" },
  { value: "partnership", label: "Partnerships" },
] as const

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") {
      return projects
    }
    return projects.filter((project) => project.category === activeCategory)
  }, [projects, activeCategory])

  return (
    <div>
      <FadeUp>
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-8"
        >
          <TabsList className="bg-nd-gray-900 border border-nd-gray-800">
            {CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="data-[state=active]:bg-nd-amber data-[state=active]:text-nd-black text-nd-gray-400 hover:text-nd-white"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </FadeUp>

      {filteredProjects.length === 0 ? (
        <FadeUp>
          <div className="py-12 text-center">
            <p className="text-nd-gray-400">No projects found in this category.</p>
          </div>
        </FadeUp>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <FadeUp key={project.id} delay={0.1 * (index % 6)}>
              <ProjectCard project={project} />
            </FadeUp>
          ))}
        </div>
      )}
    </div>
  )
}
