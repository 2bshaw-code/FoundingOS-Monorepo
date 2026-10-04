import assert from 'node:assert/strict'
import test from 'node:test'
import { createCorsOptions } from '../src/cors.js'

test('browser record creation permits its idempotency header', () => {
  const options = createCorsOptions(['https://www.foundingos.com'])
  assert.ok(options.allowedHeaders.includes('Idempotency-Key'))
  assert.ok(options.methods.includes('POST'))
  assert.equal(options.credentials, true)
})

test('adding the record header does not relax the origin allowlist', () => {
  const options = createCorsOptions(['https://www.foundingos.com'])
  options.origin('https://www.foundingos.com', (error, allowed) => {
    assert.equal(error, null)
    assert.equal(allowed, true)
  })
  options.origin('https://untrusted.example', (error, allowed) => {
    assert.match(error!.message, /Origin not allowed/)
    assert.equal(allowed, undefined)
  })
})
