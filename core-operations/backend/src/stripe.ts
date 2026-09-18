/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { createHmac, timingSafeEqual } from 'node:crypto'

type StripeCredentials = Record<string, unknown>

const requiredCredential = (credentials: StripeCredentials, key: string) => {
  const value = String(credentials[key] ?? '').trim()
  if (!value) throw Object.assign(new Error(`Stripe credential ${key} is required`), { status: 503 })
  return value
}

const stripeError = (body: unknown, status: number) => {
  if (body && typeof body === 'object' && 'error' in body) {
    const error = (body as { error?: { message?: unknown } }).error
    if (typeof error?.message === 'string') return error.message
  }
  return `Stripe returned HTTP ${status}`
}

export async function createTenantCheckout(input: {
  tenantId: string
  workspace: string
  module: string
  recordId: string
  reference: string
  name: string
  amountPence: number
  currency: string
  credentials: StripeCredentials
  idempotencyKey: string
}) {
  if (!Number.isSafeInteger(input.amountPence) || input.amountPence <= 0) throw Object.assign(new Error('Payment amount must be a positive whole number of pence'), { status: 400 })
  const currency = input.currency.trim().toLowerCase()
  if (!/^[a-z]{3}$/.test(currency)) throw Object.assign(new Error('Payment currency must be a three-letter ISO code'), { status: 400 })
  const webUrl = String(process.env.FOUNDINGOS_WEB_URL ?? '').trim().replace(/\/+$/, '')
  if (!webUrl) throw Object.assign(new Error('FOUNDINGOS_WEB_URL is required to create payment checkout sessions'), { status: 503 })

  const returnUrl = `${webUrl}/app/${encodeURIComponent(input.workspace)}/${encodeURIComponent(input.module)}`
  const body = new URLSearchParams({
    mode: 'payment',
    success_url: `${returnUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl}?payment=cancelled`,
    client_reference_id: input.recordId,
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': currency,
    'line_items[0][price_data][unit_amount]': String(input.amountPence),
    'line_items[0][price_data][product_data][name]': input.name,
    'metadata[tenantId]': input.tenantId,
    'metadata[workspace]': input.workspace,
    'metadata[module]': input.module,
    'metadata[recordId]': input.recordId,
    'metadata[reference]': input.reference,
    'payment_intent_data[metadata][tenantId]': input.tenantId,
    'payment_intent_data[metadata][workspace]': input.workspace,
    'payment_intent_data[metadata][module]': input.module,
    'payment_intent_data[metadata][recordId]': input.recordId,
  })
  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requiredCredential(input.credentials, 'secretKey')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': input.idempotencyKey,
    },
    body,
    signal: AbortSignal.timeout(15_000),
  })
  const result = await response.json() as { id?: string; url?: string; status?: string; error?: { message?: string } }
  if (!response.ok) throw Object.assign(new Error(stripeError(result, response.status)), { status: 502 })
  if (!result.id || !result.url) throw Object.assign(new Error('Stripe did not return a checkout URL'), { status: 502 })
  return { id: result.id, url: result.url, status: result.status ?? 'open' }
}

export function verifyStripeWebhookSignature(rawBody: Buffer, signatureHeader: string | undefined, credentials: StripeCredentials, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (!signatureHeader) return false
  const webhookSecret = String(credentials.webhookSecret ?? '').trim()
  if (!webhookSecret) return false
  const parts = signatureHeader.split(',').map((part) => part.split('=', 2))
  const timestamp = Number(parts.find(([key]) => key === 't')?.[1])
  const signatures = parts.filter(([key]) => key === 'v1').map(([, value]) => value).filter(Boolean)
  if (!Number.isSafeInteger(timestamp) || Math.abs(nowSeconds - timestamp) > 300 || !signatures.length) return false
  const expected = Buffer.from(createHmac('sha256', webhookSecret).update(`${timestamp}.${rawBody.toString('utf8')}`).digest('hex'))
  return signatures.some((signature) => {
    const provided = Buffer.from(signature)
    return expected.length === provided.length && timingSafeEqual(expected, provided)
  })
}
