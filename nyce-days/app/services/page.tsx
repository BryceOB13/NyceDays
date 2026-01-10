import Link from "next/link"
import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Camera, ShoppingBag } from "lucide-react"

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
    icon: <Calendar className="h-12 w-12" />,
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
    icon: <Users className="h-12 w-12" />,
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
    icon: <Camera className="h-12 w-12" />,
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
    icon: <ShoppingBag className="h-12 w-12" />,
  },
]

export default function ServicesPage() {
  return (
    <main>
      {/* Hero Section */}
      <Section className="bg-nd-black pt-32">
        <FadeUp>
          <h1 className="text-center font-serif text-4xl font-bold text-nd-white md:text-5xl lg:text-6xl">
            Our Services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-nd-gray-400">
            Full-service creative solutions for brands looking to connect with culture and community.
          </p>
        </FadeUp>
      </Section>

      {/* Services Grid */}
      <Section className="bg-nd-cream">
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <FadeUp key={service.title} delay={0.1 * (index + 1)}>
              <Card className="h-full border-none bg-nd-white shadow-lg">
                <CardHeader>
                  <div className="mb-4 text-nd-red">{service.icon}</div>
                  <CardTitle className="font-serif text-2xl text-nd-black">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-nd-gray-600">{service.description}</p>
                  <ul className="mt-6 space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-nd-gray-700">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-nd-red" />
                        {feature}
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
            <h2 className="font-serif text-3xl font-bold text-nd-white md:text-4xl">
              Ready to Work Together?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-nd-white/90">
              Let&apos;s discuss how we can help bring your vision to life. Get in touch to start the conversation.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-nd-white px-8 py-6 text-lg font-semibold text-nd-red hover:bg-nd-white/90"
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </FadeUp>
        </div>
      </Section>
    </main>
  )
}
