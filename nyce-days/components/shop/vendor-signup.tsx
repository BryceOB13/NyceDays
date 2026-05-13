'use client'

import { useState, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'

const MAX_FILES = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif']

const stripAt = (val: string) => val.trim().replace(/^@+/, '')

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  instagram: z.string().min(1, 'Instagram is required').max(80).transform(stripAt),
  phone: z.string().min(7, 'Phone is required').max(40),
  email: z.string().email('Invalid email'),
  business_name: z.string().max(120).optional(),

  menu_items: z.string().min(3, 'Tell us what you\u2019re serving').max(4000),
  quantity_estimate: z.string().min(1, 'Estimate is required').max(200),
  allergens: z.string().max(500).optional(),

  arrival_choice: z.enum(['by_3pm', 'specific'], { error: 'Pick an arrival option' }),
  arrival_specific_time: z.string().max(120).optional(),
  bringing: z.string().max(500).optional(),
  special_needs: z.string().max(500).optional(),

  share_flyer: z.boolean().refine(v => v === true, {
    message: 'Required to submit',
  }),
  feature_optin: z.boolean().optional(),
  tag_handles: z.string().max(300).optional(),

  menu_confirmation_acknowledged: z.boolean().refine(v => v === true, {
    message: 'Required to submit',
  }),
}).refine(d => d.arrival_choice === 'by_3pm' || (d.arrival_specific_time && d.arrival_specific_time.trim().length > 0), {
  message: 'Tell us what time you\u2019ll arrive',
  path: ['arrival_specific_time'],
})

type FormData = z.infer<typeof schema>

export function VendorSignup() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      instagram: '',
      phone: '',
      email: '',
      business_name: '',
      menu_items: '',
      quantity_estimate: '',
      allergens: '',
      arrival_choice: 'by_3pm',
      arrival_specific_time: '',
      bringing: '',
      special_needs: '',
      share_flyer: false,
      feature_optin: false,
      tag_handles: '',
      menu_confirmation_acknowledged: false,
    },
  })

  const arrivalChoice = form.watch('arrival_choice')

  const handleFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return
    setErrorMsg('')
    const next = [...files]
    for (const f of Array.from(incoming)) {
      if (next.length >= MAX_FILES) { setErrorMsg(`Max ${MAX_FILES} photos.`); break }
      if (f.size > MAX_FILE_BYTES) { setErrorMsg(`${f.name} is over 10MB.`); continue }
      if (!ACCEPTED_TYPES.includes(f.type.toLowerCase())) { setErrorMsg(`${f.name} is not jpg, png, or heic.`); continue }
      next.push(f)
    }
    setFiles(next)
    setPreviews(next.map(f => URL.createObjectURL(f)))
  }, [files])

  const removeFile = useCallback((idx: number) => {
    const next = files.filter((_, i) => i !== idx)
    setFiles(next)
    setPreviews(next.map(f => URL.createObjectURL(f)))
  }, [files])

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setErrorMsg('')

    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined || v === null) return
      fd.append(k, typeof v === 'boolean' ? String(v) : String(v))
    })
    files.forEach(f => fd.append('menu_photos', f))

    try {
      const res = await fetch('/api/vendor', { method: 'POST', body: fd })
      const result = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(result.error || 'Something went wrong. Please try again.')
        return
      }
      router.push('/shop/thanks')
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  const inputClasses =
    'bg-background/60 border-border/50 h-10 text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all'
  const labelClasses = 'text-foreground/90 text-xs font-medium'
  const sectionHeader = 'text-[11px] uppercase tracking-[0.18em] text-nd-red/90 font-medium'

  return (
    <div className="w-full max-w-[640px] mx-auto">
      {/* Page header */}
      <div className="mb-8 space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">
          Sell plates at THE YARD.
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Fill this out so we can lock in your spot, feature your menu on our drop next Monday (5.18),
          and coordinate setup.
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
                  <FormLabel className={labelClasses}>Name *</FormLabel>
                  <FormControl><Input placeholder="Your name" className={inputClasses} {...field} /></FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )} />
              <FormField control={form.control} name="instagram" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClasses}>Instagram *</FormLabel>
                  <FormControl><Input placeholder="@handle" className={inputClasses} {...field} /></FormControl>
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
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClasses}>Email *</FormLabel>
                  <FormControl><Input type="email" placeholder="you@email.com" className={inputClasses} {...field} /></FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="business_name" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClasses}>Business name</FormLabel>
                <FormControl><Input placeholder="Optional" className={inputClasses} {...field} /></FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />
          </section>

          {/* === MENU === */}
          <section className="space-y-4">
            <h2 className={sectionHeader}>Your menu</h2>

            <FormField control={form.control} name="menu_items" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClasses}>What are you serving? *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List your plates, sides, sauces, drinks..."
                    className="bg-background/60 border-border/50 min-h-[120px] text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="quantity_estimate" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClasses}>Quantity estimate *</FormLabel>
                <FormControl><Input placeholder="e.g. 50 plates, 100 servings" className={inputClasses} {...field} /></FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="allergens" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClasses}>Allergens or dietary notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nuts, dairy, vegan options, etc. (optional)"
                    className="bg-background/60 border-border/50 min-h-[70px] text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />

            {/* File upload */}
            <div className="space-y-1.5">
              <label className={labelClasses}>Menu photos (optional, max 5 · 10MB each)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
                className="cursor-pointer border border-dashed border-border/60 rounded-md px-4 py-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:border-nd-red/50 hover:text-foreground transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Tap to upload or drop files here</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.heic,.heif,image/jpeg,image/png,image/heic,image/heif"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-border/50 bg-background/40">
                      <Image src={src} alt={`Preview ${idx + 1}`} fill className="object-cover" unoptimized />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 bg-background/80 hover:bg-nd-red hover:text-white rounded-full p-0.5 transition-colors"
                        aria-label="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* === LOGISTICS === */}
          <section className="space-y-4">
            <h2 className={sectionHeader}>Logistics</h2>

            <FormField control={form.control} name="arrival_choice" render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={labelClasses}>When will you arrive? *</FormLabel>
                <div className="flex flex-col sm:flex-row gap-2">
                  {([
                    { val: 'by_3pm', label: 'By 3pm' },
                    { val: 'specific', label: 'Specific time' },
                  ] as const).map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => field.onChange(opt.val)}
                      className={`flex-1 px-4 py-2.5 text-sm rounded-md border transition-all font-medium ${
                        field.value === opt.val
                          ? 'bg-nd-red text-white border-nd-red'
                          : 'bg-background/60 border-border/50 text-muted-foreground hover:border-nd-red/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />

            {arrivalChoice === 'specific' && (
              <FormField control={form.control} name="arrival_specific_time" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClasses}>Your arrival time *</FormLabel>
                  <FormControl><Input placeholder="e.g. 2:15pm" className={inputClasses} {...field} /></FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )} />
            )}

            <FormField control={form.control} name="bringing" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClasses}>What are you bringing?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tables, chafing dishes, coolers, canopy, etc. (optional)"
                    className="bg-background/60 border-border/50 min-h-[70px] text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="special_needs" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClasses}>Special needs</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Power, water, space requirements, etc. (optional)"
                    className="bg-background/60 border-border/50 min-h-[70px] text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />
          </section>

          {/* === PROMO === */}
          <section className="space-y-4">
            <h2 className={sectionHeader}>Promo</h2>

            <FormField control={form.control} name="share_flyer" render={({ field }) => (
              <FormItem className="space-y-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-border/60 text-nd-red focus:ring-nd-red/30 cursor-pointer accent-nd-red"
                  />
                  <span className="text-sm text-foreground/90 leading-snug">
                    I&rsquo;ll share the event flyer on my IG story or feed. *
                  </span>
                </label>
                <FormMessage className="text-[11px] ml-7" />
              </FormItem>
            )} />

            <FormField control={form.control} name="feature_optin" render={({ field }) => (
              <FormItem className="space-y-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-border/60 text-nd-red focus:ring-nd-red/30 cursor-pointer accent-nd-red"
                  />
                  <span className="text-sm text-foreground/90 leading-snug">
                    Feature my menu in the Nyce Days drop next Monday (5.18).
                  </span>
                </label>
              </FormItem>
            )} />

            <FormField control={form.control} name="tag_handles" render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClasses}>Tag handles</FormLabel>
                <FormControl><Input placeholder="@yourbrand @yourchef (optional)" className={inputClasses} {...field} /></FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />
          </section>

          {/* === GATE === */}
          <section className="space-y-4 border-t border-border/40 pt-6">
            <FormField control={form.control} name="menu_confirmation_acknowledged" render={({ field }) => (
              <FormItem className="space-y-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-border/60 text-nd-red focus:ring-nd-red/30 cursor-pointer accent-nd-red"
                  />
                  <span className="text-sm text-foreground/90 leading-snug">
                    I&rsquo;ve shared my menu with a Nyce Days team rep, or I will before the event. *
                  </span>
                </label>
                <FormMessage className="text-[11px] ml-7" />
              </FormItem>
            )} />

            {errorMsg && (
              <p className="text-xs text-destructive">{errorMsg}</p>
            )}

            <Button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-nd-red hover:bg-nd-red/90 text-white h-11 text-sm font-semibold rounded-md"
            >
              {status === 'loading' ? 'Submitting...' : 'Apply to sell plates.'}
            </Button>
          </section>
        </form>
      </Form>
    </div>
  )
}
