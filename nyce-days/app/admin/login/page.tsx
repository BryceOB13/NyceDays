'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Loader2, AlertCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('bryce@nycedays.com') // Pre-fill for testing
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/admin'
  const urlError = searchParams.get('error')

  useEffect(() => {
    if (urlError) {
      setError(`Authentication error: ${urlError}`)
    }

    // Check if user is already logged in
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session }, error } = await supabase.auth.getSession()
      
      setDebugInfo(`Session check: ${session ? 'Found' : 'None'}, Error: ${error?.message || 'None'}`)
      
      if (session && !error) {
        router.push(redirectTo)
      }
    }

    checkAuth()
  }, [urlError, redirectTo, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const supabase = createClient()
      
      // Test connection first
      const { data: testData, error: testError } = await supabase.from('subscribers').select('count').limit(1)
      setDebugInfo(`DB Test: ${testError ? testError.message : 'Connected'}, Data: ${JSON.stringify(testData)}`)
      
      const redirectUrl = `${window.location.origin}/admin/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
      console.log('Sending magic link to:', email, 'Redirect URL:', redirectUrl)
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      console.log('Auth response:', { data, error })

      if (error) {
        setError(`Login error: ${error.message}`)
        setDebugInfo(prev => prev + ` | Auth Error: ${error.message}`)
      } else {
        setMessage('Check your email for the login link!')
        setDebugInfo(prev => prev + ` | Magic link sent successfully`)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(`Unexpected error: ${err}`)
      setDebugInfo(prev => prev + ` | Catch Error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your email to receive a magic link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@nycedays.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                {message}
              </div>
            )}

            {debugInfo && (
              <div className="p-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md">
                <strong>Debug:</strong> {debugInfo}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !email}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Magic Link
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/')}
              className="text-sm text-muted-foreground"
            >
              ← Back to website
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => router.push('/admin/auth-test')}
              className="text-xs text-muted-foreground"
            >
              Debug Auth
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}