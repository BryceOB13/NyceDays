'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const searchParams = useSearchParams()
  const supabase = createClient()

  const redirect = searchParams.get('redirect') || '/admin'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setIsError(false)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback?redirect=${redirect}`,
      },
    })

    if (error) {
      setMessage(error.message)
      setIsError(true)
    } else {
      setMessage('Check your email for the login link!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-foreground">
      <div className="w-full max-w-md p-8">
        <div className="flex justify-center mb-8">
          <Image
            src="/logos/full-white.png"
            alt="Nyce Days"
            width={180}
            height={72}
            className="h-16 w-auto"
          />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center text-background">
          Admin Login
        </h1>
        <p className="text-background/60 text-center mb-8 text-sm">
          Enter your email to receive a magic link
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nycedays.com"
              className="w-full p-4 bg-background/10 border border-background/20 rounded-lg text-background placeholder:text-background/40 focus:outline-none focus:border-background/40 transition-colors"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-background text-foreground rounded-lg font-medium hover:bg-background/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {message && (
          <p className={`mt-6 text-center text-sm ${isError ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}

        <p className="mt-8 text-center text-background/40 text-xs">
          Only authorized administrators can access this area.
        </p>
      </div>
    </div>
  )
}
