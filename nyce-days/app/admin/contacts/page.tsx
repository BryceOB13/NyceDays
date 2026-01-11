import { createClient } from '@/lib/supabase/server'
import { ContactsTable } from '@/components/admin/contacts-table'

async function getContacts() {
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contacts:', error)
    return []
  }

  return data || []
}

export default async function ContactsPage() {
  const contacts = await getContacts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <p className="text-muted-foreground mt-1">
          Manage inquiries from the contact form
        </p>
      </div>

      <ContactsTable contacts={contacts} />
    </div>
  )
}
