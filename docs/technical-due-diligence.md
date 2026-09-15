# FoundingOS Technical Due-Diligence Pack

## Product

FoundingOS is one tenant-aware platform with Core.Operations,
Core.Workforce, and Core.Intelligence. Mobile and web clients consume the same
suite contracts, API prefixes, module definitions, onboarding steps, and
quantum visual language.

## Architecture

The shared backbone owns identity, tenant licensing, messaging adapters,
mapping, orchestration, telemetry, auditability, and usage events. Suite APIs
are exposed under `/api/v1/ops`, `/api/v1/work`, and `/api/v1/int`.

## Commercial model

Starter, Growth, and Enterprise plans are defined in
`packages/config/src/commercial.ts`. Plans specify seats, enabled suites, and
usage limits. A production billing adapter still needs provider credentials,
tax configuration, webhook signature verification, invoice delivery, and
reconciliation.

## Security and operations

Production deployment must enforce tenant isolation, role-based access,
idempotent billing events, audit logs, encrypted secrets, backups, monitoring,
incident response, and SLA reporting. See
[`production-readiness.md`](./production-readiness.md).

## Validation evidence

Targeted mobile manifests and focused mobile checks can be run per workspace.
The full monorepo check is currently blocked by missing dependencies and
generated Prisma clients; the root build is blocked by a missing brand asset.
No TestFlight submission or production deployment should be represented as
complete until an authorized release operator supplies the required accounts and
records successful runs.
