# FoundingOS Shared Schema (Canonical)

This root document is the single source of truth for the shared backbone.
The more detailed design notes in `docs/shared-schema.md` remain useful
implementation notes, but new APIs and migrations must follow this contract.

## Identity model

`Tenant` owns one or more `TenantSuiteLicense` records. `User` belongs to a
tenant and may hold platform roles (`FounderOnly`, `SystemOperator`,
`ReadOnly`) plus suite-scoped roles. `AuthSession` and `PasswordReset` are
shared identity tables; access tokens carry `tenantId`, `suite`, and role
claims. Every suite query is tenant-scoped.

## Messaging abstraction

All channels implement one adapter contract:

```ts
type MessagingChannel =
  | 'whatsapp' | 'sms' | 'email' | 'messenger'
  | 'instagram' | 'telegram' | 'webchat'

type MessageIntent = {
  tenantId: string
  channel: MessagingChannel
  recipient: string
  template: string
  variables: Record<string, string>
  correlationId: string
}
```

Adapters return `{ accepted, providerMessageId, retryable, errorCode }`.
Suite code emits intents; provider credentials and retry policy stay in the
shared backbone.

## Mapping model

`ExternalMapping` links a provider object to a FoundingOS object without
leaking provider identifiers into suite tables:

```text
ExternalMapping(
  tenantId, provider, externalType, externalId,
  resourceType, resourceId, lastSyncedAt, metadata
)
```

Mappings are unique on `(tenantId, provider, externalType, externalId)` and
are queried through a shared mapping service. Mapping reads emit
`mapping.query` telemetry events.

## Orchestration event model

Every cross-suite action is an immutable event:

```text
OrchestrationEvent(
  id, tenantId, suite, name, correlationId, causationId,
  actorType, actorId, payload, occurredAt, status
)
```

Examples: `order.fulfilled`, `applicant.stage_changed`,
`suite.activated`, `message.route_requested`, and
`message.route_succeeded`.

## Unified event store

`TelemetryEvent` is the append-only analytical event store:

```text
TelemetryEvent(
  id, tenantId, suite, name, correlationId,
  actorType, actorId, properties, occurredAt
)
```

Required event families:

- `orchestration.*`
- `mapping.*`
- `messaging.route_*`
- `identity.*`
- `suite.activation`

Events must not contain passwords, tokens, or reset codes. Retention defaults
to 400 days and is tenant-configurable.
