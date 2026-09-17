export type IntelligenceEventName =
  | 'orchestration.event'
  | 'mapping.query'
  | 'messaging.route_succeeded'
  | 'identity.resolved'
  | 'suite.activation'

export function recordIntelligenceEvent(
  name: IntelligenceEventName,
  properties: Record<string, unknown> = {},
): void {
  console.info(JSON.stringify({
    event: name,
    suite: 'core_intelligence',
    occurredAt: new Date().toISOString(),
    properties,
  }))
}

export const recordOrchestrationEvent = (properties: Record<string, unknown> = {}) =>
  recordIntelligenceEvent('orchestration.event', properties)

export const recordMappingQuery = (properties: Record<string, unknown> = {}) =>
  recordIntelligenceEvent('mapping.query', properties)

export const recordMessagingRouteSuccess = (properties: Record<string, unknown> = {}) =>
  recordIntelligenceEvent('messaging.route_succeeded', properties)

export const recordIdentityResolution = (properties: Record<string, unknown> = {}) =>
  recordIntelligenceEvent('identity.resolved', properties)

export const recordSuiteActivation = (properties: Record<string, unknown> = {}) =>
  recordIntelligenceEvent('suite.activation', properties)
