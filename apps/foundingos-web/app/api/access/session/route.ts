/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest, NextResponse } from 'next/server'
import { readSiteAccess, SITE_ACCESS_COOKIE } from '../../../../src/site-access'
import { ACCOUNT_HANDOFF_COOKIE, openAccountHandoff } from '../../../../src/account-handoff'

export const dynamic = 'force-dynamic'

const apiRoot = () => (process.env.CORE_OPERATIONS_API_BASE || process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL || process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || '')
  .trim().replace(/\/ops\/?$/, '').replace(/\/+$/, '')

// Exchanges a verified partner/investor/tester access cookie for a workspace session, so people
// who entered their access code on the website are not asked to sign in a second time.
const SESSION_ROLES = new Set(['investor', 'partner', 'tester'])
export async function POST(request: NextRequest) {
  let access: ReturnType<typeof readSiteAccess> = null
  try { access = readSiteAccess(request.cookies.get(SITE_ACCESS_COOKIE)?.value) } catch { access = null }
  if (!access) return NextResponse.json({ success: false, message: 'Sign-in required' }, { status: 403 })
  const root = apiRoot()
  const token = process.env.PLATFORM_BOOTSTRAP_TOKEN?.trim()
  const fingerprint = request.headers.get('x-device-fingerprint')?.trim()
  if (!root) return NextResponse.json({ success: false, message: 'Sign-in is not configured' }, { status: 503 })
  if (!fingerprint) return NextResponse.json({ success: false, message: 'Device fingerprint is required' }, { status: 400 })
  if (access.role === 'guest') {
    const refreshToken = openAccountHandoff(request.cookies.get(ACCOUNT_HANDOFF_COOKIE)?.value, access.email, fingerprint)
    if (!refreshToken) return NextResponse.json({ success: false, message: 'Account session expired. Sign in to your workspace.' }, { status: 403 })
    try {
      const upstream = await fetch(`${root}/auth/refresh`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Refresh-Token': refreshToken, 'X-Device-Fingerprint': fingerprint },
        body: '{}', cache: 'no-store', signal: AbortSignal.timeout(8000),
      })
      const body = await upstream.json() as { success?: boolean; token?: string; accessToken?: string; refreshToken?: string; user?: { email?: string } }
      const valid = upstream.ok && body.refreshToken && (body.token || body.accessToken) && body.user?.email?.toLowerCase() === access.email
      const response = NextResponse.json(valid ? { success: true, token: body.token || body.accessToken, refreshToken: body.refreshToken, user: body.user } : { success: false, message: 'Account session could not be restored. Sign in again.' }, { status: valid ? 200 : 403, headers: { 'Cache-Control': 'no-store' } })
      response.cookies.set(ACCOUNT_HANDOFF_COOKIE, '', { maxAge: 0, path: '/' })
      return response
    } catch (error) {
      console.error('[access] account handoff unavailable', error instanceof Error ? error.message : 'Unknown error')
      return NextResponse.json({ success: false, message: 'Account session is temporarily unavailable.' }, { status: 502 })
    }
  }
  if (!SESSION_ROLES.has(access.role)) return NextResponse.json({ success: false, message: 'Preview access code required' }, { status: 403 })
  if (!token) return NextResponse.json({ success: false, message: 'Preview sign-in is not configured' }, { status: 503 })
  const upstream = await fetch(`${root}/ops/access/code-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-bootstrap-token': token, 'x-device-fingerprint': fingerprint },
    body: JSON.stringify({ email: access.email, role: access.role }),
    cache: 'no-store',
  }).catch(() => null)
  const body = await upstream?.json().catch(() => null) as Record<string, unknown> | null
  if (!upstream?.ok || !body?.success) return NextResponse.json({ success: false, message: (body?.message as string) || 'Preview sign-in failed' }, { status: upstream?.status && upstream.status < 500 ? upstream.status : 502 })
  return NextResponse.json({ success: true, token: body.token, refreshToken: body.refreshToken, user: body.user }, { headers: { 'Cache-Control': 'no-store' } })
}
