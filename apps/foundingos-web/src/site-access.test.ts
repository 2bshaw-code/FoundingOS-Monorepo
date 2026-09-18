import assert from 'node:assert/strict'
import { randomBytes, scryptSync } from 'node:crypto'
import test from 'node:test'
import { normalizeAccessEmail, safeReturnPath, signSiteAccess, verifySitePassword } from './site-access.js'

test('site password verification uses the configured scrypt hash', () => {
  const salt = randomBytes(16)
  process.env.SITE_ACCESS_PASSWORD_HASH = `scrypt$${salt.toString('hex')}$${scryptSync('shared-test-password', salt, 32).toString('hex')}`
  assert.equal(verifySitePassword('shared-test-password'), true)
  assert.equal(verifySitePassword('wrong-password'), false)
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

test('return paths cannot redirect to another host', () => {
  assert.equal(safeReturnPath('/test-workspaces'), '/test-workspaces')
  assert.equal(safeReturnPath('//malicious.example'), '/')
  assert.equal(safeReturnPath('https://malicious.example'), '/')
})
