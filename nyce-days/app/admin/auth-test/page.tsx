'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AuthTest() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          setError(`Session error: ${error.message}`)
        } else {
          setSession(session)
          setUser(session?.user || null)
        }
      } catch (err) {
        setError(`Unexpected error: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session)
        setSession(session)
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const testLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: 'bryce@nycedays.com',
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback`
      }
    })
    
    if (error) {
      setError(`Login error: ${error.message}`)
    } else {
      alert('Check your email for the magic link!')
    }
  }

  const testLogout = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(`Logout error: ${error.message}`)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Auth Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
              {error}
            </div>
          )}
          
          <div>
            <h3 className="font-semibold">User:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold">Session:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
          
          <div className="space-x-2">
            <Button onClick={testLogin}>Test Login</Button>
            <Button onClick={testLogout} variant="outline">Test Logout</Button>
          </div>
          
          <div>
            <h3 className="font-semibold">Environment:</h3>
            <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p>Has Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}