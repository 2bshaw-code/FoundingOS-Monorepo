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
  TMPDIR: process.env.DEMO_TMPDIR || process.env.TMPDIR,
}

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
