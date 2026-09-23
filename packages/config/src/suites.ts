/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Suite registry — the source of truth for FoundingOS's three product
// suites (Core.Operations, Core.Workforce, Core.Intelligence). This
// supersedes the legacy per-brand model in `./index.ts` for anything
// customer-facing (pricing, feature flags, console navigation).
//
// See /docs/shared-backbone.md, /docs/feature-flags.md, and
// /docs/pricing.md for the design this implements.

export type SuiteKey = 'core_operations' | 'core_workforce' | 'core_intelligence'

export type PlanTier = 'lite' | 'starter' | 'growth' | 'enterprise'

export type SuiteDefinition = {
  key: SuiteKey
  name: string
  tagline: string
  description: string
  formerBrand: string
  routePrefix: string
  tablePrefix: string
  modules: string[]
}

export const suites: Record<SuiteKey, SuiteDefinition> = {
  core_operations: {
    key: 'core_operations',
    name: 'Core.Operations',
    tagline: 'Retail operations, connected.',
    description:
      'Customers, orders, inventory, billing, and delivery — messaging-first commerce workflows for founder-run businesses.',
    formerBrand: 'Core.Operations',
    routePrefix: '/api/v1/ops',
    tablePrefix: 'core_ops_',
    modules: ['Retail', 'Logistics', 'Finance', 'Marketing', 'Messaging', 'Customers', 'Inventory', 'Orders', 'Billing', 'Delivery'],
  },
  core_workforce: {
    key: 'core_workforce',
    name: 'Core.Workforce',
    tagline: 'Hiring intelligence, made human.',
    description:
      'Applicants, recruiters, jobs, and workforce intelligence for modern founder-led teams.',
    formerBrand: 'Core.Workforce',
    routePrefix: '/api/v1/work',
    tablePrefix: 'core_workforce_',
    modules: ['Applicants', 'Recruiters', 'Jobs', 'Workforce Intel'],
  },
  core_intelligence: {
    key: 'core_intelligence',
    name: 'Core.Intelligence',
    tagline: 'Decisions, backed by your own data.',
    description:
      'Founder and owner KPIs, funnels, and reporting built entirely from first-party operational data.',
    formerBrand: 'Core.Intelligence',
    routePrefix: '/api/v1/int',
    tablePrefix: 'core_intel_',
    modules: ['KPI Dashboards', 'Funnels', 'Reports'],
  },
}

export const suiteList = Object.values(suites)

export function getSuite(key: SuiteKey) {
  return suites[key]
}

/** A tenant's license to use a given suite, at a given plan tier. */
export type TenantSuiteLicense = {
  tenantId: string
  suite: SuiteKey
  planTier: PlanTier
  enabled: boolean
  seats?: number
  trialEndsAt?: string | null
}

/** Bundle discounts applied when a tenant licenses multiple suites. See docs/pricing.md. */
export const bundleDiscounts: Record<number, number> = {
  1: 0,
  2: 0.15,
  3: 0.25,
}

/**
 * Returns the suite keys a tenant currently has enabled, given its
 * licenses. Console navigation should only render modules for suites
 * returned here — unlicensed suites must be hidden, not shown-disabled.
 */
export function getEnabledSuites(licenses: TenantSuiteLicense[]): SuiteKey[] {
  return licenses.filter((license) => license.enabled).map((license) => license.suite)
}

/** Deployment-level kill switches, independent of tenant licensing. */
export function isSuiteDeployable(suite: SuiteKey): boolean {
  const envVar = `FOUNDINGOS_ENABLE_${suite.toUpperCase()}`
  const value = process.env[envVar]
  return value === undefined ? true : value !== 'false'
}

// --- Phase 27: console-shell module tier gating -----------------------------
//
// `TenantSuiteLicense.planTier` (see the type above and
// `core-operations/backend/prisma/schema.prisma`) is a single tier per
// *suite*, not per module. There is no per-module gate persisted anywhere
// today. The mapping below is this project's first attempt at translating
// docs/pricing.md's prose tier descriptions ("Lite: basic records";
// "Starter: core workflows"; "Growth: automation, advanced reporting";
// "Enterprise: custom") into concrete per-module minimums, so the console
// shell (packages/ui/src/sidebar.tsx) has something real to filter against.
// Treat this as an initial, adjustable policy — not a commercial commitment —
// and update docs/pricing.md alongside any change here.
export const PLAN_TIER_RANK: Record<PlanTier, number> = { lite: 0, starter: 1, growth: 2, enterprise: 3 }

/** Minimum plan tier required to see a given nav module, keyed by suite then module label. */
export const moduleMinTier: Record<SuiteKey, Record<string, PlanTier>> = {
  core_operations: {
    Dashboard: 'lite',
    Orders: 'lite',
    Inventory: 'lite',
    Customers: 'lite',
    CRM: 'starter',
    Accounting: 'starter',
    Delivery: 'starter',
    Messaging: 'starter',
    Marketing: 'growth',
    Monitoring: 'growth',
    'Brand Studio': 'growth',
    'Fulfilment-to-Cash': 'growth',
    Intelligence: 'enterprise',
  },
  core_workforce: {
    Talent: 'lite',
    Workers: 'starter',
    Payroll: 'growth',
  },
  core_intelligence: {
    'Event Feed': 'lite',
    Insights: 'starter',
    'Predictive Ops': 'growth',
  },
}

/** Whether a tenant on `planTier` may see a nav item labelled `moduleLabel` within `suite`. */
export function isModuleVisibleAtTier(suite: SuiteKey, moduleLabel: string, planTier: PlanTier): boolean {
  const requiredTier = moduleMinTier[suite]?.[moduleLabel]
  if (!requiredTier) return true // unknown modules default to visible, never silently hidden
  return PLAN_TIER_RANK[planTier] >= PLAN_TIER_RANK[requiredTier]
}

// Deprecated legacy brands. Not part of the suite model — kept only so
// existing brand-registry consumers (see ./index.ts) can detect and warn
// on legacy usage during the migration window. Do not add new brands
// here; add suites above instead.
export const deprecatedBrands = ['meat', 'crypto'] as const
export type DeprecatedBrandSlug = (typeof deprecatedBrands)[number]
