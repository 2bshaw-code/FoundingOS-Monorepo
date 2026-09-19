import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import test from 'node:test'
import { verifyFounderSession } from './founder-session.js'

const base64Url = (value: string | Buffer) => Buffer.from(value).toString('base64url')
const token = (scope: string, id: string, secret: string) => {
  const payload = `${scope}:${id}:1800000000000`
  return `${base64Url(payload)}.${base64Url(createHmac('sha256', secret).update(payload).digest())}`
}

test('only the existing super founder admin session bypasses site access', async () => {
  const secret = 'shared-console-session-secret'
  assert.equal(await verifyFounderSession(token('admin', 'super-founder-admin', secret), secret), true)
  assert.equal(await verifyFounderSession(token('tester', 'super-founder-admin', secret), secret), false)
  assert.equal(await verifyFounderSession(token('admin', 'another-admin', secret), secret), false)
  assert.equal(await verifyFounderSession(token('admin', 'super-founder-admin', 'wrong-secret'), secret), false)
  assert.equal(await verifyFounderSession(undefined, secret), false)
})
