import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { ProjectGrid } from "@/components/portfolio"
import { getAllProjects } from "@/lib/queries"

export const metadata = {
  title: "Portfolio | Nyce Days",
  description: "Explore our portfolio of events, content creation, and partnership projects.",
}

export default async function PortfolioPage() {
  const projects = await getAllProjects()

  return (
    <main>
      <Section className="bg-background pt-32">
        <FadeUp>
          <h1 className="text-center font-serif text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Our Work
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            A collection of events, content, and partnerships that showcase what we do best.
          </p>
        </FadeUp>

        <div className="mt-12">
          <ProjectGrid projects={projects} />
        </div>
      </Section>
    </main>
  )
}
