import assert from 'node:assert/strict'
import test from 'node:test'
import { openAccountHandoff, sealAccountHandoff } from './account-handoff'

test('account handoff is encrypted, short-lived and bound to identity and device', () => {
  process.env.SITE_ACCESS_SECRET = 'test-only-secret-that-is-at-least-32-characters'
  const value = sealAccountHandoff('qa@example.com', 'private-refresh-token', 'device-one', 1000)
  assert.ok(!value.includes('private-refresh-token'))
  assert.equal(openAccountHandoff(value, 'qa@example.com', 'device-one', 2000), 'private-refresh-token')
  assert.equal(openAccountHandoff(value, 'different@example.com', 'device-one', 2000), null)
  assert.equal(openAccountHandoff(value, 'qa@example.com', 'different-device', 2000), null)
  assert.equal(openAccountHandoff(value, 'qa@example.com', 'device-one', 121000), null)
  assert.equal(openAccountHandoff(value.slice(0, -8) + 'tampered', 'qa@example.com', 'device-one', 2000), null)
  assert.equal(openAccountHandoff(undefined, 'qa@example.com', 'device-one', 2000), null)
})
