import { notFound } from 'next/navigation'

// Unpublished alongside /media/apply between events.
export const metadata = {
  robots: { index: false, follow: false },
}

export default function MediaThanksPage() {
  notFound()
}
