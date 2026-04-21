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
  instagram_handle: z.string().min(1, 'Instagram is required'),
  phone_number: z.string().min(1, 'Phone is required'),
  is_ready: z.literal(true, { message: 'Confirm your audio is ready' }),
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
      instagram_handle: '', phone_number: '',
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
        body: JSON.stringify({
          ...data,
          booking_date: bookingDate,
          // Send IG as name/email placeholders since the API expects them
          full_name: data.instagram_handle,
          email: `${data.instagram_handle.replace('@', '')}@placeholder.nycedays.com`,
          media_link: 'https://nycedays.com',
        }),
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

  const ic = 'bg-background/50 border-border/30 h-10 text-sm focus:border-nd-red focus:ring-1 focus:ring-nd-red/20 transition-all rounded-lg'
  const lc = 'text-foreground/70 text-xs font-medium'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-background border border-border/30 rounded-2xl p-6 md:p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
          <X className="h-5 w-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="font-serif text-2xl mb-2">Date claimed.</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              We&apos;ll reach out to confirm for {format(date, 'MMMM d')}.
            </p>
            <Button onClick={onClose} variant="outline" size="sm" className="mt-6">Done</Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-nd-red font-semibold mb-1">Claim this drop date</p>
              <h2 className="font-serif text-2xl">{format(date, 'EEEE, MMMM d')}</h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="instagram_handle" render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className={lc}>Instagram *</FormLabel>
                    <FormControl><Input placeholder="@handle" className={ic} disabled={status === 'loading'} {...field} /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone_number" render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className={lc}>Phone *</FormLabel>
                    <FormControl><Input type="tel" placeholder="(555) 123-4567" className={ic} disabled={status === 'loading'} {...field} /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="is_ready" render={({ field }) => (
                  <FormItem className="flex items-start gap-2.5 space-y-0 pt-1">
                    <FormControl>
                      <input type="checkbox" checked={field.value === true} onChange={e => field.onChange(e.target.checked ? true : false)}
                        disabled={status === 'loading'}
                        className="mt-0.5 h-4 w-4 rounded border-border accent-nd-red" />
                    </FormControl>
                    <FormLabel className="text-xs text-muted-foreground leading-snug cursor-pointer">
                      My audio is ready *
                    </FormLabel>
                  </FormItem>
                )} />

                {errorMsg && <p className="text-xs text-destructive text-center">{errorMsg}</p>}

                <Button type="submit" disabled={status === 'loading'}
                  className="w-full bg-nd-red hover:bg-nd-red/90 text-white h-11 text-sm font-semibold rounded-lg mt-1">
                  {status === 'loading' ? 'Claiming...' : 'Claim This Date'}
                </Button>
              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  )
}
