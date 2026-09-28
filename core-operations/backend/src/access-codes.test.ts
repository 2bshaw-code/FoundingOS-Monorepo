import assert from 'node:assert/strict'
import { randomBytes, scryptSync } from 'node:crypto'
import test from 'node:test'
import { accessCodeRole, verifyInvestorCode } from './auth.js'

const hash = (code: string) => { const salt = randomBytes(16); return `scrypt$${salt.toString('hex')}$${scryptSync(code, salt, 64).toString('hex')}` }

test('access codes resolve to partner, view-only investor or tester', () => {
  process.env.INVESTOR_ACCESS_HASH = [`partner:${hash('partner-code')}`, `investor:${hash('viewer-code')}`, hash('legacy-code')].join(';')
  process.env.TESTER_ACCESS_HASH = `tester:${hash('tester-code')}`
  assert.equal(accessCodeRole('partner-code'), 'partner')
  assert.equal(accessCodeRole('viewer-code'), 'investor')
  assert.equal(accessCodeRole('legacy-code'), 'investor')
  assert.equal(accessCodeRole('tester-code'), 'tester')
  assert.equal(accessCodeRole('wrong'), null)
  assert.equal(accessCodeRole(''), null)
  assert.equal(verifyInvestorCode('partner-code'), true)
  assert.equal(verifyInvestorCode('tester-code'), false)
})
