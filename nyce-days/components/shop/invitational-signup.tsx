'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Clock, ExternalLink } from 'lucide-react'

const DJ_CAP = 4
const CURRENT_EVENT_DATE = '2026-05-24'

const ALL_SLOTS = [
  '3:00 – 4:00', '4:00 – 5:00', '5:00 – 6:00', '6:00 – 7:00',
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

// --- Benefits Modal ---

// --- Main Component ---

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
      <div className="w-full max-w-[480px] flex items-center justify-center py-12">
        <div className="animate-pulse text-[#E8E4DD]/60 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[480px]">
      <div className="md:bg-[rgba(232,228,221,0.06)] md:backdrop-blur-[12px] md:border md:border-[rgba(232,228,221,0.12)] md:rounded-lg md:p-8 space-y-4">
        {/* Event header */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-nd-red/80 font-medium">
            a nyce days cookout
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#E8E4DD] mt-1 leading-tight uppercase tracking-wide">
            The Yard
          </h1>
          <div className="mt-2 text-xs md:text-sm text-[#E8E4DD]/70 leading-relaxed space-y-0.5">
            <p className="font-medium text-[#E8E4DD]/90">Sunday, May 24, 2026</p>
            <p>Rock Creek Park · 3 PM – 7 PM · 1-hour sets</p>
            <p className="text-[11px] text-[#E8E4DD]/50">@nycedays</p>
          </div>
        </div>

        {/* Form / States */}
        {status === 'success' ? (
          <div className="rounded-xl border border-nd-red/20 bg-nd-red/5 p-6 text-center space-y-3">
            <CheckCircle className="h-10 w-10 text-nd-red mx-auto" />
            <h3 className="font-serif text-xl text-[#E8E4DD]">You&apos;re locked in.</h3>
            <p className="text-xs text-[#E8E4DD]/60">We&apos;ll reach out to confirm. Show up 20 min early on May 24. Need to cancel? DM @_thisbryce.</p>
            <PoshCTA />
          </div>
        ) : isDJPhase ? (
          <DJForm
            status={status}
            errorMsg={errorMsg}
            availableSlots={availableSlots}
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
            }}
          />
        ) : (
          <div className="text-center py-6">
            <p className="font-serif text-xl text-[#E8E4DD] mb-2">Lineup full.</p>
            <p className="text-xs text-[#E8E4DD]/60 leading-relaxed max-w-sm mx-auto">
              All slots are locked. Pull up to The Yard on May 24 — 3 PM at Rock Creek Park.
              Need to cancel? DM @_thisbryce.
            </p>
          </div>
        )}
      </div>
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
  const lc = 'text-[#E8E4DD]/80 text-xs font-medium'

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
            <p className="text-[10px] text-[#E8E4DD]/50">
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
