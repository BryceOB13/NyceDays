import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { EventCard, EventsHeader, NyceListSection } from "@/components/community"
import { PoshFollowSection } from "@/components/community/posh-follow-section"
import { getUpcomingEvents } from "@/lib/queries"

export const metadata = {
  title: "Events | Nyce Days",
  description: "Active Nyce Days events and the Nyce List. Hear first. No algorithm in the way.",
}

export default async function CommunityPage() {
  const events = await getUpcomingEvents()

  return (
    <main>
      {/* Events-first hero with active events front and center */}
      <EventsHeader activeEvents={events} />

      {/* Full upcoming events grid */}
      <Section id="events-grid" className="bg-background">
        <FadeUp>
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Upcoming Events
          </h2>
        </FadeUp>

        {events.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <FadeUp key={event.id} delay={index * 0.1}>
                <EventCard event={event} />
              </FadeUp>
            ))}
          </div>
        ) : (
          <FadeUp>
            <div className="mt-8 rounded-lg bg-secondary p-8 text-center">
              <p className="text-lg text-muted-foreground">
                No events live right now.
              </p>
              <p className="mt-2 text-muted-foreground/70">
                Join the Nyce List to hear first when something drops.
              </p>
            </div>
          </FadeUp>
        )}
      </Section>

      {/* The Nyce List - secondary, after people see the events */}
      <NyceListSection />

      {/* Posh follow */}
      <PoshFollowSection />
    </main>
  )
}
