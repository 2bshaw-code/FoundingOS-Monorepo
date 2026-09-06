/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { brands, type BrandSlug } from '../../../packages/config/src/index.ts'
import type { BaseTierName } from '../../../packages/config/src/package-model-d.ts'
import { getCustomerGraph } from '../../data/customer-graph/index.ts'
import { getUsageSignals } from '../../data/events/index.ts'
import { getRevenueSignals } from '../../data/revenue/index.ts'
import { entitledCapabilities } from '../../packages/modelD/entitlements.ts'
import type { AALContext } from './types.ts'
import type { AALDomain, AALIntent } from '../events/event-bus.ts'

const BRAND_SLUGS = Object.keys(brands) as BrandSlug[]
const TIERS: BaseTierName[] = ['Starter', 'Standard', 'Premium', 'Enterprise']
const DOMAINS: AALDomain[] = ['marketing', 'sales', 'crm', 'finance']
const INTENTS: AALIntent[] = ['analyse', 'recommend', 'automate', 'forecast', 'draft', 'approve']

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && allowed.includes(value as T) ? (value as T) : fallback
}

export function buildContext(input: Record<string, unknown>): AALContext {
  const brandSlug = pick(input.brandSlug, BRAND_SLUGS, 'foundingos')
  const domain = pick(input.domain, DOMAINS, 'marketing')
  const intent = pick(input.intent, INTENTS, 'recommend')
  const tier = pick(input.tier, TIERS, 'Starter')
  const brand = brands[brandSlug]
  const actorId = typeof input.actorId === 'string' ? input.actorId : 'system'
  const tenantId = typeof input.tenantId === 'string' ? input.tenantId : actorId
  const inputs = typeof input.inputs === 'object' && input.inputs !== null ? (input.inputs as Record<string, unknown>) : {}
  const customerId = typeof inputs.customerId === 'string' ? inputs.customerId : undefined

  return {
    actorId,
    tenantId,
    brandSlug,
    domain,
    intent,
    tier,
    locale: typeof input.locale === 'string' ? input.locale : 'en-GB',
    channel: pick(input.channel, ['web', 'mobile', 'api'] as const, 'api'),
    prompt: typeof input.prompt === 'string' ? input.prompt : '',
    inputs,
    brand: { name: brand.name, accent: brand.accent, modules: brand.modules, tagline: brand.tagline },
    capabilities: entitledCapabilities(tier),
    customerGraph: getCustomerGraph(customerId),
    usageSignals: getUsageSignals(tenantId),
    revenueSignals: getRevenueSignals(tenantId),
  }
}
