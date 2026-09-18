# FoundingOS Production Deployment Runbook

Target providers: AWS (Postgres, S3, ECS), Cloudflare (DNS/CDN), Stripe
(billing and tenant payment collection), Resend (email), Twilio (SMS), and
Sentry (error monitoring). The production workspace currently uses the Core
Operations JWT access/refresh implementation. Clerk is optional and must not
be treated as active unless the runtime is deliberately migrated to it.

## Demo mode

Copy `.env.demo` into the process environment for a fully local, non-billable
demo. Demo mode uses local storage and mock billing, auth, email, SMS,
monitoring, metering, and onboarding. The deterministic demo helpers are
exported from `@foundingos/config/demo-providers`. No provider credentials are
contacted.

> If this repository is on a cloud-synced path (iCloud Drive, Dropbox,
> OneDrive, Google Drive), see [environment-setup.md](./environment-setup.md)
> before building — cloud-sync daemons can cause builds to hang
> indefinitely for reasons unrelated to this codebase. Use Node 20 LTS and
> build output under `./build-clean/`.

If ignored legacy environment files exist locally, run
`npm run demo:credentials`. This copies only an allowlisted set of provider
settings into `.env.demo.local`, forces `APP_MODE=demo`, and never prints or
commits values. Demo adapters remain authoritative, so copied provider keys are
available for UI compatibility only and do not activate production services.

For Vercel, Netlify, or Cloudflare Pages, use the values from `.env.demo`
directly in the platform's environment-variable UI. Do not upload
`.env.demo.local`; it may contain real credentials from a prior deployment.

## Production mode

Copy `production.example.env` to `.env.production`, replace every empty
placeholder with real credentials, and set `APP_MODE=production`. Production
providers are selected only when the explicit mode is production and required
credentials are present. Never commit `.env.production`.

## Required production secrets

Store these in the deployment secret manager, never in git:

```text
DATABASE_URL
DIRECT_URL
AUTH_ACCESS_TOKEN_SECRET
AUTH_REFRESH_TOKEN_SECRET
PLATFORM_BOOTSTRAP_TOKEN
INTEGRATION_ENCRYPTION_KEY
PASSWORD_RESET_WEBHOOK_URL
CLERK_SECRET_KEY
CLERK_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_STARTER
STRIPE_PRICE_GROWTH
STRIPE_PRICE_ENTERPRISE
RESEND_API_KEY
RESEND_FROM_ADDRESS
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_FROM_NUMBER
WHATSAPP_ACCESS_TOKEN
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_VERIFY_TOKEN
WHATSAPP_APP_SECRET
AWS_REGION
AWS_S3_BUCKET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
CLOUDFLARE_ZONE_ID
CLOUDFLARE_API_TOKEN
SENTRY_DSN
EAS_PROJECT_ID
APPLE_TEAM_ID
APPLE_KEY_ID
APPLE_ISSUER_ID
CORS_ORIGINS
FOUNDINGOS_WEB_URL
NEXT_PUBLIC_APP_MODE
NEXT_PUBLIC_FOUNDINGOS_API_URL
REQUIRED_INTEGRATIONS
```

Also set (non-secret, but required for the correct runtime mode/behavior):

```text
APP_MODE=production
NODE_ENV=production
SCRAPING_DISABLED=true
OPS_ENABLED=true
WORK_ENABLED=true
INT_ENABLED=true
DEMO_BILLING=false
DEMO_AUTH=false
DEMO_EMAIL=false
DEMO_SMS=false
DEMO_MONITORING=false
DEMO_METERING=false
DEMO_ONBOARDING=false
```

This full list matches `production.example.env` exactly — copy that file to
`.env.production` and fill in every placeholder rather than retyping keys by
hand.

## Release order

1. Create the AWS database, encrypted S3 bucket, ECS services, security groups,
   backups, and alarms.
2. Set production secrets and run `prisma generate` plus migrations for each
   backend from CI.
   Run `npm run verify:production-readiness` before building. Generate
   `INTEGRATION_ENCRYPTION_KEY` with `openssl rand -hex 32`; rotating this key
   requires a reviewed credential re-encryption procedure.
3. Deploy API services and verify `/health`, `/api/v1/ops/whatsapp/status`,
   and tenant-scoped `/api/v1/ops/messaging/readiness`.
4. Configure Cloudflare DNS and CDN routes for the unified web app and API.
5. Generate independent high-entropy JWT access and refresh secrets, configure
   allowed CORS origins, and verify login, refresh rotation, logout, tenant
   isolation, and role enforcement. Configure Clerk only after an intentional
   identity-provider migration.
6. Configure platform subscription billing with FoundingOS Stripe
   products/prices and the global billing webhook. Separately, for every buyer
   using customer payment collection, register
   `/api/v1/ops/stripe/webhook/<tenant-id>` for
   `checkout.session.completed` and save that endpoint's secret with the
   tenant's Stripe key in **Integrations**.
7. Configure Resend and Twilio sender identities and delivery webhooks.
8. Configure Sentry projects, release source maps, alert routing, and on-call
   escalation.
9. Connect a staging WhatsApp Business phone-number ID to one staging tenant,
   authorize test participants, and run the command matrix in
   [release-scorecard.md](./release-scorecard.md).
10. Verify that failed Meta delivery produces an Event Feed risk and that the
    same workflow can be completed in the web workspace.
11. Run web/mobile smoke tests and obtain release approval.
12. Build and submit the single primary FoundingOS mobile application from the
    authorized Apple team. Historical vertical apps are not independent
    products and must not drive release packaging.

## First customer activation

1. Open any production workspace and choose **Initialize a new deployment**.
2. Enter the server-side `PLATFORM_BOOTSTRAP_TOKEN`, business details, and the
   first owner account. The API creates one tenant, all seven workspace
   entitlements, and an audit event.
3. Sign in with the new owner account.
4. In **Integrations**, add provider credentials. Credentials are encrypted
   with AES-256-GCM and are never returned by an API response.
   Configure Meta's callback URL as
   `https://<api-host>/api/v1/ops/whatsapp/webhook/<tenant-id>` so verification,
   signature checks, outbound replies, and message ownership use that tenant's
   encrypted WhatsApp connection.
5. In **Team & access**, invite managers and staff and limit their workspace
   access.
6. In **Settings**, confirm the business identity and request go-live.
7. Call authenticated `GET /api/v1/ops/platform/readiness`. Do not onboard a
   paying customer until `ready` is `true` and `missingIntegrations` is empty.

## Rollback

Keep the previous ECS task definition, web deployment, and database migration
available. Roll back application code first; only roll back schema changes
through a reviewed forward migration.

## Access-gated actions

This repository does not contain provider credentials, AWS account access,
Cloudflare zone access, or Apple App Store Connect credentials. Those actions
must be performed by an authorized release operator.
