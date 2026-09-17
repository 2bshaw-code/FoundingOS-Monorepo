export type DemoWorkspace = {
  id: string
  name: string
  ownerEmail: string
  createdAt: string
}

export function createDemoWorkspace(ownerEmail: string, name = 'Demo workspace'): DemoWorkspace {
  return {
    id: `demo_${ownerEmail.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name,
    ownerEmail,
    createdAt: new Date(0).toISOString(),
  }
}

export function mockBillingCheckout(plan: PlanTier) {
  return { mode: 'demo' as const, status: 'active' as const, plan, checkoutId: `demo_checkout_${plan}` }
}

export function mockUsageEvent(metric: string, quantity = 1) {
  return { mode: 'demo' as const, metric, quantity, accepted: true as const }
}

export function mockNotification(channel: 'email' | 'sms', recipient: string) {
  return { mode: 'demo' as const, channel, recipient, delivered: true as const }
}
import type { PlanTier } from './suites'
