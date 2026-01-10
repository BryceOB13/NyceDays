import { Section } from "@/components/shared/section"
import { FadeUp } from "@/components/shared/fade-up"
import { EventCard, NewsletterForm } from "@/components/community"
import { getUpcomingEvents } from "@/lib/queries"

export const metadata = {
  title: "Community | Nyce Days",
  description: "Join the Nyce Days community. See upcoming events and sign up for our newsletter.",
}

export default async function CommunityPage() {
  const events = await getUpcomingEvents()

  return (
    <main>
      {/* Hero Section */}
      <Section className="bg-background pt-32">
        <FadeUp>
          <h1 className="text-center font-serif text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            You&apos;re Invited
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Join us at our upcoming events and become part of the Nyce Days community.
          </p>
        </FadeUp>
      </Section>

      {/* Events Section */}
      <Section className="bg-background">
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
                No upcoming events scheduled at the moment.
              </p>
              <p className="mt-2 text-muted-foreground/70">
                Sign up for our newsletter to be the first to know when new events are announced.
              </p>
            </div>
          </FadeUp>
        )}
      </Section>

      {/* Newsletter Section */}
      <Section className="bg-secondary">
        <div className="mx-auto max-w-xl text-center">
          <FadeUp>
            <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
              Stay Connected
            </h2>
            <p className="mt-4 text-muted-foreground">
              Subscribe to our newsletter for event announcements, exclusive content, and community updates.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="mt-8">
              <NewsletterForm source="community" />
            </div>
          </FadeUp>
        </div>
      </Section>
    </main>
  )
}
