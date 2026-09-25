import { emitTelemetry } from './telemetry-emitter.js'

export type IntelligenceEventName =
  | 'orchestration.event'
  | 'mapping.query'
  | 'messaging.route_succeeded'
  | 'identity.resolved'
  | 'suite.activation'

// Phase 30 — this module previously only console.info'd a structured local
// event; it now also forwards each event into the real cross-suite
// TelemetryEvent pipeline (Phase 28) via emitTelemetry(), which is
// fire-and-forget and never throws, so this remains as safe to call from
// hot-path middleware as it always was.
export function recordIntelligenceEvent(
  name: IntelligenceEventName,
  properties: Record<string, unknown> = {},
  tenantId?: string,
): void {
  console.info(JSON.stringify({
    event: name,
    suite: 'core_intelligence',
    occurredAt: new Date().toISOString(),
    properties,
  }))
  emitTelemetry(tenantId, name, properties)
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
