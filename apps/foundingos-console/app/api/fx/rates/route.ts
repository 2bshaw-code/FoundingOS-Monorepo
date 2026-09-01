/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'

// This app's first-ever real external network call — deliberately isolated to this one
// read-only, no-auth, GET-only route. No API key (a real, free, no-key-required public
// endpoint), no writes, no database, no schema change: rates are cached in-memory only
// (reset on cold start) and re-fetched at most every 12 hours. Every consumer of this route
// (demo modules AND the few real-module "FX view" surfaces) must treat the response as a
// read-only display layer — nothing here is ever written back into any stored currency
// value anywhere in the OS.
export const dynamic = 'force-dynamic'

const FX_SOURCE_URL = 'https://open.er-api.com/v6/latest/USD'
const CACHE_MS = 12 * 60 * 60 * 1000

type FxCache = { fetchedAt: number; rates: Record<string, number> } | null
let cache: FxCache = null

export type FxRatesResponse = {
  live: boolean
  base: 'USD'
  rates: Record<string, number> | null
  fetchedAt: string | null
  source: string
  error?: string
}

export async function GET() {
  const now = Date.now()
  if (cache && now - cache.fetchedAt < CACHE_MS) {
    return jsonWithCors({ live: true, base: 'USD', rates: cache.rates, fetchedAt: new Date(cache.fetchedAt).toISOString(), source: FX_SOURCE_URL })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)
    const response = await fetch(FX_SOURCE_URL, { signal: controller.signal, cache: 'no-store' })
    clearTimeout(timeout)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    if (data?.result !== 'success' || !data?.rates) throw new Error('unexpected response shape')
    cache = { fetchedAt: now, rates: data.rates }
    return jsonWithCors({ live: true, base: 'USD', rates: data.rates, fetchedAt: new Date(now).toISOString(), source: FX_SOURCE_URL })
  } catch (err) {
    // Honest failure mode: report live:false rather than fabricating rates. Callers fall
    // back to the existing synthetic demo rates (demo modules) or hide the FX view entirely
    // (real modules) — never show stale/fake numbers labeled as live.
    return jsonWithCors({
      live: false,
      base: 'USD',
      rates: cache?.rates ?? null,
      fetchedAt: cache ? new Date(cache.fetchedAt).toISOString() : null,
      source: FX_SOURCE_URL,
      error: err instanceof Error ? err.message : 'fetch failed',
    })
  }
}

// Permissive but safe: this route returns only public, non-sensitive exchange-rate numbers
// (no auth, no cookies, no PII, no per-user data), and CRM's read-only "FX view" is rendered
// on all 9 app domains (foundingos-console + 8 brand consoles), each needing to call this one
// real proxy that lives only in foundingos-console — hence the open CORS header, scoped to
// this single endpoint only.
function jsonWithCors(body: FxRatesResponse) {
  return NextResponse.json(body, { headers: { 'Access-Control-Allow-Origin': '*' } })
}
