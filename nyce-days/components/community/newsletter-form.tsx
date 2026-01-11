'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { subscribeSchema, type SubscribeData } from '@/lib/schemas'
import { useAnalytics } from '@/hooks/use-analytics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

interface NewsletterFormProps {
  source?: 'footer' | 'community' | 'shop' | 'contact'
  className?: string
}

export function NewsletterForm({ source = 'footer', className }: NewsletterFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { track } = useAnalytics()

  const form = useForm<SubscribeData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: '',
      source,
    },
  })

  async function onSubmit(data: SubscribeData) {
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setStatus('error')
        setErrorMessage(result.error || 'Something went wrong. Please try again.')
        return
      }

      // Track successful subscription
      track('newsletter_signup', { source })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('text-center', className)}>
        <p className="text-sm text-foreground">
          Thanks for subscribing! We&apos;ll be in touch.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col sm:flex-row gap-2', className)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background border-border"
                  disabled={status === 'loading'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="bg-nd-red hover:bg-nd-red/90 text-white"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      {status === 'error' && (
        <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
      )}
    </Form>
  )
}
