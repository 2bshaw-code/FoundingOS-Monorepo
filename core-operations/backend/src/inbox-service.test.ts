import assert from 'node:assert/strict'
import test from 'node:test'
import { createInboxReplyService, type InboxMessage, type InboxRepository } from './inbox-service.js'
import { assertWebhookPhone, extractWhatsAppDeliveries, statusesNotToDowngrade } from './whatsapp-delivery.js'

function fixture() {
  const messages = new Map<string, InboxMessage>()
  let inbound = new Date()
  let calls = 0
  let failure = false
  const repository: InboxRepository = {
    conversation: async (tenantId, id) => tenantId === 'company-one' && id === 'thread-one' ? { id, channel: 'whatsapp', participantAddress: '447700900000', lastMessageAt: new Date() } : null,
    latestInbound: async () => inbound,
    byRequestKey: async (_tenantId, key) => messages.get(key) ?? null,
    queue: async (_tenantId, _conversation, key, body) => {
      const message = { id: key, providerMessageId: `pending-${key}`, body, direction: 'outbound', messageType: 'text', status: 'queued', createdAt: new Date() }
      messages.set(key, message)
      return message
    },
    accepted: async (id, providerMessageId) => {
      const message = messages.get(id)!
      message.status = 'sent'
      message.providerMessageId = providerMessageId
      return message
    },
    failed: async (id) => { messages.get(id)!.status = 'failed' },
  }
  const reply = createInboxReplyService(repository, async () => {
    calls += 1
    if (failure) throw new Error('Meta rejected this token')
    return 'wamid.confirmed'
  })
  return { reply, messages, calls: () => calls, expire: () => { inbound = new Date(Date.now() - 24 * 60 * 60_000) }, fail: () => { failure = true } }
}

test('a real reply stores provider acceptance and deduplicates retried requests', async () => {
  const f = fixture()
  const input = { body: 'Hello back', consent: true }
  const sent = await f.reply('company-one', 'thread-one', input, 'request-key-123456')
  assert.equal(sent.status, 'sent')
  assert.equal(sent.providerMessageId, 'wamid.confirmed')
  await f.reply('company-one', 'thread-one', input, 'request-key-123456')
  assert.equal(f.calls(), 1)
  await assert.rejects(() => f.reply('company-one', 'thread-one', { ...input, body: 'Different reply' }, 'request-key-123456'), /different reply/)
})

test('tenant isolation, consent, text length and reply window are enforced before send', async () => {
  const f = fixture()
  await assert.rejects(() => f.reply('company-two', 'thread-one', { body: 'Hello', consent: true }, 'request-key-123456'), /not found/)
  await assert.rejects(() => f.reply('company-one', 'thread-one', { body: 'Hello' }, 'request-key-123456'), /opted in/)
  await assert.rejects(() => f.reply('company-one', 'thread-one', { body: 'x'.repeat(4097), consent: true }, 'request-key-123456'), /4096/)
  f.expire()
  await assert.rejects(() => f.reply('company-one', 'thread-one', { body: 'Hello', consent: true }, 'request-key-123456'), /window has closed/)
  assert.equal(f.calls(), 0)
})

test('provider errors persist failed status and never produce sent-shaped success', async () => {
  const f = fixture()
  f.fail()
  await assert.rejects(() => f.reply('company-one', 'thread-one', { body: 'Hello', consent: true }, 'request-key-123456'), /not confirmed by Meta/)
  assert.equal(f.messages.get('request-key-123456')?.status, 'failed')
  await assert.rejects(() => f.reply('company-one', 'thread-one', { body: 'Hello', consent: true }, 'request-key-123456'), /pending or failed/)
  assert.equal(f.calls(), 1)
})

test('signed status callbacks retain phone context and cannot downgrade delivery', () => {
  assert.deepEqual(extractWhatsAppDeliveries({ entry: [{ changes: [{ value: { metadata: { phone_number_id: 'phone-one' }, statuses: [{ id: 'wamid.one', status: 'delivered' }, { id: 'wamid.two', status: 'unknown' }] } }] }] }), [{ phoneNumberId: 'phone-one', id: 'wamid.one', status: 'delivered' }])
  assert.throws(() => assertWebhookPhone('phone-two', 'phone-one'), /does not match/)
  assert.doesNotThrow(() => assertWebhookPhone('phone-one', 'phone-one'))
  assert.deepEqual(statusesNotToDowngrade('sent'), ['sent', 'delivered', 'read'])
  assert.deepEqual(statusesNotToDowngrade('failed'), ['delivered', 'read'])
})
