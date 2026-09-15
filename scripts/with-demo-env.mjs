#!/usr/bin/env node
import { spawn } from 'node:child_process'

const [, , command, ...args] = process.argv
if (!command) {
  console.error('Usage: node scripts/with-demo-env.mjs <command> [args...]')
  process.exit(2)
}

const env = {
  ...process.env,
  APP_MODE: 'demo',
  NEXT_PUBLIC_APP_MODE: 'demo',
  EXPO_PUBLIC_APP_MODE: 'demo',
  DEMO_BILLING: 'true',
  DEMO_AUTH: 'true',
  DEMO_EMAIL: 'true',
  DEMO_SMS: 'true',
  DEMO_MONITORING: 'true',
  DEMO_METERING: 'true',
  DEMO_ONBOARDING: 'true',
  // Keep Metro/Expo caches and temp files off the iCloud-synced Desktop path — iCloud's
  // fileproviderd/brctl frequently stalls large numbers of small-file writes there.
  TMPDIR: process.env.DEMO_TMPDIR || process.env.TMPDIR,
}

// Resolve bare command names (e.g. "next", "expo") through the local
// node_modules/.bin the same way an npm script would, since we are invoked
// directly with `node scripts/with-demo-env.mjs <command>` and don't inherit
// npm's PATH prepending.
env.PATH = [
  `${process.cwd()}/node_modules/.bin`,
  `${process.cwd()}/../../node_modules/.bin`,
  process.env.PATH,
].join(':')

const child = spawn(command, args, { stdio: 'inherit', env, shell: false })
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 1)
})
