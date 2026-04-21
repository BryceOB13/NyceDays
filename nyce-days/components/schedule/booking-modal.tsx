'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { X, CheckCircle } from 'lucide-react'

const bookingSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone_number: z.string().min(1, 'Phone is required'),
  instagram_handle: z.string().min(1, 'Instagram is required'),
  media_link: z.string().url('Must be a valid URL'),
  is_ready: z.literal(true, { message: 'You must confirm your content is ready' }),
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingModalProps {
  bookingDate: string
  onClose: () => void
  onBooked: () => void
}

export function BookingModal({ bookingDate, onClose, onBooked }: BookingModalProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const date = new Date(bookingDate + 'T12:00:00')

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      full_name: '', email: '', phone_number: '', instagram_handle: '', media_link: '',
      is_ready: false as unknown as true,
    },
  })

  const onSubmit = async (data: BookingFormData) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/schedule/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, booking_date: bookingDate }),
      })
      const result = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(result.error || 'Something went wrong.')
        return
      }
      setStatus('success')
      onBooked()
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Try again.')
    }
  }

  const ic = 'bg-background/50 border-border/40 h-10 text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all rounded-lg'
  const lc = 'text-foreground/80 text-xs font-medium'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-background border border-border/40 rounded-xl p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" aria-label="Close">
          <X className="h-5 w-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-4" />
            <h3 className="font-serif text-xl mb-2">Booked!</h3>
            <p className="text-sm text-muted-foreground">
              Your set is scheduled for {format(date, 'EEEE, MMMM d')}. We&apos;ll be in touch.
            </p>
            <Button onClick={onClose} variant="outline" size="sm" className="mt-4">Close</Button>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-xl mb-1">Book Your Drop</h2>
            <p className="text-sm text-muted-foreground mb-5">{format(date, 'EEEE, MMMM d, yyyy')}</p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                  <FormField control={form.control} name="phone_number" render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className={lc}>Phone *</FormLabel>
                      <FormControl><Input type="tel" placeholder="(555) 123-4567" className={ic} disabled={status === 'loading'} {...field} /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="instagram_handle" render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className={lc}>Instagram *</FormLabel>
                      <FormControl><Input placeholder="@handle" className={ic} disabled={status === 'loading'} {...field} /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="media_link" render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className={lc}>Media Link *</FormLabel>
                    <FormControl><Input type="url" placeholder="https://drive.google.com/..." className={ic} disabled={status === 'loading'} {...field} /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="is_ready" render={({ field }) => (
                  <FormItem className="flex items-start gap-2 space-y-0 pt-1">
                    <FormControl>
                      <input type="checkbox" checked={field.value === true} onChange={e => field.onChange(e.target.checked ? true : false)}
                        disabled={status === 'loading'}
                        className="mt-0.5 h-4 w-4 rounded border-border accent-nd-red" />
                    </FormControl>
                    <FormLabel className="text-xs text-muted-foreground leading-snug cursor-pointer">
                      I have my audio and video ready to upload *
                    </FormLabel>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />

                {errorMsg && <p className="text-xs text-destructive text-center">{errorMsg}</p>}

                <Button type="submit" disabled={status === 'loading'}
                  className="w-full bg-nd-red hover:bg-nd-red/90 text-white h-10 text-sm font-semibold rounded-lg">
                  {status === 'loading' ? 'Booking...' : 'Book This Date'}
                </Button>
              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  )
}
