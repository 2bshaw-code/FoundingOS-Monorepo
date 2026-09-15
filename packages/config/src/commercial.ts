import type { PlanTier, SuiteKey } from './suites'

export type CommercialPlan = {
  tier: PlanTier
  monthlyPriceGbp: number | null
  includedSeats: number
  includedSuites: SuiteKey[]
  usageLimits: {
    monthlyMessages: number | null
    monthlyOrchestrationEvents: number | null
    monthlyMappings: number | null
  }
}

export const commercialPlans: Record<PlanTier, CommercialPlan> = {
  starter: {
    tier: 'starter',
    monthlyPriceGbp: 99,
    includedSeats: 3,
    includedSuites: ['core_operations'],
    usageLimits: { monthlyMessages: 1000, monthlyOrchestrationEvents: 500, monthlyMappings: 500 },
  },
  growth: {
    tier: 'growth',
    monthlyPriceGbp: 499,
    includedSeats: 15,
    includedSuites: ['core_operations', 'core_workforce', 'core_intelligence'],
    usageLimits: { monthlyMessages: 10000, monthlyOrchestrationEvents: 5000, monthlyMappings: 5000 },
  },
  enterprise: {
    tier: 'enterprise',
    monthlyPriceGbp: null,
    includedSeats: 50,
    includedSuites: ['core_operations', 'core_workforce', 'core_intelligence'],
    usageLimits: { monthlyMessages: null, monthlyOrchestrationEvents: null, monthlyMappings: null },
  },
}

export type UsageMetric = 'messages' | 'orchestration_events' | 'mappings'

export type UsageEvent = {
  tenantId: string
  metric: UsageMetric
  quantity: number
  occurredAt: string
  idempotencyKey: string
}
