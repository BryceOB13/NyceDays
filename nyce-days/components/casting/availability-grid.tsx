'use client'

import { useMemo, useState } from 'react'
import { X, Plus, CalendarDays } from 'lucide-react'

// Targeted availability capture: recurring weekly windows + specific lock-in dates.
// Structured so submissions can be matched to shoot dates later.
export type Availability = {
  recurring: string[]
  specific: { date: string; note?: string }[]
  notes: string
}

export const EMPTY_AVAILABILITY: Availability = { recurring: [], specific: [], notes: '' }

// Pre-split by weekday/weekend so the common patterns are one tap and precise —
// no 28-cell grid, no implying someone is free around the clock.
const RECURRING: { id: string; label: string }[] = [
  { id: 'wk_evening', label: 'weekday evenings' },
  { id: 'we_day', label: 'weekend daytime' },
  { id: 'we_evening', label: 'weekend evenings' },
  { id: 'wk_late', label: 'weekday late nights' },
  { id: 'wk_afternoon', label: 'weekday afternoons' },
  { id: 'wk_morning', label: 'weekday mornings' },
]
const RECURRING_LABEL: Record<string, string> = Object.fromEntries(RECURRING.map((r) => [r.id, r.label]))

function fmtDate(d: string): string {
  const dt = new Date(d + 'T00:00:00')
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const chipBase = 'rounded-full border px-3.5 py-1.5 font-sans text-sm transition-all'
const chipOn = 'border-transparent bg-[#C95E6C] text-white'
const chipOff = 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
const inputBase =
  'rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 font-sans text-base text-white placeholder:text-white/30 focus:border-[#C95E6C] focus:outline-none transition-colors'

export function AvailabilityGrid({
  value,
  onChange,
}: {
  value: Availability
  onChange: (v: Availability) => void
}) {
  const [draftDate, setDraftDate] = useState('')
  const [draftNote, setDraftNote] = useState('')

  const recurring = value.recurring || []
  const specific = value.specific || []

  const toggleRecurring = (id: string) => {
    const set = new Set(recurring)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    onChange({ ...value, recurring: Array.from(set) })
  }

  const addSpecific = () => {
    if (!draftDate) return
    const note = draftNote.trim() || undefined
    const without = specific.filter((s) => s.date !== draftDate)
    const next = [...without, { date: draftDate, note }].sort((a, b) => a.date.localeCompare(b.date))
    onChange({ ...value, specific: next })
    setDraftDate('')
    setDraftNote('')
  }

  const removeSpecific = (date: string) => {
    onChange({ ...value, specific: specific.filter((s) => s.date !== date) })
  }

  const recurringSummary = useMemo(
    () => recurring.map((id) => RECURRING_LABEL[id]).filter(Boolean).join(', '),
    [recurring]
  )

  return (
    <div className="space-y-7">
      {/* Recurring windows */}
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-white/40">
          When are you usually free?
        </p>
        <p className="mb-3 mt-1 font-sans text-xs text-white/35">
          pick the windows that repeat for you, week to week.
        </p>
        <div className="flex flex-wrap gap-2">
          {RECURRING.map((r) => {
            const on = recurring.includes(r.id)
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleRecurring(r.id)}
                className={`${chipBase} ${on ? chipOn : chipOff}`}
              >
                {r.label}
              </button>
            )
          })}
        </div>
        {recurringSummary && (
          <p className="mt-3 font-serif text-sm italic text-white/60">
            usually free: <span className="text-white/80">{recurringSummary}</span>
          </p>
        )}
      </div>

      {/* Specific lock-in dates */}
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-white/40">
          Lock in specific days
        </p>
        <p className="mb-3 mt-1 font-sans text-xs text-white/35">
          days you already know you&apos;re free. this is what gets you matched to a shoot.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="date"
            value={draftDate}
            onChange={(e) => setDraftDate(e.target.value)}
            aria-label="Date you are free"
            className={`${inputBase} [color-scheme:dark] sm:w-44`}
          />
          <input
            type="text"
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value.slice(0, 200))}
            placeholder="optional note (off work, free all day...)"
            aria-label="Note about that day"
            className={`${inputBase} flex-1`}
          />
          <button
            type="button"
            onClick={addSpecific}
            disabled={!draftDate}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/20 px-4 py-3 font-sans text-sm text-white transition-colors hover:border-white/50 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> add
          </button>
        </div>
        {specific.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {specific.map((s) => (
              <span
                key={s.date}
                className="inline-flex items-center gap-2 rounded-full border border-[#C95E6C]/40 bg-[#C95E6C]/10 px-3 py-1.5 font-sans text-sm text-white"
              >
                <CalendarDays className="h-3.5 w-3.5 text-[#C95E6C]" />
                {fmtDate(s.date)}
                {s.note ? <span className="text-white/60">· {s.note}</span> : null}
                <button
                  type="button"
                  onClick={() => removeSpecific(s.date)}
                  aria-label={`Remove ${fmtDate(s.date)}`}
                  className="text-white/50 transition-colors hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="availability-notes"
          className="mb-2 block font-sans text-[11px] uppercase tracking-[0.22em] text-white/40"
        >
          Anything else about your schedule? (optional)
        </label>
        <textarea
          id="availability-notes"
          value={value.notes || ''}
          onChange={(e) => onChange({ ...value, notes: e.target.value.slice(0, 500) })}
          rows={2}
          placeholder="back in town the 15th, only free after 6 on weekdays, etc."
          className={`${inputBase} w-full text-sm`}
        />
      </div>
    </div>
  )
}
