import { NextRequest, NextResponse } from 'next/server'
import { recordPreviewVisit } from '../../../../src/preview-visitors'
import { normalizeAccessEmail, safeReturnPath, signSiteAccess, SITE_ACCESS_COOKIE, SITE_ACCESS_MAX_AGE, siteAccessRole } from '../../../../src/site-access'
import { ACCOUNT_HANDOFF_COOKIE, ACCOUNT_HANDOFF_MAX_AGE, sealAccountHandoff } from '../../../../src/account-handoff'

const attempts = new Map<string, { count: number; resetAt: number }>()
const windowMs = 15 * 60_000
const maxAttempts = 8

const apiRoot = () => (process.env.CORE_OPERATIONS_API_BASE || process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL || process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || '')
  .trim().replace(/\/ops\/?$/, '').replace(/\/+$/, '')

async function accountLogin(email: string, password: string, fingerprint: string) {
  const root = apiRoot()
  if (!root || password.length < 12 || !fingerprint) return null
  const response = await fetch(`${root}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Device-Fingerprint': fingerprint }, body: JSON.stringify({ email, password }), cache: 'no-store', signal: AbortSignal.timeout(8000) })
  if (response.status === 401 || response.status === 403) return null
  if (!response.ok) throw new Error(`Account sign-in unavailable (HTTP ${response.status})`)
  const body = await response.json() as { refreshToken?: unknown; user?: { email?: string } }
  if (typeof body.refreshToken !== 'string' || body.user?.email?.toLowerCase() !== email) throw new Error('Account sign-in returned an incomplete session')
  return body.refreshToken
}

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return new NextResponse('Same-origin sign-in required.', { status: 403 })
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
  const fingerprint = String(form.get('fingerprint') ?? '').trim().slice(0, 200)
  let role = email ? siteAccessRole(password) : null
  let refreshToken: string | null = null
  if (email && !role) {
    try { refreshToken = await accountLogin(email, password, fingerprint) } catch (error) {
      console.error('[access] account sign-in unavailable', error instanceof Error ? error.message : 'Unknown error')
      return new NextResponse('Account sign-in is temporarily unavailable. Please try again.', { status: 502 })
    }
    if (refreshToken) role = 'guest'
  }
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
  const response = NextResponse.redirect(new URL(refreshToken && returnTo === '/' ? '/app/retail' : returnTo, request.url), 303)
  response.cookies.set(SITE_ACCESS_COOKIE, signSiteAccess(email, Date.now(), role), {
    httpOnly: true,
    maxAge: SITE_ACCESS_MAX_AGE,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
  response.cookies.set(ACCOUNT_HANDOFF_COOKIE, refreshToken ? sealAccountHandoff(email, refreshToken, fingerprint) : '', {
    httpOnly: true, maxAge: refreshToken ? ACCOUNT_HANDOFF_MAX_AGE : 0,
    sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/',
  })
  return response
}
