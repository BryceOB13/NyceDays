import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { AboutHeader } from "@/components/about/about-header"
import { AboutMission } from "@/components/about/about-mission"
import { StoryCarousel } from "@/components/about/story-carousel"

export const metadata = {
  title: "About | Nyce Days",
  description: "Learn about Nyce Days - our story, values, and the team behind the brand.",
}

interface Value {
  number: string
  title: string
  description: string
}

const values: Value[] = [
  {
    number: "01",
    title: "Community First",
    description: "Everything we do starts with the community. We build authentic connections that bring people together.",
  },
  {
    number: "02",
    title: "Creative Excellence",
    description: "We push boundaries and challenge conventions to create memorable experiences and content.",
  },
  {
    number: "03",
    title: "Cultural Relevance",
    description: "We stay connected to culture, trends, and the pulse of what matters to our audience.",
  },
  {
    number: "04",
    title: "Authentic Partnerships",
    description: "We collaborate with brands and artists who share our vision and values.",
  },
]

export default function AboutPage() {
  return (
    <main>
      {/* Video Header Section */}
      <AboutHeader />

      {/* Origin Story Section */}
      <Section className="bg-secondary overflow-hidden">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <FadeUp>
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
              Our Story
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl">
              From Small Gatherings to Cultural Movement
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Nyce Days started with a simple idea: create spaces where people feel welcome, 
                inspired, and connected. What began as small gatherings among friends has grown 
                into a full-service creative agency.
              </p>
              <p>
                We believe in the power of community to drive culture forward. Through event 
                curation, content creation, and strategic partnerships, we help brands connect 
                with audiences in meaningful ways.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* Patchwork Image Carousel */}
        <FadeUp delay={0.3}>
          <StoryCarousel />
        </FadeUp>
      </Section>

      {/* Mission Section with Video */}
      <AboutMission />

      {/* Services CTA Section */}
      <Section className="bg-nd-red">
        <div className="text-center max-w-3xl mx-auto">
          <FadeUp>
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-white/70 mb-4">
              For Brands
            </p>
            <h2 className="font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Let&apos;s Build Something Together
            </h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              Event curation. Community marketing. Content creation. 
              We help brands connect with culture and community through authentic experiences.
            </p>
          </FadeUp>
          
          <FadeUp delay={0.2}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-nd-red font-medium uppercase tracking-wider text-sm rounded-full hover:bg-white/90 transition-all"
              >
                View Services
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/50 text-white font-medium uppercase tracking-wider text-sm rounded-full hover:bg-white/10 hover:border-white transition-all"
              >
                Get In Touch
              </a>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Values Section */}
      <Section className="bg-background">
        <FadeUp>
          <p className="text-center font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
            Our Values
          </p>
          <h2 className="mt-3 text-center font-serif text-3xl font-bold text-foreground md:text-4xl">
            The Principles That Guide Us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Everything we do is rooted in these core beliefs.
          </p>
        </FadeUp>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {values.map((value, index) => (
            <FadeUp key={value.number} delay={0.1 * (index + 1)}>
              <div className="rounded-lg border border-border/50 bg-card p-8 transition-all duration-300 hover:border-border hover:shadow-lg">
                <span className="font-serif text-5xl font-bold text-nd-red/20">
                  {value.number}
                </span>
                <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>
    </main>
  )
}
