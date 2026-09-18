import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import test from 'node:test'
import { createTenantCheckout, verifyStripeWebhookSignature } from './stripe.js'

test('tenant checkout uses encrypted tenant credentials and server-controlled return URLs', async (context) => {
  process.env.FOUNDINGOS_WEB_URL = 'https://foundingos.example/'
  const originalFetch = globalThis.fetch
  let request: { url: string; init?: RequestInit } | undefined
  globalThis.fetch = async (url, init) => {
    request = { url: String(url), init }
    return new Response(JSON.stringify({ id: 'cs_test_123', url: 'https://checkout.stripe.com/test', status: 'open' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }
  context.after(() => { globalThis.fetch = originalFetch })

  const checkout = await createTenantCheckout({
    tenantId: 'tenant-1',
    workspace: 'retail',
    module: 'payments',
    recordId: 'record-1',
    reference: 'PAY-101',
    name: 'Customer order',
    amountPence: 4999,
    currency: 'GBP',
    credentials: { secretKey: 'sk_test_tenant' },
    idempotencyKey: 'checkout-1',
  })

  assert.deepEqual(checkout, { id: 'cs_test_123', url: 'https://checkout.stripe.com/test', status: 'open' })
  assert.equal(request?.url, 'https://api.stripe.com/v1/checkout/sessions')
  assert.equal(new Headers(request?.init?.headers).get('authorization'), 'Bearer sk_test_tenant')
  assert.equal(new Headers(request?.init?.headers).get('idempotency-key'), 'checkout-1')
  const body = new URLSearchParams(String(request?.init?.body))
  assert.equal(body.get('line_items[0][price_data][unit_amount]'), '4999')
  assert.equal(body.get('success_url'), 'https://foundingos.example/app/retail/payments?payment=success&session_id={CHECKOUT_SESSION_ID}')
  assert.equal(body.get('metadata[tenantId]'), 'tenant-1')
})

test('tenant Stripe webhook verification accepts valid current signatures', () => {
  const rawBody = Buffer.from('{"id":"evt_123","type":"checkout.session.completed"}')
  const timestamp = 1_800_000_000
  const webhookSecret = 'whsec_tenant'
  const signature = createHmac('sha256', webhookSecret).update(`${timestamp}.${rawBody.toString('utf8')}`).digest('hex')

  assert.equal(verifyStripeWebhookSignature(rawBody, `t=${timestamp},v1=${signature}`, { webhookSecret }, timestamp), true)
  assert.equal(verifyStripeWebhookSignature(rawBody, `t=${timestamp},v1=malformed`, { webhookSecret }, timestamp), false)
})

test('tenant Stripe webhook verification rejects stale and missing signatures', () => {
  const rawBody = Buffer.from('{}')
  const timestamp = 1_800_000_000
  const webhookSecret = 'whsec_tenant'
  const signature = createHmac('sha256', webhookSecret).update(`${timestamp}.${rawBody.toString('utf8')}`).digest('hex')

  assert.equal(verifyStripeWebhookSignature(rawBody, undefined, { webhookSecret }, timestamp), false)
  assert.equal(verifyStripeWebhookSignature(rawBody, `t=${timestamp},v1=${signature}`, { webhookSecret }, timestamp + 301), false)
})
