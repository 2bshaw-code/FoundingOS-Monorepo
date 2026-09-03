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

// Same categorization rule as foundingos-console/app/tester/tester-data.ts, collapsed
// down to the three roles this app needs to distinguish: admin is handled separately
// (its own cookie/scope), so this only classifies a *tester*-scoped id.
const FREE_ROAM_IDS = new Set(['juliet', 'tester-10', 'survey-demo'])
function isFreeRoamLike(id: string): boolean {
  // Free-roam + investor + lawyer all get the same "view, don't touch" ecosystem access.
  return FREE_ROAM_IDS.has(id) || id === 'investor-alpha' || id === 'investor-omega' || id === 'lawyer-review'
}

const QUANTUM_LOGIN_URL = 'https://www.foundingos.com/'
const SURVEY_URL = 'https://console.foundingos.com/tester/survey'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Self-contained synthetic data generators (retail's own /api/scrape/refresh,
  // /api/feeds/update, /api/dashboard/refresh) must be reachable with NO session at all —
  // that's exactly how Vercel's own cron jobs invoke them on schedule (crons carry no
  // browser cookie), and it's the same real endpoint SuperDash's admin-only "Run Scrape"
  // trigger calls on demand. Each one only ever mutates this brand's own BrandMetric row
  // via a deterministic, seeded, no-external-network generator — there is no real data
  // exposure or write risk from leaving these specific, exact paths open. Every other route
  // (including the free-roam-blocking checks below) is completely unaffected.
  const SYNTHETIC_GENERATOR_PATHS = new Set(['/api/scrape/refresh', '/api/feeds/update', '/api/dashboard/refresh'])
  if (SYNTHETIC_GENERATOR_PATHS.has(pathname)) return NextResponse.next()

  const adminToken = request.cookies.get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  if (adminId) return NextResponse.next() // Admin: unrestricted, full access.

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value
  const testerId = sessionToken ? await verifyToken('tester', sessionToken) : null

  if (!testerId) return NextResponse.redirect(new URL(QUANTUM_LOGIN_URL))

  if (isFreeRoamLike(testerId)) {
    // Free Roam (+ investor/lawyer): read-only. Block any write beneath /api/ — including
    // GET-triggered scraper writes, which still mutate BrandMetric despite the method.
    if (pathname.startsWith('/api/scrape/') || (pathname.startsWith('/api/') && request.method !== 'GET')) {
      return NextResponse.json({ error: 'Read-only session — write access is disabled.' }, { status: 403 })
    }
    return NextResponse.next()
  }

  // Tester/Survey: never see the brand website — always sent to their real survey.
  return NextResponse.redirect(new URL(SURVEY_URL))
}

export const config = {
  // Real fix: PWA assets (the web app manifest, its icons, and the service worker itself)
  // must be publicly fetchable — a browser installing/registering a service worker or
  // reading the manifest for "Add to Home Screen" does so without the tester/admin session
  // context these gated routes expect, so they were previously redirected to login (breaking
  // installability entirely, not just showing a cosmetic issue).
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|manifest.webmanifest|sw.js|icons/).*)'],
}
