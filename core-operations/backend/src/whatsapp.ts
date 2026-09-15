/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import crypto from 'node:crypto'

const config = () => ({
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || '',
  appSecret: process.env.WHATSAPP_APP_SECRET || '',
  graphVersion: process.env.WHATSAPP_GRAPH_VERSION || 'v22.0',
})

export const whatsappReadiness = () => {
  const value = config()
  return {
    configured: Boolean(value.accessToken && value.phoneNumberId && value.verifyToken && value.appSecret),
    webhookVerification: Boolean(value.verifyToken),
    signatureValidation: Boolean(value.appSecret),
    outboundMessaging: Boolean(value.accessToken && value.phoneNumberId),
    graphVersion: value.graphVersion,
  }
}

export const verifyWebhook = (mode: unknown, token: unknown) => mode === 'subscribe' && Boolean(config().verifyToken) && token === config().verifyToken

export const verifyWebhookSignature = (body: Buffer, signature: string | undefined) => {
  const secret = config().appSecret
  if (!secret || !signature?.startsWith('sha256=')) return false
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export const sendWhatsAppText = async (to: unknown, text: unknown) => {
  const value = config()
  if (!value.accessToken || !value.phoneNumberId) throw new Error('WhatsApp Cloud API is not configured')
  const response = await fetch(`https://graph.facebook.com/${value.graphVersion}/${value.phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${value.accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', to: String(to || ''), type: 'text', text: { body: String(text || '') } }),
    signal: AbortSignal.timeout(10_000),
  })
  const body = await response.json().catch(() => ({ error: { message: 'Invalid WhatsApp response' } }))
  if (!response.ok) throw new Error(body.error?.message || `WhatsApp returned HTTP ${response.status}`)
  return body
}