'use client'

import { useMemo } from 'react'

export type Availability = {
  presets: string[]
  grid: Record<string, string[]>
  weeks: string[]
  notes: string
}

export const EMPTY_AVAILABILITY: Availability = { presets: [], grid: {}, weeks: [], notes: '' }

const DAYS: [string, string][] = [
  ['mon', 'Mon'],
  ['tue', 'Tue'],
  ['wed', 'Wed'],
  ['thu', 'Thu'],
  ['fri', 'Fri'],
  ['sat', 'Sat'],
  ['sun', 'Sun'],
]
const SLOTS: [string, string][] = [
  ['morning', 'Morning'],
  ['afternoon', 'Afternoon'],
  ['evening', 'Evening'],
  ['late', 'Late'],
]
const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri']
const WEEKEND = ['sat', 'sun']
const WEEKS: [string, string][] = [
  ['jul_6', 'Jul 6'],
  ['jul_13', 'Jul 13'],
  ['jul_20', 'Jul 20'],
  ['jul_27', 'Jul 27'],
]

type Preset = { id: string; label: string; covers: (day: string, slot: string) => boolean }
// No "free all the time" preset on purpose — most people work weekdays, so the
// realistic windows are weekday nights and weekends. Anyone genuinely open during
// a weekday daytime can still tap those specific cells in the grid.
const PRESETS: Preset[] = [
  { id: 'weekends', label: 'weekends', covers: (d) => WEEKEND.includes(d) },
  { id: 'weekday_nights', label: 'weekday nights', covers: (d, s) => WEEKDAYS.includes(d) && (s === 'evening' || s === 'late') },
  { id: 'weekday_days', label: 'weekday days', covers: (d, s) => WEEKDAYS.includes(d) && (s === 'morning' || s === 'afternoon') },
]

const cellKey = (day: string, slot: string) => `${day}:${slot}`

function isPresetActive(p: Preset, grid: Record<string, string[]>): boolean {
  for (const [d] of DAYS) {
    for (const [s] of SLOTS) {
      if (p.covers(d, s) && !(grid[d] || []).includes(s)) return false
    }
  }
  return true
}

function summarize(grid: Record<string, string[]>): string {
  const has = (d: string, s: string) => (grid[d] || []).includes(s)
  const phrases: string[] = []

  for (const [slot, slotLabel] of SLOTS) {
    const weekdayAll = WEEKDAYS.every((d) => has(d, slot))
    const weekendAll = WEEKEND.every((d) => has(d, slot))
    if (weekdayAll && weekendAll) phrases.push(`${slotLabel.toLowerCase()}s`)
    else {
      if (weekdayAll) phrases.push(`weekday ${slotLabel.toLowerCase()}s`)
      if (weekendAll) phrases.push(`weekend ${slotLabel.toLowerCase()}s`)
    }
  }

  const total = DAYS.reduce((n, [d]) => n + (grid[d] || []).length, 0)
  if (phrases.length === 0) {
    if (total === 0) return ''
    return `${total} time slot${total === 1 ? '' : 's'} picked`
  }
  return phrases.slice(0, 3).join(' + ')
}

export function AvailabilityGrid({
  value,
  onChange,
}: {
  value: Availability
  onChange: (v: Availability) => void
}) {
  const grid = value.grid || {}

  const activePresets = useMemo(
    () => PRESETS.filter((p) => isPresetActive(p, grid)).map((p) => p.id),
    [grid]
  )
  const summary = useMemo(() => summarize(grid), [grid])

  const emit = (nextGrid: Record<string, string[]>) => {
    const presets = PRESETS.filter((p) => isPresetActive(p, nextGrid)).map((p) => p.id)
    onChange({ ...value, grid: nextGrid, presets })
  }

  const toggleCell = (day: string, slot: string) => {
    const cur = new Set(grid[day] || [])
    if (cur.has(slot)) cur.delete(slot)
    else cur.add(slot)
    const next = { ...grid }
    if (cur.size) next[day] = Array.from(cur)
    else delete next[day]
    emit(next)
  }

  const togglePreset = (p: Preset) => {
    const active = activePresets.includes(p.id)
    const next: Record<string, string[]> = {}
    for (const [d] of DAYS) next[d] = [...(grid[d] || [])]
    for (const [d] of DAYS) {
      const set = new Set(next[d])
      for (const [s] of SLOTS) {
        if (!p.covers(d, s)) continue
        if (active) set.delete(s)
        else set.add(s)
      }
      if (set.size) next[d] = Array.from(set)
      else delete next[d]
    }
    emit(next)
  }

  const toggleWeek = (id: string) => {
    const weeks = new Set(value.weeks || [])
    if (weeks.has(id)) weeks.delete(id)
    else weeks.add(id)
    onChange({ ...value, weeks: Array.from(weeks) })
  }

  return (
    <div className="space-y-6">
      {/* Quick-pick presets */}
      <div>
        <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.22em] text-white/40">Quick pick</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const active = activePresets.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={active}
                onClick={() => togglePreset(p)}
                className={`rounded-full border px-3.5 py-1.5 font-sans text-sm transition-all ${
                  active
                    ? 'border-transparent bg-[#C95E6C] text-white'
                    : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tappable grid */}
      <div>
        <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.22em] text-white/40">
          Tap the times you&apos;re around
        </p>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr>
                <th className="w-12 bg-white/[0.03] p-1.5" aria-hidden="true" />
                {SLOTS.map(([s, label]) => (
                  <th
                    key={s}
                    scope="col"
                    className="bg-white/[0.03] p-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-white/45"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map(([d, label]) => (
                <tr key={d}>
                  <th
                    scope="row"
                    className="border-t border-white/10 bg-white/[0.03] p-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-white/55"
                  >
                    {label}
                  </th>
                  {SLOTS.map(([s, slotLabel]) => {
                    const on = (grid[d] || []).includes(s)
                    return (
                      <td key={cellKey(d, s)} className="border-t border-l border-white/10 p-0">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          aria-label={`${label} ${slotLabel}`}
                          onClick={() => toggleCell(d, s)}
                          className={`flex h-11 w-full items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C95E6C] focus-visible:ring-inset ${
                            on ? 'bg-[#C95E6C] text-white' : 'bg-transparent text-white/20 hover:bg-white/[0.06]'
                          }`}
                        >
                          <span className="text-sm leading-none">{on ? '✓' : '·'}</span>
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {summary && (
          <p className="mt-3 font-serif text-sm italic text-white/60">
            you&apos;re free: <span className="text-white/80">{summary}</span>
          </p>
        )}
      </div>

      {/* July weeks */}
      <div>
        <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.22em] text-white/40">
          Which July weeks are you around?
        </p>
        <div className="flex flex-wrap gap-2">
          {WEEKS.map(([id, label]) => {
            const on = (value.weeks || []).includes(id)
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleWeek(id)}
                className={`rounded-full border px-4 py-1.5 font-sans text-sm transition-all ${
                  on
                    ? 'border-transparent bg-[#C95E6C] text-white'
                    : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="availability-notes" className="mb-2 block font-sans text-[11px] uppercase tracking-[0.22em] text-white/40">
          Anything specific about your schedule? (optional)
        </label>
        <textarea
          id="availability-notes"
          value={value.notes || ''}
          onChange={(e) => onChange({ ...value, notes: e.target.value.slice(0, 500) })}
          rows={2}
          placeholder="back in town the 15th, only free after 6 on weekdays, etc."
          className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 font-sans text-sm text-white placeholder:text-white/30 focus:border-[#C95E6C] focus:outline-none"
        />
      </div>
    </div>
  )
}
