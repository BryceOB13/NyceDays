import { supabaseAdmin } from '@/lib/supabase/admin'
import { CastingTable } from '@/components/admin/casting-table'

async function getCasting() {
  // Read with the service-role client (bypasses RLS) — same approach the other
  // submission tables use for admin surfacing.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin as any)
    .from('casting_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching casting submissions:', error)
    return []
  }

  return data || []
}

export default async function CastingAdminPage() {
  const submissions = await getCasting()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Casting Submissions</h1>
        <p className="text-muted-foreground mt-1">
          Summer 2026 casting &amp; collaborator onboarding
        </p>
      </div>

      <CastingTable submissions={submissions} />
    </div>
  )
}
