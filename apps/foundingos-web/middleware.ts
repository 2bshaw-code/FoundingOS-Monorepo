import { NextRequest, NextResponse } from 'next/server'

const cookieName = 'foundingos_site_access'
const cookieValue = 'granted'

const bytesToHex = (bytes: ArrayBuffer) => Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('')

async function expectedSignature() {
  const secret = process.env.SITE_ACCESS_SECRET?.trim()
  if (!secret || secret.length < 32) return null
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return bytesToHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(cookieValue)))
}

const constantTimeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  return difference === 0
}

export async function middleware(request: NextRequest) {
  if (process.env.SITE_ACCESS_ENABLED !== 'true') return NextResponse.next()
  const expected = await expectedSignature()
  if (!expected) return new NextResponse('Site access is enabled but not configured.', { status: 503 })
  const provided = request.cookies.get(cookieName)?.value ?? ''
  if (constantTimeEqual(provided, expected)) return NextResponse.next()
  const accessUrl = new URL('/access', request.url)
  accessUrl.searchParams.set('returnTo', `${request.nextUrl.pathname}${request.nextUrl.search}`)
  return NextResponse.redirect(accessUrl)
}

export const config = {
  matcher: ['/((?!access|api/access|api/billing/webhook|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
