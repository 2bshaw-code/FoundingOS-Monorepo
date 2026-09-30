import { NextRequest, NextResponse } from 'next/server'
import { recordPreviewVisit } from '../../../../src/preview-visitors'
import { normalizeAccessEmail, safeReturnPath, signSiteAccess, SITE_ACCESS_COOKIE, SITE_ACCESS_MAX_AGE, siteAccessRole } from '../../../../src/site-access'

const attempts = new Map<string, { count: number; resetAt: number }>()
const windowMs = 15 * 60_000
const maxAttempts = 8

const apiRoot = () => (process.env.CORE_OPERATIONS_API_BASE || process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL || process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || '')
  .trim().replace(/\/ops\/?$/, '').replace(/\/+$/, '')

// People with a real FoundingOS account (for example invited teammates) can pass the preview gate
// with their own password. The check session is signed out straight away.
async function hasAccount(email: string, password: string) {
  const root = apiRoot()
  if (!root || password.length < 12) return false
  const response = await fetch(`${root}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Device-Fingerprint': 'foundingos-web-access-gate' }, body: JSON.stringify({ email, password }), cache: 'no-store', signal: AbortSignal.timeout(8000) }).catch(() => null)
  if (!response?.ok) return false
  const body = await response.json().catch(() => null) as { refreshToken?: unknown } | null
  if (typeof body?.refreshToken === 'string') await fetch(`${root}/auth/logout`, { method: 'POST', headers: { 'x-refresh-token': body.refreshToken, 'X-Device-Fingerprint': 'foundingos-web-access-gate' }, cache: 'no-store' }).catch(() => undefined)
  return true
}

export async function POST(request: NextRequest) {
  if (process.env.SITE_ACCESS_ENABLED !== 'true') return NextResponse.redirect(new URL('/', request.url), 303)
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const client = forwarded || request.ip || 'unknown'
  const now = Date.now()
  const current = attempts.get(client)
  const state = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current
  if (state.count >= maxAttempts) return new NextResponse('Too many password attempts. Try again later.', { status: 429 })

  const form = await request.formData()
  const returnTo = safeReturnPath(form.get('returnTo'))
  const email = normalizeAccessEmail(String(form.get('email') ?? ''))
  const password = String(form.get('password') ?? '')
  const role = email ? siteAccessRole(password) ?? (await hasAccount(email, password) ? 'guest' : null) : null
  if (!email || !role) {
    attempts.set(client, { ...state, count: state.count + 1 })
    const retry = new URL('/access', request.url)
    retry.searchParams.set('returnTo', returnTo)
    retry.searchParams.set('error', 'invalid')
    return NextResponse.redirect(retry, 303)
  }

  await recordPreviewVisit({
    email,
    returnPath: returnTo,
    referrer: request.headers.get('referer'),
    userAgent: request.headers.get('user-agent'),
    clientAddress: client,
  }).catch((error) => {
    // Visit logging is analytics, not authentication. A database outage must
    // never lock verified visitors out of the site.
    console.error('[access] could not record preview visit', error)
  })

  attempts.delete(client)
  const response = NextResponse.redirect(new URL(returnTo, request.url), 303)
  response.cookies.set(SITE_ACCESS_COOKIE, signSiteAccess(email, Date.now(), role), {
    httpOnly: true,
    maxAge: SITE_ACCESS_MAX_AGE,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
  return response
}
