/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BaseTierName } from '../../../packages/config/src/package-model-d.ts'
import type { AALDomain, AALIntent } from '../../ai/events/event-bus.ts'

export type EntitlementDecision = {
  allowed: boolean
  tier: BaseTierName
  reason: string
  requiredTier?: BaseTierName
  creditSafe: boolean
}

const TIER_RANK: Record<BaseTierName, number> = { Starter: 1, Standard: 2, Premium: 3, Enterprise: 4 }

const REQUIRED_TIER: Record<AALDomain, Record<AALIntent, BaseTierName>> = {
  marketing: { analyse: 'Starter', recommend: 'Starter', draft: 'Standard', automate: 'Premium', forecast: 'Premium', approve: 'Enterprise' },
  sales: { analyse: 'Starter', recommend: 'Standard', draft: 'Standard', automate: 'Premium', forecast: 'Premium', approve: 'Enterprise' },
  crm: { analyse: 'Starter', recommend: 'Starter', draft: 'Standard', automate: 'Premium', forecast: 'Standard', approve: 'Enterprise' },
  finance: { analyse: 'Standard', recommend: 'Standard', draft: 'Premium', automate: 'Enterprise', forecast: 'Premium', approve: 'Enterprise' },
}

export function checkEntitlement(domain: AALDomain, intent: AALIntent, tier: BaseTierName = 'Starter'): EntitlementDecision {
  const requiredTier = REQUIRED_TIER[domain][intent]
  const allowed = TIER_RANK[tier] >= TIER_RANK[requiredTier]
  return {
    allowed,
    tier,
    requiredTier,
    creditSafe: true,
    reason: allowed
      ? `${tier} includes ${domain} ${intent} assistance.`
      : `${domain} ${intent} assistance requires ${requiredTier} or higher.`,
  }
}

export function canUseFeature(_tenantId: string, featureKey: string, tier: BaseTierName = 'Starter') {
  if (featureKey.startsWith('director.')) return TIER_RANK[tier] >= TIER_RANK.Enterprise
  if (featureKey.startsWith('autonomous.')) return TIER_RANK[tier] >= TIER_RANK.Premium
  if (featureKey.startsWith('predictive.')) return TIER_RANK[tier] >= TIER_RANK.Standard
  return TIER_RANK[tier] >= TIER_RANK.Starter
}

export function canUseAIMode(_tenantId: string, domain: AALDomain, mode: AALIntent, tier: BaseTierName = 'Starter') {
  return checkEntitlement(domain, mode, tier).allowed
}

export function entitledCapabilities(tier: BaseTierName) {
  return (Object.keys(REQUIRED_TIER) as AALDomain[]).flatMap((domain) =>
    (Object.keys(REQUIRED_TIER[domain]) as AALIntent[])
      .filter((intent) => checkEntitlement(domain, intent, tier).allowed)
      .map((intent) => `${domain}:${intent}`),
  )
}
