# Routing Conventions

> **Migration note:** routes below use legacy brand prefixes
> (`core_operations`, `foundmeat`, `foundthis`, `core_workforce`, `foundcrypto`).
> The target routing scheme uses suite prefixes (`/core-operations/*`,
> `/core-workforce/*`, `/core-intelligence/*`) with legacy paths kept as
> redirects during migration. See
> [docs/migration-map.md](./docs/migration-map.md) for the full mapping and
> [docs/deprecations.md](./docs/deprecations.md) for routes being removed
> entirely (CoreOperations, CoreOperations, and CoreIntelligence ingestion/data-operations
> routes).

All frontends use React Router with these conventions:

- `/` public or application home
- `/login` authentication entry
- `/dashboard` authenticated landing page
- `/core_operations/retail-manager-console` retail manager console
- `/core_operations/staff-console` staff console
- `/foundmeat/supplier-console` supplier console
- `/foundmeat/buyer-console/*` buyer console
- `/foundthis/intelligence-console` intelligence console
- `/foundthis/data-operations-console/*` data operations console
- `/core_workforce/workforce-intelligence-console` workforce intelligence console
- `/core_workforce/recruiter-console/*` recruiter console
- `/foundcrypto/chart-intelligence-dashboard` chart intelligence dashboard
- `/foundcrypto/trader-console` trader console
- `/system/*` operational routes

Legacy aliases remain in place as redirects during the transition.

All backends expose:

- `GET /health`
- `GET /api/v1/status`
- application resources beneath `/api/v1/*`

FoundingOS deep-links to the documented local frontend hostnames. Hostname resolution is intentionally left to future local infrastructure work.
