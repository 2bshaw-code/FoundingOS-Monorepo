# FoundingOS — Modular Pricing

Pricing is structured around one FoundingOS account with modular workspaces.
Every plan uses the same primary FoundingOS web and mobile applications.

## Model: base plan + suite bolt-ons

Every business starts on a base plan. Bolt-ons add a suite to the Core base
and can be added or removed monthly. Complete bundles everything at a discount.
All prices are GBP per tenant per month. Source of truth:
`packages/config/src/commercial.ts`.

| Plan | Price | Users | Includes |
| --- | --- | --- | --- |
| Lite | Free | 1 | Core.Operations basics: sales, orders, customers |
| Core | £19 | 3 | Core.Operations: pipeline, CRM, orders, inventory, customers, WhatsApp, marketing, Brand Studio |
| Complete | £89 | 15 | Core + all three bolt-ons (£108 bought separately, ~18% off) |
| Enterprise | Custom | 50 | Everything, SSO, SLAs, custom integrations, dedicated support |

Internal tier keys are unchanged so gating and stored licences keep working:
`lite` = Lite, `starter` = Core, `growth` = Complete, `enterprise` = Enterprise.

## Bolt-ons (Core plan only)

| Bolt-on | Price | Suite | Workspace enabled | What it unlocks |
| --- | --- | --- | --- | --- |
| Commerce Pro | +£25 | Core.Operations | `finance` | Invoicing, mobile money, purchasing, fulfilment, returns, cashflow |
| Core.Workforce | +£29 | Core.Workforce | `talent` | Hiring, onboarding, time off, performance, payroll inputs |
| Core.Intelligence | +£35 | Core.Intelligence | `intelligence` | Signals, forecasts, anomalies, AI recommendations |

## Other add-ons

| Add-on | Price | Availability |
| --- | --- | --- |
| Extra team member | £5/user/month | Core and Complete |
| Language Pack | £5/month | Lite only; all languages included on paid plans |

Industry offers (retail, logistics, health) are marketing pages that recommend
a combination of Core and bolt-ons, not separate plans. Logistics and Health
workspaces remain parked and are not sold.

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
(`&add=<bolt-on key>` preselects a bolt-on); only Enterprise routes to `/contact`.
The sign-up API (`apps/foundingos-web/app/api/signup/route.ts`) creates the tenant
through the Core.Operations `/platform/bootstrap` endpoint with only the purchased
workspaces enabled, then sends paid plans to Stripe Checkout with one line item
per plan, bolt-on, and extra-seat quantity.

Required production settings on `founding-os-web` (plus `PLATFORM_BOOTSTRAP_TOKEN`
on both `founding-os-web` and `core-operations-backend`):

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_CORE` (£19), `STRIPE_PRICE_COMPLETE` (£89)
- `STRIPE_PRICE_COMMERCE_PRO` (£25), `STRIPE_PRICE_WORKFORCE` (£29), `STRIPE_PRICE_INTELLIGENCE` (£35)
- `STRIPE_PRICE_EXTRA_SEAT` (£5, per-unit)

If any price needed for a sign-up is missing, the account is still created but
no payment is taken. Cancelled or failed subscriptions do not yet disable
workspaces automatically.

## Open item

The £19 Core, bolt-on, and £89 Complete prices are the currently configured launch
prices. They still require commercial validation before paid acquisition is
scaled; changes must be made in `packages/config/src/commercial.ts` first.
