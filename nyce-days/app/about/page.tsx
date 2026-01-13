import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { AboutHeader } from "@/components/about/about-header"
import { AboutMission } from "@/components/about/about-mission"
import { StoryCarousel } from "@/components/about/story-carousel"
import { ValuesSection } from "@/components/about/values-section"

export const metadata = {
  title: "About | Nyce Days",
  description: "Learn about Nyce Days - our story, values, and the team behind the brand.",
}

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
              The Movement
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl">
              We Don&apos;t Build Audiences.
              <br />
              <span className="text-nd-red">We Build Communities.</span>
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The best marketing doesn&apos;t feel like marketing. It feels like belonging.
              </p>
              <p>
                Nyce Days started in living rooms and rooftops. Friends inviting friends. No flyers, 
                no ads. Just word of mouth and a simple promise: you&apos;ll leave knowing more people 
                than you came with.
              </p>
              <p>
                That&apos;s still how we operate. We don&apos;t chase algorithms or impressions. We create 
                spaces where strangers become regulars, where regulars become family, and where your 
                brand becomes part of someone&apos;s story.
              </p>
              <p className="font-serif text-foreground italic">
                Have A Nyce Day.
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
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-nd-red font-medium uppercase tracking-wider text-sm rounded-full hover:bg-white/90 transition-all"
              >
                Get In Touch
              </a>
              <a 
                href="/community"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/50 text-white font-medium uppercase tracking-wider text-sm rounded-full hover:bg-white/10 hover:border-white transition-all"
              >
                View Events
              </a>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Values Section */}
      <ValuesSection />
    </main>
  )
}
