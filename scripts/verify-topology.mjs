#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const websites = [
  ['foundingos-web', 3000, 'FoundingOS'],
  ['retail-web', 3001, 'FoundRetail'],
  ['meat-web', 3002, 'FoundMeat'],
  ['foundthat-web', 3003, 'FoundThat'],
  ['talent-web', 3004, 'FoundTalent'],
  ['crypto-web', 3005, 'FoundCrypto'],
  ['finance-web', 3006, 'FoundFinance'],
  ['health-web', 3007, 'FoundHealth'],
  ['logistics-web', 3008, 'FoundLogistics'],
]

const consoles = [
  ['foundingos-console', 4000, 'FoundingOS'],
  ['retail-console-starter', 4001, 'FoundRetail'],
  ['retail-console', 4002, 'FoundRetail'],
  ['meat-console-starter', 4003, 'FoundMeat'],
  ['meat-console', 4004, 'FoundMeat'],
  ['foundthat-console-starter', 4005, 'FoundThat'],
  ['foundthat-console', 4006, 'FoundThat'],
  ['talent-console-starter', 4007, 'FoundTalent'],
  ['talent-console', 4008, 'FoundTalent'],
  ['crypto-console-starter', 4009, 'FoundCrypto'],
  ['crypto-console', 4010, 'FoundCrypto'],
  ['finance-console-starter', 4011, 'FoundFinance'],
  ['finance-console', 4012, 'FoundFinance'],
  ['health-console-starter', 4013, 'FoundHealth'],
  ['health-console', 4014, 'FoundHealth'],
  ['logistics-console-starter', 4015, 'FoundLogistics'],
  ['logistics-console', 4016, 'FoundLogistics'],
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

if (!process.exitCode) console.log('[verify-topology] Full 9-website (3000-3008) / 17-console (4000-4016) ecosystem verified.')
