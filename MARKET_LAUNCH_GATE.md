# Market Launch Gate

## Code gates passed

- Full monorepo build passes for four frontends, four backends, shared packages, and desktop entry points.
- Unified authentication tests and FoundThis scraping security tests pass.
- Production dependency audit reports zero known vulnerabilities.
- Founder, FoundRetail, FoundThis, and FoundMeat APIs expose request IDs, security headers, rate limits, structured errors, explicit production CORS, and trusted-proxy handling.
- FoundThis discovery automatically creates deduplicated and enriched FoundRetail customers visible through FoundRetail and Founder aggregation.
- Customer CRUD, inventory, orders, invoices, delivery, marketing, social scheduling, persisted Bob media, company management, and package applications use PostgreSQL-backed services.
- Founder and Owner analytics remain attached to shared KPI, funnel, line, bar, heat-map, waterfall, and trend components.
- Active source contains no remote hero-image dependencies, scaffolded statuses, or HTTP 501 placeholder routes.

## External launch blockers

The following require operator credentials, infrastructure, or legal decisions and cannot be completed or certified from source code alone:

1. Provision production PostgreSQL, run Prisma schema synchronization, configure automated encrypted backups, and complete a restore drill.
2. Choose the production hosting platform and domains; configure DNS, TLS certificates, HTTPS ingress, health checks, scaling, and monitoring.
3. Inject `DATABASE_URL`, a shared `AUTH_ACCESS_TOKEN_SECRET`, per-service `AUTH_REFRESH_TOKEN_SECRET`, production `CORS_ORIGINS`, production WebAuthn RP values, and reset-delivery endpoints through a managed secret store. Rotate any secrets previously used outside that store.
4. Supply Meta WhatsApp credentials before enabling live messages: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`, and `WHATSAPP_APP_SECRET`.
5. Add only explicitly approved FoundThis scraping sources and document their terms of use and data-processing basis.
6. Select error monitoring, centralized log retention, uptime monitoring, incident response, and support ownership.
7. Have qualified counsel review copyright ownership, contributor assignments, dependency notices, privacy terms, data-processing obligations, and proposed FoundingOS, FoundRetail, FoundThis, FoundMeat, and WhatsApp-related trademark usage. Source checks cannot establish legal ownership or trademark availability.
8. Complete production payment-provider selection and credentials if paid subscriptions or automated invoice settlement are required at launch.

## Release commands

```bash
npm ci
npm run build
npm test
npm audit --omit=dev
```

Deploy only after every external blocker above has an accountable owner, evidence, and rollback plan.
