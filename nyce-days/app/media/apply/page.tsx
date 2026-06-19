import { notFound } from 'next/navigation'

// Media credentials signup is unpublished between events.
// To re-publish: restore the previous version from git history and add the
// upcoming event to lib/media-events.ts.
export const metadata = {
  robots: { index: false, follow: false },
}

export default function MediaApplyPage() {
  notFound()
}
