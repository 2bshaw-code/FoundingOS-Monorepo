# FoundingOS — Deprecations

Record of legacy brands, code paths, and infrastructure removed or
superseded during the FoundingOS restructure. See
[migration-map.md](./migration-map.md) for the full directory/route/env/table
rename tables and [suite-and-module-architecture.md](./suite-and-module-architecture.md)
for the current suite model these deprecations were folded into.

## Removed brands

| Legacy brand | Status | Notes |
|---|---|---|
| **FoundMeat** | Fully removed | No app root, backend, frontend, or mobile app remains in `apps/`. The `meat` entry in `packages/config/src/index.ts`'s legacy brand registry is retained only so old lookups by `BrandSlug` don't throw, and is explicitly labelled `FoundMeat (deprecated)` — it must not be surfaced in navigation, marketing pages, or mobile apps. Listed in `packages/config/src/suites.ts`'s `deprecatedBrands`. |
| **FoundCrypto** | Fully removed | Same treatment as FoundMeat: no live app, legacy registry entry labelled `FoundCrypto (deprecated)`, listed in `deprecatedBrands`. |
| **FoundThat scraping** | Removed | Scraping-based data collection for the CRM/intelligence surface (formerly FoundThat) has been disabled. `SCRAPING_DISABLED=true` is set in both `.env.demo` and `production.example.env` and is treated as a hard kill switch, not a suggestion — no code path should perform third-party scraping regardless of environment. |

## Superseded (not removed, but no longer primary)

- **Per-brand consoles** (`apps/*-console`, `apps/*-console-starter`) — superseded
  by the unified FoundingOS console shell (`apps/foundingos-web`) with
  suite-based, feature-flagged navigation. Legacy per-brand console
  directories remain in the tree during the migration window; see
  [migration-map.md](./migration-map.md) for their disposition.
- **Legacy brand registry** (`packages/config/src/index.ts`) — superseded by
  the suite registry (`packages/config/src/suites.ts`) for anything
  customer-facing (pricing, feature flags, console navigation). The legacy
  registry is retained only for backward-compatible lookups during
  migration; new code should use the suite registry.
- **`shared/ui/components/BrandLogo.tsx`, `shared/ui/components/BrandCard.tsx`,
  `shared/ui/src/index.tsx`** — not imported by any app in this repository.
  Retained for historical reference only; do not add new imports.

## Verification

- `npm run build` (root) runs a brand-asset and SuperDashboard-isolation
  verification step that fails if forbidden legacy brand symbols
  (e.g. hardcoded FoundMeat/FoundCrypto logos) are used in place of the
  current FoundingOS/Core-suite assets.
- `git diff --check` is expected to pass with no whitespace errors.
- Any new PR that reintroduces a `foundmeat-mobile`/`foundcrypto-mobile` app
  root, restores scraping code, or removes the `(deprecated)` labelling from
  the legacy brand registry should be treated as a regression.
