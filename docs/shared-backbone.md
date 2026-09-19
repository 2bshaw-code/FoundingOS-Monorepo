# FoundingOS Restructure — Shared Backbone

This document defines the shared backbone that every FoundingOS suite is
built on. It is the contract between suites: anything not listed here is
suite-specific and must not leak into other suites.

## 1. Single brand, three suites

FoundingOS collapses the previous nine-brand structure into **one brand**
(`foundingos`) delivered as **one platform** with **three product suites**:

| Suite | Replaces (legacy brand) | Domain |
| --- | --- | --- |
| **Core.Operations** | FoundRetail, FoundFinance, FoundHealth, FoundLogistics | Customers, orders, inventory, billing, delivery, messaging commerce |
| **Core.Workforce** | FoundTalent | Applicants, recruiters, jobs, workforce intelligence |
| **Core.Intelligence** | FoundThat (scraping-based) | Founder/owner analytics, KPIs, funnels, reporting, decision support — rebuilt on first-party data |

Legacy brands **removed/deprecated** entirely (not migrated into a suite):

- **FoundMeat** — vertical meat-trade product. Deprecated.
- **FoundCrypto** — crypto trading/signals product. Deprecated.
- **FoundThat's scraping engine** — third-party scraping is disabled and
  removed. Only first-party analytics survive, folded into
  Core.Intelligence.

See [deprecations.md](./deprecations.md) for the full removal list and
[migration-map.md](./migration-map.md) for path/route/table renames.

## 2. Shared backbone components

Every suite consumes the same backbone; suites must not fork these:

1. **Identity & Auth** (`@founder-os/auth` → renamed `@foundingos/auth`)
   - One issuer (`founding-os`), one audience (`founding-os-apps`).
   - Shared `AuthUser`, `AuthSession`, `PasswordReset` tables per suite
     schema (see [shared-schema.md](./shared-schema.md)).
   - Roles are suite-scoped but issued by the same token service:
     `FounderOnly`, `SystemOperator`, `ReadOnly` (platform); suite roles
     defined per suite (e.g. Core.Operations: `Owner`, `Merchant`, `Staff`).
2. **Console shell** (`packages/ui`)
   - One shared shell: sidebar, dashboard KPIs, settings, module routes,
     activity log, admin user management.
   - Suites register modules into the shell; they do not run their own
     shell.
3. **Brand/suite registry** (`packages/config`)
   - Single source of truth for suite metadata, URLs, and feature flags
     (see [feature-flags.md](./feature-flags.md)).
4. **Database** (`packages/db`, Prisma)
   - One logical database, one Prisma schema, per-suite table prefixes
     (see [shared-schema.md](./shared-schema.md)) instead of per-brand
     schemas/databases.
5. **API conventions**
   - Every service exposes `GET /health`, `GET /api/v1/status`, and
     resources under `/api/v1/*`.
   - Shared auth router mounted at `/api/v1/auth` (login, refresh, logout,
     password flows).
   - Shared response envelope: request IDs, structured errors, security
     headers, rate limits (see [api-review.md](./api-review.md)).
6. **Telemetry** (see [telemetry.md](./telemetry.md))
   - One event schema, one ingestion path, per-suite event namespaces.
7. **Messaging Core**
   - Channel-neutral ingestion, durable conversations/messages, participant
     authorization, intent routing, channel formatting, and delivery status.
   - WhatsApp Cloud API is the first production transport. Telegram, SMS,
     Messenger, Instagram, email, Slack, and RCS must implement the same
     contract rather than embedding channel logic in a workspace.
   - Every inbound message and executed/failed intent publishes an event into
     the shared Event Feed.

### Messaging Core flow

```text
WhatsApp webhook
  -> signature verification
  -> tenant channel connection
  -> provider-message idempotency
  -> conversation + participant authorization
  -> deterministic intent classifier
  -> workspace command
  -> shared Event Feed
  -> WhatsApp confirmation
```

Phase-one operational commands are `/status`, `/order`, `/delivered`,
`/invoice`, and `/campaign`. Intelligence adds `/snapshot` plus the concise
contextual replies `APPROVE`, `REJECT`, `EXECUTE`, `UNDO`, `WHY`, `IMPACT`,
`ALTERNATIVES`, and `MORE`.
Natural-language order capture is supported as a guarded fallback. Unsupported
or unauthorized actions are recorded and rejected; they never silently mutate
business records.

An owner can dispatch a low-bandwidth intelligence brief through
`POST /api/v1/ops/platform/agent-actions-intelligence/message` to an active,
authorized participant. The brief is assembled from the same tenant-scoped
snapshot, Emerging Signals, action evidence, and related-decision data shown in
the SuperDashboard. Delivery state is persisted in Messaging Core and emits a
Shared Event Feed event.

Short decision replies are resolved against the action reference stored on the
durable conversation. `APPROVE` and `REJECT` require founder/admin messaging
permission and a link to an active tenant user. Approval calls the existing
AgentAction transition and never performs execution. `WHY`, `ALTERNATIVES`,
`IMPACT`, `ALTERNATIVES`, and `MORE` are read-only explanations grounded in
stored evidence.

`EXECUTE` is accepted only after approval and creates a unique
`AgentActionExecution` ledger entry in the same serializable transaction as
the internal Retail, Logistics, and Finance records. It is replay-protected.
`UNDO` performs the workflow-declared compensation: cancel the internal
supplier order and inbound booking and void the scheduled supplier liability.
It records the compensation in the ledger, Event Feed, and workspace audit
trail. This phase does not connect to or move funds through an external
payment rail.

Inbound provider message IDs are deduplicated before command evaluation. The
inbound record also retains the exact reply and delivery result. If a provider
retries after confirmation delivery failed, Messaging Core retries that stored
reply without evaluating or executing the command again. Unknown input returns
safe, action-state-specific recovery commands and confirms that no unrecognized
action was taken.

## 3. Event-driven AI Insights contract

Core.Intelligence panels in suite consoles consume the shared, indexed event
feed contract published by Core.Operations:

- `GET /api/v1/ops/events?limit=200` for bounded baseline history
- `GET /api/v1/ops/events?source=retail&type=inventory.threshold.breached`
  for indexed workspace/type retrieval
- `GET /api/v1/ops/events?actionId=...&since=...&until=...` for correlated
  action trails and time-window analysis
- `GET /api/v1/ops/event-patterns?kind=inventory.replenishment&sku=...` for
  grounded historical and predictive outcome summaries
- `GET /api/v1/ops/events/stream` for live SSE updates

The insights layer derives four output classes from this feed:

1. Predictions (delivery and cashflow trajectory)
2. Risk flags (inventory and receivables pressure)
3. Workflow suggestions (cross-suite next best actions)
4. Anomalies (event volume/coverage irregularities)

### Intelligence orchestration contract

Core.Intelligence is the control plane above the seven workspaces. FoundAI
observes tenant-scoped feed events and may create an internal `AgentAction`
proposal containing:

- the triggering `sourceEventId`;
- a typed action `kind`;
- rationale, risk, and estimated financial impact;
- ordered workspace/module steps;
- a structured coordination summary covering inventory risk, logistics load,
  cash impact, trade-offs, expected outcome, and an explainable priority score;
- historical evidence derived from comparable Event Feed signals and outcomes;
- a forward-looking `predictiveSignals` summary describing what usually
  happens next, calibrated confidence, success/rejection counts, and the exact
  aggregate evidence basis;
- a read-only before/after simulation for every affected workspace;
- likely second-order effects plus a read-only approve-versus-reject comparison;
- approval and execution state; and
- durable execution results and exact correlated Event Feed IDs.

The initial lifecycle is intentionally small:

```text
workspace signal
  -> Shared Event Feed
  -> FoundAI proposal
  -> owner/manager approval or rejection
  -> atomic cross-workspace execution
  -> workspace records + Shared Event Feed outcomes + audit event
```

No external or business-record mutation occurs while an action is only
`proposed`. Execution requires the durable `approved` state, is tenant-scoped,
and rejects replay after completion. This is an internal primitive, not a
general plugin system. Workflow behavior is held in a small server-side
definition registry that binds a validated proposal builder to an atomic
executor. Each definition declares its workspace coordination template,
required evidence fields, simulation builder, and human-readable outcome
summarizer. Missing required evidence fails closed. Only explicitly registered
kinds can execute.

The initial workflow set is:

1. `inventory.replenishment`: Retail purchase, Logistics inbound, and Finance
   liability records. Compensation cancels/voids those internal effects.
2. `finance.receivables.collection`: Finance collection case, Retail CRM
   follow-up, and Marketing reminder. Compensation cancels/closes the internal
   work; execution never debits the customer.
3. `logistics.delivery.recovery`: Logistics exception, Retail service case,
   and Finance remedy ceiling. Compensation cancels/closes/releases the
   internal work; execution never issues a refund.

All three use the same proposal → human approval → explicit execution →
assessment → optional compensation lifecycle. The generic proposal endpoint is
`POST /api/v1/ops/platform/agent-actions/proposals` with `{ kind, input }`;
the replenishment-specific endpoint remains available for compatibility.

### First-value activation contract

The Intelligence onboarding flow reuses `PUT /platform/onboarding` and the
existing workspace-record APIs to capture business identity, one supplier,
starting inventory, and opening cash context. Its record writes use stable
idempotency keys so a retry cannot duplicate completed setup steps. Activation
then creates the first proposal; it never bypasses approval or execution.

The SuperDashboard ranks pending decisions using financial impact,
cross-workspace coverage, risk, pattern confidence, and urgency. Confidence is
smoothed so small samples cannot produce false certainty. Each coordination
card explains the evidence behind its confidence and previews the projected
before/after state without mutating records.

Cross-tenant pattern learning is aggregate-only and internal. Tenant IDs,
payloads, SKUs, suppliers, and individual outcomes are never returned. Cohort
evidence contributes only after at least three distinct tenants have supplied
eligible outcomes; otherwise it is explicitly withheld and only tenant-local
history is used. For the initial replenishment workflow, a precedent is marked
high-impact when its recorded financial impact is at least £500; the threshold
is deterministic and can move into workflow configuration when additional
workflow kinds are introduced.

The user interface and messaging briefs keep evidence classes distinct:
post-execution **measured accuracy**, pre-decision **predictive confidence**,
and evidence-weighted **pattern reliability** are never presented as
interchangeable metrics. Improvement language appears only when enough
assessed outcomes exist to compare measured groups.

Every lifecycle event carries the
same action, source-event, and correlation identifiers. The action trail
therefore reconstructs the source signal, proposal, human decision, workspace
mutations, and final outcome in both production and simulation. Completion
events include the workflow-generated human-readable outcome summary, which is
also stored on the durable action.

### Outcome learning loop

Every completed action produces a separate
`agent.action.outcome.assessed` event after the completion event. The workflow
compares its declared prediction with execution evidence and records:

- matched workspace effects;
- missing or changed effects;
- the predicted and actual financial commitment plus the delta;
- original prediction confidence; and
- a deterministic accuracy score and human-readable assessment.

The assessment is stored on the durable action and included in its correlated
trail. Future predictions can adjust confidence by at most five points from
aggregate assessment accuracy, preventing a small or self-reinforcing sample
from overpowering the underlying completion/rejection evidence.

A pattern is labelled **refined** only after at least ten assessed outcomes and
ten resolved decisions are available within eligible tenant-local or
privacy-thresholded cohort evidence. The SuperDashboard exposes assessed
outcome count, average accuracy, and a pattern reliability score. Reliability
therefore grows from measured outcomes rather than model assertion.

Simulation remains advisory and read-only. Alongside immediate Retail,
Logistics, and Finance changes, each workflow can declare likely second-order
effects and an approve-versus-reject comparison. Rejecting or taking no action
never causes a hidden mutation.

### Cross-action awareness

The Intelligence layer analyzes tenant-local pending actions and actions
completed within the previous 30 days for explicit shared dimensions:

- the same supplier;
- the same SKU;
- overlapping Logistics capacity; and
- combined pending cash commitments.

An interaction is surfaced only when it shares a supplier or SKU, or when at
least two advisory dimensions overlap. Each result includes the affected
actions, severity, evidence, and a non-blocking recommendation. It never changes
action state, prevents approval, combines executions, or resolves a conflict
automatically.

### System Intelligence Health

The SuperDashboard exposes one tenant-scoped health summary derived from
durable AgentActions and outcome assessments:

- total assessed outcomes;
- average measured prediction accuracy;
- active and refined workflow patterns;
- average pattern reliability;
- confidence change from earliest to latest recorded action; and
- current cross-action interaction count.

FoundAI consumes this same summary. Responses about institutional memory,
prediction improvement, or related decisions therefore cite the same persisted
evidence visible to operators. A recurring deviation is named only when the
same assessed field has deviated at least twice; otherwise the system states
that no repeatable bias has been established.

### Emerging Signals and Intelligence Snapshot

The intelligence-summary contract includes:

- evidence-bearing Emerging Signals for recurring deviations, cross-action
  pressure, and strong historical precedents;
- recent prediction-accuracy movement over a bounded 20-assessment window;
- assessed-outcome, refined-pattern, and active-interaction counts; and
- a bounded learning-momentum score labelled `establishing`, `building`, or
  `compounding`.

These are read models, not execution instructions. The dashboard exposes
“Why is this surfaced?” evidence for every signal, related decision, and
high-ranked pending action. FoundAI synthesizes the same metrics when answering
broader questions about current attention and overall system performance.

All cross-tenant contributions remain aggregate-only behind the existing
three-tenant anonymity threshold. Messaging briefs contain tenant-local
decisions and privacy-safe aggregate measures only.

### Economic value and governance read models

`GET /platform/agent-actions-intelligence` additionally returns:

- `snapshot.economicValue`, an evidence-bounded tenant summary of governed
  cash, immediately preserved cash commitments, measurable protected margin,
  inventory units protected, accurately resolved risks, coordinated handoffs,
  and estimated operator minutes saved;
- `auditTrail`, the latest proposal, approval, rejection, execution,
  assessment, and compensation events linked to their AgentAction.

Economic values use completed outcome evidence or explicit rejection state.
Margin is nullable and is never estimated without both cost and selling-price
inputs. Time saved is clearly labelled as an estimate and uses the documented
eight-minute-per-handoff benchmark. These definitions are reused by the
SuperDashboard, FoundAI, and WhatsApp `IMPACT` responses.

The audit read model is derived from existing append-only Event Feed records.
It does not introduce a second source of truth and remains tenant-scoped.
Actor identifiers, timestamps, event types, action IDs, and source-event IDs
are retained for investigation. The buyer-facing lifecycle demo is browser
local, visibly marked as simulation-only, and cannot call execution APIs.

## 4. Non-negotiable naming rules

- Product/brand name in all copy, routes, env vars, and table prefixes is
  **FoundingOS**, plus suite name (**Core.Operations**, **Core.Workforce**,
  **Core.Intelligence**). Legacy brand words (FoundRetail, FoundMeat,
  FoundThat, FoundTalent, FoundCrypto, FoundFinance, FoundHealth,
  FoundLogistics) must not appear in new copy, new routes, new env
  vars, or new table names. Existing references are tracked for cleanup in
  [migration-map.md](./migration-map.md).
- Env vars: `FOUNDINGOS_<SUITE>_<PURPOSE>`, e.g.
  `FOUNDINGOS_CORE_OPERATIONS_DATABASE_URL`.
- Table prefixes: `core_ops_`, `core_workforce_`, `core_intel_`, and
  unprefixed shared tables (`AuthUser`, `AuthSession`, `Subscription`, ...).
- Routes: `/core-operations/*`, `/core-workforce/*`, `/core-intelligence/*`,
  with `/system/*` reserved for platform/operator routes.

## 5. Architecture diagram

See [architecture.md](./architecture.md) for the full diagram and component
descriptions.
## Control, outcomes, and governed workflow contracts

Tenant control settings are stored in the shared Core Operations data layer and are read through tenant-scoped APIs. Notification preferences, approval thresholds, evidence requirements, and owner-only execution are explicit configuration; governance mode is fixed to human approval. Team permissions are enforced server-side, not only in the UI.

Outcomes exports contain AgentAction lifecycle rows and workspace audit events for the current tenant. They intentionally omit integration credentials and raw provider payloads. The Outcomes & Value view labels measured accuracy, lifecycle-derived cash governed, and estimated operator time saved according to their evidence quality.

The shared workflow contract includes the additional `finance.expense.approval`, `marketing.campaign.launch`, and `finance.budget.reallocation` kinds. Each supplies validation, evidence requirements, coordination, simulation, execution, assessment, and compensation. External payment, publication, debit, refund, and transfer remain outside the execution boundary.

Tenant teams can use Founder/Owner, Manager, Operator, and Viewer roles. Viewer access is read-only and still constrained by explicit workspace permissions; only Founder/Owner roles can manage team/settings or execute and reverse actions.

Invitations are represented by `TenantInvitation` records rather than pre-created accounts. The raw token is never persisted; acceptance hashes the submitted token, checks expiry/revocation/single-use state, creates the tenant-scoped user with a chosen password, and records an audit event in one transaction.
