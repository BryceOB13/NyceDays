'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/schemas'
import { useAnalytics } from '@/hooks/use-analytics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface ContactFormProps {
  className?: string
  variant?: 'default' | 'dark'
}

const inquiryTypes = [
  { value: 'partnership', label: 'Partnership' },
  { value: 'event', label: 'Event' },
  { value: 'content', label: 'Content' },
  { value: 'general', label: 'General' },
] as const

export function ContactForm({ className, variant = 'default' }: ContactFormProps) {
  const isDark = variant === 'dark'
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { track } = useAnalytics()
  const hasTrackedStart = useRef(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      inquiry_type: undefined,
      message: '',
      referral: '',
    },
  })

  async function onSubmit(data: ContactFormData) {
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setStatus('error')
        if (result.details) {
          Object.entries(result.details).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              form.setError(field as keyof ContactFormData, {
                type: 'server',
                message: messages[0],
              })
            }
          })
        }
        setErrorMessage(result.error || 'Something went wrong. Please try again.')
        return
      }

      // Track successful submission
      track('contact_form_submit', { inquiry_type: data.inquiry_type })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  // Track form start on first interaction
  const handleFormStart = () => {
    if (!hasTrackedStart.current) {
      track('contact_form_start', { page: '/contact' })
      hasTrackedStart.current = true
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('rounded-lg p-6 text-center', isDark ? 'bg-white/10 backdrop-blur-sm' : 'bg-secondary/50', className)}>
        <h3 className={cn('font-serif text-xl mb-2', isDark ? 'text-white' : 'text-foreground')}>Message Sent!</h3>
        <p className={cn('text-sm', isDark ? 'text-white/70' : 'text-muted-foreground')}>
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
        <Button
          onClick={() => setStatus('idle')}
          variant="outline"
          size="sm"
          className={cn('mt-4', isDark && 'border-white/30 text-white hover:bg-white/10')}
        >
          Send Another
        </Button>
      </div>
    )
  }

  const inputClasses = isDark 
    ? 'bg-white/5 border-white/30 text-white placeholder:text-white/40 h-10 text-sm focus:border-nd-red focus:bg-white/10 transition-all'
    : 'bg-transparent border-border/50 h-9 text-sm focus:border-nd-red transition-colors'
  
  const labelClasses = isDark ? 'text-white text-xs font-medium' : 'text-foreground text-xs'

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onFocus={handleFormStart}
        className={cn('space-y-4', className)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className={labelClasses}>Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    className={inputClasses}
                    disabled={status === 'loading'}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className={labelClasses}>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className={inputClasses}
                    disabled={status === 'loading'}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className={labelClasses}>Company</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Optional"
                    className={inputClasses}
                    disabled={status === 'loading'}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inquiry_type"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className={labelClasses}>Inquiry Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={status === 'loading'}
                >
                  <FormControl>
                    <SelectTrigger className={isDark 
                      ? 'bg-white/5 border-white/30 text-white h-10 text-sm focus:border-nd-red focus:bg-white/10 transition-all [&>span]:text-white/40 [&[data-state=open]>span]:text-white'
                      : 'bg-transparent border-border/50 h-9 text-sm focus:border-nd-red transition-colors'
                    }>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border">
                    {inquiryTypes.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="text-sm"
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={labelClasses}>Message *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your project..."
                  className={isDark 
                    ? 'min-h-[100px] bg-white/5 border-white/30 text-white placeholder:text-white/40 text-sm focus:border-nd-red focus:bg-white/10 transition-all resize-none'
                    : 'min-h-[100px] bg-transparent border-border/50 text-sm focus:border-nd-red transition-colors resize-none'
                  }
                  disabled={status === 'loading'}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referral"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className={labelClasses}>How did you hear about us?</FormLabel>
              <FormControl>
                <Input
                  placeholder="Instagram, friend, event, etc."
                  className={inputClasses}
                  disabled={status === 'loading'}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {status === 'error' && errorMessage && (
          <p className="text-xs text-destructive">{errorMessage}</p>
        )}

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-nd-red hover:bg-nd-red/90 text-white h-10 text-sm font-medium"
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  )
}
