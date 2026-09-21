# FoundingOS — Shared Schema

Canonical data model shared across Core.Operations, Core.Workforce, and
Core.Intelligence. This supersedes the previous per-brand Prisma schemas
(`core_operations`, `foundmeat`, `foundthis`/`core_intelligence`, `core_workforce`,
`foundcrypto`, `founder_os`).

## Design rules

1. **One database, one Prisma schema.** No more per-brand databases or
   per-brand `schema.prisma` files. All suites read/write through
   `packages/db`.
2. **Table prefixes replace database-per-brand isolation.** Suite-owned
   tables use a prefix; shared/platform tables have no prefix.
3. **Tenant isolation via `tenantId`, not separate schemas.** Every
   suite-owned table carries a `tenantId` foreign key to `Tenant`. Row-level
   scoping replaces the old brand-per-database model, which is required for
   modular pricing (a tenant may license one, two, or three suites).
4. **No table, column, or migration name may reference a deprecated brand**
   forward. Existing tables are tracked in [migration-map.md](./migration-map.md).

## Shared / platform tables (no prefix)

| Table | Purpose |
| --- | --- |
| `Tenant` | One row per customer organization. Replaces implicit "brand = tenant" model. |
| `TenantSuiteLicense` | Which suites (`core_operations`, `core_workforce`, `core_intelligence`) a tenant has licensed, plus plan tier. Drives feature flags. |
| `User` | Platform-wide user identity. |
| `AuthUser` / `AuthSession` / `PasswordReset` | Unified auth (unchanged from [AUTHENTICATION.md](../AUTHENTICATION.md)), now tenant-scoped instead of brand-scoped. |
| `Subscription` | Billing subscription, references `TenantSuiteLicense`. |
| `ActivityLog` | Cross-suite audit/activity trail. |
| `TelemetryEvent` | Shared telemetry sink (see [telemetry.md](./telemetry.md)). |
| `TenantBrandProfile` | Versioned company identity, logo, colours, typography, legal/contact details, locale, currency, payment terms, social links, and brand voice. Supplies orders, invoices, receipts, campaigns, emails, and customer documents. |
| `BrandedDocument` | Immutable rendered order/invoice output with the exact brand profile version, full brand-profile snapshot, source-record snapshot, and generation timestamp. |
| `MessagingChannelConnection` | Maps a provider account (for example a WhatsApp phone-number ID) to one tenant without storing provider secrets in business records. |
| `MessagingParticipant` | Tenant-scoped authorized channel identity with a least-privilege operational role. |
| `MessagingConversation` | Durable channel-neutral conversation state and last-message context. |
| `MessagingMessage` | Idempotent inbound/outbound message record keyed by provider message ID, including direction, type, intent, status, and raw provider context. |

Brand voice rules are enforced at the write boundary for campaigns, social
posts, and generated media. Approved and prohibited terminology cannot overlap;
content containing a prohibited term is rejected rather than silently saved.

## Core.Operations tables (`core_ops_` prefix)

Replaces `core_operations` schema.

| Table | Notes |
| --- | --- |
| `core_ops_customer` | Was `core_operations.Customer` |
| `core_ops_order` | Was `core_operations.Order` |
| `core_ops_inventory_item` | Was `core_operations.InventoryItem` / `Product` |
| `core_ops_invoice` | Was `core_operations.Invoice` |
| `core_ops_delivery` | Was `core_operations.Delivery` |
| `core_ops_marketing_campaign` | Was `core_operations.MarketingCampaign` |

## Core.Workforce tables (`core_workforce_` prefix)

Replaces `core_workforce` schema.

| Table | Notes |
| --- | --- |
| `core_workforce_applicant` | Was `core_workforce.Applicant` |
| `core_workforce_job` | Was `core_workforce.Job` |
| `core_workforce_recruiter` | Was `core_workforce.Recruiter` |
| `core_workforce_intel_metric` | Was `core_workforce.WorkforceIntel` |

## Core.Intelligence tables (`core_intel_` prefix)

Replaces the first-party analytics portion of `foundthis`/`core_intelligence`.

| Table | Notes |
| --- | --- |
| `core_intel_kpi_snapshot` | Founder/owner KPI rollups |
| `core_intel_funnel_stage` | Funnel analytics |
| `core_intel_report` | Saved/scheduled reports |

## Deprecated tables (do not migrate; drop after archival export)

| Table | Reason |
| --- | --- |
| `foundmeat.*` (Supplier, Stock, Traceability, MeatOrder) | Brand deprecated |
| `foundcrypto.*` (Chart, Signal, AutomationRule, RiskProfile) | Brand deprecated |

## Multi-tenancy & isolation (current implementation)

The schema above describes the target `Tenant`/`tenantId` model. The
Prisma schema actually deployed today (`packages/db/prisma/schema.prisma`)
predates that rename and still uses `Brand`/`brandId` (FK-based tables:
`User`, `Module`, `Subscription`, `ActivityLog`) and `brandSlug` (string-keyed
tables: `BrandSubscription`, `CrmDeal`, `BrandFinance`, `AccountingInvoice`).
Both are the same concept — one row per tenant/customer organization — under
the older name; treat `brandId`/`brandSlug` as synonyms for `tenantId` until
the rename lands.

Isolation today is **pooled**: every tenant's rows live in the same
PostgreSQL database and tables, distinguished only by that discriminator
column. As of migration `20260902100000_tenant_isolation_rls`, isolation is
enforced at two layers, not one:

1. **Application layer (existing)** — every query passes an explicit
   `where: { brandId }` / `where: { brandSlug }` filter.
2. **Database layer (new, defense-in-depth)** — Postgres Row-Level Security
   is enabled and forced on every tenant-scoped table. A policy on each table
   only allows rows matching two session-local settings,
   `app.current_brand_id` / `app.current_brand_slug`, set per-transaction. If
   application code ever forgets the `WHERE` filter, the database itself
   still refuses to return or write another tenant's rows.

All tenant-scoped reads/writes must go through the helpers in
`packages/db/src/index.ts`:

- `withTenantScope({ brandId, brandSlug }, callback)` — sets the two session
  GUCs for the given tenant before running `callback`, so RLS scopes the
  query to that tenant only. Use this in every per-tenant request handler.
- `withAdminBypass(callback)` — sets `app.bypass_rls = 'on'`, allowing the
  callback to see every tenant's rows. Reserved for genuinely cross-tenant
  reads (SuperDash rollups such as `readRealPipelineRollup`,
  `readAllBrandSubscriptions`) — never call this from a handler that took a
  brandId/brandSlug from the current request.

`AnomalyLog`, `EngagementLog`, `BrandMetric`, and `DriftLog` are intentionally
excluded from RLS — they are cross-brand admin/portfolio rollup tables, not
per-tenant application data.

### Dedicated database per large tenant (`Brand.dataTier`)

`Brand.dataTier` (`pooled` default, or `dedicated`) is the flag a large or
contractually-sensitive tenant is promoted to when the shared pool is no
longer appropriate — either for scale (a very large tenant's volume/locks
would otherwise affect every other tenant sharing the same tables) or for a
buyer's data-residency requirement. Provisioning path for a `dedicated`
tenant:

1. Stand up a new Postgres instance/database and run the same Prisma
   migrations against it (schema is identical — no per-tenant schema drift).
2. Backfill that tenant's rows from the pooled database into the dedicated
   one, then delete them from the pool.
3. Route that tenant's connection string (`DATABASE_URL`) to the dedicated
   instance at the connection-pooling layer, keyed off `Brand.dataTier` /
   `Brand.slug`, instead of the shared pool's URL. (This routing layer does
   not exist yet — `dataTier` is currently just the provisioning flag; wiring
   per-tenant connection routing is the next step once a tenant actually
   needs this tier.)

## Migration approach

1. Stand up the new shared schema in `packages/db` alongside the existing
   per-brand schemas (already scaffolded; see
   [FOUNDEROS_NEXT_README.md](../FOUNDEROS_NEXT_README.md)).
2. Write one-time backfill scripts per legacy schema → new prefixed tables
   for Core.Operations and Core.Workforce data (Core.Intelligence data is
   derived, not migrated).
   any customer-contractual retention window, then drop those schemas.
4. Cut over reads/writes suite-by-suite behind the feature flags in
   [feature-flags.md](./feature-flags.md).

No migration has been created or run as part of this pass — see
"Remaining blockers" in [restructure-summary.md](./restructure-summary.md).
