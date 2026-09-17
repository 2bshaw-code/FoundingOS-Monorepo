import type { PlanTier, SuiteKey } from './suites'

export type CommercialPlan = {
  tier: PlanTier
  monthlyPriceGbp: number | null
  includedSeats: number
  includedSuites: SuiteKey[]
  includedWorkspaces: string[]
  access: string[]
  includedFeatures: string[]
  usageLimits: {
    monthlyMessages: number | null
    monthlyOrchestrationEvents: number | null
    monthlyMappings: number | null
  }
}

export const commercialPlans: Record<PlanTier, CommercialPlan> = {
  lite: {
    tier: 'lite',
    monthlyPriceGbp: 0,
    includedSeats: 1,
    includedSuites: ['core_operations'],
    includedWorkspaces: ['Retail basics'],
    access: ['One FoundingOS account', 'FoundingOS web', 'FoundingOS mobile'],
    includedFeatures: ['Core records', 'Basic company identity', 'Manual refresh', 'Offline-tolerant capture', 'Low-data mode'],
    usageLimits: { monthlyMessages: 100, monthlyOrchestrationEvents: 100, monthlyMappings: 50 },
  },
  starter: {
    tier: 'starter',
    monthlyPriceGbp: 29,
    includedSeats: 3,
    includedSuites: ['core_operations'],
    includedWorkspaces: ['Retail', 'Orders', 'Inventory', 'Customers', 'Basic Finance', 'Brand Studio'],
    access: ['One FoundingOS account', 'FoundingOS web', 'FoundingOS mobile', '3 team members'],
    includedFeatures: ['Core workflows', 'WhatsApp content and delivery messaging', 'Brand Studio and branded documents', 'Automatic sync', 'All supported languages', 'Community support'],
    usageLimits: { monthlyMessages: 1000, monthlyOrchestrationEvents: 500, monthlyMappings: 500 },
  },
  growth: {
    tier: 'growth',
    monthlyPriceGbp: 99,
    includedSeats: 15,
    includedSuites: ['core_operations', 'core_workforce', 'core_intelligence'],
    includedWorkspaces: ['Retail', 'Logistics', 'Finance', 'Marketing', 'Talent', 'Health', 'Core Intelligence'],
    access: ['One FoundingOS account', 'FoundingOS web', 'FoundingOS mobile', '15 team members'],
    includedFeatures: ['All suites', 'WhatsApp-first messaging automation', 'Channel-ready workflows', 'All supported languages', 'Advanced reporting', 'Priority support'],
    usageLimits: { monthlyMessages: 10000, monthlyOrchestrationEvents: 5000, monthlyMappings: 5000 },
  },
  enterprise: {
    tier: 'enterprise',
    monthlyPriceGbp: null,
    includedSeats: 50,
    includedSuites: ['core_operations', 'core_workforce', 'core_intelligence'],
    includedWorkspaces: ['All current and future workspaces'],
    access: ['One FoundingOS account', 'FoundingOS web', 'FoundingOS mobile', '50 included seats', 'SSO and managed rollout'],
    includedFeatures: ['All suites', 'Unlimited automation', 'All supported languages', 'SSO', 'Custom integrations'],
    usageLimits: { monthlyMessages: null, monthlyOrchestrationEvents: null, monthlyMappings: null },
  },
}

export const commercialAddOns = {
  languagePack: {
    key: 'language_pack',
    name: 'Language Pack',
    monthlyPriceGbp: 5,
    eligiblePlans: ['lite'] as PlanTier[],
    includedFromPlan: 'starter' as PlanTier,
    description: 'Unlocks English, French, Spanish, Portuguese, Kiswahili, and Arabic for a Lite workspace.',
  },
} as const

export const marketingPlanFeatures: Record<PlanTier, string[]> = {
  lite: ['Customer records', 'One active promotion', 'Basic company identity', 'Manual WhatsApp sharing', 'Basic conversion count'],
  starter: ['Campaign builder', 'Brand Studio and branded documents', 'WhatsApp and email content', 'Publishing calendar', 'Customer audiences', 'Campaign performance'],
  growth: ['AI content studio', 'Multi-channel scheduling', 'Automated audiences', 'Revenue attribution', 'Recommendations and alerts'],
  enterprise: ['Approval workflows', 'Custom channels', 'Regional governance', 'Custom attribution', 'Dedicated integration support'],
}

export type UsageMetric = 'messages' | 'orchestration_events' | 'mappings'

export type UsageEvent = {
  tenantId: string
  metric: UsageMetric
  quantity: number
  occurredAt: string
  idempotencyKey: string
}
