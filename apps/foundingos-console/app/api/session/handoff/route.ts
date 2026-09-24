/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest, NextResponse } from 'next/server'
import { coreOperationsApiRoot, TENANT_REFRESH_COOKIE, TENANT_SESSION_COOKIE, tenantSessionCookieOptions } from '../../../lib/tenant-session'

// Completes the login handoff started by apps/foundingos-web/app/login/page.tsx: the website
// authenticates the user once, then sends the resulting token pair here (via a URL fragment,
// never a query string, so it never reaches server access logs — see
// app/session/handoff/page.tsx, the only caller of this route) so this app can establish its
// own real session without asking the user to sign in a second time.
export async function POST(request: NextRequest) {
  const apiRoot = coreOperationsApiRoot()
  if (!apiRoot) {
    return NextResponse.json({ success: false, message: 'Sign-in is not configured for this environment.' }, { status: 503 })
  }

  const body = await request.json().catch(() => null) as { token?: unknown; refreshToken?: unknown } | null
  const token = typeof body?.token === 'string' ? body.token : ''
  const refreshToken = typeof body?.refreshToken === 'string' ? body.refreshToken : ''
  if (!token || !refreshToken) {
    return NextResponse.json({ success: false, message: 'Missing sign-in handoff data.' }, { status: 400 })
  }

  // Never trust the handed-off token blindly — confirm it is still a live Core.Operations
  // session before establishing a console session from it.
  let response: Response
  try {
    response = await fetch(`${apiRoot}/auth/me`, {
      headers: { authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    return NextResponse.json({ success: false, message: 'Cannot reach FoundingOS right now. Please try again shortly.' }, { status: 502 })
  }
  if (!response.ok) {
    return NextResponse.json({ success: false, message: 'That sign-in has expired. Please sign in again.' }, { status: 401 })
  }

  const result = NextResponse.json({ success: true })
  const cookieOptions = tenantSessionCookieOptions()
  result.cookies.set(TENANT_SESSION_COOKIE, token, cookieOptions)
  result.cookies.set(TENANT_REFRESH_COOKIE, refreshToken, cookieOptions)
  return result
}
