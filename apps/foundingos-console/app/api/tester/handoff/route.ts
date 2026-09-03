/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, verifyToken } from '../../../tester/session'
import { brands } from '@foundingos/config'

// Real, one-time SSO handoff for the native mobile app. The app authenticates itself via
// /api/tester/login and stores the resulting session token in on-device SecureStore — that
// storage is invisible to the phone's system browser (Safari), so tapping "open in browser"
// on a brand console previously landed on a fresh, unauthenticated login screen even though
// the app itself was already signed in. This endpoint re-presents that same already-valid
// token as a real Set-Cookie on the shared .foundingos.com cookie domain, then redirects into
// the requested brand console, which is why it can be a plain GET link opened via Linking.openURL.
const ALLOWED_REDIRECT_ORIGINS = new Set(
  Object.values(brands).map((brand) => new URL(brand.consoleUrl).origin)
)

const FALLBACK_URL = 'https://www.foundingos.com/?handoff=invalid'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token') ?? ''
  const redirectTarget = url.searchParams.get('redirect') ?? ''

  const testerId = token ? await verifyToken('tester', token) : null
  if (!testerId) {
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
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    domain: '.foundingos.com',
    maxAge: 60 * 60 * 8,
  })
  return response
}
