/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandSlug } from '../../../packages/config/src/index.ts'

export type AALDomain = 'marketing' | 'sales' | 'crm' | 'finance'
export type AALIntent = 'analyse' | 'recommend' | 'automate' | 'forecast' | 'draft' | 'approve'
export type AALRiskLevel = 'low' | 'medium' | 'high'

export type AALEvent = {
  id: string
  type: 'context_built' | 'entitlement_checked' | 'engine_routed' | 'suggestion_generated' | 'guardrail_applied' | 'action_completed' | 'action_failed'
  domain: AALDomain
  brandSlug: BrandSlug
  actorId: string
  timestamp: string
  metadata: Record<string, string | number | boolean>
}

export function createEventId(domain: AALDomain, type: AALEvent['type']) {
  return `aal_${domain}_${type}_${Date.now()}`
}

export class EventBus {
  private events: AALEvent[] = []

  emit(event: Omit<AALEvent, 'id' | 'timestamp'>) {
    const enriched = { ...event, id: createEventId(event.domain, event.type), timestamp: new Date().toISOString() }
    this.events.push(enriched)
    return enriched
  }

  list() {
    return [...this.events]
  }
}

export const eventBus = new EventBus()
