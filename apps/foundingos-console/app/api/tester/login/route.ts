/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, ADMIN_COOKIE, signToken } from '../../../tester/session'
import { findCredentialByPassword, isSuperFounderAdmin, categorizeCredential } from '../../../tester/tester-data'
import { getTester, upsertTester } from '../../../tester/store.server'
import { LEGAL_CONTENT_VERSION } from '../../../tester/legal-content'
import { logLegalAcceptance } from '../../../tester/legal-acceptance-store.server'
import { brands } from '@foundingos/config'

// The real Quantum-styled login page lives on the root domain (www.foundingos.com /
// apps/foundingos-web), a different origin from this console — it calls this endpoint
// cross-origin with credentials so the resulting session cookie is set for
// console.foundingos.com. Only these known, real app origins are allowed.
const ALLOWED_ORIGINS = new Set([
  'https://www.foundingos.com',
  'https://foundingos.com',
  'https://console.foundingos.com',
])

// Local development origins — never allowed in production builds.
const DEV_ORIGINS = new Set([
  'http://localhost:1000',
  'http://localhost:8000',
])

function isAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false
  if (ALLOWED_ORIGINS.has(origin)) return true
  return process.env.NODE_ENV !== 'production' && DEV_ORIGINS.has(origin)
}

// Cookie domain: shared .foundingos.com in production so sessions span subdomains;
// host-only (undefined) in local dev, because browsers reject Domain=.foundingos.com
// cookies set from localhost and silently drop the session.
function sessionCookieDomain(): string | undefined {
  return process.env.NODE_ENV === 'production' ? '.foundingos.com' : undefined
}

function corsHeaders(origin: string | null): HeadersInit {
  if (!isAllowedOrigin(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin')
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(origin),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  const withCors = (response: NextResponse) => {
    for (const [key, value] of Object.entries(corsHeaders(origin))) response.headers.set(key, value)
    return response
  }

  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password.trim() : ''
  const agreedToLegalTerms = body?.agreedToLegalTerms === true

  if (!email || !password) {
    return withCors(NextResponse.json({ error: 'Email and password/access code are required.' }, { status: 400 }))
  }

  // Super Founder Admin: bypasses the tester credential pool, but goes through the exact same
  // legal-acceptance gate as every real tester/investor/lawyer session. Lands back on the real
  // main website's own Homepage (not the Switcher Hub) — explicit product direction: admin's
  // login should return to the main site, with a real one-click path from there into the
  // console's full Demo & Survey Switcher hub (see FounderLauncher's "Console" nav link, which
  // now points straight at /tester/dashboard rather than forcing a second login). Explicitly
  // clears any pre-existing tester SESSION_COOKIE on this browser so a leftover tester session
  // can never coexist with — or be mistaken for — the admin session.
  if (isSuperFounderAdmin(email, password)) {
    if (!agreedToLegalTerms) {
      return withCors(NextResponse.json({ error: 'You must review and accept the agreements before signing in.' }, { status: 403 }))
    }

    try {
      await logLegalAcceptance({ email, passwordUsed: '(admin)', version: LEGAL_CONTENT_VERSION, timestamp: new Date() })
    } catch (error) {
      console.error('logLegalAcceptance failed (admin login proceeds regardless):', error)
    }

    const token = await signToken('admin', 'super-founder-admin')
    const response = NextResponse.json({ ok: true, redirect: `${brands.foundingos.webUrl}/home`, category: 'admin' })
    response.cookies.set(ADMIN_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', domain: sessionCookieDomain(), maxAge: 60 * 60 * 8 })
    response.cookies.set(SESSION_COOKIE, '', { path: '/', domain: sessionCookieDomain(), maxAge: 0 })
    return withCors(response)
  }

  const credential = findCredentialByPassword(password)
  if (!credential) {
    return withCors(NextResponse.json({ error: 'That password or access code is not recognized.' }, { status: 401 }))
  }

  // Legal agreements (Terms of Service, Privacy Policy, NDA, etc.) must be accepted
  // before a Tester/Investor/Legal Reviewer session is granted — this is enforced
  // server-side, not just via a disabled button in the UI.
  if (!agreedToLegalTerms) {
    return withCors(NextResponse.json({ error: 'You must review and accept the agreements before signing in.' }, { status: 403 }))
  }

  const existing = await getTester(credential.id)
  const tester = await upsertTester(credential.id, {
    email: existing?.email || email,
    moduleId: credential.moduleId,
    moduleLabel: credential.moduleLabel,
    surveyId: credential.surveyId,
    status: existing?.status ?? 'registered',
    currentAnswers: existing?.currentAnswers ?? [],
    runs: existing?.runs ?? [],
    // Tracks exactly which password/access code (any batch) was used at this login,
    // alongside the email/module/timestamp fields this record already carries.
    lastCredentialUsed: password,
  })

  // Immutable, versioned, timestamped acceptance record — Postgres-backed (Commercial
  // Mode) or a safe no-op (Demo Mode, the current state) — append-only, never edited.
  // Wrapped defensively: a transient DB outage in Commercial Mode must never block a
  // tester/investor/lawyer from signing in — acceptance is already enforced above via
  // the agreedToLegalTerms check; this call is best-effort persistence on top of that.
  try {
    await logLegalAcceptance({
      email: tester.email,
      passwordUsed: password,
      version: LEGAL_CONTENT_VERSION,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('logLegalAcceptance failed (login proceeds regardless):', error)
  }

  const category = categorizeCredential(credential.id)
  // Category-specific real destinations, used by the root-domain login page (which
  // ignores the generic /tester/dashboard redirect below for survey/investor/lawyer
  // categories); kept here too so any direct caller of this API gets a sensible default.
  const categoryRedirect: Record<typeof category, string> = {
    survey: '/tester/survey',
    tester: '/tester/dashboard',
    investor: '/investor',
    buyer: '/tester/dashboard',
    customer: '/tester/dashboard',
    lawyer: '/legal',
    'free-roam': '/tester/dashboard',
    // Never actually reached — the real Super Founder Admin returns early above — but
    // CredentialCategory now includes 'admin' for buildSwitcherOptions' sake, so this map
    // must stay exhaustive. Kept consistent with where admin actually lands.
    admin: '/tester/dashboard',
  }

  const token = await signToken('tester', tester.id)
  const response = NextResponse.json({ ok: true, redirect: categoryRedirect[category], category })
  response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', domain: sessionCookieDomain(), maxAge: 60 * 60 * 8 })
  // Real, pre-existing gap found and fixed: the admin login above already clears any stale
  // SESSION_COOKIE so an admin session can never coexist with a leftover tester one — but this
  // real tester login never did the same in reverse. A stale ADMIN_COOKIE from an earlier admin
  // session in the same browser would keep taking priority everywhere (middleware, this same
  // page's own layout), silently masking a brand-new real tester login behind the old admin
  // view. Confirmed live: logging in as a real tester right after an admin session, without
  // this, still showed the admin dashboard.
  response.cookies.set(ADMIN_COOKIE, '', { path: '/', domain: sessionCookieDomain(), maxAge: 0 })
  return withCors(response)
}
