import Link from "next/link"
import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Camera, ShoppingBag } from "lucide-react"
import { ServicesHeader } from "@/components/services/services-header"

export const metadata = {
  title: "Services | Nyce Days",
  description: "We do events, brand partnerships, and content. Across fashion, music, and film. DMV-rooted, coast-to-coast.",
}

interface Service {
  title: string
  description: string
  features: string[]
  icon: React.ReactNode
}

const services: Service[] = [
  {
    title: "Event Curation",
    description: "Concept to day-of. We handle the whole thing, from what happens to how it all comes together.",
    features: [
      "Concept development and creative direction",
      "Venue sourcing and logistics",
      "Talent booking and artist relations",
      "Production and technical management on day-of",
      "Day-of coordination",
    ],
    icon: <Calendar className="h-8 w-8" />,
  },
  {
    title: "Community Marketing",
    description: "We know the people in our markets. We connect brands with those people in real ways that matter to them.",
    features: [
      "Brand strategy and market positioning",
      "Artist and influencer partnerships",
      "Ground-level activations and events",
      "Social presence and community",
    ],
    icon: <Users className="h-8 w-8" />,
  },
  {
    title: "Content Creation",
    description: "Photos and videos that say something real. The kind you actually want to look at again.",
    features: [
      "Photography and videography",
      "Creative direction for shoots",
      "Editing and post-production",
      "Content for social and archive",
    ],
    icon: <Camera className="h-8 w-8" />,
  },
  {
    title: "Merch and Collaborations",
    description: "Apparel and accessories that mean something. Limited runs, collaborations, and the kind of pieces people actually want to wear.",
    features: [
      "Apparel and accessory design",
      "Limited edition pieces and collaborations",
      "Pop-ups and retail",
    ],
    icon: <ShoppingBag className="h-8 w-8" />,
  },
]

export default function ServicesPage() {
  return (
    <main>
      {/* Video Header */}
      <ServicesHeader />

      {/* Services Grid */}
      <Section className="bg-secondary">
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <FadeUp key={service.title} delay={0.1 * (index + 1)}>
              <Card className="h-full border-border/50 bg-card transition-all duration-300 hover:border-border hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-nd-red/10 text-nd-red">
                    {service.icon}
                  </div>
                  <CardTitle className="font-serif text-2xl text-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  <ul className="mt-6 space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-foreground/80">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-nd-red" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-nd-red">
        <div className="text-center">
          <FadeUp>
            <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
              Let&apos;s talk.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/90 leading-relaxed">
              Got something you want to build or a partnership in mind. We&apos;re here to figure it out with you.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <Button
              asChild
              size="xl"
              className="mt-8 bg-white text-nd-red hover:bg-white/90"
            >
              <Link href="/contact">Get in touch</Link>
            </Button>
          </FadeUp>
        </div>
      </Section>
    </main>
  )
}
