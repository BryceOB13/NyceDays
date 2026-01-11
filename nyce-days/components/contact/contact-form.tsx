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
}

const inquiryTypes = [
  { value: 'partnership', label: 'Partnership' },
  { value: 'event', label: 'Event' },
  { value: 'content', label: 'Content' },
  { value: 'general', label: 'General' },
] as const

export function ContactForm({ className }: ContactFormProps) {
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
      <div className={cn('rounded-lg bg-secondary p-8 text-center', className)}>
        <h3 className="font-serif text-2xl text-foreground mb-2">Message Sent!</h3>
        <p className="text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
        <Button
          onClick={() => setStatus('idle')}
          variant="outline"
          className="mt-4"
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onFocus={handleFormStart}
        className={cn('space-y-6', className)}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    className="bg-secondary border-border"
                    disabled={status === 'loading'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-secondary border-border"
                    disabled={status === 'loading'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Company</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your company (optional)"
                    className="bg-secondary border-border"
                    disabled={status === 'loading'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inquiry_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Inquiry Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={status === 'loading'}
                >
                  <FormControl>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border">
                    {inquiryTypes.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Message *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your project or inquiry..."
                  className="min-h-[150px] bg-secondary border-border"
                  disabled={status === 'loading'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referral"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">How did you hear about us?</FormLabel>
              <FormControl>
                <Input
                  placeholder="Instagram, friend, event, etc. (optional)"
                  className="bg-secondary border-border"
                  disabled={status === 'loading'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {status === 'error' && errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-nd-red hover:bg-nd-red/90 text-white"
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  )
}
