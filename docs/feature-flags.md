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
- The console shell reads licenses once at session start and renders only
  licensed suite modules in navigation; unlicensed suites are hidden, not
  shown-and-disabled (avoids advertising unpurchased functionality inside
  the product — that's a marketing-site job, not a console job).
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
