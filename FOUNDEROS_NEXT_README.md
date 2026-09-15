# FoundingOS Next.js Multi-Brand SaaS

> **Migration note:** this scaffold predates the FoundingOS suite
> restructure. `retail-web`/`retail-console` map to **Core.Operations**,
> `talent-web`/`talent-console` map to **Core.Workforce**, and
> Intelligence web and console map to **Core.Intelligence**.
> `meat-*` and `crypto-*` apps are deprecated — see
> [docs/deprecations.md](./docs/deprecations.md) and
> [docs/migration-map.md](./docs/migration-map.md) for the full app/route/
> env mapping.

This scaffold adds a production-oriented Turborepo layout beside the existing implementation.

## Structure

- `apps/foundingos-web` - public FoundingOS launcher.
- `apps/foundingos-console` - private FoundingOS console.
- `apps/retail-web`, `apps/meat-web`, `apps/it-web`, `apps/talent-web`, `apps/crypto-web` - public brand websites.
- `apps/retail-console`, `apps/meat-console`, `apps/it-console`, `apps/talent-console`, `apps/crypto-console` - private brand consoles.
- `packages/ui` - shared design system, marketing pages, console shell, and route screens.
- `packages/auth` - shared NextAuth configuration with Credentials and Google providers.
- `packages/db` - Prisma schema and singleton client.
- `packages/config` - brand registry, TypeScript base config, and Tailwind config.

## Routes

Public websites expose `/`, `/about`, `/pricing`, `/contact`, and `/login`. The `/login` route redirects to the matching console login URL.

Console apps expose `/login`, `/dashboard`, `/settings`, and `/modules/[moduleId]` through App Router catch-all routing. The root console route redirects to `/dashboard`.

## Local Ports

- FoundingOS web: `3000`
- FoundingOS console: `3010`
- CoreOperations web: `5210`
- CoreOperations console: `5211`
- CoreOperations web: `5220`
- CoreOperations console: `5221`
- Intelligence web: `5230`
- Intelligence console: `5231`
- CoreWorkforce web: `5240`
- CoreWorkforce console: `5241`
- CoreOperations web: `5250`
- CoreOperations console: `5251`

## Environment

Copy `.env.example.next` into each deployment environment. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` before production deployment.

## Database

Run:

```bash
npm install
npm run db:generate
npm run db:migrate
```

The schema includes `User`, `Brand`, `Module`, `Subscription`, and `ActivityLog`, with brand isolation through `brandId` relations.

## Development

Run one app:

```bash
npm run dev --workspace @foundingos/retail-web
npm run dev --workspace @foundingos/retail-console
```

Run all Next apps with Turbo:

```bash
npm run dev:next
```

## Deployment

1. Create a Neon PostgreSQL database and set `DATABASE_URL`.
2. Add every app in Vercel and set the root directory to the matching `apps/*` folder.
3. Configure shared environment variables in Vercel project settings.
4. Set each public website domain to the web app and each console subdomain to the console app.
5. Run migrations with `npm run db:migrate` before production traffic.

## Brand Modules

- CoreOperations: Customers, Inventory, Orders, Products.
- CoreOperations: Suppliers, Stock, Traceability, Orders.
- Intelligence: Market Intel, Lead Capture, Data Quality, Reports.
- CoreWorkforce: Applicants, Recruiters, Jobs, Workforce Intel.
- CoreOperations: Charts, Signals, Automation, Risk.

The console shell includes dashboard KPIs, settings, module detail routes, activity log, and admin user-management navigation through the shared sidebar.