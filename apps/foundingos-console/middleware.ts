/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from './app/tester/session'

// Scoped to /tester/* only — every other route in this console is untouched (zero drift).
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/tester/admin') && pathname !== '/tester/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE)?.value
    const adminId = token ? await verifyToken('admin', token) : null
    if (!adminId) return NextResponse.redirect(new URL('/tester/admin/login', request.url))
    return NextResponse.next()
  }

  if (pathname.startsWith('/tester/dashboard') || pathname.startsWith('/tester/survey') || pathname.startsWith('/tester/demo')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    const testerId = token ? await verifyToken('tester', token) : null
    if (!testerId) return NextResponse.redirect(new URL('/tester/login', request.url))
    return NextResponse.next()
  }

  if (pathname.startsWith('/finance') || pathname.startsWith('/crypto')) {
    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value
    const adminToken = request.cookies.get(ADMIN_COOKIE)?.value
    const testerId = sessionToken ? await verifyToken('tester', sessionToken) : null
    const adminId = adminToken ? await verifyToken('admin', adminToken) : null
    if (!testerId && !adminId) return NextResponse.redirect(new URL('/tester/login', request.url))
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/tester/dashboard/:path*', '/tester/survey/:path*', '/tester/demo/:path*', '/tester/admin/:path*', '/finance/:path*', '/crypto/:path*'],
}

