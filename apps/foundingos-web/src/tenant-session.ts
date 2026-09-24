/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real, tenant-scoped session for foundingos-web's /login → /workspace flow.
// This is the "single, real Quantum login gate" apps/foundingos-console/app/login/page.tsx
// already redirects here for — before this file existed, /login only collected a name and
// pushed to a non-existent /survey route, so that redirect was a dead end for every real
// account created via the working /invite/[token] acceptance flow.
//
// Tokens are stored exactly as Core.Operations' POST /api/v1/auth/login returns them (see
// shared/auth/src/http.ts authSuccess) — the same access/refresh token pair the mobile app
// stores in lib/core-operations-api.ts — just kept in this app's own httpOnly cookies
// instead of device storage, since this runs server-side in Next.js Route Handlers.

export const TENANT_SESSION_COOKIE = 'fo_web_session'
export const TENANT_REFRESH_COOKIE = 'fo_web_refresh'
const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days, matches shared/auth/src/http.ts refreshCookie

export type TenantSessionUser = {
  id: string
  email: string
  role: string
  tenantId: string | null
  name?: string | null
}

export function coreOperationsApiRoot(): string {
  const configured = process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL || process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || ''
  return configured.replace(/\/ops\/?$/, '').replace(/\/+$/, '')
}

export function tenantSessionCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  }
}

// Only the console's own handoff page may ever be handed raw tokens (in a URL fragment —
// see app/login/page.tsx and app/api/session/login/route.ts). Shared here so both the login
// page (deciding whether to auto-handoff an existing session) and the login API route
// (deciding whether to include tokens in its response) apply the exact same check.
export function isAllowedReturnTo(returnTo: string, consoleUrl: string): boolean {
  try {
    const target = new URL(returnTo)
    const console = new URL(consoleUrl)
    return target.origin === console.origin && target.pathname === '/session/handoff'
  } catch {
    return false
  }
}
