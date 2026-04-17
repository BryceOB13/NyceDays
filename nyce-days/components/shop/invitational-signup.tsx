'use client'

import { useState, useEffect, useCallback } from 'react'
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
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet'
import { FadeUp } from '@/components/shared/fade-up'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Clock, ExternalLink } from 'lucide-react'

const DJ_CAP = 20

const ALL_SLOTS = [
  '7:00 – 7:30', '7:30 – 8:00', '8:00 – 8:30', '8:30 – 9:00', '9:00 – 9:30',
  '9:30 – 10:00', '10:00 – 10:30', '10:30 – 11:00', '11:00 – 11:30', '11:30 – 12:00',
  'No preference / any slot',
] as const

const djSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  instagram_handle: z.string().min(1, 'IG handle is required'),
  phone: z.string().optional(),
  contact_preference: z.enum(['instagram', 'sms']),
  time_slot_preference: z.array(z.string()).min(1, 'Pick a time slot').max(1),
}).refine(d => d.contact_preference !== 'sms' || (d.phone && d.phone.replace(/\D/g, '').length >= 10), {
  message: 'Phone number is required for text notifications',
  path: ['phone'],
})

const waitlistSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  instagram_handle: z.string().min(1, 'IG handle is required'),
})

type DJFormData = z.infer<typeof djSchema>
type WaitlistFormData = z.infer<typeof waitlistSchema>

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits.length ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function PoshCTA() {
  return (
    <a href="https://posh.vip/o/nyce-days" target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 rounded-lg bg-foreground/5 border border-border/30 px-3 py-2.5 hover:border-nd-red/30 transition-colors">
      <p className="text-[11px] text-muted-foreground leading-snug">
        Follow <span className="text-foreground font-medium">@nycedays</span> on Posh for first access to future events.
      </p>
      <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-nd-red">
        Follow <ExternalLink className="h-3 w-3" />
      </span>
    </a>
  )
}

export function InvitationalSignup() {
  const [djCount, setDjCount] = useState<number | null>(null)
  const [claimedSlots, setClaimedSlots] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [successType, setSuccessType] = useState<'dj' | 'waitlist'>('dj')
  const [errorMsg, setErrorMsg] = useState('')

  // Fetch initial data + subscribe to realtime
  useEffect(() => {
    fetch('/api/invitational')
      .then(r => r.json())
      .then(d => {
        setDjCount(d.djCount ?? 0)
        setClaimedSlots(d.claimedSlots ?? [])
      })
      .catch(() => setDjCount(0))

    // Realtime subscription for live slot updates
    const supabase = createClient()
    const channel = supabase
      .channel('invitational-slots')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'invitational_signups',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, (payload: any) => {
        if (payload.new?.signup_type === 'dj' && Array.isArray(payload.new?.time_slot_preference)) {
          setClaimedSlots(prev => [...prev, ...payload.new.time_slot_preference])
          setDjCount(prev => (prev ?? 0) + 1)
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const isDJPhase = djCount !== null && djCount < DJ_CAP
  const availableSlots = ALL_SLOTS.filter(s => !claimedSlots.includes(s))

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
        <div className="flex justify-center mb-3 md:mb-4">
          <Image src="/logos/stars-white.png" alt="Nyce Days" width={320} height={96}
            className="hidden dark:block object-contain h-24 md:h-28 w-auto" />
          <Image src="/logos/stars-black.png" alt="Nyce Days" width={320} height={96}
            className="dark:hidden object-contain h-24 md:h-28 w-auto" />
        </div>
        <div className="text-center mb-4 md:mb-6">
          <h1 className="font-serif text-[1.65rem] sm:text-4xl md:text-5xl font-bold uppercase tracking-wide leading-none">
            Something Nyce Open Decks
          </h1>
          <div className="mt-2 md:mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground/80">Sunday, April 19, 2026</p>
            <p>Looking Glass Lounge, DC · 7 PM–Midnight · 20-min sets</p>
          </div>
          <p className="mt-2 md:mt-3 text-xs md:text-sm text-foreground/60 max-w-sm mx-auto leading-snug">
            Think you got next? Step up and show us what you&apos;re working with.
          </p>
        </div>
      </FadeUp>

      {status === 'success' ? (
        <FadeUp>
          <div className="rounded-xl border border-nd-red/20 bg-nd-red/5 p-8 text-center space-y-4">
            <CheckCircle className="h-10 w-10 text-nd-red mx-auto" />
            {successType === 'dj' ? (
              <>
                <h3 className="font-serif text-xl">You&apos;re in the mix.</h3>
                <p className="text-sm text-muted-foreground">We&apos;ll reach out to confirm your slot.</p>
              </>
            ) : (
              <>
                <h3 className="font-serif text-xl">You&apos;re on the list.</h3>
                <p className="text-sm text-muted-foreground">We&apos;ll hit you up with the details for April 19.</p>
              </>
            )}
            <PoshCTA />
          </div>
        </FadeUp>
      ) : (
        <FadeUp delay={0.1}>
          <div className="rounded-xl border border-border/40 bg-card/50 p-4 md:p-5 space-y-3.5">
            {isDJPhase ? (
              <DJForm status={status} errorMsg={errorMsg} availableSlots={availableSlots}
                onSubmit={async (data) => {
                  setStatus('loading'); setErrorMsg('')
                  try {
                    const res = await fetch('/api/invitational', {
                      method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...data, signup_type: 'dj' }),
                    })
                    const result = await res.json()
                    if (result.error === 'dj_cap_reached') { setDjCount(DJ_CAP); setStatus('idle'); setErrorMsg('DJ spots just filled — join the waitlist below.'); return }
                    if (result.error === 'slot_taken') { setClaimedSlots(prev => [...prev, data.time_slot_preference[0]]); setStatus('idle'); setErrorMsg(result.message); return }
                    if (!res.ok) { setStatus('error'); setErrorMsg(result.message || 'Something went wrong.'); return }
                    setSuccessType('dj'); setStatus('success')
                  } catch { setStatus('error'); setErrorMsg('Network error. Try again.') }
                }} />
            ) : (
              <>
                <p className="text-center text-xs text-muted-foreground mb-4 leading-relaxed">
                  DJ spots are filled — drop your info for the waitlist or just pull up to Looking Glass Lounge on April 19.
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

function DJForm({ status, errorMsg, availableSlots, onSubmit }: {
  status: string; errorMsg: string; availableSlots: string[]; onSubmit: (data: DJFormData) => void
}) {
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const form = useForm<DJFormData>({
    resolver: zodResolver(djSchema),
    defaultValues: { full_name: '', email: '', instagram_handle: '', phone: '', contact_preference: 'instagram', time_slot_preference: [] },
  })
  const contactPref = form.watch('contact_preference')

  const selectSlot = useCallback((slot: string) => {
    setSelectedSlot(slot)
    form.setValue('time_slot_preference', [slot], { shouldValidate: true })
    setSheetOpen(false)
  }, [form])

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, onChange: (v: string) => void) => {
    onChange(formatPhone(e.target.value))
  }, [])

  const ic = 'bg-background/50 border-border/40 h-10 text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all rounded-lg'
  const lc = 'text-foreground/80 text-xs font-medium'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
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

        <div className="grid grid-cols-2 gap-3">
          <FormField control={form.control} name="instagram_handle" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={lc}>Instagram *</FormLabel>
              <FormControl><Input placeholder="@handle" className={ic} disabled={status === 'loading'} {...field} /></FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={lc}>Phone{contactPref === 'sms' ? ' *' : ''}</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(555) 123-4567" className={ic} disabled={status === 'loading'}
                  value={field.value} onChange={(e) => handlePhoneChange(e, field.onChange)} />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )} />
        </div>

        {/* Contact preference toggle */}
        <FormField control={form.control} name="contact_preference" render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className={lc}>Reach me for slot confirmation via:</FormLabel>
            <div className="flex gap-2">
              {(['instagram', 'sms'] as const).map(opt => (
                <button key={opt} type="button" onClick={() => field.onChange(opt)}
                  className={`flex-1 px-3 py-2 text-xs rounded-lg border transition-all font-medium ${
                    field.value === opt
                      ? 'bg-nd-red text-white border-nd-red'
                      : 'bg-background/50 border-border/40 text-muted-foreground hover:border-nd-red/40'
                  }`}>
                  {opt === 'instagram' ? 'Instagram DM' : 'Text'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground/70">
              {field.value === 'instagram'
                ? "We\u2019ll slide into your DMs to confirm your slot and send day-of info."
                : "We\u2019ll text you to confirm your slot and send day-of info."}
            </p>
          </FormItem>
        )} />

        {/* Time slot trigger */}
        <FormField control={form.control} name="time_slot_preference" render={() => (
          <FormItem className="space-y-1">
            <FormLabel className={lc}>Time Slot *</FormLabel>
            <button type="button" onClick={() => setSheetOpen(true)}
              className="w-full flex items-center justify-between bg-background/50 border border-border/40 h-10 px-3 text-sm rounded-lg transition-all hover:border-nd-red/40">
              <span className={selectedSlot ? 'text-foreground text-xs' : 'text-muted-foreground text-xs'}>
                {selectedSlot || 'Select your slot'}
              </span>
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )} />

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="bottom" className="rounded-t-xl max-h-[70svh]">
            <SheetHeader className="text-center mb-4">
              <SheetTitle>Pick Your Slot</SheetTitle>
              <SheetDescription>One slot per DJ — choose wisely</SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto pb-4">
              {availableSlots.map(slot => (
                <button key={slot} type="button" onClick={() => selectSlot(slot)}
                  className={`px-3 py-3 text-sm rounded-lg border transition-all font-medium ${
                    selectedSlot === slot
                      ? 'bg-nd-red text-white border-nd-red shadow-sm shadow-nd-red/20'
                      : 'bg-background border-border/40 text-muted-foreground hover:border-nd-red/40 hover:text-foreground'
                  }`}>{slot}</button>
              ))}
              {availableSlots.length === 0 && (
                <p className="col-span-full text-center text-sm text-muted-foreground py-4">All slots are claimed.</p>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <PoshCTA />

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
        <PoshCTA />
        {errorMsg && <p className="text-[10px] text-destructive text-center">{errorMsg}</p>}
        <Button type="submit" disabled={status === 'loading'}
          className="w-full bg-nd-red hover:bg-nd-red/90 text-white h-10 text-sm font-semibold rounded-lg">
          {status === 'loading' ? 'Submitting...' : 'Join the Waitlist'}
        </Button>
      </form>
    </Form>
  )
}
