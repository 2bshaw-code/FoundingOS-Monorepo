/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Phase 30 — Core.Intelligence has no direct database access to
// Core.Operations' TelemetryEvent table (it is a separate service/database),
// so it emits over HTTP to Core.Operations' ingestion endpoint (Phase 28),
// mirroring the existing opsRequest() cross-suite pattern in
// core-operations-client.ts. Fire-and-forget: a telemetry failure must never
// affect the real request it's attached to.
const baseUrl = () => (process.env.CORE_OPERATIONS_API_URL || 'http://127.0.0.1:4001/api/v1/ops').replace(/\/+$/, '')

export function emitTelemetry(tenantId: string | undefined, name: string, properties: Record<string, unknown> = {}): void {
  void fetch(`${baseUrl()}/platform/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      events: [{ tenantId, suite: 'core_intelligence', name, actorType: 'system', occurredAt: new Date().toISOString(), properties }],
    }),
    signal: AbortSignal.timeout(5_000),
  }).catch((error) => {
    console.error(`[telemetry] failed to emit "${name}"`, error)
  })
}
