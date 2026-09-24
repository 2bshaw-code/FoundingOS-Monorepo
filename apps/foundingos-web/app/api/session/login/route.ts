/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest, NextResponse } from 'next/server'
import { brands } from '@foundingos/config'
import { coreOperationsApiRoot, isAllowedReturnTo, TENANT_REFRESH_COOKIE, TENANT_SESSION_COOKIE, tenantSessionCookieOptions } from '../../../../src/tenant-session'

// Real tenant login — proxies to Core.Operations' POST /api/v1/auth/login (the exact
// endpoint the mobile app and /invite/[token] acceptance both rely on), then stores the
// returned access/refresh tokens in this app's own httpOnly cookies. Kept server-side so
// the tokens never sit in client-readable storage on the marketing site.
export async function POST(request: NextRequest) {
  const apiRoot = coreOperationsApiRoot()
  if (!apiRoot) {
    return NextResponse.json({ success: false, message: 'Sign-in is not configured for this environment.' }, { status: 503 })
  }

  const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown; returnTo?: unknown } | null
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const returnTo = typeof body?.returnTo === 'string' ? body.returnTo : ''
  if (!email || !password) {
    return NextResponse.json({ success: false, message: 'Enter your email and password.' }, { status: 400 })
  }

  let response: Response
  try {
    response = await fetch(`${apiRoot}/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-device-fingerprint': `web-${request.headers.get('x-forwarded-for') || 'unknown'}`,
      },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return NextResponse.json({ success: false, message: 'Cannot reach FoundingOS right now. Please try again shortly.' }, { status: 502 })
  }

  const data = await response.json().catch(() => ({})) as {
    success?: boolean
    message?: string
    token?: string
    refreshToken?: string
    user?: { id: string; email: string; role: string; tenantId: string | null; name?: string | null }
  }

  if (!response.ok || !data.success || !data.token || !data.refreshToken || !data.user) {
    return NextResponse.json({ success: false, message: data.message || 'That email or password was not accepted.' }, { status: response.status || 401 })
  }

  const result = NextResponse.json(
    returnTo && isAllowedReturnTo(returnTo, brands.foundingos.consoleUrl)
      ? { success: true, user: data.user, handoff: { token: data.token, refreshToken: data.refreshToken } }
      : { success: true, user: data.user },
  )
  const cookieOptions = tenantSessionCookieOptions()
  result.cookies.set(TENANT_SESSION_COOKIE, data.token, cookieOptions)
  result.cookies.set(TENANT_REFRESH_COOKIE, data.refreshToken, cookieOptions)
  return result
}
