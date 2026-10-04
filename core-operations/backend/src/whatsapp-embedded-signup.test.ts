import assert from 'node:assert/strict'
import test from 'node:test'
import { countsTowardServiceWindow, extractCoexistenceEvents } from './whatsapp-coexistence.js'
import { completeEmbeddedSignup, parseEmbeddedSignupInput, runCoexistenceSync, type GraphCall } from './whatsapp-embedded-signup.js'

const env = { appId: '1541191037694867', appSecret: 'secret', configId: '999999', graphVersion: 'v25.0' }
const metadata = { phone_number_id: '111', display_phone_number: '+44 7700 900123' }

test('extracts business app echoes as outbound', () => {
  const events = extractCoexistenceEvents({ entry: [{ changes: [{ field: 'smb_message_echoes', value: { metadata, message_echoes: [{ from: '447700900123', to: '447700900999', id: 'wamid.E1', timestamp: '1700000000', type: 'text', text: { body: 'On its way' } }] } }] }] })
  assert.deepEqual(events.messages, [{ phoneNumberId: '111', id: 'wamid.E1', counterpart: '447700900999', direction: 'outbound', source: 'echo', type: 'text', body: 'On its way', timestamp: 1700000000, status: 'sent' }])
})

test('extracts history with direction and declined sharing', () => {
  const events = extractCoexistenceEvents({ entry: [{ changes: [
    { field: 'history', value: { metadata, history: [{ metadata: { phase: 0 }, threads: [{ id: '447700900999', messages: [
      { from: '447700900999', id: 'wamid.H1', timestamp: '1690000000', type: 'text', text: { body: 'Hi' }, history_context: { status: 'READ' } },
      { from: '447700900123', to: '447700900999', id: 'wamid.H2', timestamp: '1690000100', type: 'image', image: { caption: 'Photo' }, history_context: { status: 'DELIVERED' } },
    ] }] }] } },
    { field: 'history', value: { metadata, history: [{ errors: [{ code: 2593109 }] }] } },
  ] }] })
  assert.deepEqual(events.messages.map((m) => [m.id, m.direction, m.status, m.body]), [['wamid.H1', 'inbound', 'received', 'Hi'], ['wamid.H2', 'outbound', 'delivered', 'Photo']])
  assert.deepEqual(events.historyDeclined, ['111'])
})

test('ignores normal message webhooks and malformed payloads', () => {
  assert.deepEqual(extractCoexistenceEvents({ entry: [{ changes: [{ field: 'messages', value: { metadata, messages: [{ id: 'x' }] } }] }] }), { messages: [], historyDeclined: [] })
  assert.deepEqual(extractCoexistenceEvents(null), { messages: [], historyDeclined: [] })
  assert.deepEqual(countsTowardServiceWindow, { OR: [{ intent: null }, { intent: { not: 'history_import' } }] })
})

test('validates sign-up input', () => {
  assert.throws(() => parseEmbeddedSignupInput({}), /sign-up code/)
  assert.throws(() => parseEmbeddedSignupInput({ code: 'c', wabaId: 'abc' }), /valid Meta ID/)
  assert.deepEqual(parseEmbeddedSignupInput({ code: ' c ', event: 'finish', wabaId: '123456' }), { code: 'c', event: 'FINISH', wabaId: '123456', phoneNumberId: undefined, businessId: undefined })
})

const fakeGraph = (phones: any[], calls: string[]): GraphCall => async (method, path, options) => {
  calls.push(`${method} ${path}${options?.body ? ` ${JSON.stringify(options.body)}` : ''}`)
  if (path === 'oauth/access_token') return { access_token: 'business-token' }
  if (path === 'debug_token') return { data: { granular_scopes: [{ scope: 'whatsapp_business_management', target_ids: ['555555'] }] } }
  if (path.endsWith('/phone_numbers')) return { data: phones }
  if (path.endsWith('/smb_app_data')) return { request_id: `req-${options?.body?.sync_type}` }
  return { success: true }
}

test('onboards a new Cloud API number and registers it', async () => {
  const calls: string[] = []
  const result = await completeEmbeddedSignup(fakeGraph([{ id: '222', display_phone_number: '+44 1', is_on_biz_app: false }], calls), env, { code: 'c', event: 'FINISH', wabaId: '555555', phoneNumberId: '222' }, () => '123456')
  assert.equal(result.coexistence, false)
  assert.equal(result.twoStepPin, '123456')
  assert.deepEqual(calls.slice(2), ['POST 555555/subscribed_apps', 'POST 222/register {"messaging_product":"whatsapp","pin":"123456"}'])
})

test('onboards a WhatsApp Business app number without registering, finding the WABA from the token', async () => {
  const calls: string[] = []
  const result = await completeEmbeddedSignup(fakeGraph([{ id: '333', is_on_biz_app: true, platform_type: 'CLOUD_API' }], calls), env, { code: 'c', event: 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING' })
  assert.equal(result.coexistence, true)
  assert.equal(result.wabaId, '555555')
  assert.equal(result.phone.id, '333')
  assert.ok(!calls.some((call) => call.includes('/register')))
})

test('rejects a phone that is not in the selected account and disabled config', async () => {
  await assert.rejects(completeEmbeddedSignup(fakeGraph([{ id: '222' }], []), env, { code: 'c', wabaId: '555555', phoneNumberId: '999' }), /does not belong/)
  await assert.rejects(completeEmbeddedSignup(fakeGraph([], []), { ...env, configId: '' }, { code: 'c' }), /not enabled/)
})

test('runs each coexistence sync once within 24 hours', async () => {
  const calls: string[] = []
  const now = new Date('2026-01-01T10:00:00Z')
  const state = await runCoexistenceSync(fakeGraph([], calls), 't', '333', { onboardedAt: '2026-01-01T09:00:00Z' }, now)
  assert.equal(state.contacts?.requestId, 'req-smb_app_state_sync')
  assert.equal(state.history?.requestId, 'req-history')
  await runCoexistenceSync(fakeGraph([], calls), 't', '333', state, now)
  assert.equal(calls.length, 2)
  await assert.rejects(runCoexistenceSync(fakeGraph([], []), 't', '333', { onboardedAt: '2025-12-30T09:00:00Z' }, now), /24 hours/)
})
