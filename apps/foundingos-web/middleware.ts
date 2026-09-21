import { NextRequest, NextResponse } from 'next/server'
import { verifyFounderSession } from './src/founder-session'

const cookieName = 'foundingos_site_access'
const founderCookieName = 'fo_tester_admin_session'

const bytesToHex = (bytes: ArrayBuffer | Uint8Array) => Array.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('')

async function hasPreviewSession(token: string | undefined) {
  const secret = process.env.SITE_ACCESS_SECRET?.trim()
  if (!secret || secret.length < 32 || !token) return false
  const [payload, provided] = token.split('.')
  if (!payload || !provided) return false
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const expected = bytesToHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)))
  const providedBytes = Uint8Array.from(atob(provided.replace(/-/g, '+').replace(/_/g, '/')), (character) => character.charCodeAt(0))
  if (!constantTimeEqual(bytesToHex(providedBytes), expected)) return false
  try {
    const data = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { email?: unknown; expiresAt?: unknown }
    return typeof data.email === 'string' && typeof data.expiresAt === 'number' && data.expiresAt > Date.now()
  } catch {
    return false
  }
}

const constantTimeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  return difference === 0
}

async function hasFounderSession(request: NextRequest) {
  const token = request.cookies.get(founderCookieName)?.value
  const secret = process.env.TESTER_SESSION_SECRET?.trim()
  return verifyFounderSession(token, secret)
}

export async function middleware(request: NextRequest) {
  if (process.env.SITE_ACCESS_ENABLED !== 'true') return NextResponse.next()
  if (await hasFounderSession(request)) return NextResponse.next()
  if (!process.env.SITE_ACCESS_SECRET?.trim()) return new NextResponse('Site access is enabled but not configured.', { status: 503 })
  if (await hasPreviewSession(request.cookies.get(cookieName)?.value)) return NextResponse.next()
  const accessUrl = new URL('/access', request.url)
  accessUrl.searchParams.set('returnTo', `${request.nextUrl.pathname}${request.nextUrl.search}`)
  return NextResponse.redirect(accessUrl)
}

export const config = {
  matcher: ['/((?!access|privacy|api/access|api/billing/webhook|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
