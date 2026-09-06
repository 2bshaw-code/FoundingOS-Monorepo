/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { eventBus } from './event-bus.ts'

export { eventBus, EventBus } from './event-bus.ts'
export type { AALEvent } from './event-bus.ts'

export function emitAIEvent(domain: import('./event-bus.ts').AALDomain, action: string, outcome: string, metadata: Record<string, string | number | boolean> = {}) {
  return eventBus.emit({
    type: outcome === 'blocked' ? 'guardrail_applied' : 'suggestion_generated',
    domain,
    brandSlug: 'foundingos',
    actorId: 'system',
    metadata: { action, outcome, ...metadata },
  })
}

export function subscribeToAIEvents(handler: (event: import('./event-bus.ts').AALEvent) => void) {
  eventBus.list().forEach(handler)
  return () => undefined
}
