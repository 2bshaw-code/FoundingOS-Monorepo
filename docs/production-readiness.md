# FoundingOS Production Readiness

This is the release gate for operating FoundingOS as a revenue-ready SaaS
company. Repository code can define contracts and checks; deployment, billing
providers, Apple accounts, DNS, and production secrets must be completed by an
authorized operator.

## Required before launch

- Provision isolated production PostgreSQL with automated backups, point-in-time
  recovery, encryption, and tenant-scoped access checks.
- Configure production auth, object storage, CDN, email, SMS, logging, metrics,
  alerting, and incident escalation.
- Apply Brand Studio and Messaging Core migrations to staging first, after a
  verified backup and restore check.
- Connect a staging Meta WhatsApp Business account, map its phone-number ID to
  one tenant, authorize test participants, and pass the command and fallback
  matrix in [release-scorecard.md](./release-scorecard.md).
- Connect billing checkout, invoices, tax handling, webhook signature
  verification, subscription state, and usage metering to
  `packages/config/src/commercial.ts`.
- Run migrations and generated Prisma clients in CI, not on a developer
  workstation.
- Complete web and mobile typecheck, lint, build, smoke tests, and release
  approvals.
- Configure EAS credentials and submit each mobile app from an authorized Apple
  team account. TestFlight submission cannot be performed from this repository
  without those credentials.

## Operational controls

- Every request carries a tenant identity and is authorized against an enabled
  suite license.
- First deployment is protected by `PLATFORM_BOOTSTRAP_TOKEN`; it creates a
  tenant-scoped owner and seven explicit workspace entitlements.
- Provider credentials are encrypted with AES-256-GCM using
  `INTEGRATION_ENCRYPTION_KEY` and are never returned to clients.
- Workspace record writes use optimistic versions, idempotency keys, soft
  deletion, audit events, and Shared Event Feed publication.
- Billing and usage webhooks are idempotent and written to an audit trail.
- Production secrets are injected by the deployment platform and never stored
  in the repository.
- Health checks cover API, database, queue/orchestration, storage, email, and
  messaging dependencies.
- Demo users are seeded only when `APP_MODE=demo`; production startup must not
  create or reset predictable accounts.
- Failed messaging actions and failed confirmations create shared Event Feed
  events and Core Intelligence risks. Critical workflows remain available in
  the web application.
- Support incidents include severity, owner, timestamps, customer impact, and
  SLA status.

## Operator-controlled release blockers

- Production and staging database targets, backup ownership, and restore
  evidence have not been confirmed.
- Brand Studio and Messaging Core migrations have not been applied.
- A Meta WhatsApp Business account and phone-number ID have not been connected
  to a staging tenant.
- No real end-to-end command, rate-limit, policy, delivery-failure, or recovery
  evidence exists yet.
- Pilot customers and measurable activation/reliability outcomes have not been
  established.
- Production provider credentials have not been supplied. Run
  `npm run verify:production-readiness` after loading secrets and do not accept
  payment until the authenticated platform readiness endpoint reports ready.

The Core Operations backend, Core Operations console, and public website
currently pass their targeted builds and typechecks. This is necessary but not
sufficient for production approval.
