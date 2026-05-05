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

const DJ_CAP = 7
const CURRENT_EVENT_DATE = '2026-05-17'

const ALL_SLOTS = [
  '3:00 – 4:00', '4:00 – 5:00', '5:00 – 6:00', '6:00 – 7:00',
  '7:00 – 8:00', '8:00 – 9:00', '9:00 – 10:00',
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

type DJFormData = z.infer<typeof djSchema>

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits.length ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function PoshCTA() {
  return (
    <a href="https://posh.vip/g/nyce-days" target="_blank" rel="noopener noreferrer"
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
  const [errorMsg, setErrorMsg] = useState('')

  // Fetch initial data + subscribe to realtime
  useEffect(() => {
    fetch(`/api/invitational?event_date=${CURRENT_EVENT_DATE}`)
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
        if (payload.new?.signup_type === 'dj' && payload.new?.event_date === CURRENT_EVENT_DATE && Array.isArray(payload.new?.time_slot_preference)) {
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
            Royalties
          </h1>
          <p className="text-xs text-nd-red/80 uppercase tracking-[0.15em] font-medium mt-1">the creative day party</p>
          <div className="mt-2 md:mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground/80">Sunday, May 17, 2026</p>
            <p>Upstairs at Seta Oasis · 3 PM–10 PM · 1-hour sets</p>
            <p className="text-[11px] text-muted-foreground/60 mt-1">@nycedays + @official.royaltalks</p>
          </div>
          <p className="mt-2 md:mt-3 text-xs md:text-sm text-foreground/60 max-w-sm mx-auto leading-snug">
            Think you got next? Step up and show us what you&apos;re working with.
          </p>
        </div>
      </FadeUp>

      {/* Benefits */}
      <FadeUp delay={0.05}>
        <div className="rounded-lg border border-border/30 bg-card/30 p-4 mb-4 text-xs text-muted-foreground space-y-2">
          <p className="text-foreground/80 font-medium text-[11px] uppercase tracking-wider">What you get</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>2 free tickets to New Money on Saturday May 30 at Seta Oasis</li>
            <li>Potential booking at New Money. If your set hits, you get the call.</li>
            <li>Comp entry to Royalties on May 17</li>
            <li>Press and content creators will be in the room</li>
          </ul>
          <p className="text-foreground/80 font-medium text-[11px] uppercase tracking-wider mt-3">What to bring</p>
          <p>Bring a deck. That&apos;s it.</p>
          <p className="text-foreground/80 font-medium text-[11px] uppercase tracking-wider mt-3">House rules</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Show up 20 min before your slot to soundcheck and hand off cleanly</li>
            <li>One hour, hard out. The next DJ is up.</li>
            <li>Read the energy based on your slot. 3pm is warmup. 8pm is peak.</li>
          </ul>
        </div>
      </FadeUp>

      {status === 'success' ? (
        <FadeUp>
          <div className="rounded-xl border border-nd-red/20 bg-nd-red/5 p-8 text-center space-y-4">
            <CheckCircle className="h-10 w-10 text-nd-red mx-auto" />
            <h3 className="font-serif text-xl">You&apos;re locked in.</h3>
            <p className="text-sm text-muted-foreground">We&apos;ll reach out to confirm. Show up 20 min early on May 17. Need to cancel? DM @_thisbryce.</p>
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
                      body: JSON.stringify({ ...data, signup_type: 'dj', event_date: CURRENT_EVENT_DATE }),
                    })
                    const result = await res.json()
                    if (result.error === 'dj_cap_reached') { setDjCount(DJ_CAP); setStatus('idle'); setErrorMsg('All slots are filled.'); return }
                    if (result.error === 'slot_taken') { setClaimedSlots(prev => [...prev, data.time_slot_preference[0]]); setStatus('idle'); setErrorMsg(result.message); return }
                    if (!res.ok) { setStatus('error'); setErrorMsg(result.message || 'Something went wrong.'); return }
                    setStatus('success')
                  } catch { setStatus('error'); setErrorMsg('Network error. Try again.') }
                }} />
            ) : (
              <div className="text-center py-6">
                <p className="font-serif text-xl text-foreground mb-2">Lineup full.</p>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  All 7 slots are locked. Pull up to Royalties on May 17 — doors at 3 PM.
                  Need to cancel? DM @_thisbryce.
                </p>
              </div>
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
