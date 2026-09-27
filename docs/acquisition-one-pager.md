# FoundingOS — Acquisition One-Pager

## What it is

FoundingOS is the operating system for founder-run businesses — one core
platform with three product suites (**Core.Operations**,
**Core.Workforce**, **Core.Intelligence**) that replace a stack of
disconnected point tools with a single system of record for customers,
people, and decisions. *(Locked positioning — see
[positioning.md](./positioning.md).)*

## The consolidation thesis

FoundingOS began as nine separate brand products — FoundRetail, FoundMeat,
FoundThat, FoundTalent, FoundCrypto, FoundFinance, FoundHealth,
FoundLogistics, and the original FoundingOS shell itself — each with its
own website, console, database, and pricing page. This restructure
collapses that surface area into one brand and three suites, sharing one
auth system, one console shell, one schema, and one telemetry pipeline.
The result: lower operating cost per customer, one sales motion, one
support surface, and a coherent story for a buyer.

## Suite summary

| Suite | What it does | Origin |
| --- | --- | --- |
| **Core.Operations** | Customers, orders, inventory, billing, delivery, messaging-first commerce | Formerly FoundRetail, FoundFinance, FoundHealth, FoundLogistics |
| **Core.Workforce** | Applicants, recruiters, jobs, workforce intelligence | Formerly FoundTalent |
| **Core.Intelligence** | Founder/owner analytics, KPIs, funnels, reporting, decision support | Formerly FoundThat (scraping-based) — rebuilt on first-party data |

## What was removed and why

- **FoundMeat** (vertical meat-trade product) and **FoundCrypto** (crypto
  trading/signals) — narrow verticals outside the founder-run operating
  system thesis; removed to focus the platform and reduce regulatory/
  legal surface area (terms-of-service risk, unclear data-processing
  basis, trademark risk) and because they undermined a "trusted system of
  record" positioning.
- **FoundThat's scraping-based data collection** — third-party scraping
  created legal exposure and unreliable data quality; removed and
  replaced with first-party operational analytics retained under
  Core.Intelligence. See [deprecations.md](./deprecations.md).

## Architecture snapshot

One brand, one console shell, one shared auth/config/db backbone, one
Postgres database with suite-prefixed tables and tenant-scoped rows. Full
diagram: [architecture.md](./architecture.md).

## What the product does today

- **Web app and iOS/Android app** on one tenant-isolated PostgreSQL backbone — the
  same records on every device.
- **Core.Operations** — Retail & Logistics (pipeline, CRM, quotes, orders, POS,
  returns, inventory with shared product photos, deliveries and drivers), Commerce Pro
  (invoices, aged debt, purchasing, cashflow) and Marketing (campaigns, social
  publishing).
- **Core.Workforce** — Talent (jobs, candidates, interviews, offers, placements) and HR
  (onboarding, rotas, timesheets, holiday, right-to-work).
- **Core.Intelligence** — signals, forecasts, anomalies and reports on first-party data.
- **FoundAI and Autopilot** — AI answers and proposed actions in the app and on
  WhatsApp, with human approval, an audit trail and reversal. No autonomous money
  movement.
- **SuperDash** — founder view of subscriptions, estimated MRR/ARR, upgrade requests,
  platform health, finance ledger, marketing and private customer ratings.
- **Billing** — Stripe Checkout and signed webhooks; paid workspaces switch on only for
  active or trialling subscriptions and fall back to free Lite otherwise.
- **Privacy** — published privacy and cookie notice; only necessary and preference
  storage; no advertising trackers or third-party scraping.

- **Health** — patients, appointments, records, referrals, care plans and compliance
  for clinics, care providers and pharmacies (£19 base workspace).

## Commercial model

Subscription SaaS priced per workspace: free **Lite**; **Core** from £19 per base
workspace (Retail & Logistics, Talent, HR, Health) with bolt-ons (+£25 Commerce Pro, +£35
Core.Intelligence); **Complete** £89 for everything; **Enterprise** custom; £5 per extra
user. See [pricing.md](./pricing.md) and [feature-flags.md](./feature-flags.md).

## Consolidation status

| Area | Before | Now |
| --- | --- | --- |
| Brands | 9 brand products | 1 brand (FoundingOS), 3 suites |
| Customer apps | Per-brand sites and consoles | 1 web app, 1 mobile app, 1 founder SuperDash |
| Pricing | Per-brand | 1 pricing page, modular workspaces |
| Data | Per-brand schemas | 1 shared, tenant-scoped backend for web and mobile |

Remaining clean-up (legacy console directories and table renames) is tracked in
[restructure-summary.md](./restructure-summary.md) and
[migration-map.md](./migration-map.md).

## Traction and valuation evidence

The product is built; valuation depends on traction the founder supplies from SuperDash
and Stripe. This document does not state or estimate these figures.

- Paying customers and MRR/ARR
- Monthly retention and churn
- Weekly active companies and Lite-to-paid upgrade rate
- Customer ratings and case studies
- Acquisition cost and payback
- Team, runway and 12-month plan

## Why this matters for a buyer

- **Reduced integration risk** — one auth system, one schema, one API
  contract instead of nine.
- **Reduced legal/compliance risk** — no crypto trading liability, no
  vertical-specific meat-trade compliance surface, no third-party
  scraping exposure.
- **Expansion-ready** — modular suite licensing supports land-and-expand
  motion without re-platforming.
- **Documented, auditable transition** — every rename, removal, and schema
  change is mapped ([migration-map.md](./migration-map.md)) rather than
  ad hoc.
