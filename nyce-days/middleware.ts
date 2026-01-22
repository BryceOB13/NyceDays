import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // COMPLETELY DISABLED FOR DEBUGGING
  console.log('Middleware bypassed for:', request.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [],  // Empty matcher = no middleware
}
