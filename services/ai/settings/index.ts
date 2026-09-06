/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AALDomain } from '../events/event-bus.ts'

export type AISettings = {
  tenantId: string
  enabledDomains: AALDomain[]
  autonomousEnabled: boolean
  tone: 'formal' | 'friendly' | 'direct'
}

const DEFAULT_DOMAINS: AALDomain[] = ['marketing', 'sales', 'crm', 'finance']
const settings = new Map<string, AISettings>()

export function getAISettings(tenantId: string): AISettings {
  return settings.get(tenantId) ?? { tenantId, enabledDomains: DEFAULT_DOMAINS, autonomousEnabled: false, tone: 'direct' }
}

export function updateAISettings(tenantId: string, update: Partial<Omit<AISettings, 'tenantId'>>) {
  const next = { ...getAISettings(tenantId), ...update, tenantId }
  settings.set(tenantId, next)
  return next
}

export function canRunAIDomain(tenantId: string, domain: AALDomain) {
  return getAISettings(tenantId).enabledDomains.includes(domain)
}
