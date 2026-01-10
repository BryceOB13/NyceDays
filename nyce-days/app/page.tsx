import { Hero, WhatWeDo, FeaturedWork, StatsBar } from "@/components/home"
import { getFeaturedProjects } from "@/lib/queries"

export default async function Home() {
  const featuredProjects = await getFeaturedProjects()

  return (
    <main>
      <Hero />
      <WhatWeDo />
      <FeaturedWork projects={featuredProjects} />
      <StatsBar />
    </main>
  )
}
