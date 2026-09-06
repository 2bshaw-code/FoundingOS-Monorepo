/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BASE_TIERS, type BaseTierName } from '../../../packages/config/src/package-model-d.ts'
import { calculateAddOnPrice } from '../../../packages/config/src/pricing-engine.ts'
import type { AALDomain } from '../../ai/events/event-bus.ts'

export function resolvePriceForUsage(_tenantId: string, domain: AALDomain, usageVolume: number) {
  const addOn = domain === 'finance' ? 'quantumos' : 'intelligenceos'
  return calculateAddOnPrice(addOn, 'C', {
    usage: {
      insights: usageVolume,
      simulations: domain === 'sales' ? Math.ceil(usageVolume / 10) : 0,
      anomalyDetections: domain === 'finance' ? Math.ceil(usageVolume / 8) : 0,
      riskModels: domain === 'finance' ? Math.ceil(usageVolume / 20) : 0,
      scenarioPacks: domain === 'marketing' ? Math.ceil(usageVolume / 25) : 0,
    },
  })
}

export function resolveTierForFeature(_tenantId: string, featureKey: string): BaseTierName {
  if (featureKey.startsWith('director.') || featureKey.includes('approve')) return 'Enterprise'
  if (featureKey.startsWith('autonomous.') || featureKey.includes('forecast')) return 'Premium'
  if (featureKey.startsWith('predictive.') || featureKey.includes('draft')) return 'Standard'
  return BASE_TIERS[0].name
}
