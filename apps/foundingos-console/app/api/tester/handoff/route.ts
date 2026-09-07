/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from '../../../tester/session'
import { brands } from '@foundingos/config'

// Real, one-time SSO handoff for the native mobile apps. Each app authenticates itself via
// /api/tester/login and stores the resulting session token in on-device SecureStore — that
// storage is invisible to the phone's system browser or in-app browser sheet, so opening a
// console previously landed on a fresh, unauthenticated login screen even though the app
// itself was already signed in. This endpoint re-presents that same already-valid token as a
// real Set-Cookie on the shared .foundingos.com cookie domain, then redirects into the
// requested console. Accepts either a tester or an admin token — the founder's own
// FoundingOS app most often carries an admin session (e.g. opening SuperDashboard), while the
// per-brand apps carry a tester session.
// Some brand consoleUrls resolve to a relative "/" in production when their NEXT_PUBLIC_*_URL
// env var isn't set (see the CROSS_APP_URL_KEYS safety net in packages/config/src/index.ts) —
// `new URL()` throws on those, so they're filtered out here rather than crashing the build.
const ALLOWED_REDIRECT_ORIGINS = new Set(
  Object.values(brands)
    .map((brand) => {
      try {
        return new URL(brand.consoleUrl).origin
      } catch {
        return null
      }
    })
    .filter((origin): origin is string => origin !== null)
)

const FALLBACK_URL = 'https://www.foundingos.com/?handoff=invalid'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token') ?? ''
  const redirectTarget = url.searchParams.get('redirect') ?? ''

  const adminId = token ? await verifyToken('admin', token) : null
  const testerId = !adminId && token ? await verifyToken('tester', token) : null
  if (!adminId && !testerId) {
    return NextResponse.redirect(FALLBACK_URL)
  }

  let destination: URL
  try {
    destination = new URL(redirectTarget)
  } catch {
    return NextResponse.redirect(FALLBACK_URL)
  }
  if (!ALLOWED_REDIRECT_ORIGINS.has(destination.origin)) {
    return NextResponse.redirect(FALLBACK_URL)
  }

  const response = NextResponse.redirect(destination.toString())
  const cookieName = adminId ? ADMIN_COOKIE : SESSION_COOKIE
  response.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    domain: '.foundingos.com',
    maxAge: 60 * 60 * 8,
  })
  return response
}
