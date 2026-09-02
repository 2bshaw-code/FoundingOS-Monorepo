/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Shared real-monetary client helpers — used by CRMBoard, the accounting module, and
// BrandDashboard/BrandMicroDashboard to read/write the real Prisma-backed monetary models
// (BrandSubscription, CrmDeal, BrandFinance, AccountingInvoice) that live only in
// foundingos-console. Every fetch here goes cross-origin to that one app (same pattern
// already proven by /api/fx/rates), since this file is imported into all 9 app bundles.
import { useEffect, useState } from 'react'

// Real brand-name -> brand-slug mapping (matches packages/config/src/index.ts's real brands
// registry) — needed because BrandConsoleConfig only carries a display name ("FoundRetail"),
// not the Prisma-facing slug ("retail").
const BRAND_NAME_TO_SLUG: Record<string, string> = {
  FoundRetail: 'retail',
  FoundMeat: 'meat',
  FoundTalent: 'talent',
  FoundCrypto: 'crypto',
  FoundFinance: 'finance',
  FoundHealth: 'health',
  FoundLogistics: 'logistics',
  FoundThat: 'foundthat',
}

export function resolveBrandSlugFromName(name: string): string | null {
  return BRAND_NAME_TO_SLUG[name] ?? null
}

// Reads the real, raw env var directly (never the browser-safety-Proxy-wrapped `brands`
// registry from @foundingos/config, which rewrites "localhost" URLs to "/" in production —
// see route-health.server.ts / verification-layer.server.ts for the same documented trap).
function consoleBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:8000').replace(/\/+$/, '')
}

export function realMonetaryUrl(path: string): string {
  return `${consoleBaseUrl()}${path}`
}

export type FxState = { rates: Record<string, number> | null; live: boolean; checked: boolean }

// Real FX rates (USD-based, from the real /api/fx/rates proxy) — shared hook so every
// real-monetary panel shows the identical live-or-fallback state rather than each fetching
// independently and potentially disagreeing.
export function useRealFxRates(): FxState {
  const [state, setState] = useState<FxState>({ rates: null, live: false, checked: false })
  useEffect(() => {
    let cancelled = false
    fetch(realMonetaryUrl('/api/fx/rates'))
      .then((r) => r.json())
      .then((data: { live: boolean; rates: Record<string, number> | null }) => {
        if (cancelled) return
        setState({ rates: data.live ? data.rates : null, live: Boolean(data.live && data.rates), checked: true })
      })
      .catch(() => {
        if (!cancelled) setState({ rates: null, live: false, checked: true })
      })
    return () => {
      cancelled = true
    }
  }, [])
  return state
}

// Converts a GBP base amount to a target currency using real USD-based rates (GBP -> USD ->
// target). Returns null if live rates aren't available — callers must show the honest
// "FX unavailable, showing base currency only" fallback rather than a fabricated number.
export function convertFromGbp(amountGbp: number, targetCode: string, fx: FxState): string | null {
  if (!fx.live || !fx.rates || !fx.rates.GBP || !fx.rates[targetCode]) return null
  const amountUsd = amountGbp / fx.rates.GBP
  const amountTarget = amountUsd * fx.rates[targetCode]
  try {
    // Explicit locale ('en-GB', not `undefined`) is required, not cosmetic: `undefined` means
    // "use the runtime's default locale", which differs between the server (Node/Vercel's
    // locale) and a real visitor's browser — producing different formatted text for the exact
    // same amount and causing a real, confirmed-live React hydration mismatch (error #425) on
    // any page that renders this before/during hydration. A fixed locale makes the output
    // identical in both environments, for every visitor, regardless of their own browser locale.
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: targetCode, maximumFractionDigits: targetCode === 'JPY' ? 0 : 2 }).format(amountTarget)
  } catch {
    return null
  }
}

export function formatBase(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency, maximumFractionDigits: currency === 'JPY' ? 0 : 2 }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

// Small, reusable "FX view" line — shown next to any real base-currency amount. Never writes
// anything; purely a read-only display layer, honestly labeled either way.
export function FxHint({ amountBase, baseCurrency, fx }: { amountBase: number; baseCurrency: string; fx: FxState }) {
  if (!fx.checked) return null
  if (!fx.live) return <small style={{ opacity: 0.55 }}> (FX unavailable, showing {baseCurrency} only)</small>
  const usd = baseCurrency !== 'USD' ? convertFromGbp(amountBase, 'USD', fx) : null
  const eur = baseCurrency !== 'EUR' ? convertFromGbp(amountBase, 'EUR', fx) : null
  if (!usd && !eur) return null
  return <small style={{ opacity: 0.6 }}> ({[usd, eur].filter(Boolean).join(' · ')} — real live FX, read-only)</small>
}
