import Link from "next/link"
import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { getUpcomingEvents } from "@/lib/queries"

export async function WhatWeDo() {
  const events = await getUpcomingEvents()
  const displayEvents = events.slice(0, 3) // Show max 3

  return (
    <Section className="bg-background">
      <FadeUp>
        <p className="text-center font-sans text-xs font-medium uppercase tracking-widest text-nd-red">
          Upcoming
        </p>
        <h2 className="mt-3 text-center font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
          Next Experiences
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Join us at our upcoming events and become part of the community.
        </p>
      </FadeUp>

      {displayEvents.length > 0 ? (
        <>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {displayEvents.map((event, index) => {
              const eventDate = new Date(event.date)
              const formattedDate = eventDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              }).toUpperCase()
              
              return (
                <FadeUp key={event.id} delay={0.1 * (index + 1)}>
                  <Link href={event.ticket_url || `/community`}>
                    <Card className="group h-full border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-nd-red/50 cursor-pointer overflow-hidden">
                      <CardContent className="p-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-nd-red">
                          {formattedDate}
                        </p>
                        <h3 className="mt-2 font-serif text-xl font-semibold text-foreground group-hover:text-nd-red transition-colors">
                          {event.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.location}
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-foreground/70 group-hover:text-nd-red group-hover:gap-2 transition-all">
                          {event.ticket_url ? 'Get Tickets' : 'Details'}
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeUp>
              )
            })}
          </div>

          <FadeUp delay={0.4}>
            <div className="mt-10 text-center">
              <Link 
                href="/community" 
                className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-foreground hover:text-nd-red transition-colors"
              >
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeUp>
        </>
      ) : (
        <FadeUp delay={0.2}>
          <div className="mt-12 text-center">
            <div className="mx-auto max-w-md">
              <p className="text-lg text-muted-foreground mb-6">
                Something special is in the works.
              </p>
              <p className="text-muted-foreground/70 mb-8">
                Join the Nyce List to be the first to know when we announce our next experience.
              </p>
              <Link 
                href="/community" 
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-nd-red text-white font-medium uppercase tracking-wider text-sm rounded-full hover:bg-nd-red/90 transition-all"
              >
                Join The Nyce List
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </FadeUp>
      )}
    </Section>
  )
}
