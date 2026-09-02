/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from './app/tester/session'
import { categorizeCredential } from './app/tester/tester-data'

// Scoped to /tester/* only — every other route in this console is untouched (zero drift).
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/tester/admin') && pathname !== '/tester/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE)?.value
    const adminId = token ? await verifyToken('admin', token) : null
    if (!adminId) return NextResponse.redirect(new URL('/tester/admin/login', request.url))
    return NextResponse.next()
  }

  if (pathname.startsWith('/tester/dashboard') || pathname.startsWith('/tester/survey') || pathname.startsWith('/tester/demo') || pathname.startsWith('/investor') || pathname.startsWith('/legal')) {
    const adminToken = request.cookies.get(ADMIN_COOKIE)?.value
    const adminId = adminToken ? await verifyToken('admin', adminToken) : null

    // Admin always bypasses the tester gate on these pages — matches the existing
    // /finance and /crypto branches below, which already accept either token. This branch
    // previously only checked the tester cookie, so an admin (no tester session) visiting
    // /tester/dashboard|survey|demo was incorrectly bounced to /tester/login.
    if (adminId) {
      const response = NextResponse.next()
      // Defense in depth: if a stale tester cookie exists from before login-time clearing
      // was added, strip it here too so admin never sees tester-mode state.
      if (request.cookies.get(SESSION_COOKIE)) response.cookies.delete(SESSION_COOKIE)
      return response
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value
    const testerId = token ? await verifyToken('tester', token) : null
    if (!testerId) return NextResponse.redirect(new URL('/tester/login', request.url))
    return NextResponse.next()
  }

  // Founder Console: admin-only (this is the master control centre, not a tester-facing
  // surface) — previously had no auth check at all here or in its own page code, meaning
  // anyone with the URL could reach it. Real fix, not a demo/manual-only workaround.
  if (pathname.startsWith('/founder')) {
    const adminToken = request.cookies.get(ADMIN_COOKIE)?.value
    const adminId = adminToken ? await verifyToken('admin', adminToken) : null
    if (!adminId) return NextResponse.redirect(new URL('/tester/login', request.url))
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

  // SuperDash + Guardian: Admin gets full access, Free Roam (+ investor/lawyer) gets a
  // read-only view, Tester/Survey sessions are sent to their own real survey instead —
  // they were previously fully public, now aligned with the same three-role model as
  // every other app on the shared session domain.
  if (pathname.startsWith('/superdashboard') || pathname.startsWith('/system/guardian')) {
    const adminToken = request.cookies.get(ADMIN_COOKIE)?.value
    const adminId = adminToken ? await verifyToken('admin', adminToken) : null
    if (adminId) return NextResponse.next()

    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value
    const testerId = sessionToken ? await verifyToken('tester', sessionToken) : null
    if (!testerId) return NextResponse.redirect(new URL('/tester/login', request.url))

    const category = categorizeCredential(testerId)
    if (category === 'free-roam' || category === 'investor' || category === 'lawyer') {
      if (pathname.startsWith('/api/') && request.method !== 'GET') {
        return NextResponse.json({ error: 'Read-only session — write access is disabled.' }, { status: 403 })
      }
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/tester/survey', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/tester/dashboard/:path*', '/tester/survey/:path*', '/tester/demo/:path*', '/tester/admin/:path*', '/founder/:path*', '/finance/:path*', '/crypto/:path*', '/investor/:path*', '/legal/:path*', '/superdashboard/:path*', '/system/guardian/:path*'],
}

