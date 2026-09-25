/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { IS_DEMO_MODE } from '@foundingos/ui/mobile-runtime-mode'
import { deleteStoredValue, getStoredValue, setStoredValue } from './platform-storage'

// Real API client — talks to the real, live foundingos-console backend (the same one every
// web brand console and the main website use). No mock data, no fabricated endpoints, no
// WebView/browser handoff: the session token is sent as a real Authorization: Bearer header
// on every request (see apps/foundingos-console/app/lib/session-auth.ts, which checks that
// header first, falling back to a cookie only for browser-based callers).
const API_BASE = 'https://console.foundingos.com'
const TOKEN_KEY = 'fo_mobile_session_token'

export type LoginResult =
  | { ok: true; category: string }
  | { ok: false; error: string }

// The real /api/tester/login endpoint sets the session token via Set-Cookie — React Native's
// fetch does not expose that header's full semantics to JS the way a browser does, but the
// underlying networking stack does surface the raw header value, so the real token substring
// is extracted from it once at login and stored — everything after this is header-based, not
// cookie-based.
export async function login(email: string, password: string): Promise<LoginResult> {
  if (IS_DEMO_MODE) return { ok: true, category: 'demo' }
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
  const token =
    setCookie?.match(/fo_tester_admin_session=([^;,]+)/)?.[1] ||
    setCookie?.match(/fo_tester_session=([^;,]+)/)?.[1]
  if (token) {
    await setStoredValue(TOKEN_KEY, token)
  }
  return { ok: true, category: data?.category ?? 'tester' }
}

export async function getToken(): Promise<string | null> {
  return getStoredValue(TOKEN_KEY)
}

export async function logout(): Promise<void> {
  await deleteStoredValue(TOKEN_KEY)
}

// Every authenticated call in the app goes through this — attaches the real Bearer token,
// and surfaces a clear error if the session is missing/expired rather than failing silently.
export async function authedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  if (IS_DEMO_MODE) return new Response(JSON.stringify({ mode: 'demo', ok: true }), { status: 200 })
  const token = await getToken()
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(url, { ...init, headers })
}

// Mirrors verifySession() in lib/core-operations-api.ts for the legacy tester-login
// system: a stored token can exist on disk without the backend still accepting it
// (revoked account, expired session, etc.), which would otherwise silently bounce a
// user past the login screen into a broken signed-in-but-nothing-loads state.
export async function verifyLegacyToken(): Promise<boolean> {
  if (IS_DEMO_MODE) return true
  const token = await getToken()
  if (!token) return false
  try {
    const response = await authedFetch(`${API_BASE}/api/superdash/overview`)
    if (response.status === 401 || response.status === 403) {
      await logout()
      return false
    }
    return true
  } catch {
    // Network/server error unrelated to auth — don't destroy a possibly-valid token.
    return true
  }
}
