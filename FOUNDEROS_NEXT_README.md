# FoundingOS Next.js Multi-Brand SaaS

This scaffold adds a production-oriented Turborepo layout beside the existing implementation.

## Structure

- `apps/foundingos-web` - public FoundingOS launcher.
- `apps/foundingos-console` - private FoundingOS console.
- `apps/retail-web`, `apps/meat-web`, `apps/talent-web`, `apps/crypto-web` - public brand websites.
- `apps/retail-console`, `apps/meat-console`, `apps/talent-console`, `apps/crypto-console` - private brand consoles.
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
- FoundRetail web: `5210`
- FoundRetail console: `5211`
- FoundMeat web: `5220`
- FoundMeat console: `5221`
- FoundThis web: `5230`
- FoundThis console: `5231`
- FoundTalent web: `5240`
- FoundTalent console: `5241`
- FoundCrypto web: `5250`
- FoundCrypto console: `5251`

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

- FoundRetail: Customers, Inventory, Orders, Products.
- FoundMeat: Suppliers, Stock, Traceability, Orders.
- FoundThis: Market Intel, Lead Capture, Data Quality, Reports.
- FoundTalent: Applicants, Recruiters, Jobs, Workforce Intel.
- FoundCrypto: Charts, Signals, Automation, Risk.

The console shell includes dashboard KPIs, settings, module detail routes, activity log, and admin user-management navigation through the shared sidebar.