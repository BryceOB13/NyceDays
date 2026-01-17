import { NewsletterForm } from "@/components/community/newsletter-form"
import { FadeUp } from "@/components/shared/fade-up"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <FadeUp>
        <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
          Join the Nyce List
        </p>
        <div className="w-full max-w-md">
          <NewsletterForm source="shop" />
        </div>
      </FadeUp>
    </div>
  )
}
