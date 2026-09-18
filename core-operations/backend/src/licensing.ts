/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { prisma } from './auth.js'

// The three real, licensable suites. Kept in sync with
// packages/config/src/suites.ts — duplicated here (rather than imported)
// because this backend does not depend on that workspace package.
const knownSuites = new Set(['core_operations', 'core_workforce', 'core_intelligence'])

/**
 * Real, persisted suite-license check backing `/module-access/:tenantId/:module`.
 * A tenant's first check for a known suite auto-provisions an enabled
 * TenantSuiteLicense row (all three suites currently ship as one bundle —
 * there is no per-suite paywall live yet, see docs/pricing.md), so this
 * never fabricates a decision: every returned answer reflects a real,
 * queryable row a founder/owner could see and toggle off.
 */
export const isSuiteLicensed = async (tenantId: string, suite: string): Promise<boolean> => {
  if (!tenantId || !knownSuites.has(suite)) return false
  const existing = await prisma.tenantSuiteLicense.findUnique({ where: { tenantId_suite: { tenantId, suite } } })
  if (existing) return existing.enabled && (!existing.trialEndsAt || existing.trialEndsAt.getTime() > Date.now())
  await prisma.tenantSuiteLicense.create({ data: { tenantId, suite, enabled: true } })
  return true
}

export const listTenantSuiteLicenses = (tenantId: string) => prisma.tenantSuiteLicense.findMany({ where: { tenantId }, orderBy: { suite: 'asc' } })

export const setTenantSuiteLicense = async (tenantId: string, suite: string, enabled: boolean) => {
  if (!knownSuites.has(suite)) throw new Error(`Unknown suite: ${suite}`)
  return prisma.tenantSuiteLicense.upsert({
    where: { tenantId_suite: { tenantId, suite } },
    create: { tenantId, suite, enabled },
    update: { enabled },
  })
}
