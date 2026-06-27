'use client'

import { useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Archive, Star, Instagram, ExternalLink, Save } from 'lucide-react'

interface Availability {
  recurring?: string[]
  specific?: { date: string; note?: string }[]
  notes?: string
}

interface Casting {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  instagram_handle: string | null
  other_socials: string | null
  portfolio_url: string | null
  contact_preference: string | null
  sms_consent: boolean
  email_consent: boolean
  applicant_type: string[] | null
  roles: string[] | null
  role_other: string | null
  headline: string | null
  bio: string | null
  experience: string | null
  pronouns: string | null
  is_18_plus: boolean
  city: string | null
  area: string | null
  has_transport: boolean | null
  availability: Availability | null
  earliest_date: string | null
  release_ok: boolean
  heard_from: string | null
  anything_else: string | null
  status: string
  approved: boolean | null
  read: boolean
  archived: boolean
  team_notes: string | null
  campaign: string
}

const STATUSES = ['new', 'reviewing', 'shortlisted', 'booked', 'passed'] as const

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-amber-100 text-amber-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  booked: 'bg-green-100 text-green-800',
  passed: 'bg-gray-100 text-gray-600',
}

function availabilitySummary(a: Availability | null): string {
  if (!a) return '—'
  const parts: string[] = []
  if (a.recurring?.length)
    parts.push(a.recurring.map((r) => r.replace('wk_', 'weekday ').replace('we_', 'weekend ')).join(', '))
  if (a.specific?.length) parts.push(`${a.specific.length} locked date${a.specific.length === 1 ? '' : 's'}`)
  return parts.join(' · ') || '—'
}

export function CastingTable({ submissions: initial }: { submissions: Casting[] }) {
  const [rows, setRows] = useState(initial)
  const [selected, setSelected] = useState<Casting | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'shortlisted' | 'booked' | 'archived'>('all')
  const [notesDraft, setNotesDraft] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const supabase = createClient()

  const filtered = rows.filter((r) => {
    if (filter === 'unread') return !r.read && !r.archived
    if (filter === 'archived') return r.archived
    if (filter === 'shortlisted') return r.status === 'shortlisted' && !r.archived
    if (filter === 'booked') return r.status === 'booked' && !r.archived
    return !r.archived
  })

  const patch = async (id: string, updates: Partial<Casting>) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...updates } : r)))
    setSelected((s) => (s && s.id === id ? { ...s, ...updates } : s))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('casting_submissions').update(updates).eq('id', id)
  }

  const handleSelect = (row: Casting) => {
    setSelected(row)
    setNotesDraft(row.team_notes || '')
    if (!row.read) patch(row.id, { read: true })
  }

  const saveNotes = async () => {
    if (!selected) return
    setSavingNotes(true)
    await patch(selected.id, { team_notes: notesDraft })
    setSavingNotes(false)
  }

  const fmt = (d: string, withTime = false) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}),
    })

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6">
      {/* List */}
      <div className="flex w-1/2 flex-col overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-wrap gap-2 border-b p-4">
          {(['all', 'unread', 'shortlisted', 'booked', 'archived'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm capitalize transition-colors ${
                filter === f ? 'bg-foreground text-background' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-muted-foreground">No submissions</p>
          ) : (
            filtered.map((row) => (
              <button
                key={row.id}
                onClick={() => handleSelect(row)}
                className={`w-full border-b p-4 text-left transition-colors hover:bg-muted/50 ${
                  selected?.id === row.id ? 'bg-muted' : ''
                } ${!row.read ? 'bg-primary/5' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`truncate font-medium ${!row.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {row.full_name}
                  </span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[row.status] || ''}`}>
                    {row.status}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(row.applicant_type || []).map((t) => (
                    <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {row.headline || row.email}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {(row.city || '').toUpperCase()} · {fmt(row.created_at, true)}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="w-1/2 overflow-hidden rounded-xl border bg-card">
        {selected ? (
          <div className="flex h-full flex-col">
            <div className="border-b p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold">
                    {selected.full_name}
                    {selected.pronouns ? (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">({selected.pronouns})</span>
                    ) : null}
                  </h2>
                  <a href={`mailto:${selected.email}`} className="text-primary hover:underline">
                    {selected.email}
                  </a>
                  <p className="text-sm text-muted-foreground">
                    {selected.phone} · prefers {selected.contact_preference}
                  </p>
                </div>
                <button
                  onClick={() => patch(selected.id, { archived: !selected.archived })}
                  className="rounded-lg p-2 transition-colors hover:bg-muted"
                  title={selected.archived ? 'Unarchive' : 'Archive'}
                >
                  <Archive className="h-5 w-5" />
                </button>
              </div>

              {/* Status pipeline */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => patch(selected.id, { status: s })}
                    className={`rounded-full px-2.5 py-1 text-xs capitalize transition-colors ${
                      selected.status === s ? statusColors[s] : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    }`}
                  >
                    {selected.status === s && <Star className="mr-1 inline h-3 w-3" />}
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6 text-sm">
              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {selected.instagram_handle && (
                  <a
                    href={`https://instagram.com/${selected.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <Instagram className="h-4 w-4" />@{selected.instagram_handle}
                  </a>
                )}
                {selected.portfolio_url && (
                  <a
                    href={selected.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" /> portfolio
                  </a>
                )}
              </div>

              <Detail label="Applying as">{(selected.applicant_type || []).join(', ') || '—'}</Detail>
              <Detail label="Roles">
                {[...(selected.roles || []), selected.role_other].filter(Boolean).join(', ') || '—'}
              </Detail>
              {selected.headline && <Detail label="Headline">{selected.headline}</Detail>}
              {selected.experience && (
                <Detail label="Bio / experience">
                  <span className="whitespace-pre-wrap">{selected.experience}</span>
                </Detail>
              )}
              <Detail label="Location">
                {(selected.city || '').toUpperCase()}
                {selected.area ? ` · ${selected.area}` : ''} · 18+: {selected.is_18_plus ? 'yes' : 'no'} ·
                transport: {selected.has_transport ? 'yes' : 'no'}
              </Detail>
              <Detail label="Availability">{availabilitySummary(selected.availability)}</Detail>
              {selected.availability?.specific?.length ? (
                <Detail label="Locked-in dates">
                  {selected.availability.specific
                    .map((s) => (s.note ? `${s.date} (${s.note})` : s.date))
                    .join(', ')}
                </Detail>
              ) : null}
              {selected.availability?.notes && <Detail label="Schedule notes">{selected.availability.notes}</Detail>}
              {selected.earliest_date && <Detail label="Earliest date">{selected.earliest_date}</Detail>}
              {selected.other_socials && <Detail label="Other socials">{selected.other_socials}</Detail>}
              {selected.heard_from && <Detail label="Heard from">{selected.heard_from}</Detail>}
              {selected.anything_else && (
                <Detail label="Anything else">
                  <span className="whitespace-pre-wrap">{selected.anything_else}</span>
                </Detail>
              )}
              <Detail label="Consent / release">
                release {selected.release_ok ? 'yes' : 'no'} · sms {selected.sms_consent ? 'yes' : 'no'} · email{' '}
                {selected.email_consent ? 'yes' : 'no'}
              </Detail>
              <Detail label="Received">{fmt(selected.created_at, true)} · {selected.campaign}</Detail>

              {/* Team notes */}
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Team notes</p>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="Internal notes about this person..."
                />
                <button
                  onClick={saveNotes}
                  disabled={savingNotes || notesDraft === (selected.team_notes || '')}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-1.5 text-sm text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingNotes ? 'Saving...' : 'Save notes'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a submission to view
          </div>
        )}
      </div>
    </div>
  )
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-foreground">{children}</p>
    </div>
  )
}
