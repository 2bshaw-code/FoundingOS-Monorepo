# FoundingOS — Modular Pricing

Pricing is structured around one FoundingOS account with modular workspaces.
Every plan uses the same primary FoundingOS web and mobile applications.

## Current configured pricing (per tenant / per month)

| Plan | Monthly base price | Included suites | Positioning |
| --- | --- | --- | --- |
| Lite | Free | Retail basics | One user, low-data workflows, manual refresh |
| Starter | £29 | Core Operations | Three users, Retail and core operating workspaces, WhatsApp content and delivery messaging |
| Growth | £99 | All three cores | Fifteen users, every workspace, WhatsApp-first automation, channel-ready workflows, intelligence |
| Enterprise | Custom | All three cores | SSO, custom integrations, governance, dedicated support |

## Add-ons

| Add-on | Price | Availability |
| --- | --- | --- |
| Language Pack | £5/month | Lite only; all supported languages are included from Starter upward |

## Brand Studio

- Lite includes basic company identity on customer documents.
- Starter adds the complete Brand Studio: logo, colour system, typography,
  legal/contact details, document defaults, and branded order/invoice output.
- Growth adds brand-aware AI campaign content and multi-channel automation.
- Enterprise adds approval workflows, regional governance, and custom asset
  storage/integration support.

## Application and workspace access

| Plan | Application | Enabled workspaces |
| --- | --- | --- |
| Lite | FoundingOS web + FoundingOS mobile | Retail basics |
| Starter | FoundingOS web + FoundingOS mobile | Retail, Orders, Inventory, Customers, Basic Finance, Brand Studio |
| Growth | FoundingOS web + FoundingOS mobile | Retail, Logistics, Finance, Marketing, Talent, Health, Core Intelligence |
| Enterprise | FoundingOS web + FoundingOS mobile | All current and future workspaces |

The five historical mobile apps are transitional implementations, not separate
products included or excluded by plan. The target is one primary FoundingOS
mobile app with role-based workspace switching.

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

## Plan tier definitions (apply across all suites)

- **Lite** — free one-user access to basic records, manual refresh, and
  offline-tolerant low-data workflows.
- **Starter** — small team, core workflows, automatic sync, all supported
  languages, and community support.
- **Growth** — team seats, automation features, priority support,
  advanced reporting inside the suite.
- **Enterprise** — custom seats/SLA, SSO, dedicated support, custom
  integrations, procurement/security review support.

## What changed from the old model

- Previously: legacy brands had separate pricing, product, and checkout
  surfaces.
- Now: **one** pricing page (`foundingos.com/pricing`) presents one account,
  four plan tiers, and the workspaces enabled by each tier.
- Deprecated products no longer have independent pricing.

## Config wiring

Pricing tiers reference the same `SuiteKey` values as
[feature-flags.md](./feature-flags.md) (`core_operations`,
`core_workforce`, `core_intelligence`) so that a completed checkout maps
directly to a `TenantSuiteLicense` row — no separate brand-to-suite
translation layer needed.

## Open item

The £29 Starter and £99 Growth prices are the currently configured launch
prices. They still require commercial validation before paid acquisition is
scaled; changes must be made in `packages/config/src/commercial.ts` first.
