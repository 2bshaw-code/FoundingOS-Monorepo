import { NextRequest, NextResponse } from 'next/server'
import { recordPreviewVisit } from '../../../../src/preview-visitors'
import { normalizeAccessEmail, safeReturnPath, signSiteAccess, SITE_ACCESS_COOKIE, SITE_ACCESS_MAX_AGE, verifySitePassword } from '../../../../src/site-access'

const attempts = new Map<string, { count: number; resetAt: number }>()
const windowMs = 15 * 60_000
const maxAttempts = 8

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
  if (!email || !verifySitePassword(String(form.get('password') ?? ''))) {
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
  })

  attempts.delete(client)
  const response = NextResponse.redirect(new URL(returnTo, request.url), 303)
  response.cookies.set(SITE_ACCESS_COOKIE, signSiteAccess(email), {
    httpOnly: true,
    maxAge: SITE_ACCESS_MAX_AGE,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
  return response
}
