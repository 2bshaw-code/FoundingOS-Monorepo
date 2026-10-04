import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('customer launch links real registered modules and distinguishes simulation', () => {
  const source = readFileSync(new URL('./customer-launch.tsx', import.meta.url), 'utf8')
  for (const path of ['/retail/products', '/retail/integrations#whatsapp-setup', '/retail/inbox']) assert.ok(source.includes(path))
  assert.ok(source.includes('Catalogue status unavailable'))
  assert.ok(source.includes('Demo walkthrough'))
})

test('production record forms and inbox do not imply simulated actions are real', () => {
  const source = readFileSync(new URL('./complete-workspace-application.tsx', import.meta.url), 'utf8')
  assert.ok(source.includes('production={production}'))
  assert.ok(source.includes('production ? <option>Unassigned</option>'))
  assert.ok(source.includes('Price in GBP, e.g. 12.50'))
  assert.ok(source.includes('disabled={production || !replyDraft.trim()}'))
  assert.ok(source.includes('Demo reply simulated - no message sent'))
})

test('configured integrations are never reported as verified connections', () => {
  const source = readFileSync(new URL('./complete-workspace-application.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /connected: item\.status === 'ready' \|\| item\.status === 'configured'/)
  assert.ok(source.includes("connected: item.status === 'ready'"))
  assert.ok(source.includes('Credentials verified'))
  assert.ok(source.includes('Demo connected'))
})

test('WhatsApp guide separates credential checks from actual message delivery', () => {
  const source = readFileSync(new URL('./whatsapp-setup.tsx', import.meta.url), 'utf8')
  for (const text of ['Company callback URL', 'Verify token', 'messages', 'Temporary access tokens expire', 'opted-in test phone', 'not one-click Meta embedded signup', 'do not include tokens or secrets', 'Refresh connection checks']) assert.ok(source.includes(text))
  const client = readFileSync(new URL('./workspace-production-client.ts', import.meta.url), 'utf8')
  assert.ok(client.includes('/ops/whatsapp/webhook/${encodeURIComponent(tenantId)}'))
})

test('live inbox reads backend threads and sends consented replies with duplicate protection', () => {
  const source = readFileSync(new URL('./live-whatsapp-inbox.tsx', import.meta.url), 'utf8')
  for (const text of ['/messaging/inbox', 'Idempotency-Key', 'body, consent', 'Meta accepted your reply', '24-hour reply window']) assert.ok(source.includes(text))
  assert.ok(!source.includes('messageBody('))
  const workspace = readFileSync(new URL('./complete-workspace-application.tsx', import.meta.url), 'utf8')
  assert.ok(workspace.includes("production && current.id === 'inbox'"))
})
