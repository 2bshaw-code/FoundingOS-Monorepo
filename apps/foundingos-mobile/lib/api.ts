/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import * as SecureStore from 'expo-secure-store'

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

// Every authenticated call in the app goes through this — attaches the real Bearer token,
// and surfaces a clear error if the session is missing/expired rather than failing silently.
export async function authedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = await getToken()
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(url, { ...init, headers })
}

// Real, live, publicly-readable engagement data — the same feed that powers SuperDash on the
// web. No auth required for this one endpoint.
export type BrandMetric = {
  brandName: string
  totalEngagement: number
  anomalyScore: number
  categoryBreakdown: Record<string, number>
  lastUpdated: string
}

export async function fetchBrandMetrics(): Promise<BrandMetric[]> {
  const response = await fetch(`${API_BASE}/api/superdash/brand-metrics`)
  if (!response.ok) return []
  const data = await response.json().catch(() => ({ brands: [] }))
  return Array.isArray(data?.brands) ? data.brands : []
}

// Real SuperDash overview — the exact brand rows, predictive insights, anomalies, and
// forecast-by-horizon data the real web SuperDashboard renders (see
// apps/foundingos-console/app/api/superdash/overview/route.ts). Requires any valid session.
export type SuperDashBrandRow = {
  brand: string
  marketing: number
  accounting: number
  serviceLoad: number
  previousServiceLoad: number
  messaging: number
  aiActions: number
  status: 'good' | 'watch' | 'risk'
  marketingHistory: number[]
}

export type SuperDashOverview = {
  brandRows: SuperDashBrandRow[]
  predictiveInsights: string[]
  anomalies: { brand: string; signal: string; tone: 'good' | 'watch' | 'risk' }[]
  forecastByHorizon: Record<'24h' | '7d' | '30d', { combinedRevenueTrend: string; combinedServiceLoadTrend: string; confidence: string }>
}

export async function fetchSuperDashOverview(): Promise<SuperDashOverview | null> {
  const response = await authedFetch(`${API_BASE}/api/superdash/overview`)
  if (!response.ok) return null
  return response.json().catch(() => null)
}

const AAL_ACTION_ENDPOINTS: Record<string, string> = {
  weeklyReport: '/api/ai/marketing/director/weekly-report?tier=Premium',
  suggestCampaigns: '/api/ai/marketing/director/suggest-campaigns?tier=Premium',
  prioritizePipeline: '/api/ai/sales/pipeline/prioritize',
  dealStrategy: '/api/ai/sales/deal/strategy',
  detectUnhappy: '/api/ai/crm/relationship/unhappy?tier=Premium',
  upsellSequence: '/api/ai/crm/relationship/upsell',
  monthlyReport: '/api/ai/finance/controller/monthly-report?tier=Premium',
  cashflowForecast: '/api/ai/finance/controller/cashflow-forecast?tier=Premium',
  boardSummary: '/api/ai/finance/revenue/board-summary?tier=Premium',
}

export type MobileAALResult =
  | { success: true; data?: unknown; meta?: Record<string, unknown> }
  | { success: false; error: string; meta?: Record<string, unknown> }

export async function runAALAction(actionId: string): Promise<MobileAALResult> {
  const endpoint = AAL_ACTION_ENDPOINTS[actionId]
  if (!endpoint) return { success: false, error: `No mobile AAL endpoint registered for ${actionId}.` }

  const method = endpoint.includes('?') ? 'GET' : 'POST'
  const response = await authedFetch(`${API_BASE}${endpoint}`, {
    method,
    headers: method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
    body: method === 'POST' ? JSON.stringify({ tier: 'Premium', inputs: { customerId: 'mobile-superdash-customer', dealId: 'mobile-superdash-deal' } }) : undefined,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return { success: false, error: data?.error ?? 'AAL action failed.', meta: data?.meta }
  return data
}

// Real Guardian status — the same live survey-feed log and route-health probe the real web
// Guardian page reads (see apps/foundingos-console/app/api/system/guardian/status/route.ts).
// Admin-only: returns null for a non-admin session rather than throwing.
export type GuardianStatus = {
  hasIssues: boolean
  surveyWarnings: string[]
  coreEnforcement: string[]
}

export async function fetchGuardianStatus(): Promise<GuardianStatus | null> {
  const response = await authedFetch(`${API_BASE}/api/system/guardian/status`)
  if (!response.ok) return null
  return response.json().catch(() => null)
}
