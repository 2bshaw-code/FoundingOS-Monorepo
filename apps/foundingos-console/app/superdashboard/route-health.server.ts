/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real broken-route detection for brand website survey flows. Runs server-side (never in
// the browser) specifically so it isn't subject to CORS — a server-to-server fetch to
// another app's domain is unrestricted, whereas a client-side fetch from the SuperDash
// page to a different origin would be blocked by the browser.
//
// Deliberately reads raw env vars (not @foundingos/config's `brands`) — that helper wraps
// cross-app URLs in a Proxy that rewrites any "localhost" URL down to a bare "/" in
// production builds, which is correct for browser-facing links but wrong here: a
// server-to-server fetch needs a real absolute URL in every environment, local or deployed.
export type RouteHealthResult = { path: string; ok: boolean; status: number }
export type BrandRouteHealthResult = { brand: string; path: string; ok: boolean; status: number }

const CHECKED_PATHS = [
  '/home', '/retail', '/retail/console',
  '/survey/sales', '/survey/marketing', '/survey/product', '/survey/support', '/survey/operations',
  '/survey/finance', '/survey/retailexp', '/survey/uxui', '/survey/branding', '/survey/competitor',
]

export async function checkRetailRouteHealth(): Promise<RouteHealthResult[]> {
  const base = (process.env.NEXT_PUBLIC_RETAIL_WEB_URL || 'http://localhost:1001').replace(/\/+$/, '')
  return Promise.all(
    CHECKED_PATHS.map(async (path) => {
      try {
        const response = await fetch(`${base}${path}`, { method: 'GET', cache: 'no-store' })
        return { path, ok: response.ok, status: response.status }
      } catch {
        return { path, ok: false, status: 0 }
      }
    }),
  )
}

// The other 7 brand websites use a simpler, single /survey + /survey/thankyou pipeline
// (not retail's 10 category subroutes) — checked per-brand here.
const OTHER_BRAND_ENV_VARS: Record<string, string> = {
  meat: 'NEXT_PUBLIC_MEAT_WEB_URL',
  foundthat: 'NEXT_PUBLIC_FOUNDTHAT_WEB_URL',
  talent: 'NEXT_PUBLIC_TALENT_WEB_URL',
  crypto: 'NEXT_PUBLIC_CRYPTO_WEB_URL',
  finance: 'NEXT_PUBLIC_FINANCE_WEB_URL',
  health: 'NEXT_PUBLIC_HEALTH_WEB_URL',
  logistics: 'NEXT_PUBLIC_LOGISTICS_WEB_URL',
}

const OTHER_BRAND_DEFAULT_PORTS: Record<string, number> = {
  meat: 1002, talent: 1004, crypto: 1005, finance: 1006, health: 1007, logistics: 1008, foundthat: 1003,
}

export async function checkAllBrandRouteHealth(): Promise<BrandRouteHealthResult[]> {
  const retail = (await checkRetailRouteHealth()).map((result) => ({ brand: 'retail', ...result }))

  const others = await Promise.all(
    Object.entries(OTHER_BRAND_ENV_VARS).map(async ([slug, envVar]) => {
      const base = (process.env[envVar] || `http://localhost:${OTHER_BRAND_DEFAULT_PORTS[slug]}`).replace(/\/+$/, '')
      const paths = ['/survey', '/survey/thankyou']
      return Promise.all(
        paths.map(async (path) => {
          try {
            const response = await fetch(`${base}${path}`, { method: 'GET', cache: 'no-store' })
            return { brand: slug, path, ok: response.ok, status: response.status }
          } catch {
            return { brand: slug, path, ok: false, status: 0 }
          }
        }),
      )
    }),
  )

  return [...retail, ...others.flat()]
}
