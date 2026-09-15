#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const websites = [
  ['foundingos-web', 3000, 'FoundingOS'],
  ['retail-web', 3001, 'CoreOperations'],
  ['meat-web', 3002, 'CoreOperations'],
  ['core_intelligence-web', 3003, 'CoreIntelligence'],
  ['talent-web', 3004, 'CoreWorkforce'],
  ['crypto-web', 3005, 'CoreOperations'],
  ['finance-web', 3006, 'CoreOperations'],
  ['health-web', 3007, 'CoreOperations'],
  ['logistics-web', 3008, 'CoreOperations'],
]

const consoles = [
  ['foundingos-console', 4000, 'FoundingOS'],
  ['retail-console-starter', 4001, 'CoreOperations'],
  ['retail-console', 4002, 'CoreOperations'],
  ['meat-console-starter', 4003, 'CoreOperations'],
  ['meat-console', 4004, 'CoreOperations'],
  ['core_intelligence-console-starter', 4005, 'CoreIntelligence'],
  ['core_intelligence-console', 4006, 'CoreIntelligence'],
  ['talent-console-starter', 4007, 'CoreWorkforce'],
  ['talent-console', 4008, 'CoreWorkforce'],
  ['crypto-console-starter', 4009, 'CoreOperations'],
  ['crypto-console', 4010, 'CoreOperations'],
  ['finance-console-starter', 4011, 'CoreOperations'],
  ['finance-console', 4012, 'CoreOperations'],
  ['health-console-starter', 4013, 'CoreOperations'],
  ['health-console', 4014, 'CoreOperations'],
  ['logistics-console-starter', 4015, 'CoreOperations'],
  ['logistics-console', 4016, 'CoreOperations'],
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
