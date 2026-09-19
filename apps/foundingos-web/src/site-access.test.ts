import assert from 'node:assert/strict'
import { randomBytes, scryptSync } from 'node:crypto'
import test from 'node:test'
import { normalizeAccessEmail, readSiteAccess, safeReturnPath, signSiteAccess, verifySitePassword } from './site-access.js'

test('site password verification uses the configured scrypt hash', () => {
  const salt = randomBytes(16)
  process.env.SITE_ACCESS_PASSWORD_HASH = `scrypt$${salt.toString('hex')}$${scryptSync('shared-test-password', salt, 32).toString('hex')}`
  assert.equal(verifySitePassword('shared-test-password'), true)
  assert.equal(verifySitePassword('wrong-password'), false)
})

test('site password verification accepts any of several distinct issued passwords', () => {
  const entries = ['investor-one-pw', 'investor-two-pw', 'investor-three-pw'].map((password) => {
    const salt = randomBytes(16)
    return `scrypt$${salt.toString('hex')}$${scryptSync(password, salt, 32).toString('hex')}`
  })
  process.env.SITE_ACCESS_PASSWORD_HASH = entries.join(';')
  assert.equal(verifySitePassword('investor-one-pw'), true)
  assert.equal(verifySitePassword('investor-two-pw'), true)
  assert.equal(verifySitePassword('investor-three-pw'), true)
  assert.equal(verifySitePassword('not-issued'), false)
})

test('site access signatures require a sufficiently strong secret', () => {
  process.env.SITE_ACCESS_SECRET = 'short'
  assert.throws(() => signSiteAccess('tester@example.com'))
  process.env.SITE_ACCESS_SECRET = 'a-secure-cookie-signing-secret-with-32-characters'
  assert.match(signSiteAccess('tester@example.com'), /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
})

test('access email addresses are normalized and validated', () => {
  assert.equal(normalizeAccessEmail(' Tester@Example.COM '), 'tester@example.com')
  assert.equal(normalizeAccessEmail('not-an-email'), null)
})

test('signed access identifies the visitor until expiry', () => {
  process.env.SITE_ACCESS_SECRET = 'a-secure-cookie-signing-secret-with-32-characters'
  const now = Date.now()
  const token = signSiteAccess('Tester@Example.com', now)
  assert.deepEqual(readSiteAccess(token, now), {
    email: 'tester@example.com',
    expiresAt: now + 7 * 24 * 60 * 60 * 1000,
  })
  assert.equal(readSiteAccess(token, now + 8 * 24 * 60 * 60 * 1000), null)
  assert.equal(readSiteAccess(`${token}tampered`, now), null)
})

test('return paths cannot redirect to another host', () => {
  assert.equal(safeReturnPath('/test-workspaces'), '/test-workspaces')
  assert.equal(safeReturnPath('//malicious.example'), '/')
  assert.equal(safeReturnPath('https://malicious.example'), '/')
})
