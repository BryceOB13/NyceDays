'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

import { Mail, MailOpen, Archive, Trash2 } from 'lucide-react'

interface Contact {
  id: string
  created_at: string
  name: string
  email: string
  company: string | null
  inquiry_type: string
  message: string
  referral: string | null
  read: boolean
  archived: boolean
}

interface ContactsTableProps {
  contacts: Contact[]
}

export function ContactsTable({ contacts: initialContacts }: ContactsTableProps) {
  const [contacts, setContacts] = useState(initialContacts)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all')
  const supabase = createClient()

  const filteredContacts = contacts.filter((contact) => {
    if (filter === 'unread') return !contact.read && !contact.archived
    if (filter === 'archived') return contact.archived
    return !contact.archived
  })

  const markAsRead = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('contact_submissions')
      .update({ read: true })
      .eq('id', id)

    setContacts(contacts.map(c => c.id === id ? { ...c, read: true } : c))
  }

  const toggleArchive = async (id: string, archived: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('contact_submissions')
      .update({ archived: !archived })
      .eq('id', id)

    setContacts(contacts.map(c => c.id === id ? { ...c, archived: !archived } : c))
    if (selectedContact?.id === id) setSelectedContact(null)
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('contact_submissions')
      .delete()
      .eq('id', id)

    setContacts(contacts.filter(c => c.id !== id))
    if (selectedContact?.id === id) setSelectedContact(null)
  }

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact)
    if (!contact.read) markAsRead(contact.id)
  }

  const inquiryTypeColors: Record<string, string> = {
    partnership: 'bg-purple-100 text-purple-800',
    event: 'bg-blue-100 text-blue-800',
    content: 'bg-green-100 text-green-800',
    general: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* List */}
      <div className="w-1/2 flex flex-col bg-card border rounded-xl overflow-hidden">
        {/* Filters */}
        <div className="flex gap-2 p-4 border-b">
          {(['all', 'unread', 'archived'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === f
                  ? 'bg-foreground text-background'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <p className="p-4 text-muted-foreground text-center">No messages</p>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                  selectedContact?.id === contact.id ? 'bg-muted' : ''
                } ${!contact.read ? 'bg-primary/5' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${!contact.read ? 'bg-primary/10' : 'bg-muted'}`}>
                    {contact.read ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium truncate ${!contact.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {contact.name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${inquiryTypeColors[contact.inquiry_type]}`}>
                        {contact.inquiry_type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
                    <p className="text-sm text-muted-foreground truncate mt-1">{contact.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(contact.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="w-1/2 bg-card border rounded-xl overflow-hidden">
        {selectedContact ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedContact.name}</h2>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                  {selectedContact.company && (
                    <p className="text-muted-foreground mt-1">{selectedContact.company}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleArchive(selectedContact.id, selectedContact.archived)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title={selectedContact.archived ? 'Unarchive' : 'Archive'}
                  >
                    <Archive className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteContact(selectedContact.id)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <span className={`text-xs px-2 py-1 rounded-full ${inquiryTypeColors[selectedContact.inquiry_type]}`}>
                  {selectedContact.inquiry_type}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(selectedContact.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Message */}
            <div className="flex-1 p-6 overflow-y-auto">
              <p className="whitespace-pre-wrap">{selectedContact.message}</p>
              {selectedContact.referral && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Referral:</span> {selectedContact.referral}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t">
              <a
                href={`mailto:${selectedContact.email}?subject=Re: Your inquiry to Nyce Days`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Reply via Email
              </a>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a message to view
          </div>
        )}
      </div>
    </div>
  )
}
