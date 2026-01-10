import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Camera } from "lucide-react"

interface ServiceItem {
  title: string
  description: string
  icon: React.ReactNode
}

const services: ServiceItem[] = [
  {
    title: "Event Curation",
    description:
      "From intimate gatherings to large-scale productions, we craft memorable experiences that bring communities together.",
    icon: <Calendar className="h-10 w-10" />,
  },
  {
    title: "Community Marketing",
    description:
      "We build authentic connections between brands and their audiences through grassroots engagement and cultural relevance.",
    icon: <Users className="h-10 w-10" />,
  },
  {
    title: "Content Creation",
    description:
      "Capturing moments that matter with photography, videography, and creative direction that tells your story.",
    icon: <Camera className="h-10 w-10" />,
  },
]

export function WhatWeDo() {
  return (
    <Section className="bg-nd-cream">
      <FadeUp>
        <h2 className="text-center font-serif text-3xl font-bold text-nd-black md:text-4xl lg:text-5xl">
          What We Do
        </h2>
      </FadeUp>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {services.map((service, index) => (
          <FadeUp key={service.title} delay={0.1 * (index + 1)}>
            <Card className="h-full border-none bg-nd-white shadow-lg transition-transform hover:-translate-y-1">
              <CardHeader className="items-center text-center">
                <div className="mb-4 text-nd-red">{service.icon}</div>
                <CardTitle className="font-serif text-xl text-nd-black">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center font-sans text-nd-gray-600">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          </FadeUp>
        ))}
      </div>
    </Section>
  )
}
