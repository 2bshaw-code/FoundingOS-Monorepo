#!/usr/bin/env node

const required = [
  'DATABASE_URL',
  'AUTH_ACCESS_TOKEN_SECRET',
  'AUTH_REFRESH_TOKEN_SECRET',
  'PLATFORM_BOOTSTRAP_TOKEN',
  'INTEGRATION_ENCRYPTION_KEY',
  'FOUNDINGOS_WEB_URL',
  'NEXT_PUBLIC_FOUNDINGOS_API_URL',
  'CORS_ORIGINS',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'WHATSAPP_ACCESS_TOKEN',
  'WHATSAPP_PHONE_NUMBER_ID',
  'WHATSAPP_VERIFY_TOKEN',
  'WHATSAPP_APP_SECRET',
]

const failures = []
const checks = []
const check = (name, passed, detail) => {
  checks.push({ name, passed, detail })
  if (!passed) failures.push(`${name}: ${detail}`)
}

check('runtime mode', process.env.APP_MODE === 'production', 'APP_MODE must equal production')
check('scraping disabled', process.env.SCRAPING_DISABLED === 'true', 'SCRAPING_DISABLED must equal true')
for (const name of required) check(name, Boolean(process.env[name]?.trim()), `${name} is required`)
if (process.env.SITE_ACCESS_ENABLED === 'true') {
  check('SITE_ACCESS_PASSWORD_HASH', Boolean(process.env.SITE_ACCESS_PASSWORD_HASH?.trim()), 'SITE_ACCESS_PASSWORD_HASH is required when site access is enabled')
  check('SITE_ACCESS_SECRET', Boolean(process.env.SITE_ACCESS_SECRET?.trim()) && process.env.SITE_ACCESS_SECRET.trim().length >= 32, 'SITE_ACCESS_SECRET must contain at least 32 characters')
  check('TESTER_SESSION_SECRET', Boolean(process.env.TESTER_SESSION_SECRET?.trim()), 'TESTER_SESSION_SECRET is required so founder sessions can bypass the tester gate')
}

for (const name of ['FOUNDINGOS_WEB_URL', 'NEXT_PUBLIC_FOUNDINGOS_API_URL']) {
  if (!process.env[name]) continue
  try {
    const url = new URL(process.env[name])
    check(`${name} protocol`, url.protocol === 'https:', `${name} must use HTTPS`)
  } catch {
    check(`${name} format`, false, `${name} must be a valid URL`)
  }
}

if (process.env.INTEGRATION_ENCRYPTION_KEY) {
  const value = process.env.INTEGRATION_ENCRYPTION_KEY
  const key = /^[0-9a-f]{64}$/i.test(value) ? Buffer.from(value, 'hex') : Buffer.from(value, 'base64')
  check('integration encryption key', key.length === 32, 'INTEGRATION_ENCRYPTION_KEY must decode to 32 bytes')
}

if (process.argv.includes('--live') && process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL && process.env.FOUNDINGOS_WEB_URL) {
  const apiHealth = `${process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL.replace(/\/api\/v1\/?$/, '')}/health`
  for (const [name, url] of [['API health', apiHealth], ['web application', process.env.FOUNDINGOS_WEB_URL]]) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(10_000) })
      check(name, response.ok, `${url} returned ${response.status}`)
    } catch (error) {
      check(name, false, `${url} could not be reached: ${error instanceof Error ? error.message : 'unknown error'}`)
    }
  }
}

for (const item of checks) console.log(`${item.passed ? 'PASS' : 'FAIL'} ${item.name}${item.passed ? '' : ` — ${item.detail}`}`)
if (failures.length) {
  console.error(`\nProduction readiness failed with ${failures.length} blocking check(s).`)
  process.exit(1)
}
console.log('\nProduction environment readiness checks passed.')
