# FoundingOS — Buyer Feature Flags & Config

FoundingOS is sold as one platform with three independently licensable
suites. Feature flags gate suite access per tenant; they are not
per-brand toggles anymore.

## Flag model

```ts
type SuiteKey = 'core_operations' | 'core_workforce' | 'core_intelligence'

interface TenantSuiteLicense {
  tenantId: string
  suite: SuiteKey
  planTier: 'lite' | 'starter' | 'growth' | 'enterprise'
  enabled: boolean
  seats?: number
  trialEndsAt?: string | null
}
```

- A tenant's available console modules = the set of `TenantSuiteLicense`
  rows with `enabled: true`.
- **Mobile** (`apps/foundingos-mobile`) implements this today: the tab bar
  reads `licensedSuites` (populated from the real
  `/module-access/:tenantId/:suite` check) and hides unlicensed suite tabs —
  unlicensed suites are hidden, not shown-and-disabled (avoids advertising
  unpurchased functionality inside the product — that's a marketing-site
  job, not a console job).
- **The per-suite web consoles** (`apps/core-operations-console`,
  `apps/core-workforce-console`, `apps/core-intelligence-console`) are each
  scoped to a single suite already, so there is no cross-suite hide/show
  decision to make there — the open question for those apps is
  *within-suite* module gating by `planTier`, covered below.
- Plan tier gates feature-level flags *within* a suite (e.g. "advanced
  marketing automation" only on `growth`/`enterprise` inside
  Core.Operations).
- Lite is a free, one-seat, low-data entry tier. It exposes basic Core
  Operations records, manual refresh, and offline-tolerant capture. Automatic
  synchronisation, automation, and advanced reporting remain paid capabilities.
- All supported languages are included from Starter upward. Lite workspaces
  can enable the complete language set through the Language Pack add-on.

## Buyer-facing subsets

| Buyer profile | Suites typically licensed |
| --- | --- |
| Solo operator / low-data trial | Core.Operations Lite |
| Small team / starter | Core.Operations only |
| Growing team with hiring needs | Core.Operations + Core.Workforce |
| Data-driven operator | Core.Operations + Core.Intelligence |
| Full platform | All three suites |

Core.Workforce and Core.Intelligence can each be sold standalone (e.g. an
agency that only wants workforce analytics), but Core.Operations is the
recommended anchor suite in sales motion since it's the highest-frequency
daily-use surface.

## Config source of truth

`packages/config/src/suites.ts` (see code change in this pass) replaces the
old flat `brands` registry for anything customer-facing. The legacy
`packages/config/src/index.ts` `brands` map is kept for backward
compatibility during transition but is marked deprecated for

## Environment-driven flags (non-tenant, deployment-level)

| Env var | Purpose |
| --- | --- |
| `OPS_ENABLED` | Deploy-time Core.Operations kill switch, default `true` |
| `WORK_ENABLED` | Deploy-time Core.Workforce kill switch, default `true` |
| `INT_ENABLED` | Deploy-time Core.Intelligence kill switch, default `true` |
| `FOUNDINGOS_ENABLE_LEGACY_BRAND_ROUTES` | Serves legacy brand redirect routes during transition; default `true`, target `false` after migration window |

Deployment-level flags gate whether a suite can be enabled *at all* in an
environment; tenant-level `TenantSuiteLicense` rows gate whether a specific
tenant *has* it.

## Module-tier gating within a suite (Phase 27)

`TenantSuiteLicense.planTier` is one value per suite (`lite`/`starter`/
`growth`/`enterprise`) — there is no per-module column persisted anywhere.
To give the per-suite web consoles something real to filter navigation
against, `packages/config/src/suites.ts` now exports:

- `PLAN_TIER_RANK` — an ordering over the four tiers.
- `moduleMinTier` — an initial, adjustable mapping of nav-module label →
  minimum required tier per suite, derived from this file's tier
  descriptions above (not a separately-agreed commercial policy — update
  both together if either changes).
- `isModuleVisibleAtTier(suite, moduleLabel, planTier)` — the check itself.

`packages/ui/src/sidebar.tsx` (the shared `Sidebar` used by all three
per-suite consoles) accepts an optional `planTier` prop and filters its nav
items through `isModuleVisibleAtTier` when supplied. **Fallback**: with no
`planTier` (the case for all three consoles today), every module stays
visible — identical to pre-Phase-27 behavior.

**Known blocker**: none of the three per-suite consoles
(`apps/core-{operations,workforce,intelligence}-console`) currently have any
session/tenant identification at all — `middleware.ts` in each is a no-op,
and no page reads a cookie, token, or tenant ID. So there is currently no
safe way to source a real `planTier` to pass into `Sidebar` without first
building session/auth plumbing for these apps (a materially larger effort
than this pass's scope). The capability above is real and tested, but
wiring it to a live tenant session is left as follow-up work, not faked with
a hardcoded tenant.
