# FoundingOS — API & Integration Review

## Scope reviewed

- `founder-os/backend/src/routes.ts` (platform/founder API)
- `core_workforce/backend/src/routes.ts`
- Shared conventions in [ROUTING.md](../ROUTING.md) and
  [AUTHENTICATION.md](../AUTHENTICATION.md)

## Findings

### 1. Shared conventions are already solid — keep them

- `GET /health`, `GET /api/v1/status`, resources under `/api/v1/*`, and the
  shared `/api/v1/auth/*` router are consistent across backends. This
  pattern should be the backbone contract for Core.Operations,
  Core.Workforce, and Core.Intelligence services (see
  [shared-backbone.md](./shared-backbone.md) §2.5).
- Request IDs, structured errors, security headers, rate limiting, and CORS
  are already implemented per [MARKET_LAUNCH_GATE.md](../MARKET_LAUNCH_GATE.md).
  No changes recommended to that layer.


():

- `GET /merchants`, `GET /products`, `GET /listings` — all backed by
  deleted, not renamed.
  endpoints. Delete.
  source CRUD and scheduler control. Delete along with
  side effect must not silently disappear** — any customer relying on
  first-party alternative (e.g. manual lead import, or Core.Operations
  lead capture forms) before the route is removed. Flagged as a product
  decision, not just an engineering one.
- Claim/rehome endpoints (`.../claim`, `.../rehome`) operate on

**Recommendation:** do not delete these files in the same change that
removes them from routing — first confirm no active integration/customer
depends on them (see blockers), then remove route registration, then
delete the implementation files and Prisma models in a dedicated change.

### 3. Founder platform routes — mostly fine, needs suite renaming

`founder-os/backend/src/routes.ts` aggregates brand data (including a
`core_intelligenceFeed.ts` import) for founder-level dashboards. Once CoreIntelligence

### 4. CoreWorkforce routes — rename only

dependencies in this review; it's a rename-and-move candidate to
Core.Workforce with no functional risk identified.

### 5. Integrations to re-verify after suite consolidation

- **Meta WhatsApp** (`WHATSAPP_ACCESS_TOKEN`, etc.) — used by
  Core.Operations messaging workflows; unaffected by this restructure,
  keep as-is.
- **Payment provider** — not yet selected per
  [MARKET_LAUNCH_GATE.md](../MARKET_LAUNCH_GATE.md) item 8; must be wired
  to `TenantSuiteLicense`/`Subscription` (see
  [shared-schema.md](./shared-schema.md)), not per-brand billing.
- **Password reset webhook** (`PASSWORD_RESET_WEBHOOK_URL`) — shared,
  unaffected.

## Action items (not yet executed — see restructure-summary.md)

   before deleting `core_operationsLeadSync.ts`.
4. Re-point `core_intelligenceFeed.ts` at first-party Core.Intelligence data.
5. Rename route prefixes per [migration-map.md](./migration-map.md).
