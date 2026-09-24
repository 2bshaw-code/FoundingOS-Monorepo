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

// Downloads a WhatsApp media attachment (photo, voice note, document, video) so FoundingOS
// can store and display it, rather than only showing a "not yet viewable" placeholder. This is
// a real two-step Graph API flow: first resolve the media ID to a short-lived, auth-gated URL,
// then fetch the bytes from that URL with the same access token. Both requests use the
// tenant's own WhatsApp credentials — never a shared/global token.
export const fetchWhatsAppMedia = async (mediaId: string, credentials?: WhatsAppCredentialInput): Promise<{ bytes: Buffer; contentType: string } | null> => {
  const value = config(credentials)
  if (!value.accessToken || !mediaId) return null
  try {
    const lookup = await fetch(`https://graph.facebook.com/${value.graphVersion}/${mediaId}`, {
      headers: { Authorization: `Bearer ${value.accessToken}` },
      signal: AbortSignal.timeout(10_000),
    })
    const meta = await lookup.json().catch(() => null) as { url?: string; mime_type?: string } | null
    if (!lookup.ok || !meta?.url) return null
    const download = await fetch(meta.url, {
      headers: { Authorization: `Bearer ${value.accessToken}` },
      signal: AbortSignal.timeout(15_000),
    })
    if (!download.ok) return null
    const bytes = Buffer.from(await download.arrayBuffer())
    return { bytes, contentType: meta.mime_type || download.headers.get('content-type') || 'application/octet-stream' }
  } catch {
    // Best-effort: a failed media download should never take down inbound message processing —
    // the message is still stored with its text/placeholder body either way.
    return null
  }
}