# FoundingOS — Modular Pricing

Pricing is structured around one FoundingOS account with modular workspaces.
Every plan uses the same primary FoundingOS web and mobile applications.

## Model: base workspaces + suite bolt-ons

Core is bought per base workspace: Retail & Logistics, Talent and HR are each
£19/month and can be taken alone or combined (min. one). Bolt-ons add a suite
and can be added or removed monthly. Complete bundles everything at a discount.
All prices are GBP per tenant per month. Source of truth:
`packages/config/src/commercial.ts`.

| Plan | Price | Users | Includes |
| --- | --- | --- | --- |
| Lite | Free | 1 | Core.Operations basics: sales, orders, customers |
| Core | from £19 | 3 | £19 per base workspace (Retail & Logistics, Talent, HR) + marketing, Brand Studio, WhatsApp |
| Complete | £89 | 15 | All three base workspaces + every bolt-on (£117 bought separately) |
| Enterprise | Custom | 50 | Everything, SSO, SLAs, custom integrations, dedicated support |

Internal tier keys are unchanged so gating and stored licences keep working:
`lite` = Lite, `starter` = Core, `growth` = Complete, `enterprise` = Enterprise.

## Base workspaces (Core plan, £19 each)

| Workspace | Price | Suite | Workspaces enabled | What it unlocks |
| --- | --- | --- | --- | --- |
| Retail & Logistics | £19 | Core.Operations | `retail`, `logistics` | Pipeline, CRM, orders, inventory, deliveries and drivers |
| Talent | £19 | Core.Workforce | `talent` | Recruitment: jobs, candidates, interviews, offers, agency clients and placements |
| HR | £19 | Core.Workforce | `hr` | Employees, contracts, rotas/shifts, timesheets, holiday/sickness, right-to-work, documents, policies, payroll inputs |

## Bolt-ons (Core plan only)

| Bolt-on | Price | Suite | Workspace enabled | What it unlocks |
| --- | --- | --- | --- | --- |
| Commerce Pro | +£25 | Core.Operations | `finance` | Invoicing, mobile money, purchasing, fulfilment, returns, cashflow |
| Core.Intelligence | +£35 | Core.Intelligence | `intelligence` | Signals, forecasts, anomalies, AI recommendations |

## Other add-ons

| Add-on | Price | Availability |
| --- | --- | --- |
| Extra team member | £5/user/month | Core and Complete |
| Language Pack | £5/month | Lite only; all languages included on paid plans |

Logistics is sold as part of the Retail & Logistics base workspace. Health
remains parked and is not sold.

## Usage limits (per month)

| Plan | Messages | Automation events | Mappings |
| --- | --- | --- | --- |
| Lite | 100 | 100 | 50 |
| Core | 1,000 | 500 | 500 |
| Complete | 10,000 | 5,000 | 5,000 |
| Enterprise | Unlimited | Unlimited | Unlimited |

## Messaging channels

- **WhatsApp first:** Core Operations includes Meta WhatsApp Cloud API webhook
  verification, request-signature validation, configured outbound text delivery,
  and WhatsApp delivery-notification workflows.
- **Configuration required:** each production customer connects approved Meta
  credentials and completes the relevant WhatsApp Business onboarding.
- **Additional channels:** Telegram, SMS, Messenger, Instagram, email, Slack,
  and RCS share a channel-adapter contract. They remain labelled planned or
  integration-ready until provider transport, inbound processing, observability,
  and delivery tests are complete.

## What changed from the old model

- Previously: legacy brands had separate pricing, product, and checkout
  surfaces.
- Now: **one** pricing page (`foundingos.com/pricing`) presents one account,
  a base plan, three suite bolt-ons, and a Complete bundle.
- Deprecated products no longer have independent pricing.

## Config wiring

Pricing tiers reference the same `SuiteKey` values as
[feature-flags.md](./feature-flags.md) (`core_operations`,
`core_workforce`, `core_intelligence`) so that a completed checkout maps
directly to a `TenantSuiteLicense` row — no separate brand-to-suite
translation layer needed.

## Self-serve sign-up

Lite, Core and Complete are self-serve at `foundingos.com/signup?plan=lite|core|complete`
(`&base=retail|talent|hr` preselects a base workspace, `&add=<bolt-on key>` a bolt-on); only Enterprise routes to `/contact`.
The sign-up API (`apps/foundingos-web/app/api/signup/route.ts`) creates the tenant
through the Core.Operations `/platform/bootstrap` endpoint with only the purchased
workspaces enabled, then sends paid plans to Stripe Checkout with one line item
per base workspace (or Complete), bolt-on, and extra-seat quantity.

Required production settings on `founding-os-web` (plus `PLATFORM_BOOTSTRAP_TOKEN`
on both `founding-os-web` and `core-operations-backend`):

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_COMPLETE` (£89)
- Base workspaces: `STRIPE_PRICE_CORE` (Retail & Logistics), `STRIPE_PRICE_TALENT`, `STRIPE_PRICE_HR` — all £19
- `STRIPE_PRICE_COMMERCE_PRO` (£25), `STRIPE_PRICE_INTELLIGENCE` (£35)
- `STRIPE_PRICE_EXTRA_SEAT` (£5, per-unit)

If any price needed for a sign-up is missing, the account is still created but
no payment is taken. Cancelled or failed subscriptions do not yet disable
workspaces automatically.

## Open item

The £19 Core, bolt-on, and £89 Complete prices are the currently configured launch
prices. They still require commercial validation before paid acquisition is
scaled; changes must be made in `packages/config/src/commercial.ts` first.
