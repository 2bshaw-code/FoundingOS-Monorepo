#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const sources = [
  '.env',
  '.env.local',
  'apps/foundingos-web/.env.local',
  'core-operations/backend/.env',
  'core-operations/frontend/.env',
  'core-workforce/backend/.env',
  'core-workforce/frontend/.env',
]
const allowed = new Set([
  'CLERK_SECRET_KEY', 'CLERK_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PRICE_STARTER', 'STRIPE_PRICE_GROWTH', 'STRIPE_PRICE_ENTERPRISE',
  'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM_NUMBER',
  'RESEND_API_KEY', 'RESEND_FROM_ADDRESS', 'SENTRY_DSN',
  'AWS_REGION', 'AWS_S3_BUCKET', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY',
  'CLOUDFLARE_ZONE_ID', 'CLOUDFLARE_API_TOKEN',
  'EAS_PROJECT_ID', 'APPLE_TEAM_ID', 'APPLE_KEY_ID', 'APPLE_ISSUER_ID',
  'API_BASE_URL', 'NEXT_PUBLIC_API_URL', 'FOUNDER_API_URL',
])

const values = new Map()
for (const relativePath of sources) {
  const path = resolve(root, relativePath)
  if (!existsSync(path)) continue
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match || !allowed.has(match[1]) || values.has(match[1])) continue
    values.set(match[1], match[2])
  }
}

const output = [
  '# Generated locally from ignored legacy env files. Never commit this file.',
  'APP_MODE=demo',
  'NODE_ENV=development',
  'DATABASE_URL=file:./.data/foundingos-demo.db',
  'DIRECT_URL=file:./.data/foundingos-demo.db',
  'SCRAPING_DISABLED=true',
  'DEMO_BILLING=true',
  'DEMO_AUTH=true',
  'DEMO_EMAIL=true',
  'DEMO_SMS=true',
  'DEMO_MONITORING=true',
  'DEMO_METERING=true',
  'DEMO_ONBOARDING=true',
  ...[...values.entries()].map(([key, value]) => `${key}=${value}`),
  '',
].join('\n')

writeFileSync(resolve(root, '.env.demo.local'), output, { mode: 0o600 })
console.log(`Wrote .env.demo.local with ${values.size} allowlisted legacy settings; values were not printed.`)
