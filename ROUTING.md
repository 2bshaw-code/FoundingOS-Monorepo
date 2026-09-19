# Routing Conventions

All frontends use React Router with these conventions:

- `/` public or application home
- `/login` authentication entry
- `/dashboard` authenticated landing page
- `/console` suite console home (Core.Operations, Core.Workforce, Core.Intelligence)
- `/console/packages/[package]` suite package console
- `/crm` shared CRM surface
- `/intelligence` Core.Intelligence activation and strategic overview
- `/modules/[moduleId]` module surfaces
- `/settings` workspace settings
- `/system/*` operational routes

The legacy per-brand routes (`/foundretail/*`, `/foundmeat/*`, `/foundtalent/*`,
`/foundcrypto/*`, `/foundit/*`) and their backing app directories have been
removed as part of the FoundingOS consolidation into
Core.Operations/Core.Workforce/Core.Intelligence. See
[restructure-summary.md](./docs/restructure-summary.md) and
[migration-map.md](./docs/migration-map.md).

All backends expose:

- `GET /health`
- `GET /api/v1/status`
- application resources beneath `/api/v1/*`

FoundingOS deep-links to the documented local frontend hostnames. Hostname resolution is intentionally left to future local infrastructure work.
