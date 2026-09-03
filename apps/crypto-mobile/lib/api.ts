/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import * as SecureStore from 'expo-secure-store'

// Real API client — talks to the real, live foundingos-console backend, the same one every
// web brand console and the main website use (session cookies are shared across the whole
// .foundingos.com domain). No mock data, no fabricated endpoints.
const API_BASE = 'https://console.foundingos.com'
const SESSION_KEY = 'fo_crypto_mobile_session_cookie'

export type LoginResult =
  | { ok: true; category: string }
  | { ok: false; error: string }

// The real /api/tester/login endpoint sets an HttpOnly session cookie via Set-Cookie — React
// Native's fetch does not expose that header to JS (for the same reason browsers don't), so
// we read it back from the raw response headers where the underlying networking stack does
// surface it, and store it ourselves for manual attachment on every later request.
export async function login(email: string, password: string): Promise<LoginResult> {
  const response = await fetch(`${API_BASE}/api/tester/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, agreedToLegalTerms: true }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { ok: false, error: data?.error ?? 'Sign in failed. Check your email and password.' }
  }
  const setCookie = response.headers.get('set-cookie')
  if (setCookie) {
    await SecureStore.setItemAsync(SESSION_KEY, setCookie)
  }
  return { ok: true, category: data?.category ?? 'tester' }
}

export async function getStoredSession(): Promise<string | null> {
  return SecureStore.getItemAsync(SESSION_KEY)
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY)
}

// Real one-time SSO handoff (see apps/foundingos-console/app/api/tester/handoff/route.ts) —
// re-presents this app's on-device session as a real cookie on the shared .foundingos.com
// domain before redirecting into the console, so the in-app browser opens already signed in.
export async function getHandoffUrl(consoleUrl: string): Promise<string> {
  const rawSetCookie = await getStoredSession()
  const token =
    rawSetCookie?.match(/fo_tester_admin_session=([^;,]+)/)?.[1] ||
    rawSetCookie?.match(/fo_tester_session=([^;,]+)/)?.[1]
  if (!token) return consoleUrl

  const handoff = new URL(`${API_BASE}/api/tester/handoff`)
  handoff.searchParams.set('token', token)
  handoff.searchParams.set('redirect', consoleUrl)
  return handoff.toString()
}

// Real, live, publicly-readable engagement data — the same feed that powers SuperDash on the
// web, filtered down to just this brand.
export type BrandMetric = {
  brandName: string
  totalEngagement: number
  anomalyScore: number
  categoryBreakdown: Record<string, number>
  lastUpdated: string
}

export async function fetchOwnBrandMetric(): Promise<BrandMetric | null> {
  const response = await fetch(`${API_BASE}/api/superdash/brand-metrics`)
  if (!response.ok) return null
  const data = await response.json().catch(() => ({ brands: [] }))
  const rows: BrandMetric[] = Array.isArray(data?.brands) ? data.brands : []
  return rows.find((row) => row.brandName.toLowerCase().includes('crypto')) ?? null
}
