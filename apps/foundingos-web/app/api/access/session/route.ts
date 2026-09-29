/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest, NextResponse } from 'next/server'
import { readSiteAccess, SITE_ACCESS_COOKIE } from '../../../../src/site-access'

export const dynamic = 'force-dynamic'

const apiRoot = () => (process.env.CORE_OPERATIONS_API_BASE || process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL || process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || '')
  .trim().replace(/\/ops\/?$/, '').replace(/\/+$/, '')

// Exchanges a verified partner/investor/tester access cookie for a workspace session, so people
// who entered their access code on the website are not asked to sign in a second time.
const SESSION_ROLES = new Set(['investor', 'partner', 'tester'])
export async function POST(request: NextRequest) {
  let access: ReturnType<typeof readSiteAccess> = null
  try { access = readSiteAccess(request.cookies.get(SITE_ACCESS_COOKIE)?.value) } catch { access = null }
  if (!access || !SESSION_ROLES.has(access.role)) return NextResponse.json({ success: false, message: 'Partner, investor or tester access code required' }, { status: 403 })
  const root = apiRoot()
  const token = process.env.PLATFORM_BOOTSTRAP_TOKEN?.trim()
  const fingerprint = request.headers.get('x-device-fingerprint')?.trim()
  if (!root || !token) return NextResponse.json({ success: false, message: 'Preview sign-in is not configured' }, { status: 503 })
  if (!fingerprint) return NextResponse.json({ success: false, message: 'Device fingerprint is required' }, { status: 400 })
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
