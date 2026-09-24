/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real tenant session for the console app — the other half of the login unification
// started in apps/foundingos-web/src/tenant-session.ts. This is intentionally a separate,
// small file (not a shared package) so the two apps' auth cookies stay independent per
// app/domain; the handoff in app/api/session/handoff/route.ts is what connects them.
//
// This is unrelated to app/tester/session.ts (fo_tester_session / fo_tester_admin_session),
// which is the internal tester/admin program — real customer accounts never use those
// cookies, and this file never touches them.

export const TENANT_SESSION_COOKIE = 'fo_console_session'
export const TENANT_REFRESH_COOKIE = 'fo_console_refresh'
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
