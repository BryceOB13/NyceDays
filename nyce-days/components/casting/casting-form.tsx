'use client'

import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useAnalytics } from '@/hooks/use-analytics'
import { AvailabilityGrid, EMPTY_AVAILABILITY, type Availability } from './availability-grid'

const STRAWBERRY = '#C95E6C'

const APPLICANT_TYPES = [
  { id: 'talent', label: 'on-camera talent', sub: 'model / actor' },
  { id: 'crew', label: 'crew', sub: 'camera, photo, styling' },
  { id: 'featured', label: 'featured', sub: 'builder / founder / creative / athlete' },
]
const ROLES = [
  { id: 'creative_director', label: 'creative director' },
  { id: 'camera_content', label: 'camera / content' },
  { id: 'model_actor', label: 'model / actor' },
  { id: 'photographer', label: 'photographer' },
  { id: 'stylist', label: 'stylist' },
  { id: 'other', label: 'other' },
]
const CITIES = [
  { id: 'dc', label: 'DC' },
  { id: 'maryland', label: 'Maryland' },
  { id: 'virginia', label: 'Virginia' },
  { id: 'other', label: 'Other' },
]
const CONTACT_PREFS = [
  { id: 'instagram', label: 'instagram' },
  { id: 'sms', label: 'text' },
  { id: 'email', label: 'email' },
  { id: 'call', label: 'call' },
]

const STEPS = ['you', 'what you bring', "when you're free", 'wrap']

type FormState = {
  full_name: string
  email: string
  phone: string
  instagram_handle: string
  other_socials: string
  portfolio_url: string
  contact_preference: string
  pronouns: string
  city: string
  area: string
  is_18_plus: boolean | null
  has_transport: boolean | null
  applicant_type: string[]
  roles: string[]
  role_other: string
  headline: string
  experience: string
  availability: Availability
  earliest_date: string
  release_ok: boolean
  heard_from: string
  anything_else: string
  sms_consent: boolean
  email_consent: boolean
  website: string // honeypot
}

const INITIAL: FormState = {
  full_name: '',
  email: '',
  phone: '',
  instagram_handle: '',
  other_socials: '',
  portfolio_url: '',
  contact_preference: 'instagram',
  pronouns: '',
  city: '',
  area: '',
  is_18_plus: null,
  has_transport: null,
  applicant_type: [],
  roles: [],
  role_other: '',
  headline: '',
  experience: '',
  availability: EMPTY_AVAILABILITY,
  earliest_date: '',
  release_ok: false,
  heard_from: '',
  anything_else: '',
  sms_consent: false,
  email_consent: false,
  website: '',
}

const inputClass =
  'w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 font-sans text-base text-white placeholder:text-white/30 focus:border-[#C95E6C] focus:outline-none transition-colors'
const labelClass = 'mb-1.5 block font-sans text-[11px] uppercase tracking-[0.22em] text-white/40'

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <span className={labelClass}>
        {label}
        {required && <span className="text-[#C95E6C]"> *</span>}
      </span>
      {children}
      {error && <p className="mt-1 font-sans text-xs text-[#C95E6C]">{error}</p>}
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 font-sans text-sm transition-all ${
        active
          ? 'border-transparent bg-[#C95E6C] text-white'
          : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

const isValidEmail = (v: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)
const isValidPhone = (v: string) => v.replace(/\D/g, '').length === 10

export function CastingForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [done, setDone] = useState(false)
  const { track } = useAnalytics()

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: val }))
    if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: '' }))
  }

  const toggleIn = (key: 'applicant_type' | 'roles', id: string) => {
    setForm((f) => {
      const cur = f[key]
      return { ...f, [key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] }
    })
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validateStep = (s: number): boolean => {
    const next: Record<string, string> = {}
    if (s === 0) {
      if (!form.full_name.trim()) next.full_name = 'we need your name'
      if (!isValidEmail(form.email)) next.email = 'a real email, please'
      if (!isValidPhone(form.phone)) next.phone = 'a 10-digit phone'
      if (!form.instagram_handle.trim()) next.instagram_handle = 'how we find you'
      if (!form.city) next.city = 'pick one'
      if (form.is_18_plus !== true) next.is_18_plus = 'you must be 18+ to apply'
    }
    if (s === 1) {
      if (form.applicant_type.length === 0) next.applicant_type = 'pick at least one'
      if (form.roles.includes('other') && !form.role_other.trim()) next.role_other = 'tell us the role'
    }
    if (s === 3) {
      if (!form.release_ok) next.release_ok = 'a release is required to be on camera'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goNext = () => {
    if (!validateStep(step)) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goBack = () => {
    setSubmitError('')
    setStep((s) => Math.max(s - 1, 0))
  }

  const submit = async () => {
    if (!validateStep(3)) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/casting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          is_18_plus: form.is_18_plus === true,
          has_transport: form.has_transport === true,
          earliest_date: form.earliest_date || null,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setSubmitError(data.error || 'Something went wrong. Try again.')
        setSubmitting(false)
        return
      }
      track('casting_submit', { applicant_type: form.applicant_type, city: form.city })
      setDone(true)
    } catch {
      setSubmitError('Network hiccup. Try again.')
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md py-16 text-center"
      >
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: STRAWBERRY }}
        >
          <Check className="h-8 w-8 text-white" />
        </div>
        <h2 className="font-serif text-3xl italic text-white">you&apos;re in.</h2>
        <p className="mt-3 font-sans text-base text-white/60">
          we&apos;ll slide through. have a nyce day.
        </p>
      </motion.div>
    )
  }

  const conditionalLabel = form.applicant_type.includes('featured')
    ? 'what are you building? (optional)'
    : form.applicant_type.includes('talent')
    ? 'comfort on camera, sizing, anything else (optional)'
    : 'gear you bring / experience (optional)'

  return (
    <div className="mx-auto max-w-xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between font-sans text-[11px] uppercase tracking-[0.22em] text-white/40">
          <span>{STEPS[step]}</span>
          <span>
            {step + 1} / {STEPS.length}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: STRAWBERRY }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.website}
        onChange={(e) => set('website', e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          {step === 0 && (
            <>
              <Field label="full name" required error={errors.full_name}>
                <input className={inputClass} value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="first last" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="email" required error={errors.email}>
                  <input type="email" inputMode="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" />
                </Field>
                <Field label="phone" required error={errors.phone}>
                  <input type="tel" inputMode="tel" className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(202) 555-0123" />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="instagram" required error={errors.instagram_handle}>
                  <input className={inputClass} value={form.instagram_handle} onChange={(e) => set('instagram_handle', e.target.value)} placeholder="@yourhandle" />
                </Field>
                <Field label="other socials (optional)">
                  <input className={inputClass} value={form.other_socials} onChange={(e) => set('other_socials', e.target.value)} placeholder="tiktok, youtube, etc." />
                </Field>
              </div>
              <Field label="portfolio / reel link (optional)">
                <input className={inputClass} value={form.portfolio_url} onChange={(e) => set('portfolio_url', e.target.value)} placeholder="drive, site, or reel" />
              </Field>
              <Field label="best way to reach you">
                <div className="flex flex-wrap gap-2">
                  {CONTACT_PREFS.map((c) => (
                    <Chip key={c.id} active={form.contact_preference === c.id} onClick={() => set('contact_preference', c.id)}>
                      {c.label}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label="city" required error={errors.city}>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map((c) => (
                    <Chip key={c.id} active={form.city === c.id} onClick={() => set('city', c.id)}>
                      {c.label}
                    </Chip>
                  ))}
                </div>
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="area / neighborhood (optional)">
                  <input className={inputClass} value={form.area} onChange={(e) => set('area', e.target.value)} placeholder="shaw, silver spring, etc." />
                </Field>
                <Field label="pronouns (optional)">
                  <input className={inputClass} value={form.pronouns} onChange={(e) => set('pronouns', e.target.value)} placeholder="optional" />
                </Field>
              </div>
              <Field label="are you 18 or older?" required error={errors.is_18_plus}>
                <div className="flex gap-2">
                  <Chip active={form.is_18_plus === true} onClick={() => set('is_18_plus', true)}>
                    yes, 18+
                  </Chip>
                  <Chip active={form.is_18_plus === false} onClick={() => set('is_18_plus', false)}>
                    under 18
                  </Chip>
                </div>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="applying as" required error={errors.applicant_type}>
                <div className="flex flex-col gap-2">
                  {APPLICANT_TYPES.map((t) => {
                    const active = form.applicant_type.includes(t.id)
                    return (
                      <button
                        key={t.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleIn('applicant_type', t.id)}
                        className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-all ${
                          active ? 'border-[#C95E6C] bg-[#C95E6C]/10' : 'border-white/15 hover:border-white/40'
                        }`}
                      >
                        <span>
                          <span className="block font-sans text-base text-white">{t.label}</span>
                          <span className="block font-sans text-xs text-white/40">{t.sub}</span>
                        </span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            active ? 'border-transparent bg-[#C95E6C]' : 'border-white/30'
                          }`}
                        >
                          {active && <Check className="h-3 w-3 text-white" />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Field>
              <Field label="roles (pick any)">
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => (
                    <Chip key={r.id} active={form.roles.includes(r.id)} onClick={() => toggleIn('roles', r.id)}>
                      {r.label}
                    </Chip>
                  ))}
                </div>
              </Field>
              {form.roles.includes('other') && (
                <Field label="what role?" error={errors.role_other}>
                  <input className={inputClass} value={form.role_other} onChange={(e) => set('role_other', e.target.value)} placeholder="tell us" />
                </Field>
              )}
              <Field label="one line on what you do / build">
                <input className={inputClass} value={form.headline} onChange={(e) => set('headline', e.target.value)} placeholder="founder of __ · sprinter · stylist" maxLength={160} />
              </Field>
              <Field label={conditionalLabel}>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={form.experience}
                  onChange={(e) => set('experience', e.target.value)}
                  placeholder="keep it short and real"
                  maxLength={2000}
                />
              </Field>
              <Field label="can you get to DC + MD shoots?">
                <div className="flex gap-2">
                  <Chip active={form.has_transport === true} onClick={() => set('has_transport', true)}>
                    yeah, i&apos;m good
                  </Chip>
                  <Chip active={form.has_transport === false} onClick={() => set('has_transport', false)}>
                    need a plan
                  </Chip>
                </div>
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <AvailabilityGrid value={form.availability} onChange={(v) => set('availability', v)} />
              <Field label="earliest date you can start (optional)">
                <input
                  type="date"
                  className={`${inputClass} [color-scheme:dark]`}
                  value={form.earliest_date}
                  onChange={(e) => set('earliest_date', e.target.value)}
                />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-4 transition-all ${
                  form.release_ok ? 'border-[#C95E6C] bg-[#C95E6C]/10' : 'border-white/15 hover:border-white/40'
                } ${errors.release_ok ? 'border-[#C95E6C]' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={form.release_ok}
                  onChange={(e) => set('release_ok', e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[#C95E6C]"
                />
                <span className="font-sans text-sm text-white/80">
                  i&apos;m good to be filmed / photographed and to sign a standard release. <span className="text-[#C95E6C]">*</span>
                </span>
              </label>
              {errors.release_ok && <p className="font-sans text-xs text-[#C95E6C]">{errors.release_ok}</p>}

              <Field label="how'd you hear about this? (optional)">
                <input className={inputClass} value={form.heard_from} onChange={(e) => set('heard_from', e.target.value)} placeholder="instagram, a friend, etc." />
              </Field>
              <Field label="anything else? (optional)">
                <textarea rows={3} className={inputClass} value={form.anything_else} onChange={(e) => set('anything_else', e.target.value)} placeholder="optional" maxLength={1000} />
              </Field>

              <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={form.sms_consent} onChange={(e) => set('sms_consent', e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#C95E6C]" />
                  <span className="font-sans text-sm text-white/70">
                    text me about this.{' '}
                    <span className="text-white/40">msg &amp; data rates may apply, reply STOP to opt out.</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={form.email_consent} onChange={(e) => set('email_consent', e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#C95E6C]" />
                  <span className="font-sans text-sm text-white/70">email me about this and future drops.</span>
                </label>
              </div>

              {submitError && <p className="font-sans text-sm text-[#C95E6C]">{submitError}</p>}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-wider text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            back
          </button>
        ) : (
          <span />
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-sans text-sm font-medium uppercase tracking-wider text-black transition-all hover:bg-white/90"
          >
            next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-sans text-sm font-medium uppercase tracking-wider text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: STRAWBERRY }}
          >
            {submitting ? 'sending...' : "i'm in"}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  )
}
