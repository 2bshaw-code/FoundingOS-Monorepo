#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Real, current port scheme (updated from the original 3000-3008/4000-4016 scheme after an
// earlier port reassignment to avoid conflicts with other common dev-server defaults — see
// packages/config/src/index.ts, which already reflects these same real ports). This script had
// gone stale and was failing on every run since that reassignment, because it was never updated
// to match — caught and fixed during this session's CI audit.
const websites = [
  ['foundingos-web', 1000, 'FoundingOS'],
  ['retail-web', 1001, 'FoundRetail'],
  ['meat-web', 1002, 'FoundMeat'],
  ['foundthat-web', 1003, 'FoundThat'],
  ['talent-web', 1004, 'FoundTalent'],
  ['crypto-web', 1005, 'FoundCrypto'],
  ['finance-web', 1006, 'FoundFinance'],
  ['health-web', 1007, 'FoundHealth'],
  ['logistics-web', 1008, 'FoundLogistics'],
]

const consoles = [
  ['foundingos-console', 8000, 'FoundingOS'],
  ['retail-console-starter', 8001, 'FoundRetail'],
  ['retail-console', 8017, 'FoundRetail'],
  ['meat-console-starter', 8002, 'FoundMeat'],
  ['meat-console', 8018, 'FoundMeat'],
  ['foundthat-console-starter', 8003, 'FoundThat'],
  ['foundthat-console', 8019, 'FoundThat'],
  ['talent-console-starter', 8004, 'FoundTalent'],
  ['talent-console', 8020, 'FoundTalent'],
  ['crypto-console-starter', 8005, 'FoundCrypto'],
  ['crypto-console', 8021, 'FoundCrypto'],
  ['finance-console-starter', 8006, 'FoundFinance'],
  ['finance-console', 8022, 'FoundFinance'],
  ['health-console-starter', 8007, 'FoundHealth'],
  ['health-console', 8023, 'FoundHealth'],
  ['logistics-console-starter', 8008, 'FoundLogistics'],
  ['logistics-console', 8024, 'FoundLogistics'],
]

const endpoints = [...websites, ...consoles]

function fail(message) {
  console.error(`[verify-topology] ${message}`)
  process.exitCode = 1
}

for (const [app, port] of endpoints) {
  const manifest = JSON.parse(readFileSync(join(root, 'apps', app, 'package.json'), 'utf8'))
  const expected = `-p ${port}`
  if (manifest.scripts.dev !== `next dev ${expected}` || manifest.scripts.start !== `next start ${expected}`) {
    fail(`${app} must use port ${port} for both dev and start.`)
  }
}

const config = readFileSync(join(root, 'packages/config/src/index.ts'), 'utf8')
const brandPorts = new Map()
for (const [, port, brand] of endpoints) {
  if (!brandPorts.has(brand)) brandPorts.set(brand, [])
  brandPorts.get(brand).push(port)
}
for (const [brand, ports] of brandPorts) {
  if (!config.includes(brand)) {
    fail(`brand config does not declare ${brand}.`)
    continue
  }
  if (!ports.some((port) => config.includes(`localhost:${port}`))) {
    fail(`brand config does not declare ${brand} at any of its expected ports (${ports.join(', ')}).`)
  }
}

if (process.argv.includes('--live')) {
  for (const [, port, brand] of endpoints) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(10_000) })
      const page = await response.text()
      if (!response.ok || !page.includes(brand)) {
        fail(`port ${port} did not render ${brand} (${response.status}).`)
      }
    } catch (error) {
      fail(`port ${port} is unavailable: ${error.message}`)
    }
  }
}

if (!process.exitCode) console.log('[verify-topology] Full 9-website (1000-1008) / 17-console (8000-8024) ecosystem verified.')
