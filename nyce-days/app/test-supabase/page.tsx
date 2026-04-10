'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...')
  const [details, setDetails] = useState<any>({})

  useEffect(() => {
    const testConnection = async () => {
      try {
        const supabase = createClient()
        
        // Test 1: Basic connection
        setStatus('Testing basic connection...')
        
        // Test 2: Simple query
        const { data, error } = await supabase
          .from('subscribers')
          .select('count')
          .limit(1)
        
        if (error) {
          setStatus(`Database Error: ${error.message}`)
          setDetails({ error: error.message, code: error.code })
        } else {
          setStatus('✅ Supabase connection working!')
          setDetails({ 
            data, 
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          })
        }

        // Test 3: Auth methods
        const { data: authData, error: authError } = await supabase.auth.getSession()
        setDetails((prev: any) => ({
          ...prev,
          authTest: authError ? authError.message : 'Auth methods available',
          session: authData.session ? 'Has session' : 'No session'
        }))

      } catch (err) {
        setStatus(`Connection Error: ${err}`)
        setDetails({ error: String(err) })
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Status:</h2>
          <p>{status}</p>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Details:</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Environment:</h2>
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p>Has Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</p>
          <p>Key Preview: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
        </div>
      </div>
    </div>
  )
}