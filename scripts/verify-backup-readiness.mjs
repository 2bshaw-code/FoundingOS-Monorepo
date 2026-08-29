#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const security = JSON.parse(readFileSync(join(root, 'config/backup-security.json'), 'utf8'))
const snapshot = JSON.parse(readFileSync(join(root, 'scripts/ecosystem-snapshot-spec.json'), 'utf8'))
const requiredBrands = ['FoundRetail', 'FoundMeat', 'FoundThat', 'FoundTalent', 'FoundCrypto', 'FoundingOS']

function fail(message) {
  console.error(`[verify-backup-readiness] ${message}`)
  process.exitCode = 1
}

if (JSON.stringify(snapshot.brands) !== JSON.stringify(requiredBrands) || snapshot.applications.length !== 12) {
  fail('Snapshot specification must contain exactly the locked six brands and twelve applications.')
}

for (const path of [...snapshot.applications, ...snapshot.sharedServices, snapshot.database.schema, snapshot.database.migrations]) {
  if (!existsSync(join(root, path))) fail(`Required snapshot path is missing: ${path}`)
}

const brandConfig = readFileSync(join(root, 'packages/config/src/index.ts'), 'utf8')
for (const capability of snapshot.requiredCapabilities) {
  if (!brandConfig.includes(`'${capability}'`)) {
    fail(`Required capability is not wired into the FoundingOS module registry: ${capability}`)
  }
}

try {
  execFileSync('security', ['find-generic-password', '-s', security.keychainService], { stdio: 'ignore' })
} catch {
  fail(`No password is stored in the macOS Keychain service "${security.keychainService}".`)
}

for (const [label, location] of Object.entries({
  'remote location A': security.remoteLocationA,
  'remote location B': security.remoteLocationB,
})) {
  if (!existsSync(location) || !statSync(location).isDirectory()) fail(`${label} is not configured and reachable: ${location}`)
}

if (!process.exitCode) console.log('[verify-backup-readiness] Password and both remote destinations are securely configured.')
