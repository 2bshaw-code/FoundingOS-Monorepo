/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import crypto from 'node:crypto'

type WhatsAppCredentialInput = Partial<{ accessToken: unknown; phoneNumberId: unknown; verifyToken: unknown; appSecret: unknown; graphVersion: unknown }>

const config = (credentials: WhatsAppCredentialInput = {}) => ({
  accessToken: String(credentials.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || ''),
  phoneNumberId: String(credentials.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || ''),
  verifyToken: String(credentials.verifyToken || process.env.WHATSAPP_VERIFY_TOKEN || ''),
  appSecret: String(credentials.appSecret || process.env.WHATSAPP_APP_SECRET || ''),
  graphVersion: String(credentials.graphVersion || process.env.WHATSAPP_GRAPH_VERSION || 'v22.0'),
})

export const whatsappReadiness = (credentials?: WhatsAppCredentialInput) => {
  const value = config(credentials)
  return {
    configured: Boolean(value.accessToken && value.phoneNumberId && value.verifyToken && value.appSecret),
    webhookVerification: Boolean(value.verifyToken),
    signatureValidation: Boolean(value.appSecret),
    outboundMessaging: Boolean(value.accessToken && value.phoneNumberId),
    graphVersion: value.graphVersion,
  }
}

export const verifyWebhook = (mode: unknown, token: unknown, credentials?: WhatsAppCredentialInput) => mode === 'subscribe' && Boolean(config(credentials).verifyToken) && token === config(credentials).verifyToken

export const verifyWebhookSignature = (body: Buffer, signature: string | undefined, credentials?: WhatsAppCredentialInput) => {
  const secret = config(credentials).appSecret
  if (!secret || !signature?.startsWith('sha256=')) return false
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`
  const expectedBuffer = Buffer.from(expected)
  const signatureBuffer = Buffer.from(signature)
  return expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
}

export const sendWhatsAppText = async (to: unknown, text: unknown, phoneNumberId?: string, credentials?: WhatsAppCredentialInput) => {
  const value = config(credentials)
  const senderId = phoneNumberId || value.phoneNumberId
  if (!value.accessToken || !senderId) throw new Error('WhatsApp Cloud API is not configured')
  const response = await fetch(`https://graph.facebook.com/${value.graphVersion}/${senderId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${value.accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', to: String(to || ''), type: 'text', text: { body: String(text || '') } }),
    signal: AbortSignal.timeout(10_000),
  })
  const body = await response.json().catch(() => ({ error: { message: 'Invalid WhatsApp response' } }))
  if (!response.ok) throw new Error(body.error?.message || `WhatsApp returned HTTP ${response.status}`)
  return body
}