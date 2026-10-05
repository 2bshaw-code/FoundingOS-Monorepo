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

### Founder-only Gmail building expenses

Web SuperDash has an additive **Building expenses** panel for authenticated founder/admin
sessions only. It is not shown in tester or read-only views. Its APIs independently require
the admin cookie and a configured, non-default `TESTER_SESSION_SECRET`. Records are scoped
to the admin ID and are never returned by the public accounting or mobile overview APIs.
Customer invoices, brand revenue, profit, and AI summary metrics are unchanged.

Setup for the FoundingOS console only:

1. In Google Cloud, enable the **Gmail API**, configure the OAuth consent screen, and
   create a **Web application** OAuth client. For personal testing, add your own Gmail
   address as an OAuth test user. Request only
   `https://www.googleapis.com/auth/gmail.readonly` (a restricted Google scope).
2. Register the exact redirect URI:
   `https://console.foundingos.com/api/gmail/callback` for the existing console deployment.
   This flow lives at `https://console.foundingos.com/superdashboard`, not the separately
   deployed `www.foundingos.com/superdash`. For local development, use
   `http://localhost:8000/api/gmail/callback` and register that separately in Google.
3. Set server-only `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REDIRECT_URI`, and
   `GMAIL_TOKEN_KEY` on the FoundingOS console. Generate the encryption key locally with
   `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`.
   Store it in your deployment secret manager, never in Git or chat. Set a strong
   `TESTER_SESSION_SECRET` if not already configured; changing it signs out current sessions.
   It must match across the existing apps that share founder-session cookies.
4. Generate the client (`npm run db:generate`) and apply pending migrations to the
   intended database using
   `npm exec --workspace @foundingos/db -- prisma migrate deploy`.
   The additive migration creates `founder_expenses`; it does not change existing invoice
   tables. Back up and review all pending migrations before deploying them.
5. Deploy the console and sign in through `/tester/admin/login`. In SuperDash:
   **Connect Gmail → Search Gmail → choose email → read/download invoice → confirm details**.

Read-only authorization means FoundingOS cannot send, edit, or delete mail. Google nevertheless
grants read access to the mailbox, not only invoice emails; the app queries only when you
search or choose a message. Authorization uses state verification and PKCE. Access tokens
are encrypted in a host-only, HttpOnly cookie, bound to the founder ID, and expire after
at most one hour. No refresh token is requested or stored, and no background inbox scan runs.
Reconnection is required after expiry. Disconnect removes the local connection and attempts
Google token revocation; if Google cannot confirm it, the UI explicitly tells you to remove
access in your Google Account permissions.
Gmail and expense API requests bypass the console service worker's offline/runtime cache.

The first version displays plain-text email content and downloads attachments up to 10 MB.
It does **not** perform PDF/OCR extraction or send email/invoice content to an AI service.
Enter and confirm supplier, invoice number, total, currency, and invoice date yourself.
Only confirmed expense metadata plus its source mailbox/message ID is persisted, not email
bodies or attachments. One expense is allowed per email; reimporting the same mailbox/message
is rejected. Totals are kept separately by currency, without invented exchange rates or
payment claims. Saved expenses remain available after disconnecting Gmail.

Public availability can require Google's restricted-scope verification and potentially
a security assessment. Do not advertise this as a verified public Gmail integration
before completing Google's requirements. See
[Google Gmail scopes](https://developers.google.com/workspace/gmail/api/auth/scopes) and
[OAuth web-server authorization](https://developers.google.com/identity/protocols/oauth2/web-server).

- FoundRetail: Customers, Inventory, Orders, Products.
- FoundMeat: Suppliers, Stock, Traceability, Orders.
- FoundThis: Market Intel, Lead Capture, Data Quality, Reports.
- FoundTalent: Applicants, Recruiters, Jobs, Workforce Intel.
- FoundCrypto: Charts, Signals, Automation, Risk.

The console shell includes dashboard KPIs, settings, module detail routes, activity log, and admin user-management navigation through the shared sidebar.