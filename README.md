# FoundingOS

FoundingOS is the unified operating system for founder-run businesses, centered on three suites: Core.Operations, Core.Workforce, and Core.Intelligence.

Positioning statement: FoundingOS gives founder-led companies one shared operating layer for operations, workforce, and intelligence so they can run the business, manage the team, and make decisions from the same system instead of stitching together brand-specific tools.

This repository is organized around the shared FoundingOS platform rather than the legacy brand silo model. FoundMeat, FoundCrypto, and the FoundThat scraping engine are explicitly deprecated and are not treated as active product surfaces in the current platform architecture.

## Active suites

| Suite | Purpose | Primary console |
| --- | --- | --- |
| Core.Operations | retail operations, orders, messaging, and business control | `founder-os` / console |
| Core.Workforce | workforce workflows, staffing, and hiring operations | `founder-os` / console |
| Core.Intelligence | first-party signals, lead intelligence, and reporting | `founder-os` / console |

## Deprecated products

- FoundMeat: deprecated and removed from active API/module references.
- FoundCrypto: deprecated and removed from active API/module references.
- FoundThat scraping: deprecated. First-party intelligence is the active path.

## Shared packages

- `@founder-os/auth`: auth, RBAC, and access-policy helpers
- `@founder-os/bob`: AI operator and workflow integration
- `@founder-os/ui`: shared React primitives
- `@founder-os/brand-assets`: shared mark assets
- `@founder-os/media`: media contracts and helpers

## Repository posture

This is a working monorepo, not a one-shot rewrite. The current goal is to preserve unrelated work while consolidating the active platform around FoundingOS, its three current suites, and the product boundaries already documented in the restructure notes.
