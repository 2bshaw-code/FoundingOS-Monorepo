import type { PlanTier, SuiteKey } from './suites'

// Internal tier keys stay stable (feature gating and stored licences use them);
// `name` is what buyers see. starter = "Core" base, growth = "Complete" bundle.
export type CommercialPlan = {
  tier: PlanTier
  name: string
  monthlyPriceGbp: number | null
  includedSeats: number
  includedSuites: SuiteKey[]
  includedWorkspaces: string[]
  includedBoltOns: BoltOnKey[]
  access: string[]
  includedFeatures: string[]
  usageLimits: {
    monthlyMessages: number | null
    monthlyOrchestrationEvents: number | null
    monthlyMappings: number | null
  }
}

export type BoltOnKey = 'commerce_pro' | 'core_workforce' | 'core_intelligence'

export type CommercialBoltOn = {
  key: BoltOnKey
  name: string
  monthlyPriceGbp: number
  suite: SuiteKey
  // Backend workspace slugs this bolt-on enables (see core-operations/backend/src/platform.ts).
  workspaces: string[]
  description: string
  features: string[]
}

export const commercialPlans: Record<PlanTier, CommercialPlan> = {
  lite: {
    tier: 'lite',
    name: 'Lite',
    monthlyPriceGbp: 0,
    includedSeats: 1,
    includedSuites: ['core_operations'],
    includedWorkspaces: ['Core.Operations basics: sales, orders, and customers'],
    includedBoltOns: [],
    access: ['One FoundingOS account', 'FoundingOS web', 'FoundingOS mobile'],
    includedFeatures: ['Core records', 'Basic company identity', 'Manual refresh', 'Offline-tolerant capture', 'Low-data mode'],
    usageLimits: { monthlyMessages: 100, monthlyOrchestrationEvents: 100, monthlyMappings: 50 },
  },
  starter: {
    tier: 'starter',
    name: 'Core',
    monthlyPriceGbp: 19,
    includedSeats: 3,
    includedSuites: ['core_operations'],
    includedWorkspaces: ['Core.Operations: pipeline, CRM, orders, inventory, and customers', 'Marketing and Brand Studio'],
    includedBoltOns: [],
    access: ['One FoundingOS account', 'FoundingOS web', 'FoundingOS mobile', '3 team members', 'Add bolt-ons any time'],
    includedFeatures: ['WhatsApp messaging and delivery notifications', 'Brand Studio and branded documents', 'Automatic sync', 'All supported languages', 'Community support'],
    usageLimits: { monthlyMessages: 1000, monthlyOrchestrationEvents: 500, monthlyMappings: 500 },
  },
  growth: {
    tier: 'growth',
    name: 'Complete',
    monthlyPriceGbp: 89,
    includedSeats: 15,
    includedSuites: ['core_operations', 'core_workforce', 'core_intelligence'],
    includedWorkspaces: ['Core.Operations', 'Commerce Pro', 'Core.Workforce', 'Core.Intelligence'],
    includedBoltOns: ['commerce_pro', 'core_workforce', 'core_intelligence'],
    access: ['One FoundingOS account', 'FoundingOS web', 'FoundingOS mobile', '15 team members'],
    includedFeatures: ['Every bolt-on included', 'WhatsApp-first messaging automation', 'Channel-ready workflows', 'Advanced reporting', 'Priority support'],
    usageLimits: { monthlyMessages: 10000, monthlyOrchestrationEvents: 5000, monthlyMappings: 5000 },
  },
  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise',
    monthlyPriceGbp: null,
    includedSeats: 50,
    includedSuites: ['core_operations', 'core_workforce', 'core_intelligence'],
    includedWorkspaces: ['All current and future workspaces'],
    includedBoltOns: ['commerce_pro', 'core_workforce', 'core_intelligence'],
    access: ['One FoundingOS account', 'FoundingOS web', 'FoundingOS mobile', '50 included seats', 'SSO and managed rollout'],
    includedFeatures: ['All suites', 'Unlimited automation', 'All supported languages', 'SSO', 'Custom integrations', 'SLAs and dedicated support'],
    usageLimits: { monthlyMessages: null, monthlyOrchestrationEvents: null, monthlyMappings: null },
  },
}

// Bolt-ons are added to the Core base only; Complete already includes all of them.
export const commercialBoltOns: Record<BoltOnKey, CommercialBoltOn> = {
  commerce_pro: {
    key: 'commerce_pro',
    name: 'Commerce Pro',
    monthlyPriceGbp: 25,
    suite: 'core_operations',
    workspaces: ['finance'],
    description: 'Finance and back-office for businesses that sell and ship.',
    features: ['Invoicing and bills', 'Mobile money and payments', 'Purchasing and suppliers', 'Fulfilment and returns', 'Cashflow and reconciliation'],
  },
  core_workforce: {
    key: 'core_workforce',
    name: 'Core.Workforce',
    monthlyPriceGbp: 29,
    suite: 'core_workforce',
    workspaces: ['talent'],
    description: 'Hire, onboard, and run your team.',
    features: ['Candidates and jobs', 'Interviews and offers', 'Onboarding', 'Time off and performance', 'Payroll inputs'],
  },
  core_intelligence: {
    key: 'core_intelligence',
    name: 'Core.Intelligence',
    monthlyPriceGbp: 35,
    suite: 'core_intelligence',
    workspaces: ['intelligence'],
    description: 'Signals and recommendations from everything happening in your business.',
    features: ['Signals and risk flags', 'Forecasts and scenarios', 'Anomaly detection', 'AI recommendations', 'Workflow suggestions'],
  },
}

export const boltOnKeys = Object.keys(commercialBoltOns) as BoltOnKey[]

// Backend workspace slugs enabled by each plan before bolt-ons.
export const planBaseWorkspaces: Record<PlanTier, string[]> = {
  lite: ['retail'],
  starter: ['retail', 'marketing'],
  growth: ['retail', 'marketing', 'finance', 'talent', 'intelligence'],
  enterprise: ['retail', 'marketing', 'finance', 'talent', 'intelligence'],
}

export const extraSeat = {
  monthlyPriceGbp: 5,
  eligiblePlans: ['starter', 'growth'] as PlanTier[],
  maxPerSignup: 50,
} as const

export function monthlyTotalGbp(tier: PlanTier, boltOns: BoltOnKey[] = [], extraSeats = 0): number | null {
  const plan = commercialPlans[tier]
  if (plan.monthlyPriceGbp === null) return null
  const addOns = tier === 'starter' ? boltOns.reduce((sum, key) => sum + commercialBoltOns[key].monthlyPriceGbp, 0) : 0
  const seats = (extraSeat.eligiblePlans as readonly PlanTier[]).includes(tier) ? Math.max(0, Math.floor(extraSeats)) * extraSeat.monthlyPriceGbp : 0
  return plan.monthlyPriceGbp + addOns + seats
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
