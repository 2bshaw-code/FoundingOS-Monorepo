import { NextRequest, NextResponse } from 'next/server'
import { normalizeAccessEmail, signSiteAccess, SITE_ACCESS_COOKIE, SITE_ACCESS_MAX_AGE } from '../../../../src/site-access'

export const dynamic = 'force-dynamic'

const apiRoot = () => (process.env.CORE_OPERATIONS_API_BASE || process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL || process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || '')
  .trim().replace(/\/ops\/?$/, '').replace(/\/+$/, '')

// A valid, unused team invitation is proof the owner wants this person in, so it lets them past
// the private preview gate as a guest. They still sign in with their own email and password.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { token?: unknown } | null
  const token = typeof body?.token === 'string' ? body.token.trim() : ''
  if (!token || token.length > 200) return NextResponse.json({ ok: false }, { status: 400 })
  if (process.env.SITE_ACCESS_ENABLED !== 'true') return NextResponse.json({ ok: true })
  const root = apiRoot()
  if (!root) return NextResponse.json({ ok: false }, { status: 503 })
  const upstream = await fetch(`${root}/ops/platform/team/invitations/inspect?token=${encodeURIComponent(token)}`, { cache: 'no-store' }).catch(() => null)
  const details = await upstream?.json().catch(() => null) as { data?: { email?: unknown } } | null
  const email = typeof details?.data?.email === 'string' ? normalizeAccessEmail(details.data.email) : ''
  if (!upstream?.ok || !email) return NextResponse.json({ ok: false }, { status: 410 })
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SITE_ACCESS_COOKIE, signSiteAccess(email, Date.now(), 'guest'), {
    httpOnly: true,
    maxAge: SITE_ACCESS_MAX_AGE,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
  return response
}
