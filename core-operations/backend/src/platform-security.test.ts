import assert from 'node:assert/strict'
import test from 'node:test'
import {
  assertExpectedVersion,
  decryptIntegrationCredentials,
  encryptIntegrationCredentials,
  isActiveIdempotencyRecord,
  roleCanAccessWorkspace,
  verifyBootstrapToken,
} from './platform-security.js'

test('integration credentials round-trip through authenticated encryption', () => {
  process.env.INTEGRATION_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64')
  const credentials = { secretKey: 'sk_test_private', webhookSecret: 'whsec_private' }
  const encrypted = encryptIntegrationCredentials(credentials)

  assert.notEqual(encrypted.credentialsCiphertext, JSON.stringify(credentials))
  assert.equal(encrypted.credentialsCiphertext.includes('sk_test_private'), false)
  assert.deepEqual(decryptIntegrationCredentials(encrypted), credentials)

  const tampered = { ...encrypted, credentialsCiphertext: `${encrypted.credentialsCiphertext.slice(0, -2)}AA` }
  assert.throws(() => decryptIntegrationCredentials(tampered))
})

test('credential encryption rejects missing and incorrectly sized keys', () => {
  delete process.env.INTEGRATION_ENCRYPTION_KEY
  assert.throws(() => encryptIntegrationCredentials({ token: 'private' }), { message: 'INTEGRATION_ENCRYPTION_KEY is required to store provider credentials' })
  process.env.INTEGRATION_ENCRYPTION_KEY = Buffer.alloc(16).toString('base64')
  assert.throws(() => encryptIntegrationCredentials({ token: 'private' }), { message: 'INTEGRATION_ENCRYPTION_KEY must decode to exactly 32 bytes' })
})

test('bootstrap authorization fails closed and uses the configured token', () => {
  delete process.env.PLATFORM_BOOTSTRAP_TOKEN
  assert.equal(verifyBootstrapToken(undefined), false)
  assert.equal(verifyBootstrapToken('candidate'), false)
  process.env.PLATFORM_BOOTSTRAP_TOKEN = 'deployment-secret'
  assert.equal(verifyBootstrapToken(undefined), false)
  assert.equal(verifyBootstrapToken('wrong'), false)
  assert.equal(verifyBootstrapToken('deployment-secret'), true)
})

test('workspace permissions enforce staff scope while privileged roles retain access', () => {
  assert.equal(roleCanAccessWorkspace('business_owner', {}, 'finance'), true)
  assert.equal(roleCanAccessWorkspace('business_manager', {}, 'health'), true)
  assert.equal(roleCanAccessWorkspace('business_staff', { workspaces: ['retail', 'marketing'] }, 'marketing'), true)
  assert.equal(roleCanAccessWorkspace('business_staff', { workspaces: ['retail'] }, 'finance'), false)
  assert.equal(roleCanAccessWorkspace('business_staff', null, 'retail'), false)
})

test('idempotency records expire and optimistic versions reject stale writes', () => {
  const now = new Date('2026-09-18T08:00:00.000Z')
  assert.equal(isActiveIdempotencyRecord({ expiresAt: new Date('2026-09-18T08:00:01.000Z') }, now), true)
  assert.equal(isActiveIdempotencyRecord({ expiresAt: now }, now), false)
  assert.equal(isActiveIdempotencyRecord(null, now), false)

  assert.doesNotThrow(() => assertExpectedVersion(undefined, 4))
  assert.doesNotThrow(() => assertExpectedVersion(4, 4))
  assert.throws(() => assertExpectedVersion(3, 4), { message: 'Record changed since it was loaded', status: 409 })
})
