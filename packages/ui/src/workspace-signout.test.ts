import assert from 'node:assert/strict'
import { test } from 'node:test'
import { logoutProduction, signOutOfFoundingOS } from './workspace-production-client'

test('sign-out clears local access before revocation and submits website logout even on failure', async () => {
  let stored: string | null = JSON.stringify({ accessToken: 'test', refreshToken: 'test', user: { role: 'owner' } })
  let submitted = false
  let logged = false
  const form = { method: '', action: '', submit: () => { submitted = true } }
  const originalFetch = globalThis.fetch
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document')
  const originalError = console.error
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage: { getItem: () => stored, removeItem: () => { stored = null } } } })
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { createElement: () => form, body: { appendChild: () => {} } } })
  console.error = () => { logged = true }
  globalThis.fetch = async () => { assert.equal(stored, null); throw new Error('Offline') }
  try {
    await signOutOfFoundingOS()
    assert.equal(stored, null)
    assert.equal(submitted, true)
    assert.equal(form.method, 'post')
    assert.equal(form.action, '/api/access/logout')
    assert.equal(logged, true)
    submitted = false
    await logoutProduction()
    assert.equal(submitted, false)
  } finally {
    globalThis.fetch = originalFetch
    console.error = originalError
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
    else Reflect.deleteProperty(globalThis, 'window')
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument)
    else Reflect.deleteProperty(globalThis, 'document')
  }
})
