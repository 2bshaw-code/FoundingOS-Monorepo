/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'

// Shared FoundingOS session — same cookie names/secret/verification as
// foundingos-console/app/tester/session.ts, duplicated here (pure Web Crypto, Edge-safe,
// no shared package exists for this) so this app can recognize the one real session set
// on the shared .foundingos.com cookie domain, without any new files.
const SESSION_COOKIE = 'fo_tester_session'
const ADMIN_COOKIE = 'fo_tester_admin_session'
const SESSION_SECRET = process.env.TESTER_SESSION_SECRET ?? 'founderos-tester-program-dev-secret'
const encoder = new TextEncoder()
const decoder = new TextDecoder()

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function getKey() {
  return crypto.subtle.importKey('raw', encoder.encode(SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
}

async function verifyToken(scope: 'tester' | 'admin', token: string): Promise<string | null> {
  const [payloadPart, signaturePart] = token.split('.')
  if (!payloadPart || !signaturePart) return null
  let payload: string
  try {
    payload = decoder.decode(fromBase64Url(payloadPart))
  } catch {
    return null
  }
  const key = await getKey()
  const valid = await crypto.subtle.verify('HMAC', key, fromBase64Url(signaturePart) as BufferSource, encoder.encode(payload))
  if (!valid) return null
  const [tokenScope, id] = payload.split(':')
  if (tokenScope !== scope || !id) return null
  return id
}

const FREE_ROAM_IDS = new Set(['juliet', 'tester-10', 'survey-demo'])
function isFreeRoamLike(id: string): boolean {
  return FREE_ROAM_IDS.has(id) || id === 'investor-alpha' || id === 'investor-omega' || id === 'lawyer-review'
}

const SURVEY_URL = 'https://console.foundingos.com/tester/survey'

// "/" itself is the real Quantum login page — never gate it (that would be a redirect
// loop), checked explicitly inside the function body rather than via a matcher trick, for
// reliability. Every other route in this app (the real Homepage at /home, /about,
// /pricing, plus the dormant /landing /survey /tester-login /onboarding demo pages) goes
// through the same real role check as every other app on the shared session domain.
//
// /legal and /contact are the one deliberate exception: real Terms/Privacy/Cookie
// information and real support info have to be reachable by anyone — regulators,
// prospective users deciding whether to sign up, testers who forgot their access code —
// without first requiring a login. Gating legal/support pages behind a session would be a
// genuine, real problem (and is a standard carve-out on every gated site), not just an
// inconsistency with this specific tester program.
const PUBLIC_PATHS = new Set(['/legal', '/contact'])

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/' || PUBLIC_PATHS.has(request.nextUrl.pathname)) return NextResponse.next()

  const adminToken = request.cookies.get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  if (adminId) return NextResponse.next() // Admin: unrestricted, full access.

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value
  const testerId = sessionToken ? await verifyToken('tester', sessionToken) : null

  if (!testerId) return NextResponse.redirect(new URL('/', request.url))

  if (isFreeRoamLike(testerId)) {
    if (request.nextUrl.pathname.startsWith('/api/') && request.method !== 'GET') {
      return NextResponse.json({ error: 'Read-only session — write access is disabled.' }, { status: 403 })
    }
    return NextResponse.next()
  }

  // Tester/Survey: never see the Homepage — always sent to their real survey.
  return NextResponse.redirect(new URL(SURVEY_URL))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

