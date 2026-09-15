# FoundingOS — Acquisition One-Pager

## What it is

FoundingOS is the operating system for founder-run businesses — one core
platform with three product suites (**Core.Operations**,
**Core.Workforce**, **Core.Intelligence**) that replace a stack of
disconnected point tools with a single system of record for customers,
people, and decisions. *(Locked positioning — see
[positioning.md](./positioning.md).)*

## The consolidation thesis

FoundingOS began as nine separate brand products (CoreOperations, CoreOperations,
CoreIntelligence, CoreWorkforce, CoreOperations, CoreOperations, CoreOperations,
CoreOperations, CoreIntelligence) each with its own website, console, database, and
pricing page. This restructure collapses that surface area into one brand
and three suites, sharing one auth system, one console shell, one schema,
and one telemetry pipeline. The result: lower operating cost per customer,
one sales motion, one support surface, and a coherent story for a buyer.

## Suite summary

| Suite | What it does | Origin |
| --- | --- | --- |
| **Core.Operations** | Customers, orders, inventory, billing, delivery, messaging-first commerce | Formerly CoreOperations |
| **Core.Workforce** | Applicants, recruiters, jobs, workforce intelligence | Formerly CoreWorkforce |

## What was removed and why

- **CoreOperations** (vertical meat-trade product) and **CoreOperations**
  (crypto trading/signals) — narrow verticals outside the founder-run
  operating system thesis; removed to focus the platform and reduce
  regulatory/legal surface area.
  legal exposure (terms-of-service risk, unclear data-processing basis,
  trademark risk) and undermined a "trusted system of record" positioning.
  Removed; first-party analytics retained under Core.Intelligence. See
  .

## Architecture snapshot

One brand, one console shell, one shared auth/config/db backbone, one
Postgres database with suite-prefixed tables and tenant-scoped rows. Full
diagram: [architecture.md](./architecture.md).

## Commercial model

Suites are licensed independently or bundled (15% off for 2, 25% off for
all 3 — "FoundingOS Complete"). See [pricing.md](./pricing.md) and
[feature-flags.md](./feature-flags.md) for how licensing maps to product
access.

## Current state vs. target state

| Area | Current | Target |
| --- | --- | --- |
| Brands | 9 active brand trees in repo | 1 brand, 3 suites |
| Databases/schemas | Per-brand schemas | 1 schema, prefixed tables |
| Consoles | Per-brand console + starter console (18+ apps) | 1 console shell, 3 modules |
| Pricing pages | Per-brand | 1 pricing page, 3 suites, 2 bundles |

This pass (see [restructure-summary.md](./restructure-summary.md)) locked
positioning, defined the shared backbone/schema/architecture, documented
deprecations and the API/integration review, and wired the suite/feature-
flag registry in code. Physical directory removal and full schema
migration are the next execution phase.

## Why this matters for a buyer

- **Reduced integration risk** — one auth system, one schema, one API
  contract instead of nine.
  trading liability, no vertical-specific meat-trade compliance surface.
- **Expansion-ready** — modular suite licensing supports land-and-expand
  motion without re-platforming.
- **Documented, auditable transition** — every rename, removal, and schema
  change is mapped ([migration-map.md](./migration-map.md)) rather than
  ad hoc.
