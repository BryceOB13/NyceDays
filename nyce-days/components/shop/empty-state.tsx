import { NewsletterForm } from "@/components/community/newsletter-form"
import { FadeUp } from "@/components/shared/fade-up"

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = "No drops right now.",
  description = "Check back soon.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FadeUp>
        <h2 className="font-serif text-3xl font-semibold text-nd-white md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-lg text-nd-gray-400">{description}</p>
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="mt-10 w-full max-w-md">
          <p className="mb-4 text-sm text-nd-gray-400">
            Sign up to be the first to know when new drops are available.
          </p>
          <NewsletterForm source="shop" />
        </div>
      </FadeUp>
    </div>
  )
}
