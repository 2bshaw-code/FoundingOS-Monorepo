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

## Implementation gap analysis (current repo state)

This section tracks the delta between this spec and what exists today, so
work can be scoped incrementally rather than attempted in one pass.

- **Shared data model** (`packages/db/prisma/schema.prisma`) currently only
  defines `Brand`, `User`, `Module`, `Subscription`, `ActivityLog`,
  `Account`, `Session`, `VerificationToken`. None of the vertical objects
  above (Product, Order, Shipment, Invoice, Worker, Patient, etc.) exist
  yet in the shared schema — this is the largest gap and the prerequisite
  for everything else in this spec. Recommend scoping as its own
  migration-reviewed change, one console at a time, rather than one large
  schema rewrite.
- **Event backbone**: did not exist prior to this change; added as
  `packages/config/src/events.ts` with the six named events above so both
  web and mobile can import a single source of truth.
- **Mobile apps**: per-console Expo apps already exist
  (`apps/foundretail-mobile`, `apps/foundlogistics-mobile`,
  `apps/foundfinance-mobile`, `apps/foundtalent-mobile`,
  `apps/foundhealth-mobile`) — a reasonable starting structural match to
  "one module per console," though they are not yet organized as modules
  inside a single shared app root with Org Switcher/Console
  Selector/Offline Cache as this spec describes. `foundthat-mobile` should
  be deprecated per the FoundThat scraping removal already in progress
  elsewhere in this repo.
- **AI automations, offline sync, WhatsApp/mobile-money integration
  layers**: not yet implemented; blocked on the data model above existing
  first.
