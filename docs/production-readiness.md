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
- Billing and usage webhooks are idempotent and written to an audit trail.
- Production secrets are injected by the deployment platform and never stored
  in the repository.
- Health checks cover API, database, queue/orchestration, storage, email, and
  SMS dependencies.
- Support incidents include severity, owner, timestamps, customer impact, and
  SLA status.

## Current repository blockers

The repository currently has missing generated Prisma clients and unresolved
workspace dependencies in the full typecheck. The root validation build also
expects a missing shared brand asset. These must be resolved before claiming a
production release.
