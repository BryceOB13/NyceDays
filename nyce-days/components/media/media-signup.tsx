'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import type { MediaEvent } from '@/lib/media-events'

const stripAt = (val: string) => val.trim().replace(/^@+/, '')

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone is required').max(40),
  instagram: z.string().min(1, 'Instagram is required').max(80).transform(stripAt),
  portfolio_url: z
    .string()
    .trim()
    .max(500)
    .optional()
    .refine(v => !v || /^https?:\/\/.+/i.test(v), { message: 'Must start with https://' }),

  does_photo: z.boolean(),
  does_video: z.boolean(),
  does_interviews: z.boolean(),
  does_other: z.boolean(),
  other_capability: z.string().max(200).optional(),

  planned_checkin_time: z.string().max(300).optional(),
  assistance_needed: z.string().max(1000).optional(),
  additional_notes: z.string().max(2000).optional(),

  ack_share_flyer: z.boolean(),
  ack_share_ticket_link: z.boolean(),
  ack_no_interrupt: z.boolean(),
  ack_share_media: z.boolean(),
}).refine(
  d => d.does_photo || d.does_video || d.does_interviews || d.does_other,
  { message: 'Tell us at least one thing you cover.', path: ['does_photo'] }
).refine(
  d => !d.does_other || (d.other_capability && d.other_capability.trim().length > 0),
  { message: 'Specify what else you cover.', path: ['other_capability'] }
).refine(
  d => d.ack_share_flyer && d.ack_share_ticket_link && d.ack_no_interrupt && d.ack_share_media,
  { message: 'All four acknowledgments are required to apply.', path: ['ack_share_flyer'] }
)

type FormData = z.infer<typeof schema>

interface MediaSignupProps {
  event: MediaEvent
  fellBack: boolean
}

export function MediaSignup({ event, fellBack }: MediaSignupProps) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      instagram: '',
      portfolio_url: '',
      does_photo: false,
      does_video: false,
      does_interviews: false,
      does_other: false,
      other_capability: '',
      planned_checkin_time: '',
      assistance_needed: '',
      additional_notes: '',
      ack_share_flyer: false,
      ack_share_ticket_link: false,
      ack_no_interrupt: false,
      ack_share_media: false,
    },
  })

  const doesOther = form.watch('does_other')

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/media-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, event_slug: event.slug }),
      })
      const result = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(result.error || 'Something went wrong. Please try again.')
        return
      }
      router.push(`/media/apply/thanks?event=${encodeURIComponent(event.slug)}`)
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  const inputClasses =
    'bg-background/60 border-border/50 h-10 text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all'
  const labelClasses = 'text-foreground/90 text-xs font-medium'
  const sectionHeader = 'text-[11px] uppercase tracking-[0.18em] text-nd-red/90 font-medium'

  const Checkbox = ({
    checked, onChange, label, required,
  }: { checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode; required?: boolean }) => (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-border/60 text-nd-red focus:ring-nd-red/30 cursor-pointer accent-nd-red"
      />
      <span className="text-sm text-foreground/90 leading-snug">
        {label}{required && ' *'}
      </span>
    </label>
  )

  return (
    <div className="w-full max-w-[640px] mx-auto">
      {/* Header */}
      <div className="mb-8 space-y-5">
        {/* Press-pass-style credential strip */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-nd-red font-medium">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Nyce Days Media Credentials</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">
          Apply for media credentials at {event.name}.
        </h1>

        {/* Flyer + event card stacked */}
        <div className="space-y-3">
          {event.flyer_url && (
            <div className="relative w-full rounded-md overflow-hidden border border-border/50 bg-background/40 shadow-sm">
              <Image
                src={event.flyer_url}
                alt={`${event.name} flyer`}
                width={1200}
                height={1500}
                priority
                sizes="(max-width: 640px) 100vw, 640px"
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="border border-border/40 rounded-md px-4 py-3 bg-background/40 space-y-1">
            <p className="font-serif italic text-foreground/80 text-sm">{event.tagline}</p>
            <p className="text-[12px] uppercase tracking-[0.16em] text-foreground font-medium">
              {event.name} <span className="text-muted-foreground">·</span> {event.date}{' '}
              <span className="text-muted-foreground">·</span> {event.venue}{' '}
              <span className="text-muted-foreground">·</span> {event.time}
            </p>
          </div>
        </div>

        {fellBack && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Event not found. Showing the next Nyce Days event.
          </p>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">
          This is a credentialed media application. We review every submission, vet capabilities,
          and issue check-in passes to approved press, photo, video, and interview personnel.
          Expect a decision within 48 hours.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* === YOU === */}
          <section className="space-y-4">
            <h2 className={sectionHeader}>You</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClasses}>Full name *</FormLabel>
                  <FormControl><Input placeholder="Your name" className={inputClasses} {...field} /></FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClasses}>Email *</FormLabel>
                  <FormControl><Input type="email" placeholder="you@email.com" className={inputClasses} {...field} /></FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClasses}>Phone *</FormLabel>
                  <FormControl><Input type="tel" placeholder="(555) 123-4567" className={inputClasses} {...field} /></FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )} />
              <FormField control={form.control} name="instagram" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClasses}>Instagram *</FormLabel>
                  <FormControl><Input placeholder="@your_handle" className={inputClasses} {...field} /></FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="portfolio_url" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClasses}>Portfolio / website</FormLabel>
                <FormControl><Input type="url" placeholder="https://..." className={inputClasses} {...field} /></FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />
          </section>

          {/* === CAPABILITIES === */}
          <section className="space-y-4">
            <h2 className={sectionHeader}>What you cover</h2>

            <FormField control={form.control} name="does_photo" render={({ field }) => (
              <FormItem className="space-y-0">
                <Checkbox checked={field.value} onChange={field.onChange} label="Photo" />
                <FormMessage className="text-[11px] ml-7" />
              </FormItem>
            )} />
            <FormField control={form.control} name="does_video" render={({ field }) => (
              <FormItem className="space-y-0">
                <Checkbox checked={field.value} onChange={field.onChange} label="Video" />
              </FormItem>
            )} />
            <FormField control={form.control} name="does_interviews" render={({ field }) => (
              <FormItem className="space-y-0">
                <Checkbox checked={field.value} onChange={field.onChange} label="Interviews" />
              </FormItem>
            )} />
            <FormField control={form.control} name="does_other" render={({ field }) => (
              <FormItem className="space-y-0">
                <Checkbox checked={field.value} onChange={field.onChange} label="Other" />
              </FormItem>
            )} />

            {doesOther && (
              <FormField control={form.control} name="other_capability" render={({ field }) => (
                <FormItem className="space-y-1.5 pl-7">
                  <FormLabel className={labelClasses}>Specify *</FormLabel>
                  <FormControl><Input placeholder="e.g. drone, live-streaming, on-site editing" className={inputClasses} {...field} /></FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )} />
            )}
          </section>

          {/* === THE DAY === */}
          <section className="space-y-4">
            <h2 className={sectionHeader}>The day</h2>

            <FormField control={form.control} name="planned_checkin_time" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClasses}>When do you plan to check in?</FormLabel>
                <FormControl><Input placeholder="e.g. 30 min before doors, or 2:30pm sharp" className={inputClasses} {...field} /></FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="assistance_needed" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClasses}>Anything you need from us?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="green room access, equipment storage, meal, etc."
                    className="bg-background/60 border-border/50 min-h-[80px] text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="additional_notes" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClasses}>Anything else we should know?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="gear restrictions, accessibility, anything wild"
                    className="bg-background/60 border-border/50 min-h-[80px] text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />
          </section>

          {/* === ACKNOWLEDGMENTS (commitments, tinted) === */}
          <section className="space-y-4 border border-nd-red/20 bg-nd-red/5 rounded-md px-4 py-5">
            <div className="space-y-1">
              <h2 className={sectionHeader}>Press Code of Conduct</h2>
              <p className="text-[11px] text-muted-foreground">All four are required to be issued credentials.</p>
            </div>

            <div className="space-y-3">
              <FormField control={form.control} name="ack_share_flyer" render={({ field }) => (
                <FormItem className="space-y-0">
                  <Checkbox checked={field.value} onChange={field.onChange} required
                    label={<>I&rsquo;ll share the event flyer on my Instagram story.</>} />
                  <FormMessage className="text-[11px] ml-7" />
                </FormItem>
              )} />
              <FormField control={form.control} name="ack_share_ticket_link" render={({ field }) => (
                <FormItem className="space-y-0">
                  <Checkbox checked={field.value} onChange={field.onChange} required
                    label={<>I&rsquo;ll send the ticket / Posh link to my network.</>} />
                </FormItem>
              )} />
              <FormField control={form.control} name="ack_no_interrupt" render={({ field }) => (
                <FormItem className="space-y-0">
                  <Checkbox checked={field.value} onChange={field.onChange} required
                    label="I understand I should not interrupt any active filming or media work at the event." />
                </FormItem>
              )} />
              <FormField control={form.control} name="ack_share_media" render={({ field }) => (
                <FormItem className="space-y-0">
                  <Checkbox checked={field.value} onChange={field.onChange} required
                    label={<>I&rsquo;ll share all media I capture with bryce@nycedays.com within 72 hours of the event.</>} />
                </FormItem>
              )} />
            </div>
          </section>

          {errorMsg && <p className="text-xs text-destructive">{errorMsg}</p>}

          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-nd-red hover:bg-nd-red/90 text-white h-11 text-sm font-semibold rounded-md"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit credentials request.'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
