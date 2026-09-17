import assert from 'node:assert/strict'
import test from 'node:test'
import { classifyMessagingIntent, extractWhatsAppMessages } from './messaging-intents.js'

test('classifies structured and natural-language orders', () => {
  assert.deepEqual(classifyMessagingIntent('/order John | 2x Blue T-shirts | £45.50 | 4 High Street'), {
    type: 'create_order',
    customer: 'John',
    detail: '2x Blue T-shirts',
    totalPence: 4550,
    deliveryAddress: '4 High Street',
  })
  assert.deepEqual(classifyMessagingIntent('New order for Sarah - 3 notebooks, deliver tomorrow'), {
    type: 'create_order',
    customer: 'Sarah',
    detail: '3 notebooks, deliver tomorrow',
    totalPence: 0,
  })
})

test('classifies operational commands', () => {
  assert.deepEqual(classifyMessagingIntent('today'), { type: 'status' })
  assert.deepEqual(classifyMessagingIntent('/delivered ORD-42'), { type: 'mark_delivered', reference: 'ORD-42' })
  assert.deepEqual(classifyMessagingIntent('/invoice ORD-42'), { type: 'create_invoice', reference: 'ORD-42' })
  assert.deepEqual(classifyMessagingIntent('/campaign Summer Sale | returning customers | Reactivation'), {
    type: 'create_campaign',
    name: 'Summer Sale',
    audience: 'returning customers',
    objective: 'Reactivation',
  })
})

test('extracts inbound WhatsApp messages with account context', () => {
  assert.deepEqual(extractWhatsAppMessages({
    object: 'whatsapp_business_account',
    entry: [{
      changes: [{
        value: {
          metadata: { phone_number_id: 'phone-1' },
          contacts: [{ profile: { name: 'Bobby' } }],
          messages: [{ id: 'wamid.1', from: '447700900000', type: 'text', text: { body: '/status' } }],
        },
      }],
    }],
  }), [{
    phoneNumberId: 'phone-1',
    contactName: 'Bobby',
    message: { id: 'wamid.1', from: '447700900000', type: 'text', text: { body: '/status' } },
  }])
})
