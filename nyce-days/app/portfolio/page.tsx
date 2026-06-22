import Image from "next/image"
import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { ProjectGrid } from "@/components/portfolio"
import { getAllProjects } from "@/lib/queries"

export const metadata = {
  title: "Portfolio | Nyce Days",
  description: "Events, content, and partnerships. Projects that moved people.",
}

export default async function PortfolioPage() {
  const projects = await getAllProjects()

  return (
    <main>
      <Section className="bg-background pt-32">
        <FadeUp>
          <p className="text-center font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
            Portfolio
          </p>
          <div className="mt-6 flex justify-center">
            <Image
              src="/logos/stars-white.png"
              alt="Nyce Days"
              width={320}
              height={96}
              className="hidden dark:block object-contain h-24 md:h-28 w-auto"
            />
            <Image
              src="/logos/stars-black.png"
              alt="Nyce Days"
              width={320}
              height={96}
              className="dark:hidden object-contain h-24 md:h-28 w-auto"
            />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground">
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
