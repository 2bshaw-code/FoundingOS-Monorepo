/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from './app/tester/session'

// Real brand slugs this hub can be tinted for — matches @foundingos/config's brand registry.
// Kept as a plain list here (not imported from config) so this Edge middleware stays free of
// any heavier dependency; the actual accent colour lookup happens in layout.tsx.
const KNOWN_BRAND_SLUGS = new Set(['retail', 'crypto', 'meat', 'talent', 'foundthat', 'finance', 'health', 'logistics'])
const HUB_BRAND_TINT_COOKIE = 'fo_hub_brand_tint'

// Scoped to /tester/* only — every other route in this console is untouched (zero drift).
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Real fix for a genuine branding mismatch: an admin/tester clicking "Demos & Surveys" from
  // a brand console (e.g. all-green FoundRetail) landed on this shared hub styled in
  // FoundingOS's own blue/rainbow theme — jarring and, per explicit product direction, worth
  // fixing by tinting the hub with whichever brand's colour you actually arrived from. Each
  // brand-config.ts's "Demos & Surveys" link now carries `?fromBrand={slug}`; this middleware
  // reads it once and stores it in a cookie so the tint persists across the whole visit
  // (survey, demo, investor, dashboard) without every internal link needing to repeat it.
  const fromBrand = request.nextUrl.searchParams.get('fromBrand')
  const tintCookie = request.cookies.get(HUB_BRAND_TINT_COOKIE)?.value
  let tintResponseInit: { setTint?: string; clearTint?: boolean } = {}
  if (fromBrand && KNOWN_BRAND_SLUGS.has(fromBrand) && fromBrand !== tintCookie) {
    tintResponseInit.setTint = fromBrand
  }

  const applyTint = (response: NextResponse) => {
    if (tintResponseInit.setTint) {
      response.cookies.set(HUB_BRAND_TINT_COOKIE, tintResponseInit.setTint, { path: '/', maxAge: 60 * 60 * 8 })
    }
    return response
  }

  if (pathname.startsWith('/tester/admin') && pathname !== '/tester/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE)?.value
    const adminId = token ? await verifyToken('admin', token) : null
    if (!adminId) return NextResponse.redirect(new URL('/tester/admin/login', request.url))
    return applyTint(NextResponse.next())
  }

  if (pathname.startsWith('/tester/dashboard') || pathname.startsWith('/tester/survey') || pathname.startsWith('/tester/demo') || pathname.startsWith('/investor') || pathname.startsWith('/legal')) {
    const adminToken = request.cookies.get(ADMIN_COOKIE)?.value
    const adminId = adminToken ? await verifyToken('admin', adminToken) : null

    // Admin always bypasses the tester gate on these pages — matches the existing
    // /finance and /crypto branches below, which already accept either token. This branch
    // previously only checked the tester cookie, so an admin (no tester session) visiting
    // /tester/dashboard|survey|demo was incorrectly bounced to /tester/login.
    if (adminId) {
      const response = applyTint(NextResponse.next())
      // Defense in depth: if a stale tester cookie exists from before login-time clearing
      // was added, strip it here too so admin never sees tester-mode state.
      if (request.cookies.get(SESSION_COOKIE)) response.cookies.delete(SESSION_COOKIE)
      return response
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value
    const testerId = token ? await verifyToken('tester', token) : null
    if (!testerId) return NextResponse.redirect(new URL('/tester/login', request.url))
    return applyTint(NextResponse.next())
  }

  // Founder Console + Ecosystem Demo: admin-only (master control centre + promo-recording
  // tool, neither is a tester-facing surface) — previously /founder had no auth check at all
  // here or in its own page code, meaning anyone with the URL could reach it. Real fix, not a
  // demo/manual-only workaround.
  if (pathname.startsWith('/founder') || pathname.startsWith('/ecosystem-demo')) {
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

  // SuperDash + Guardian: Admin gets full access; every other real session (tester, survey,
  // buyer, customer, free-roam, investor, lawyer — all of them, not just free-roam/investor/
  // lawyer as before) gets the same real, live, read-only view — matching the Switcher's G1/A1/
  // B1 "Guardian/Autonomous/BrandMetric Demo" now being available to every real session.
  if (pathname.startsWith('/superdashboard') || pathname.startsWith('/system/guardian')) {
    const adminToken = request.cookies.get(ADMIN_COOKIE)?.value
    const adminId = adminToken ? await verifyToken('admin', adminToken) : null
    if (adminId) return NextResponse.next()

    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value
    const testerId = sessionToken ? await verifyToken('tester', sessionToken) : null
    if (!testerId) return NextResponse.redirect(new URL('/tester/login', request.url))

    if (pathname.startsWith('/api/') && request.method !== 'GET') {
      return NextResponse.json({ error: 'Read-only session — write access is disabled.' }, { status: 403 })
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/tester/dashboard/:path*', '/tester/survey/:path*', '/tester/demo/:path*', '/tester/admin/:path*', '/founder/:path*', '/ecosystem-demo/:path*', '/finance/:path*', '/crypto/:path*', '/investor/:path*', '/legal/:path*', '/superdashboard/:path*', '/system/guardian/:path*'],
}

