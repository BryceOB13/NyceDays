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
    icon: <Calendar className="h-8 w-8" />,
  },
  {
    title: "Community Marketing",
    description:
      "We build authentic connections between brands and their audiences through grassroots engagement and cultural relevance.",
    icon: <Users className="h-8 w-8" />,
  },
  {
    title: "Content Creation",
    description:
      "Capturing moments that matter with photography, videography, and creative direction that tells your story.",
    icon: <Camera className="h-8 w-8" />,
  },
]

export function WhatWeDo() {
  return (
    <Section className="bg-background">
      <FadeUp>
        <p className="text-center font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
          What We Do
        </p>
        <h2 className="mt-3 text-center font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
          Full-Service Creative Solutions
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          We help brands connect with culture and community through events, content, and authentic engagement.
        </p>
      </FadeUp>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {services.map((service, index) => (
          <FadeUp key={service.title} delay={0.1 * (index + 1)}>
            <Card className="h-full border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nd-red/10 text-nd-red">
                  {service.icon}
                </div>
                <CardTitle className="font-serif text-xl text-foreground">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center font-sans text-muted-foreground leading-relaxed">
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
