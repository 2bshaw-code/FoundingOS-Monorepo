# FoundingOS — Modular Pricing

Pricing is structured around the three Core suites, not legacy brands.
Each suite is independently licensable; bundles offer a discount.

## Suite pricing (per tenant / per month, illustrative — Sales/Finance to
confirm final numbers before publishing)

| Suite | Starter | Growth | Enterprise |
| --- | --- | --- | --- |
| Core.Operations | $49 | $149 | Custom |
| Core.Workforce | $39 | $119 | Custom |
| Core.Intelligence | $29 | $99 | Custom |

## Bundle discounts

| Bundle | Discount vs. à la carte |
| --- | --- |
| Any 2 suites | 15% off combined list price |
| All 3 suites ("FoundingOS Complete") | 25% off combined list price |

## Plan tier definitions (apply across all suites)

- **Starter** — single user or small team, core workflows only, community
  support.
- **Growth** — team seats, automation features, priority support,
  advanced reporting inside the suite.
- **Enterprise** — custom seats/SLA, SSO, dedicated support, custom
  integrations, procurement/security review support.

## What changed from the old model

- Previously: each brand (CoreOperations, CoreOperations, CoreIntelligence, CoreWorkforce,
  CoreOperations, ...) had its own pricing page, own starter console, and own
  checkout. This created nine independent pricing surfaces.
- Now: **one** pricing page (`foundingos.com/pricing`) lists three suites
  and two bundle options. Buyers choose suites, not brands.
- CoreOperations and CoreOperations pricing is removed entirely (deprecated
  products). CoreIntelligence pricing becomes Core.Intelligence pricing, with

## Config wiring

Pricing tiers reference the same `SuiteKey` values as
[feature-flags.md](./feature-flags.md) (`core_operations`,
`core_workforce`, `core_intelligence`) so that a completed checkout maps
directly to a `TenantSuiteLicense` row — no separate brand-to-suite
translation layer needed.

## Open item

Final numeric pricing requires Finance/Sales sign-off before publishing
externally; treat the table above as a structural placeholder, not
approved pricing copy.
