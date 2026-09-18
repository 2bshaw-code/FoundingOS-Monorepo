# FoundingOS Environment Setup

This is the buyer/operator guide to running FoundingOS locally, in demo mode,
and in production. It complements
[production-deployment-runbook.md](./production-deployment-runbook.md) (which
covers provider provisioning and release order) and
[demo-hosting.md](./demo-hosting.md) (which covers free-tier demo hosting).

## 1. Prerequisites

- **Node.js 20 LTS.** This monorepo's web app runs on Next.js 14.2, which does
  not reliably build on Node versions newer than ~20/22 — on Node 22+ (and
  especially Node 24+/26+) `next build` can hang indefinitely with no output
  and 0% CPU on some machines. Use Node 20 explicitly for any build:
  ```bash
  brew install node@20
  export PATH="$(brew --prefix node@20)/bin:$PATH"
  node --version   # should print v20.x
  ```
- **npm** (bundled with Node 20).
- For mobile apps: Xcode + iOS Simulator (or a device) for iOS, Android
  Studio + an emulator for Android, and the Expo CLI (resolved automatically
  from each app's `node_modules/.bin/expo`).

## 2. Avoid iCloud/OneDrive-synced working directories

If this repository (or any clone of it) lives inside a cloud-synced folder —
macOS iCloud Drive/Desktop/Documents, Dropbox, OneDrive, Google Drive — the
OS-level sync daemon (`fileproviderd` on macOS) can compete with Node/webpack
for file-system access on the large `node_modules` tree and cause builds to
stall or hang unpredictably, independent of any code in this repository.

**Recommended:** clone or move the repository to a plain local path that is
not synced by any cloud-drive client, e.g. `~/dev/founding-os` rather than
`~/Desktop/founding-os` (macOS Desktop is iCloud-synced by default when
"Desktop & Documents Folders" is enabled in iCloud settings).

If you cannot move the repository, redirect build output, npm/Expo caches,
and temp directories to a local, non-synced path:

```bash
mkdir -p ~/foundingos-build-clean
ln -s ~/foundingos-build-clean ./build-clean   # from the repo root
```

The web app's `demo:build` script and every mobile app's `demo:build` script
already write their output under `./build-clean/` via this symlink — see
`apps/foundingos-web/package.json` and each `apps/*-mobile/package.json`.

Check whether your working directory is cloud-synced before troubleshooting a
slow or hung build:

```bash
# macOS: is this path under iCloud Drive's Desktop/Documents sync?
defaults read com.apple.bird 2>/dev/null | grep -i "desktop\|documents"
# A load average far above your core count with fileproviderd pegged near
# 100% CPU (see `top` or `ps aux | grep fileproviderd`) confirms the daemon,
# not this codebase, is the bottleneck.
```

## 3. Install dependencies

```bash
npm install
```

npm's cache is redirected to `./build-clean/npm-cache` via the repository's
`.npmrc` (same `build-clean/` symlink target from step 2) to reduce cloud-sync
I/O during install.

## 4. Run in DEMO MODE (zero credentials)

```bash
cp .env.demo .env.local   # or export the same variables in your shell
npm run demo:build --workspace @foundingos/foundingos-web
```

Demo mode is enforced by `packages/config/src/runtime-mode.ts`: `APP_MODE=demo`
always selects mock providers for billing, auth, email, SMS, monitoring,
storage, metering, and onboarding, and a local SQLite file
(`./.data/foundingos-demo.db`) instead of a real Postgres database. No network
calls to AWS, Cloudflare, Stripe, Clerk, Resend, Twilio, Sentry, or Apple/EAS
are made in this mode.

Each mobile app has an equivalent script:

```bash
npm run demo:build --workspace <app-name>   # e.g. foundretail-mobile
```

which runs `expo export` with demo env vars and writes to
`./build-clean/mobile-demo/<app-name>/`.

## 5. Switch to PRODUCTION MODE

1. Copy `production.example.env` to `.env.production`.
2. Fill in every placeholder with real credentials (see
   [production-deployment-runbook.md](./production-deployment-runbook.md) for
   the full list and provider setup order).
3. Set `APP_MODE=production` in the deployment environment.
4. Run the deployment runbook's release order.

The production workspace client also requires:

```text
NEXT_PUBLIC_APP_MODE=production
NEXT_PUBLIC_FOUNDINGOS_API_URL=https://core-operations-api.example.com/api/v1
PLATFORM_BOOTSTRAP_TOKEN=<one-time deployment secret>
INTEGRATION_ENCRYPTION_KEY=<32-byte key encoded as 64 hex characters or base64>
REQUIRED_INTEGRATIONS=whatsapp,stripe
```

Generate the integration encryption key with:

```bash
openssl rand -hex 32
```

Before deployment, validate the environment without printing secret values:

```bash
npm run verify:production-readiness
```

After the web and API services are reachable:

```bash
npm run verify:production-readiness -- --live
```

On the first production visit, select **Initialize a new deployment**. Enter
the bootstrap token from the secret manager and create the first business
owner. The token is sent only to the API and is not persisted by the browser.
After signing in, configure WhatsApp and Stripe in **Integrations**, configure
the business in **Settings**, and mark onboarding ready for go-live.

### Private tester access

To put the complete website behind one shared preview password, generate a
password, scrypt hash, and independent cookie-signing secret:

```bash
npm run generate:site-access
```

Share only the generated password. Add the three printed `SITE_ACCESS_*`
values to the web deployment environment and redeploy. The password itself is
not stored in source control or shipped to the browser. Access is represented
by a signed, HTTP-only, seven-day cookie; failed attempts are rate-limited.
Set the web deployment's `TESTER_SESSION_SECRET` to the same secret used by the
FoundingOS Console. Existing `super-founder-admin` sessions then bypass the
tester gate without changing the founder password or granting testers any
administrative permissions.
Set `SITE_ACCESS_ENABLED=false` and redeploy when the public site should no
longer require the preview password.

For customer payment collection, register the tenant webhook URL in Stripe:

```text
https://<api-host>/api/v1/ops/stripe/webhook/<tenant-id>
```

Subscribe it to `checkout.session.completed`, then save that endpoint's signing
secret with the tenant Stripe secret key in **Integrations**. Production payment
records expose **Collect with Stripe** and return customers to the matching
FoundingOS `/app/<workspace>/payments` screen.

For a self-contained deployment:

```bash
cp production.example.env .env.production
# Fill every required value, then:
docker compose --env-file .env.production -f docker-compose.production.yml up --build
```

This starts PostgreSQL, applies migrations before the API starts, waits for API
health, and serves the production-mode web application on port 3000.

`getAppMode()` in `packages/config/src/runtime-mode.ts` only returns
`'production'` when `APP_MODE=production` **and** the required credential
environment variables (`DATABASE_URL`, `STRIPE_SECRET_KEY`,
`CLERK_SECRET_KEY`, `AWS_S3_BUCKET`) are all present — otherwise it silently
falls back to demo mode. This prevents a half-configured production deploy
from accidentally making real provider calls with missing credentials.

## 6. Known repository blockers (as of this handover)

- **Prisma client generation** has been observed to hang on iCloud-synced
  workspaces in this environment. Run `npx prisma generate` (under
  `packages/db`) from a local, non-cloud-synced path, or in CI, not on a
  cloud-synced developer workstation.
- **Full monorepo typecheck** has not been completed end-to-end in this
  environment due to the same cloud-sync I/O contention; targeted/package-level
  typechecks should be used instead where possible, or run in CI.
- See [production-readiness.md](./production-readiness.md) for the full list
  of items that must be completed by an authorized operator with real
  provider access (they cannot be completed from this repository alone).
