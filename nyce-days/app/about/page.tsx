import Image from "next/image"
import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"

export const metadata = {
  title: "About | Nyce Days",
  description: "Learn about Nyce Days - our story, values, and the team behind the brand.",
}

interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  { value: "100K+", label: "Impressions" },
  { value: "50+", label: "Events Curated" },
  { value: "10+", label: "Team Members" },
  { value: "3", label: "Markets" },
]

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
      {/* Hero Section */}
      <Section className="bg-nd-black pt-32">
        <FadeUp>
          <h1 className="text-center font-serif text-4xl font-bold text-nd-white md:text-5xl lg:text-6xl">
            About Nyce Days
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-nd-gray-400">
            Building community through events, content, and culture.
          </p>
        </FadeUp>
      </Section>

      {/* Origin Story Section */}
      <Section className="bg-nd-cream">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <FadeUp>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-nd-gray-200">
              <Image
                src="/images/about-story.jpg"
                alt="Nyce Days team at an event"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div>
              <h2 className="font-serif text-3xl font-bold text-nd-black md:text-4xl">
                Our Story
              </h2>
              <div className="mt-6 space-y-4 text-nd-gray-700">
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
                <p>
                  Today, we operate across multiple markets, bringing our signature blend of 
                  creativity and community to every project we touch.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="bg-nd-red">
        <FadeUp>
          <h2 className="text-center font-serif text-3xl font-bold text-nd-white md:text-4xl">
            By The Numbers
          </h2>
        </FadeUp>

        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <FadeUp key={stat.label} delay={0.1 * (index + 1)}>
              <div className="text-center">
                <p className="font-serif text-4xl font-bold text-nd-white md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 font-sans text-nd-white/80">
                  {stat.label}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Values Section */}
      <Section className="bg-nd-black">
        <FadeUp>
          <h2 className="text-center font-serif text-3xl font-bold text-nd-white md:text-4xl">
            Our Values
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-nd-gray-400">
            The principles that guide everything we do.
          </p>
        </FadeUp>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {values.map((value, index) => (
            <FadeUp key={value.number} delay={0.1 * (index + 1)}>
              <div className="rounded-lg border border-nd-gray-800 bg-nd-gray-900 p-6">
                <span className="font-serif text-4xl font-bold text-nd-red">
                  {value.number}
                </span>
                <h3 className="mt-4 font-serif text-xl font-semibold text-nd-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-nd-gray-400">
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
