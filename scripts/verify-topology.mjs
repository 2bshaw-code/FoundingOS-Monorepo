#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const websites = [
  ['foundingos-web', 3000, null],
  ['core-operations-web', 3001, 'core_operations'],
  ['core-intelligence-web', 3003, 'core_intelligence'],
  ['core-workforce-web', 3004, 'core_workforce'],
]

const consoles = [
  ['foundingos-console', 4000, null],
  ['core-operations-console-starter', 4001, 'core_operations'],
  ['core-operations-console', 4002, 'core_operations'],
  ['core-intelligence-console-starter', 4005, 'core_intelligence'],
  ['core-intelligence-console', 4006, 'core_intelligence'],
  ['core-workforce-console-starter', 4007, 'core_workforce'],
  ['core-workforce-console', 4008, 'core_workforce'],
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

const config = readFileSync(join(root, 'packages/config/src/suites.ts'), 'utf8')
for (const suite of new Set(endpoints.map(([, , suiteKey]) => suiteKey).filter(Boolean))) {
  if (!config.includes(`${suite}: {`)) {
    fail(`suite config does not declare ${suite}.`)
  }
}

if (process.argv.includes('--live')) {
  for (const [app, port] of endpoints) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(10_000) })
      if (!response.ok) {
        fail(`${app} on port ${port} returned ${response.status}.`)
      }
    } catch (error) {
      fail(`${app} on port ${port} is unavailable: ${error.message}`)
    }
  }
}

if (!process.exitCode) console.log('[verify-topology] One FoundingOS surface, three suite websites, and seven suite consoles verified.')
