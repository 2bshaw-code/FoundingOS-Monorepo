/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import * as SecureStore from 'expo-secure-store'

// Real API client — talks to the real, live foundingos-console backend for login, and this
// brand's own real console API for everything else. No mock data, no fabricated endpoints,
// no WebView/browser handoff: the session token is sent as a real Authorization: Bearer
// header on every request (see apps/logistics-console/app/lib/session-auth.ts, which
// checks that header first, falling back to a cookie only for browser-based callers).
const AUTH_BASE = 'https://console.foundingos.com'
const TOKEN_KEY = 'fo_logistics_mobile_session_token'

export type LoginResult =
  | { ok: true; category: string }
  | { ok: false; error: string }

// The real /api/tester/login endpoint sets the session token via Set-Cookie — React Native's
// fetch does not expose that header's full semantics to JS the way a browser does, but the
// underlying networking stack does surface the raw header value, so the real token substring
// is extracted from it once at login and stored — everything after this is header-based, not
// cookie-based.
export async function login(email: string, password: string): Promise<LoginResult> {
  const response = await fetch(`${AUTH_BASE}/api/tester/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, agreedToLegalTerms: true }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { ok: false, error: data?.error ?? 'Sign in failed. Check your email and password.' }
  }
  const setCookie = response.headers.get('set-cookie')
  const token =
    setCookie?.match(/fo_tester_admin_session=([^;,]+)/)?.[1] ||
    setCookie?.match(/fo_tester_session=([^;,]+)/)?.[1]
  if (token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
  }
  return { ok: true, category: data?.category ?? 'tester' }
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
}

// Every authenticated call in the app goes through this — attaches the real Bearer token.
export async function authedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = await getToken()
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(url, { ...init, headers })
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
  const response = await fetch(`${AUTH_BASE}/api/superdash/brand-metrics`)
  if (!response.ok) return null
  const data = await response.json().catch(() => ({ brands: [] }))
  const rows: BrandMetric[] = Array.isArray(data?.brands) ? data.brands : []
  return rows.find((row) => row.brandName.toLowerCase().includes('logistics')) ?? null
}
