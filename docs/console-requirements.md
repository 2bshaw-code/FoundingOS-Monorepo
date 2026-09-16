# Console Requirements + Mobile Architecture (Locked)

This document is the locked reference specification for what each of the
five sector consoles (Retail, Logistics, Finance, Talent, Health) must
contain, and how mobile must achieve full parity with web. It is the
source of truth for future schema, API, and mobile work — implementation
should be checked against this doc, not the other way around.

Every console has four layers:

1. **Core UI** — web + mobile, identical workflows.
2. **Core Data** — unified data model (see `packages/db/prisma/schema.prisma`).
3. **Core Intelligence** — AI agents/automations.
4. **Core Workforce** — identity + permissions.

---

## 1. Retail Console

**Core objects**: Product, Variant, InventoryItem, InventoryMovement,
Order, Customer.

**Core screens**: Product Catalog, Inventory Dashboard, Order List, Order
Detail, Low Inventory Alerts, WhatsApp Order Intake, Fulfilment Trigger
Panel.

**Core workflows**: create/edit product; adjust inventory; create order
(web + mobile + WhatsApp); auto-trigger fulfilment; auto-trigger invoice;
auto-sync inventory across warehouses.

**AI automations**: predict low inventory; auto-create fulfilment tasks;
auto-suggest restock quantities; auto-detect fraudulent orders.

**Mobile requirements**: offline-first order creation; barcode scanning;
WhatsApp-native order intake; push notifications for low inventory.

## 2. Logistics Console

**Core objects**: Shipment, DeliveryTask, Route, Driver, Vehicle,
InventoryMovement.

**Core screens**: Route Planner, Delivery Task List, Delivery Task Detail,
Live Tracking Map, Warehouse Inventory Movement, Driver Dashboard.

**Core workflows**: create shipment; assign driver; track delivery; mark
delivery complete; move inventory between warehouses; auto-update order
status.

**AI automations**: auto-route optimization; auto-assign driver; predict
delivery delays; auto-notify Finance on delivery completion.

**Mobile requirements**: driver mode; GPS tracking; delivery confirmation;
photo proof of delivery; WhatsApp delivery updates.

## 3. Finance Console

**Core objects**: Invoice, Payment, PaymentMethod, MobileMoneyTransaction,
RevenueRecognition, CashFlowPrediction.

**Core screens**: Invoice List, Invoice Detail, Payment Reconciliation,
Revenue Dashboard, Cash Flow Forecast, Mobile Money Ledger.

**Core workflows**: auto-generate invoice; auto-send invoice; reconcile
mobile money payments; partial payments; refunds; revenue recognition; DSO
tracking.

**AI automations**: predict payment dates; flag at-risk invoices;
auto-reconcile mobile money; auto-adjust payment terms based on delays.

**Mobile requirements**: mobile money reconciliation; offline-first invoice
viewing; push notifications for payments; WhatsApp invoice delivery.

## 4. Talent Console

**Core objects**: Job, Applicant, Worker, Timesheet, PayrollRun.

**Core screens**: Job Board, Applicant Pipeline, Worker Directory,
Timesheet Dashboard, Payroll Dashboard.

**Core workflows**: post job; manage applicants; approve timesheets;
trigger payroll; sync payroll → Finance.

**AI automations**: auto-screen applicants; predict worker churn;
auto-flag payroll anomalies.

**Mobile requirements**: worker self-service; timesheet submission; push
notifications for approvals.

## 5. Health Console

**Core objects**: Patient, Appointment, Record, Treatment, MedicalInvoice.

**Core screens**: Patient List, Appointment Calendar, Record Viewer,
Treatment Workflow, Medical Billing.

**Core workflows**: create appointment; update patient record; trigger
medical billing; sync billing → Finance.

**AI automations**: predict no-shows; auto-flag compliance issues.

**Mobile requirements**: appointment management; patient lookup;
offline-first record viewing.

---

## B. Mobile App Architecture

Mobile apps must be **full native consoles, not wrappers**. Mobile is not
a subset of web — every console must be fully functional on mobile.

### Architecture principles

Web and mobile share: the same data model, the same event backbone, the
same automation engine, the same AI agent orchestration, the same
permissions, and the same workflows.

### Mobile app structure

- **App root**: Auth, Org Switcher, Console Selector, Notifications,
  Offline Cache.
- **Console modules** (one per console): RetailModule, LogisticsModule,
  FinanceModule, TalentModule, HealthModule.
- **Shared layers**: Unified Component Library, Event Backbone Listener,
  AI Agent Trigger Layer, Mobile Money Integration Layer, WhatsApp
  Integration Layer, Offline Sync Layer.

### Mobile UI requirements

Identical screens, workflows, permissions, automation triggers, and event
responses to web (adapted for mobile layout).

### Mobile-specific enhancements

Offline-first mode; background sync; push notifications; GPS tracking
(Logistics); barcode scanning (Retail); photo proof (Logistics);
WhatsApp-native flows; mobile-money-native reconciliation.

### Event backbone

Mobile listens to the same events as web (see
[`packages/config/src/events.ts`](/Users/bobbyshaw/Founding%20OS%20Local/founder-os-group/packages/config/src/events.ts)):
`order.confirmed`, `inventory.low`, `shipment.created`,
`delivery.completed`, `invoice.generated`, `payment.received`. Mobile must
react instantly and identically to web.

### AI agent architecture (mobile)

Agents run server-side; mobile must trigger agents, display agent
decisions, execute agent actions, show agent predictions, and handle agent
alerts.

### Mobile-web parity checklist (per console)

- [ ] All screens match web
- [ ] All workflows match web
- [ ] All automations match web
- [ ] All permissions match web
- [ ] All events match web
- [ ] All AI agent actions match web
- [ ] All data models match web
- [ ] All dashboards match web
- [ ] All notifications match web

---

## Implementation gap analysis (current repo state, corrected)

**Correction**: an earlier pass of this document under-reported existing
work by checking only the newer `packages/db/prisma/schema.prisma` shared
package. In fact, real backend services with their own Prisma schemas, API
routes, and working mobile screens already exist per console. Most of this
spec is already substantially built; the remaining work is consolidation,
renaming, and parity — not building from zero.

### Retail Console

- **Backend**: `core-operations/backend` (Express + Prisma). Real models:
  `Merchant`, `Customer`, `SalesOrder`, `CustomerMessage`, `InventoryItem`,
  `Invoice`, `MarketingCampaign`, `SocialPost`, `MediaGeneration`, plus
  delivery models shared with Logistics. Real endpoints in
  [`core-operations/backend/src/routes.ts`](/Users/bobbyshaw/Founding%20OS%20Local/founder-os-group/core-operations/backend/src/routes.ts):
  `/console/products`, `/console/orders`, `/console/customers`,
  `/console/reports`, `/customers`, `/leads`, WhatsApp webhook
  (`/whatsapp/webhook`), `/merchant/workspace`.
- **Mobile**: `apps/foundretail-mobile` — `home.tsx`, `inventory.tsx`,
  `new-sale.tsx`, `activity.tsx`, `ai-actions.tsx`, WhatsApp
  onboarding (`about/whatsapp.tsx`), barcode scanner
  (`about/scanner.tsx`). Polls live data via
  `lib/retail-poll.ts` → `GROWTH_CONSOLE_URL` (`retail-console.foundingos.com`).
- **Naming gap**: spec calls for `Product`/`Order`; current schema uses
  `InventoryItem`/`SalesOrder`. Recommend renaming for spec alignment
  rather than rebuilding.
- **Missing vs. spec**: `Variant` and `InventoryMovement` as distinct
  models; explicit low-inventory push notification wiring.

### Logistics Console

- **Backend**: shares `core-operations/backend` schema — `DeliveryOperator`
  (≈ Driver), `DeliveryVehicle` (≈ Vehicle), `DeliveryZone` (≈ Route),
  `DeliveryAssignment` (≈ DeliveryTask), `DeliveryNotification`,
  `LocationProfile`. Endpoints: `assignDelivery`, `updateDeliveryAssignment`,
  `updateDeliveryOperator`/`Vehicle`/`Zone`, `detectLocation`, `weatherAt`.
- **Mobile**: `apps/foundlogistics-mobile` — `home.tsx`, `fleet.tsx`,
  `deliveries.tsx`, `activity.tsx`, `ai-actions.tsx`, route optimizer
  (`lib/route-optimizer.ts`), live polling (`lib/logistics-poll.ts`).
- **Naming gap**: `DeliveryAssignment`/`DeliveryOperator` vs. spec's
  `DeliveryTask`/`Driver` — rename, don't rebuild.
- **Missing vs. spec**: `Shipment` as its own object distinct from
  `DeliveryAssignment`; photo-proof-of-delivery capture; live tracking map
  screen (currently `fleet.tsx`/`deliveries.tsx` list views, not a map).

### Finance Console — ✅ models added

- **Backend**: `Invoice` (existing) plus newly added `PaymentMethod`,
  `Payment`, `MobileMoneyTransaction`, `RevenueRecognition`,
  `CashFlowPrediction` in
  [`core-operations/backend/prisma/schema.prisma`](/Users/bobbyshaw/Founding%20OS%20Local/founder-os-group/core-operations/backend/prisma/schema.prisma),
  with persistence functions in
  [`core-operations/backend/src/finance.ts`](/Users/bobbyshaw/Founding%20OS%20Local/founder-os-group/core-operations/backend/src/finance.ts)
  and routes under `/finance/payment-methods`, `/finance/payments`,
  `/finance/payments/:id/reconcile-mobile-money`,
  `/finance/mobile-money-transactions`, `/finance/revenue-recognition`,
  `/finance/dso`, `/finance/cash-flow-predictions`.
- **Mobile**: `apps/foundfinance-mobile` — `home.tsx`, `cashflow.tsx`,
  `approvals.tsx`, `activity.tsx`, `ai-actions.tsx`, with
  `lib/cashflow.ts` polling `GROWTH_CONSOLE_URL/api/finance/cashflow`.
- **Still open**: mobile screens still poll the older computed
  `/api/finance/cashflow` feed rather than the new `/finance/*` endpoints
  — wiring the mobile app to the new endpoints is a follow-up.

### Talent Console — ✅ backend built

- **Backend**: `core-workforce/backend` previously had **no `.prisma`
  file** and served in-memory demo data. Added
  [`core-workforce/backend/prisma/schema.prisma`](/Users/bobbyshaw/Founding%20OS%20Local/founder-os-group/core-workforce/backend/prisma/schema.prisma)
  with real `Job`, `Applicant`, `Worker`, `Timesheet`, `PayrollRun`
  models, persistence in
  [`core-workforce/backend/src/talent.ts`](/Users/bobbyshaw/Founding%20OS%20Local/founder-os-group/core-workforce/backend/src/talent.ts),
  and routes for `/jobs`, `/candidates`, `/candidates/:id/stage`,
  `/workers`, `/timesheets`, `/timesheets/:id/approve`, `/payroll`,
  `/payroll/:id/sync-to-finance`.
- **Mobile**: `apps/foundtalent-mobile` — `home.tsx`, `pipeline.tsx`,
  `job-match.tsx`, `candidate/[candidateId].tsx`, `activity.tsx`,
  `ai-actions.tsx` — UI was already further along than the backend; now
  backend has caught up with real persistence.
- **Still open**: payroll→Finance sync currently just marks the
  `PayrollRun` as `synced` locally; a real cross-service call or shared
  event to `core-operations/backend`'s Finance module is the next step,
  blocked on event backbone wiring below.

### Health Console — ✅ backend built

- **Backend**: new dedicated service
  [`core-health/backend`](/Users/bobbyshaw/Founding%20OS%20Local/founder-os-group/core-health/backend)
  following the `core-operations`/`core-workforce` pattern — own
  `prisma/schema.prisma` (`Patient`, `Appointment`, `Record`, `Treatment`,
  `MedicalInvoice`, `ComplianceFlag`), own auth (`src/auth.ts`), full CRUD
  routes (`src/routes.ts`), predict-no-shows and flag-compliance-issues
  heuristics in `src/health.ts`, and a payroll/billing→Finance sync stub.
  Mounted on port 4004 at `/api/v1/health`.
- **Mobile**: `apps/foundhealth-mobile` — `home.tsx`, `appointments.tsx`,
  `vitals.tsx`, `timeline.tsx`, `activity.tsx`, `ai-actions.tsx` — still
  reads its existing local/demo feed; wiring to the new backend endpoints
  is tracked in the build order below.
- **Still open**: mobile app wiring to the new endpoints; billing→Finance
  sync is currently a local status flip, not a real cross-service call.

### Cross-cutting items

- **Event backbone**: `packages/config/src/events.ts` defines the six
  named events (`order.confirmed`, `inventory.low`, `shipment.created`,
  `delivery.completed`, `invoice.generated`, `payment.received`) plus a
  lightweight in-process `emitOsEvent`/`onOsEvent` pub-sub (swappable for
  a real broker later). **Now wired** into `core-operations/backend`:
  `createOrder` emits `order.confirmed`, `createInventoryItem`/
  `updateInventoryItem` emit `inventory.low` when stock drops to/below
  the low-stock threshold, `assignDelivery` emits `shipment.created`,
  `updateDeliveryAssignment` emits `delivery.completed` on `delivered`
  status, `createInvoice` emits `invoice.generated`, `updateInvoice`
  (status→`paid`) and `reconcileMobileMoneyPayment` both emit
  `payment.received`. `core-workforce/backend` and `core-health/backend`
  depend on `@foundingos/config` but do not yet have named events to
  emit for payroll/billing sync — that remains the next step once
  cross-service payroll/billing events are added to `OS_EVENTS`.
- **Shared data model** (`packages/db/prisma/schema.prisma`) holds only
  cross-cutting concerns (`Brand`, `User`, `Module`, `Subscription`,
  `ActivityLog`, `Account`, `Session`) — this is correct as-is; it is not
  meant to hold vertical objects, which correctly live in each console's
  own backend schema.
- **Mobile app root structure**: each mobile app is currently its own
  standalone Expo app (own `_layout.tsx`, `login.tsx`), not yet organized
  as modules inside one shared app root with Org Switcher/Console
  Selector as this spec describes. Given five separately-shipping App
  Store apps already exist and are in TestFlight, consolidating into one
  multi-console app is a larger, separate architectural decision — flagging
  for explicit confirmation before attempting, since it would affect
  existing store listings.
- `apps/foundthat-mobile` should be deprecated per the FoundThat scraping
  removal already in progress elsewhere in this repo.

### Recommended next build order (highest leverage first)

1. ~~**Talent Console backend**~~ — done: real Prisma models replace the
   in-memory demo data.
2. ~~**Finance Console models**~~ — done: `PaymentMethod`,
   `MobileMoneyTransaction`, `RevenueRecognition`, `CashFlowPrediction`
   added.
3. ~~**Health Console backend**~~ — done: new `core-health/backend`
   service with real Prisma models and routes.
4. ~~**Event backbone wiring**~~ — done for `core-operations/backend`
   (Retail/Logistics/Finance mutations now emit `OS_EVENTS`). Extending
   named events to cover payroll (`core-workforce`) and billing
   (`core-health`) sync-to-Finance is the remaining piece.
5. **Naming alignment** — rename `SalesOrder`→`Order`,
   `DeliveryAssignment`→`DeliveryTask`, `DeliveryOperator`→`Driver` (or
   accept current names and update this spec instead — cheaper option).
6. **Retail/Logistics polish** — add `Variant`, `Shipment`, photo-proof
   capture, live tracking map.
7. **Mobile wiring** — point `foundfinance-mobile`'s `lib/cashflow.ts` at
   the new `/finance/*` endpoints; add Worker/Timesheet/Payroll screens to
   `foundtalent-mobile` to match the new backend capability; wire
   `foundhealth-mobile` to the new `core-health/backend` endpoints.

