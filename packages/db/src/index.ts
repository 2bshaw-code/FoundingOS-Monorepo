/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { PrismaClient } from '@prisma/client'

// Dormant-safe by design: PrismaClient is only ever constructed when
// getPrismaClient() is called AND DATABASE_URL is actually set. Simply
// importing this module (as commercial-mode-aware code does) must never
// throw or attempt a connection — that's what keeps Demo Mode working
// with zero credentials.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL)
}

export function getPrismaClient(): PrismaClient | null {
  if (!isDatabaseConfigured()) return null
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }
  return globalForPrisma.prisma
}

// Retained for callers that already assume a live connection is configured
// (e.g. scripts run only after DATABASE_URL is set). Prefer getPrismaClient()
// in any code path that must also work in Demo Mode.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    if (!client) {
      throw new Error('DATABASE_URL is not set — FounderOS is running in Demo Mode. Set DATABASE_URL to enable Commercial Mode.')
    }
    return (client as any)[prop]
  },
})

// --- Tenant isolation ------------------------------------------------------
// See docs/shared-schema.md "Multi-tenancy & isolation" and the
// 20260902100000_tenant_isolation_rls migration for the full rationale.
//
// The Postgres Row-Level Security policies added by that migration only take
// effect once these two session-local settings are present on the
// connection: `app.current_brand_id` (for tables keyed by Brand's cuid) and
// `app.current_brand_slug` (for tables keyed by the brand's slug string).
// SET LOCAL only lasts for the current transaction, so every tenant-scoped
// read/write must go through withTenantScope() rather than calling
// getPrismaClient()/prisma directly — that is what actually turns the RLS
// policy on for those queries. Code that legitimately needs to see every
// tenant's rows (SuperDash cross-brand rollups) should call
// withAdminBypass() instead, never withTenantScope().
export type TenantContext = {
  brandId?: string | null
  brandSlug?: string | null
}

async function withRlsSession<T>(
  settings: Record<string, string>,
  callback: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>,
): Promise<T> {
  const client = getPrismaClient()
  if (!client) {
    throw new Error('DATABASE_URL is not set — FounderOS is running in Demo Mode. Set DATABASE_URL to enable Commercial Mode.')
  }
  return client.$transaction(async (tx) => {
    for (const [key, value] of Object.entries(settings)) {
      // set_config's third argument (is_local = true) scopes the setting to
      // this transaction only, equivalent to SET LOCAL but parameterizable.
      await tx.$executeRawUnsafe(`SELECT set_config($1, $2, true)`, key, value)
    }
    return callback(tx)
  })
}

// Run tenant-scoped queries/mutations with RLS enforcing that only the given
// brand's rows are visible/writable. Pass whichever of brandId/brandSlug is
// known — most call sites only have one, and each RLS policy only checks the
// matching key, so the other is set to a sentinel that can never match.
export function withTenantScope<T>(
  context: TenantContext,
  callback: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>,
): Promise<T> {
  return withRlsSession(
    {
      'app.bypass_rls': 'off',
      'app.current_brand_id': context.brandId ?? '__no_brand_id__',
      'app.current_brand_slug': context.brandSlug ?? '__no_brand_slug__',
    },
    callback,
  )
}

// Run queries that intentionally span every tenant (SuperDash rollups, admin
// migrations/scripts). Only call this from trusted, non-per-tenant-request
// code paths — never from a handler that took a brandId/brandSlug from the
// current request.
export function withAdminBypass<T>(
  callback: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>,
): Promise<T> {
  return withRlsSession({ 'app.bypass_rls': 'on' }, callback)
}
