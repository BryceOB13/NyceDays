'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose,
} from '@/components/ui/sheet'
import { FadeUp } from '@/components/shared/fade-up'
import { CheckCircle, Clock } from 'lucide-react'

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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <FadeUp>
        {/* Stars logo — standard size */}
        <div className="flex justify-center mb-3 md:mb-4">
          <Image src="/logos/stars-white.png" alt="Nyce Days" width={320} height={96}
            className="hidden dark:block object-contain h-24 md:h-28 w-auto" />
          <Image src="/logos/stars-black.png" alt="Nyce Days" width={320} height={96}
            className="dark:hidden object-contain h-24 md:h-28 w-auto" />
        </div>

        {/* Event header */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="font-serif text-[1.65rem] sm:text-4xl md:text-5xl font-bold uppercase tracking-wide leading-none">
            Nyce Invitational
          </h1>
          <div className="mt-2 md:mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground/80">Sunday, April 12, 2026</p>
            <p>The Wharf, DC · 3–8 PM · 30-min sets</p>
          </div>
          <p className="mt-2 md:mt-3 text-xs md:text-sm text-foreground/60 max-w-sm mx-auto leading-snug">
            Think you got next? Step up and show us what you're working with.
          </p>
        </div>
      </FadeUp>

      {status === 'success' ? (
        <FadeUp>
          <div className="rounded-xl border border-nd-red/20 bg-nd-red/5 p-8 text-center">
            <CheckCircle className="h-10 w-10 text-nd-red mx-auto mb-4" />
            {successType === 'dj' ? (
              <>
                <h3 className="font-serif text-xl mb-2">You're in the mix.</h3>
                <p className="text-sm text-muted-foreground">We'll reach out via email or IG to confirm your slot.</p>
              </>
            ) : (
              <>
                <h3 className="font-serif text-xl mb-2">You're on the list.</h3>
                <p className="text-sm text-muted-foreground">We'll hit you up with the details for April 12 — come vibe.</p>
              </>
            )}
          </div>
        </FadeUp>
      ) : (
        <FadeUp delay={0.1}>
          <div className="rounded-xl border border-border/40 bg-card/50 p-4 md:p-5">
            {isDJPhase ? (
              <DJForm status={status} errorMsg={errorMsg} onSubmit={async (data) => {
                setStatus('loading'); setErrorMsg('')
                try {
                  const res = await fetch('/api/invitational', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...data, signup_type: 'dj' }),
                  })
                  const result = await res.json()
                  if (result.error === 'dj_cap_reached') { setDjCount(DJ_CAP); setStatus('idle'); setErrorMsg('DJ spots just filled — join the waitlist below.'); return }
                  if (!res.ok) { setStatus('error'); setErrorMsg(result.message || 'Something went wrong.'); return }
                  setSuccessType('dj'); setStatus('success')
                } catch { setStatus('error'); setErrorMsg('Network error. Try again.') }
              }} />
            ) : (
              <>
                <p className="text-center text-xs text-muted-foreground mb-4 leading-relaxed">
                  DJ spots are filled — drop your info for the waitlist or just pull up to The Wharf on April 12.
                </p>
                <WaitlistForm status={status} errorMsg={errorMsg} onSubmit={async (data) => {
                  setStatus('loading'); setErrorMsg('')
                  try {
                    const res = await fetch('/api/invitational', {
                      method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...data, signup_type: 'waitlist' }),
                    })
                    if (!res.ok) { const r = await res.json(); setStatus('error'); setErrorMsg(r.message || 'Something went wrong.'); return }
                    setSuccessType('waitlist'); setStatus('success')
                  } catch { setStatus('error'); setErrorMsg('Network error. Try again.') }
                }} />
              </>
            )}
          </div>
        </FadeUp>
      )}
    </div>
  )
}

// --- DJ Form ---

function DJForm({ status, errorMsg, onSubmit }: {
  status: string; errorMsg: string; onSubmit: (data: DJFormData) => void
}) {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [sheetOpen, setSheetOpen] = useState(false)
  const form = useForm<DJFormData>({
    resolver: zodResolver(djSchema),
    defaultValues: { full_name: '', email: '', instagram_handle: '', genre: '', genre_other: '', time_slot_preference: [] },
  })
  const genre = form.watch('genre')
  const toggleSlot = (slot: string) => {
    const updated = selectedSlots.includes(slot) ? selectedSlots.filter(s => s !== slot) : [...selectedSlots, slot]
    setSelectedSlots(updated)
    form.setValue('time_slot_preference', updated, { shouldValidate: true })
  }

  const ic = 'bg-background/50 border-border/40 h-10 text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all rounded-lg'
  const lc = 'text-foreground/80 text-xs font-medium'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Row 1: Name + Email — always 2-col */}
        <div className="grid grid-cols-2 gap-3">
          <FormField control={form.control} name="full_name" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={lc}>Full Name *</FormLabel>
              <FormControl><Input placeholder="Your name" className={ic} disabled={status === 'loading'} {...field} /></FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={lc}>Email *</FormLabel>
              <FormControl><Input type="email" placeholder="you@email.com" className={ic} disabled={status === 'loading'} {...field} /></FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )} />
        </div>

        {/* Row 2: IG + Genre — always 2-col */}
        <div className="grid grid-cols-2 gap-3">
          <FormField control={form.control} name="instagram_handle" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={lc}>Instagram *</FormLabel>
              <FormControl><Input placeholder="@handle" className={ic} disabled={status === 'loading'} {...field} /></FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )} />
          <FormField control={form.control} name="genre" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={lc}>Genre *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={status === 'loading'}>
                <FormControl>
                  <SelectTrigger className="bg-background/50 border-border/40 h-10 text-sm focus:border-nd-red transition-all rounded-lg">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover border-border">
                  {GENRES.map(g => <SelectItem key={g} value={g} className="text-sm">{g}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )} />
        </div>

        {genre === 'Other' && (
          <FormField control={form.control} name="genre_other" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={lc}>Specify Genre *</FormLabel>
              <FormControl><Input placeholder="Your genre" className={ic} disabled={status === 'loading'} {...field} /></FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )} />
        )}

        {/* Time slot trigger */}
        <FormField control={form.control} name="time_slot_preference" render={() => (
          <FormItem className="space-y-1">
            <FormLabel className={lc}>Time Slots *</FormLabel>
            <button type="button" onClick={() => setSheetOpen(true)}
              className="w-full flex items-center justify-between bg-background/50 border border-border/40 h-10 px-3 text-sm rounded-lg transition-all hover:border-nd-red/40">
              <span className={selectedSlots.length > 0 ? 'text-foreground text-xs' : 'text-muted-foreground text-xs'}>
                {selectedSlots.length > 0 ? `${selectedSlots.length} slot${selectedSlots.length > 1 ? 's' : ''} selected` : 'Select time slots'}
              </span>
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )} />

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="bottom" className="rounded-t-xl max-h-[70svh]">
            <SheetHeader className="text-center mb-4">
              <SheetTitle>Pick Your Slots</SheetTitle>
              <SheetDescription>Select all that work for you</SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto pb-4">
              {TIME_SLOTS.map(slot => (
                <button key={slot} type="button" onClick={() => toggleSlot(slot)}
                  className={`px-3 py-3 text-sm rounded-lg border transition-all font-medium ${
                    selectedSlots.includes(slot)
                      ? 'bg-nd-red text-white border-nd-red shadow-sm shadow-nd-red/20'
                      : 'bg-background border-border/40 text-muted-foreground hover:border-nd-red/40 hover:text-foreground'
                  }`}>{slot}</button>
              ))}
            </div>
            <SheetClose asChild>
              <Button className="w-full bg-nd-red hover:bg-nd-red/90 text-white h-10 text-sm font-semibold rounded-lg">
                Done{selectedSlots.length > 0 ? ` (${selectedSlots.length})` : ''}
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>

        {errorMsg && <p className="text-[10px] text-destructive text-center">{errorMsg}</p>}

        <Button type="submit" disabled={status === 'loading'}
          className="w-full bg-nd-red hover:bg-nd-red/90 text-white h-10 text-sm font-semibold rounded-lg">
          {status === 'loading' ? 'Submitting...' : 'Sign Up to Spin'}
        </Button>
      </form>
    </Form>
  )
}

// --- Waitlist Form ---

function WaitlistForm({ status, errorMsg, onSubmit }: {
  status: string; errorMsg: string; onSubmit: (data: WaitlistFormData) => void
}) {
  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { full_name: '', email: '', instagram_handle: '' },
  })
  const ic = 'bg-background/50 border-border/40 h-9 text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all rounded-lg'
  const lc = 'text-foreground/80 text-[11px] font-medium'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField control={form.control} name="full_name" render={({ field }) => (
          <FormItem className="space-y-1"><FormLabel className={lc}>Full Name *</FormLabel>
            <FormControl><Input placeholder="Your name" className={ic} disabled={status === 'loading'} {...field} /></FormControl>
            <FormMessage className="text-[10px]" /></FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem className="space-y-1"><FormLabel className={lc}>Email *</FormLabel>
            <FormControl><Input type="email" placeholder="you@email.com" className={ic} disabled={status === 'loading'} {...field} /></FormControl>
            <FormMessage className="text-[10px]" /></FormItem>
        )} />
        <FormField control={form.control} name="instagram_handle" render={({ field }) => (
          <FormItem className="space-y-1"><FormLabel className={lc}>Instagram *</FormLabel>
            <FormControl><Input placeholder="@handle" className={ic} disabled={status === 'loading'} {...field} /></FormControl>
            <FormMessage className="text-[10px]" /></FormItem>
        )} />
        {errorMsg && <p className="text-[10px] text-destructive text-center">{errorMsg}</p>}
        <Button type="submit" disabled={status === 'loading'}
          className="w-full bg-nd-red hover:bg-nd-red/90 text-white h-10 text-sm font-semibold rounded-lg">
          {status === 'loading' ? 'Submitting...' : 'Join the Waitlist'}
        </Button>
      </form>
    </Form>
  )
}
