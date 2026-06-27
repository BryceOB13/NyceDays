// Admin access allowlist. Only these emails can use the /admin dashboard.
//
// To add or change admins:
//   1. Set ADMIN_EMAILS (comma-separated) in the environment, or edit the default below.
//   2. Update the casting_submissions RLS policies in Supabase to match (the email list is
//      hardcoded there too, since Postgres policies can't read app env vars).
const RAW = process.env.ADMIN_EMAILS || 'bryce@nycedays.com'

export const ADMIN_EMAILS = RAW.split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase())
}
