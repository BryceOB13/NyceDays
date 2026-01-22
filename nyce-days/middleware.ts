import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // TEMPORARILY DISABLE MIDDLEWARE FOR DEBUGGING
  console.log('Middleware called for:', request.nextUrl.pathname)
  return NextResponse.next()

  // Only protect /admin routes (except login and auth-test)
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow access to login page and auth test
  if (request.nextUrl.pathname === '/admin/login' || 
      request.nextUrl.pathname === '/admin/auth-test' ||
      request.nextUrl.pathname.startsWith('/admin/auth/')) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    
    console.log('Middleware auth check:', { 
      path: request.nextUrl.pathname, 
      user: user?.email, 
      error: error?.message 
    })

    // Redirect to login if not authenticated
    if (!user && !error) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      console.log('Redirecting to login:', loginUrl.toString())
      return NextResponse.redirect(loginUrl)
    }

    // If there's an auth error, also redirect to login
    if (error) {
      console.log('Auth error in middleware:', error.message)
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('error', 'auth_error')
      return NextResponse.redirect(loginUrl)
    }

    return response
  } catch (err) {
    console.error('Middleware error:', err)
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('error', 'middleware_error')
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
