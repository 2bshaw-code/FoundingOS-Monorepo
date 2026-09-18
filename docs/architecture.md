# FoundingOS — Architecture Diagram

## System overview

```
                                 ┌───────────────────────────────┐
                                 │        foundingos.com         │
                                 │   (public marketing website)  │
                                 └───────────────┬───────────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          FoundingOS Console Shell                       │
│           (packages/ui — sidebar, dashboard, settings, activity)        │
│                                                                           │
│   ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐    │
│   │  Core.Operations  │ │  Core.Workforce   │ │ Core.Intelligence │    │
│   │  (was CoreOperations)│ │  (was CoreWorkforce)│ │ (was CoreIntelligence,   │    │
│   │  Customers         │ │  Applicants       │ │  KPI dashboards   │    │
│   │  Orders            │ │  Jobs             │ │  Funnels          │    │
│   │  Inventory         │ │  Recruiters       │ │  Reports          │    │
│   │  Billing/Invoices  │ │  Workforce Intel  │ │                   │    │
│   │  Delivery          │ │                   │ │                   │    │
│   └─────────┬──────────┘ └─────────┬─────────┘ └─────────┬─────────┘    │
│             │  module registration (feature flags per tenant/suite)     │
└─────────────┼───────────────────────┼─────────────────────┼─────────────┘
              │                       │                     │
              ▼                       ▼                     ▼
   ┌───────────────────────────────────────────────────────────────────┐
   │                     Shared Backbone Services                      │
   │                                                                     │
   │  @foundingos/auth   — identity, sessions, tokens, password flows   │
   │  @foundingos/config — suite registry, feature flags, brand tokens  │
   │  @foundingos/db     — Prisma client, one schema, prefixed tables   │
   │  Telemetry pipeline — one event schema, per-suite namespaces       │
   │  API gateway conv.  — /api/v1/*, /health, /api/v1/status, /auth/*  │
   └──────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
                    ┌───────────────────────────────┐
                    │      PostgreSQL (single DB)    │
                    │  Tenant, TenantSuiteLicense,    │
                    │  User, AuthUser, Subscription,  │
                    │  core_ops_*, core_workforce_*,  │
                    │  core_intel_*                   │
                    └───────────────────────────────┘

   ✗ Removed from architecture:
     - CoreOperations suite (frontend, backend, schema)
     - CoreOperations suite (frontend, backend, schema)
```

## Request flow (single suite example: Core.Operations)

```
Browser
  │  GET /core-operations/orders
  ▼
FoundingOS Console Shell (Next.js app router)
  │  loads module "core-operations" if TenantSuiteLicense includes it
  ▼
Core.Operations module (packages/ui module + suite API client)
  │  calls /api/v1/core-operations/orders with bearer access token
  ▼
Core.Operations backend service
  │  verifies token via @foundingos/auth (issuer founding-os,
  │  audience founding-os-apps)
  │  scopes all queries by tenantId
  ▼
PostgreSQL: core_ops_order WHERE tenantId = :tenantId
```

## Deployment topology (target state)

- **1** public marketing site: `foundingos.com` (replaces 5+ brand
  websites).
- **1** console app (multi-suite, module-flagged) instead of per-brand
  consoles + starter consoles.
- **1** backend deployment per suite (Core.Operations, Core.Workforce,
  Core.Intelligence), each stateless and behind the shared auth/gateway
  conventions, or consolidated into one backend if load allows — see open
  question in [restructure-summary.md](./restructure-summary.md).
- **1** PostgreSQL database, prefixed tables, tenant-scoped rows.

This diagram describes the **target** architecture. The current repository
still contains the legacy per-brand apps described in
[migration-map.md](./migration-map.md); cutover is incremental and
tracked there.

## Intelligence control plane

```
Retail / Logistics / Finance / Marketing / Talent / Health
                              │
                              ▼
                    Shared Event Feed
          (indexed tenant-scoped intelligence substrate)
              │ query by type/source/time/action/SKU
              │ compare prior signals and outcomes
              │ privacy-thresholded aggregate cohort patterns
                              │
                              ▼
              FoundAI signal interpretation
                              │
                              ▼
                  AgentAction proposal
       (rationale + coordination summary + historical
        evidence + predictive confidence + read-only
        simulation + priority score + ordered steps)
                              │
                    owner/manager approval
                              │
                              ▼
             atomic workspace record execution
                              │
                              ▼
       correlated Event Feed trail + outcome summary + audit
             + confidence-ranked decisions
             + FoundAI context + SuperDashboard
                              │
                              ▼
               outcome accuracy assessment
          (matches + deviations + financial delta)
                              │
                              └── bounded reliability refinement
```

`AgentAction` is deliberately an internal orchestration primitive. It does not
introduce a public plugin runtime. Each supported `kind` has an explicit,
server-side proposal/executor definition and validation contract. The initial
coverage includes inventory replenishment across Retail, Logistics, and
Finance; receivables collection across Finance, Retail CRM, and Marketing; and
delivery recovery across Logistics, Retail Service, and Finance. The latter
two create internal recovery work only: they do not debit a customer, issue a
refund, or move external funds.

The Event Feed is queryable by indexed scalar dimensions and bounded
correlation filters, with no additional infrastructure. Historical summaries
are derived from stored signals, proposals, completions, and outcomes rather
than generated as ungrounded prose. The SuperDashboard uses the resulting
coordination summary to expose cash, capacity, inventory, and timing trade-offs
before a human approves execution.

Predictive summaries use completed and rejected action sequences to answer
"what usually happens next." Confidence is sample-size calibrated, and
cross-tenant evidence is restricted to aggregate counts behind a minimum
three-tenant anonymity threshold. No tenant identifiers or tenant-specific
payload values enter another tenant's proposal.

Each internal workflow definition owns six explicit contracts: proposal
validation, required evidence fields, coordination-summary construction,
read-only simulation construction, and atomic execution plus outcome
summarization and deterministic compensation. This keeps future workflows
consistent without creating a public plugin surface. The simulation and
predictive layers remain advisory; the existing human approval boundary is
unchanged.

## First-value activation

The Intelligence workspace includes a four-step activation path that captures
business identity, one supplier and inventory risk, opening cash context, and
the WhatsApp governance model before creating the first replenishment
proposal. Production setup reuses the existing onboarding and workspace-record
APIs. Setup records use stable idempotency keys so a browser or network retry
does not duplicate completed supplier, inventory, or cash steps. The first
brief still enters the normal proposal → approval → execution lifecycle.

## Compounding outcome memory

Completion is not the end of an AgentAction. The registered workflow compares
the actual transaction result with its original prediction and simulation,
then emits a correlated `agent.action.outcome.assessed` event. This produces a
measurable loop:

```text
prediction + simulation
  -> human approval
  -> atomic execution
  -> outcome summary
  -> prediction accuracy assessment
  -> privacy-safe pattern reliability
  -> bounded confidence adjustment on the next similar proposal
```

Accuracy evidence includes matched workspace mutations, deviations, and the
financial difference between predicted and actual commitments. Reliability
cannot independently authorize or execute work; it only improves the evidence
presented at the next approval.

Patterns become `refined` after sufficient resolved and assessed cases. FoundAI
can then cite the case count, average measured accuracy, and reliability score.
The SuperDashboard displays the same reliability rather than a separate opaque
AI score.

Simulation now distinguishes immediate state changes from likely second-order
effects such as replenishment cadence, inbound capacity pressure, and cash
timing. An explicit Approve-versus-Reject view shows the expected operational
delta while leaving both branches read-only until the existing human approval
and execution steps occur.

## Cross-action coherence

The control plane maintains advisory awareness across pending and recently
completed actions without coupling their execution:

```text
tenant AgentActions
  -> shared supplier / SKU / workspace / cash dimensions
  -> explainable interaction evidence
  -> Related decisions panel + FoundAI context
  -> human review only
```

Potential interactions never block, reorder, merge, or execute actions. The
analysis is tenant-local because action-level supplier and SKU values are not
eligible for cross-tenant sharing.

## System Intelligence Health

The SuperDashboard now provides a measurable institutional-memory view. It
aggregates assessed outcomes, average prediction accuracy, active and refined
patterns, average reliability, confidence improvement over chronological
actions, and current interaction count.

The health view and FoundAI both consume the same server-side intelligence
summary. This prevents UI metrics and conversational explanations from
drifting apart and gives operators and investors one auditable account of how
the system improves with use. The existing three-tenant threshold continues to
govern any cohort contribution inside the underlying pattern metrics.
Recurring bias is reported only after the same assessed field deviates at
least twice, preventing one-off differences from being presented as a trend.

## Emerging Signals and Intelligence Snapshot

The server-side intelligence summary also derives two advisory read models
from the same tenant-scoped actions, interactions, and measured outcomes:

- **Emerging Signals** highlight recurring deviations, building
  cross-workspace pressure, and sufficiently reliable historical precedents.
  Each signal carries its outcome count, reliability, contributing evidence,
  and a statement that it cannot authorize or execute work.
- **Intelligence Snapshot** reports assessed outcomes, refined patterns,
  active interactions, the recent-versus-prior accuracy change across a
  maximum 20-assessment window, and an evidence-weighted learning-momentum
  score.

The SuperDashboard, evidence disclosures, FoundAI, API, and messaging briefs
all consume this one summary contract. “Why is this surfaced?” disclosures on
signals, related decisions, and ranked actions expose the historical outcomes,
reliability, accuracy, coordination scope, and interaction evidence used.

### Economic value evidence

The Intelligence Snapshot also derives a tenant-local economic value read
model from completed, assessed, or rejected AgentActions. It deliberately
separates observed operating facts from estimates:

- **cash governed** is the value of completed internal commitments;
- **cash preserved** is the immediate commitment not created after a recorded
  rejection, not a permanent savings or ROI claim;
- **margin protected** is shown only when both unit cost and selling-price
  evidence are present;
- **inventory protected** is the executed replenishment quantity;
- **risk reduced** counts completed actions whose measured outcome accuracy is
  at least 75%; and
- **time saved** uses a disclosed conservative benchmark of eight minutes per
  completed cross-workspace handoff.

The methodology is visible beside the metrics and is shared by the dashboard,
FoundAI, and low-bandwidth messaging. Missing evidence produces “not measured”
rather than an inferred financial claim.

### Execution audit and buyer demonstration

The intelligence summary includes a bounded, reverse-chronological execution
audit derived from the tenant Event Feed. Proposal, human approval or
rejection, execution, outcome assessment, and compensation retain their action
and source-event identifiers. The SuperDashboard presents this as a lifecycle
view with actor, timestamp, summary, and expandable evidence.

The Intelligence Advantage area includes a self-contained simulation of
detect → brief → approve → execute → undo. It uses the production lifecycle
language and governance boundaries but is explicitly labelled as a simulation
and never writes records. This lets evaluators understand the low-bandwidth
operating model without weakening production authorization.

## Messaging-first intelligence

Messaging is a first-class delivery interface for the Intelligence control
plane. The channel-neutral brief formatter converts Emerging Signals,
Intelligence Snapshot progress, interactions, and pending AgentActions into
concise text designed to remain below one kilobyte. WhatsApp Cloud API is the
first delivery adapter; future adapters reuse the same brief and command
contract.

```text
tenant intelligence summary + selected AgentAction
  -> low-bandwidth intelligence brief
  -> authorized messaging participant
  -> APPROVE | REJECT | EXECUTE | UNDO | WHY | IMPACT | ALTERNATIVES | MORE
  -> role and linked-user verification
  -> existing AgentAction decision transition
  -> durable conversation + Shared Event Feed audit
```

`APPROVE` records human approval only. It never executes the action. Execution
continues through the existing explicit, replay-protected step. A conversation
stores the last delivered action reference so short replies remain
deterministic; replies without a selected action fail explicitly. Participant
links are tenant-scoped and must reference an active FoundingOS user before a
decision can be recorded.

Inbound provider IDs are deduplicated before any command is evaluated. If
business state changed but WhatsApp confirmation delivery failed, a provider
retry resends the stored confirmation text without rerunning the command.
Unexpected replies produce state-specific safe next commands and state
explicitly that no unconfirmed action was taken.

Approved participants may then send `EXECUTE` as a separate command. The
execution transaction writes the existing Retail purchase order, Logistics
inbound booking, and Finance scheduled-liability record, then creates one
tenant-scoped `AgentActionExecution` ledger entry. The action status and the
unique execution relation provide replay protection.

`UNDO` runs a deterministic compensation transaction for this internal
workflow: it cancels the supplier order and inbound booking and voids the
scheduled liability. The ledger moves from `completed` to `reversed`, the
compensation is stored, and the Event Feed and workspace audit trail receive a
reversal event. No external payment rail is invoked, and no claim is made that
an external bank or supplier transfer has been reversed.

Cross-tenant pattern learning remains aggregate-only and continues to require
the existing three-tenant anonymity threshold. Messaging payloads never expose
another tenant’s identifiers, suppliers, SKUs, or raw events.
## Governance control surface and measured outcomes

The Core Operations control surface keeps tenant settings, role boundaries, and human-approval rules durable and auditable. Founder/Owner roles manage team membership and governance settings; Managers may approve proposals; Operators work assigned workspace tasks. Execution and reversal remain owner-only, and every action is tenant-scoped.

The Intelligence workspace includes an Outcomes & Value view. It separates measured accuracy and lifecycle-derived value from estimates, exposes learning momentum and reversals, and provides a tenant-scoped governance export that excludes credentials and raw provider data.

The workflow registry now also supports `finance.expense.approval`, `marketing.campaign.launch`, and `finance.budget.reallocation`. Each creates internal records across its coordinating workspaces, requires explicit approval, remains replay-protected, provides a read-only simulation, and compensates internal records only. They never make external payments, publish campaigns, or move funds.

Team onboarding uses tenant-scoped, single-use invitation tokens. Tokens are stored only as SHA-256 hashes, expire after 72 hours, are marked accepted atomically with user creation, and produce an auditable acceptance event. Delivery is provider-ready with a simulated delivery mode for preview environments.
