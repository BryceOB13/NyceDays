'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { FadeUp } from '@/components/shared/fade-up'
import { Music, CheckCircle } from 'lucide-react'

const DJ_CAP = 20

const GENRES = [
  'House', 'Afrobeats', 'R&B/Neo-Soul', 'Hip-Hop',
  'Dancehall/Soca', 'Amapiano', 'Open Format', 'Other',
] as const

const TIME_SLOTS = [
  '3:00–3:30', '3:30–4:00', '4:00–4:30', '4:30–5:00', '5:00–5:30',
  '5:30–6:00', '6:00–6:30', '6:30–7:00', '7:00–7:30', '7:30–8:00',
  'No preference / any slot',
] as const

const djSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  instagram_handle: z.string().min(1, 'IG handle is required'),
  genre: z.string().min(1, 'Genre is required'),
  genre_other: z.string().optional(),
  time_slot_preference: z.array(z.string()).min(1, 'Pick at least one slot'),
}).refine(d => d.genre !== 'Other' || (d.genre_other && d.genre_other.trim().length > 0), {
  message: 'Please specify your genre',
  path: ['genre_other'],
})

const waitlistSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  instagram_handle: z.string().min(1, 'IG handle is required'),
})

type DJFormData = z.infer<typeof djSchema>
type WaitlistFormData = z.infer<typeof waitlistSchema>

export function InvitationalSignup() {
  const [djCount, setDjCount] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [successType, setSuccessType] = useState<'dj' | 'waitlist'>('dj')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/invitational')
      .then(r => r.json())
      .then(d => setDjCount(d.djCount ?? 0))
      .catch(() => setDjCount(0))
  }, [])

  const isDJPhase = djCount !== null && djCount < DJ_CAP

  if (djCount === null) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <FadeUp>
        <div className="rounded-xl border border-nd-red/20 bg-nd-red/5 p-8 text-center max-w-lg mx-auto">
          <CheckCircle className="h-10 w-10 text-nd-red mx-auto mb-4" />
          {successType === 'dj' ? (
            <>
              <h3 className="font-serif text-xl mb-2">You're in the mix.</h3>
              <p className="text-sm text-muted-foreground">
                We'll reach out via email or IG to confirm your slot.
              </p>
            </>
          ) : (
            <>
              <h3 className="font-serif text-xl mb-2">You're on the list.</h3>
              <p className="text-sm text-muted-foreground">
                We'll hit you up with the details for Sunday, April 12 — come vibe with us.
              </p>
            </>
          )}
        </div>
      </FadeUp>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <FadeUp>
        {/* Event header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nd-red/10 text-nd-red text-xs font-medium uppercase tracking-wider mb-4">
            <Music className="h-3 w-3" />
            Open Deck Showcase
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold uppercase tracking-wide">
            Nyce Invitational
          </h2>
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <p>Sunday, April 12, 2026</p>
            <p>The Wharf, Washington, DC</p>
            <p>3:00 PM – 8:00 PM · 30-minute sets</p>
            <p className="text-xs italic mt-2">VHS / analog filmed showcase</p>
          </div>
        </div>

        {isDJPhase ? (
          <DJForm
            status={status}
            errorMsg={errorMsg}
            onSubmit={async (data) => {
              setStatus('loading')
              setErrorMsg('')
              try {
                const res = await fetch('/api/invitational', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...data, signup_type: 'dj' }),
                })
                const result = await res.json()
                if (result.error === 'dj_cap_reached') {
                  // Race condition: cap reached between load and submit
                  setDjCount(DJ_CAP)
                  setStatus('idle')
                  setErrorMsg('DJ spots just filled up — but you can join the waitlist below.')
                  return
                }
                if (!res.ok) {
                  setStatus('error')
                  setErrorMsg(result.message || 'Something went wrong.')
                  return
                }
                setSuccessType('dj')
                setStatus('success')
              } catch {
                setStatus('error')
                setErrorMsg('Network error. Try again.')
              }
            }}
          />
        ) : (
          <>
            <p className="text-center text-sm text-muted-foreground mb-6">
              DJ spots for Sunday, April 12 are filled — but pull up! Drop your info to get on the
              waitlist or just come through and catch the sets at The Wharf from 3 PM to 8 PM.
            </p>
            {errorMsg && (
              <p className="text-center text-sm text-nd-red mb-4">{errorMsg}</p>
            )}
            <WaitlistForm
              status={status}
              errorMsg={errorMsg}
              onSubmit={async (data) => {
                setStatus('loading')
                setErrorMsg('')
                try {
                  const res = await fetch('/api/invitational', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...data, signup_type: 'waitlist' }),
                  })
                  if (!res.ok) {
                    const result = await res.json()
                    setStatus('error')
                    setErrorMsg(result.message || 'Something went wrong.')
                    return
                  }
                  setSuccessType('waitlist')
                  setStatus('success')
                } catch {
                  setStatus('error')
                  setErrorMsg('Network error. Try again.')
                }
              }}
            />
          </>
        )}
      </FadeUp>
    </div>
  )
}

// --- DJ Form ---

function DJForm({ status, errorMsg, onSubmit }: {
  status: string
  errorMsg: string
  onSubmit: (data: DJFormData) => void
}) {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])

  const form = useForm<DJFormData>({
    resolver: zodResolver(djSchema),
    defaultValues: {
      full_name: '', email: '', instagram_handle: '',
      genre: '', genre_other: '', time_slot_preference: [],
    },
  })

  const genre = form.watch('genre')

  const toggleSlot = (slot: string) => {
    const updated = selectedSlots.includes(slot)
      ? selectedSlots.filter(s => s !== slot)
      : [...selectedSlots, slot]
    setSelectedSlots(updated)
    form.setValue('time_slot_preference', updated, { shouldValidate: true })
  }

  const inputClasses = 'bg-transparent border-border/50 h-9 text-sm focus:border-nd-red transition-colors'
  const labelClasses = 'text-foreground text-xs'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="full_name" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={labelClasses}>Full Name *</FormLabel>
              <FormControl><Input placeholder="Your name" className={inputClasses} disabled={status === 'loading'} {...field} /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={labelClasses}>Email *</FormLabel>
              <FormControl><Input type="email" placeholder="you@email.com" className={inputClasses} disabled={status === 'loading'} {...field} /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="instagram_handle" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={labelClasses}>Instagram *</FormLabel>
              <FormControl><Input placeholder="@yourhandle" className={inputClasses} disabled={status === 'loading'} {...field} /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />
          <FormField control={form.control} name="genre" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={labelClasses}>Genre *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={status === 'loading'}>
                <FormControl>
                  <SelectTrigger className="bg-transparent border-border/50 h-9 text-sm focus:border-nd-red transition-colors">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover border-border">
                  {GENRES.map(g => <SelectItem key={g} value={g} className="text-sm">{g}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />
        </div>

        {genre === 'Other' && (
          <FormField control={form.control} name="genre_other" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={labelClasses}>Specify Genre *</FormLabel>
              <FormControl><Input placeholder="Your genre" className={inputClasses} disabled={status === 'loading'} {...field} /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />
        )}

        {/* Time slot multi-select */}
        <FormField control={form.control} name="time_slot_preference" render={() => (
          <FormItem className="space-y-2">
            <FormLabel className={labelClasses}>Preferred Time Slots *</FormLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  disabled={status === 'loading'}
                  className={`px-3 py-2 text-xs rounded-md border transition-all ${
                    selectedSlots.includes(slot)
                      ? 'bg-nd-red text-white border-nd-red'
                      : 'bg-transparent border-border/50 text-muted-foreground hover:border-nd-red/50 hover:text-foreground'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <FormMessage className="text-xs" />
          </FormItem>
        )} />

        {errorMsg && <p className="text-xs text-destructive">{errorMsg}</p>}

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-nd-red hover:bg-nd-red/90 text-white h-10 text-sm font-medium"
        >
          {status === 'loading' ? 'Submitting...' : 'Sign Up to Spin'}
        </Button>
      </form>
    </Form>
  )
}

// --- Waitlist Form ---

function WaitlistForm({ status, errorMsg, onSubmit }: {
  status: string
  errorMsg: string
  onSubmit: (data: WaitlistFormData) => void
}) {
  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { full_name: '', email: '', instagram_handle: '' },
  })

  const inputClasses = 'bg-transparent border-border/50 h-9 text-sm focus:border-nd-red transition-colors'
  const labelClasses = 'text-foreground text-xs'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="full_name" render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className={labelClasses}>Full Name *</FormLabel>
            <FormControl><Input placeholder="Your name" className={inputClasses} disabled={status === 'loading'} {...field} /></FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className={labelClasses}>Email *</FormLabel>
            <FormControl><Input type="email" placeholder="you@email.com" className={inputClasses} disabled={status === 'loading'} {...field} /></FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )} />
        <FormField control={form.control} name="instagram_handle" render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className={labelClasses}>Instagram *</FormLabel>
            <FormControl><Input placeholder="@yourhandle" className={inputClasses} disabled={status === 'loading'} {...field} /></FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )} />

        {errorMsg && <p className="text-xs text-destructive">{errorMsg}</p>}

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-nd-red hover:bg-nd-red/90 text-white h-10 text-sm font-medium"
        >
          {status === 'loading' ? 'Submitting...' : 'Join the Waitlist'}
        </Button>
      </form>
    </Form>
  )
}
