import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import test from 'node:test'
import { verifyWebhook, verifyWebhookSignature, whatsappReadiness } from './whatsapp.js'

const credentials = {
  accessToken: 'tenant-access-token',
  phoneNumberId: '123456789',
  verifyToken: 'tenant-verify-token',
  appSecret: 'tenant-app-secret',
}

test('tenant credentials determine WhatsApp readiness and verification', () => {
  assert.deepEqual(whatsappReadiness(credentials), {
    configured: true,
    webhookVerification: true,
    signatureValidation: true,
    outboundMessaging: true,
    graphVersion: 'v22.0',
  })
  assert.equal(verifyWebhook('subscribe', 'tenant-verify-token', credentials), true)
  assert.equal(verifyWebhook('subscribe', 'wrong-token', credentials), false)
})

test('tenant app secret verifies signatures without throwing on malformed input', () => {
  const body = Buffer.from('{"entry":[]}')
  const signature = `sha256=${createHmac('sha256', credentials.appSecret).update(body).digest('hex')}`
  assert.equal(verifyWebhookSignature(body, signature, credentials), true)
  assert.equal(verifyWebhookSignature(body, 'sha256=short', credentials), false)
  assert.equal(verifyWebhookSignature(body, undefined, credentials), false)
})
