import Link from "next/link"
import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Camera, ShoppingBag } from "lucide-react"
import { ServicesHeader } from "@/components/services/services-header"

export const metadata = {
  title: "Services | Nyce Days",
  description: "Explore Nyce Days services: Event Curation, Community Marketing, Content Creation, and Merch & Brand Collaboration.",
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
    description: "From intimate gatherings to large-scale productions, we craft memorable experiences that bring communities together.",
    features: [
      "Concept development & creative direction",
      "Venue sourcing & logistics",
      "Talent booking & artist relations",
      "Production & technical management",
      "Day-of coordination",
    ],
    icon: <Calendar className="h-8 w-8" />,
  },
  {
    title: "Community Marketing",
    description: "We build authentic connections between brands and their audiences through grassroots engagement and cultural relevance.",
    features: [
      "Brand strategy & positioning",
      "Influencer partnerships",
      "Grassroots activations",
      "Social media management",
      "Community building",
    ],
    icon: <Users className="h-8 w-8" />,
  },
  {
    title: "Content Creation",
    description: "Capturing moments that matter with photography, videography, and creative direction that tells your story.",
    features: [
      "Photography & videography",
      "Creative direction",
      "Post-production & editing",
      "Social content packages",
      "Brand storytelling",
    ],
    icon: <Camera className="h-8 w-8" />,
  },
  {
    title: "Merch & Brand Collaboration",
    description: "Custom merchandise and collaborative products that extend your brand into the physical world.",
    features: [
      "Product design & development",
      "Limited edition drops",
      "Brand collaborations",
      "Pop-up shop experiences",
      "E-commerce strategy",
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
              Ready to Work Together?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/90 leading-relaxed">
              Let&apos;s discuss how we can help bring your vision to life. Get in touch to start the conversation.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <Button
              asChild
              size="xl"
              className="mt-8 bg-white text-nd-red hover:bg-white/90"
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </FadeUp>
        </div>
      </Section>
    </main>
  )
}
