/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type WhatsAppMessage = {
  id?: string
  from?: string
  timestamp?: string
  type?: string
  text?: { body?: string }
  image?: { caption?: string }
  video?: { caption?: string }
  document?: { caption?: string; filename?: string }
  location?: { name?: string; address?: string }
}

export type WhatsAppInbound = {
  phoneNumberId: string
  contactName?: string
  message: WhatsAppMessage
}

// A customer's message body for storage/display. Text messages use their real content
// verbatim; every other WhatsApp message type (photo, voice note, document, location, …) has
// no text body at all, so rather than storing an empty string or silently dropping the
// message, this returns an honest, human-readable placeholder — we don't yet store media
// files themselves (that needs a schema change: a media URL/type column), so the placeholder
// says what arrived without pretending to show its contents.
export function describeWhatsAppMessageBody(message: WhatsAppMessage): string {
  const type = message.type || 'text'
  switch (type) {
    case 'text':
      return clean(message.text?.body)
    case 'image':
      return message.image?.caption ? `📷 Photo: ${clean(message.image.caption)}` : '📷 Photo (not yet viewable in FoundingOS)'
    case 'video':
      return message.video?.caption ? `🎥 Video: ${clean(message.video.caption)}` : '🎥 Video (not yet viewable in FoundingOS)'
    case 'audio':
    case 'voice':
      return '🎤 Voice note (not yet playable in FoundingOS)'
    case 'document':
      return message.document?.filename ? `📎 Document: ${clean(message.document.filename)}` : '📎 Document (not yet viewable in FoundingOS)'
    case 'sticker':
      return '💬 Sticker'
    case 'location':
      return message.location?.name ? `📍 Shared location: ${clean(message.location.name)}` : '📍 Shared a location'
    case 'contacts':
      return '👤 Shared a contact card'
    default:
      return `Sent a ${type.replace(/_/g, ' ')} message (not yet supported in FoundingOS)`
  }
}

export type MessagingIntent =
  | { type: 'status' }
  | { type: 'intelligence_snapshot' }
  | { type: 'agent_decision'; decision: 'approve' | 'reject'; actionReference?: string }
  | { type: 'agent_execution'; operation: 'execute' | 'reverse'; actionReference?: string }
  | { type: 'agent_explanation'; detail: 'why' | 'impact' | 'alternatives' | 'more'; actionReference?: string }
  | { type: 'create_order'; customer: string; detail: string; totalPence: number; deliveryAddress?: string }
  | { type: 'mark_delivered'; reference: string }
  | { type: 'create_invoice'; reference: string }
  | { type: 'create_campaign'; name: string; audience: string; objective: string }
  | { type: 'help' }
  | { type: 'unknown' }

const clean = (value: unknown) => String(value ?? '').trim()

const parseMoneyToPence = (value: string | undefined) => {
  if (!value) return 0
  const amount = Number(value.replace(/[^\d.]/g, ''))
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0
}

export function classifyMessagingIntent(input: string): MessagingIntent {
  const value = input.trim()
  if (/^\/?(status|today)$/i.test(value)) return { type: 'status' }
  if (/^\/?(snapshot|intelligence)$/i.test(value)) return { type: 'intelligence_snapshot' }
  if (/^\/?help$/i.test(value)) return { type: 'help' }
  const decision = value.match(/^\/?(approve|reject)(?:\s+(.+))?$/i)
  if (decision) return { type: 'agent_decision', decision: decision[1].toLowerCase() as 'approve' | 'reject', actionReference: decision[2]?.trim() }
  const execution = value.match(/^\/?(execute|undo|reverse)(?:\s+(.+))?$/i)
  if (execution) return { type: 'agent_execution', operation: execution[1].toLowerCase() === 'execute' ? 'execute' : 'reverse', actionReference: execution[2]?.trim() }
  const explanation = value.match(/^\/?(why|impact|alternatives|more)(?:\s+(.+))?$/i)
  if (explanation) return { type: 'agent_explanation', detail: explanation[1].toLowerCase() as 'why' | 'impact' | 'alternatives' | 'more', actionReference: explanation[2]?.trim() }
  if (/^(?:why (?:this|now)|show (?:me )?(?:the )?evidence)\??$/i.test(value)) return { type: 'agent_explanation', detail: 'why', actionReference: undefined }
  if (/^(?:what(?:'s| is) the impact|show (?:me )?(?:the )?(?:value|impact))\??$/i.test(value)) return { type: 'agent_explanation', detail: 'impact', actionReference: undefined }
  if (/^(?:what are the alternatives|show (?:me )?(?:the )?alternatives)\??$/i.test(value)) return { type: 'agent_explanation', detail: 'alternatives', actionReference: undefined }
  if (/^(?:tell me more|show (?:me )?(?:the )?(?:details|trail))\??$/i.test(value)) return { type: 'agent_explanation', detail: 'more', actionReference: undefined }

  const structuredOrder = value.match(/^\/order\s+([^|]+)\|([^|]+)(?:\|([^|]+))?(?:\|(.+))?$/i)
  if (structuredOrder) {
    return {
      type: 'create_order',
      customer: structuredOrder[1].trim(),
      detail: structuredOrder[2].trim(),
      totalPence: parseMoneyToPence(structuredOrder[3]),
      deliveryAddress: structuredOrder[4]?.trim(),
    }
  }

  const naturalOrder = value.match(/^new order for\s+(.+?)\s*[-:]\s*(.+)$/i)
  if (naturalOrder) {
    return {
      type: 'create_order',
      customer: naturalOrder[1].trim(),
      detail: naturalOrder[2].trim(),
      totalPence: 0,
    }
  }

  const delivered = value.match(/^\/?(?:delivered|markdelivered)\s+(.+)$/i)
  if (delivered) return { type: 'mark_delivered', reference: delivered[1].trim() }

  const invoice = value.match(/^\/?invoice\s+(.+)$/i)
  if (invoice) return { type: 'create_invoice', reference: invoice[1].trim() }

  const campaign = value.match(/^\/campaign\s+([^|]+)\|([^|]+)(?:\|(.+))?$/i)
  if (campaign) {
    return {
      type: 'create_campaign',
      name: campaign[1].trim(),
      audience: campaign[2].trim(),
      objective: campaign[3]?.trim() || 'Growth',
    }
  }

  return { type: 'unknown' }
}

export function extractWhatsAppMessages(payload: unknown): WhatsAppInbound[] {
  if (!payload || typeof payload !== 'object') return []
  const root = payload as Record<string, unknown>
  if (root.object !== 'whatsapp_business_account' || !Array.isArray(root.entry)) return []

  const inbound: WhatsAppInbound[] = []
  for (const entry of root.entry) {
    if (!entry || typeof entry !== 'object') continue
    const changes = (entry as Record<string, unknown>).changes
    if (!Array.isArray(changes)) continue
    for (const change of changes) {
      if (!change || typeof change !== 'object') continue
      const value = (change as Record<string, unknown>).value
      if (!value || typeof value !== 'object') continue
      const record = value as Record<string, unknown>
      const metadata = record.metadata && typeof record.metadata === 'object'
        ? record.metadata as Record<string, unknown>
        : {}
      const phoneNumberId = clean(metadata.phone_number_id)
      const contacts = Array.isArray(record.contacts) ? record.contacts : []
      const firstContact = contacts[0] && typeof contacts[0] === 'object'
        ? contacts[0] as Record<string, unknown>
        : {}
      const profile = firstContact.profile && typeof firstContact.profile === 'object'
        ? firstContact.profile as Record<string, unknown>
        : {}
      const contactName = clean(profile.name) || undefined
      if (!phoneNumberId || !Array.isArray(record.messages)) continue
      for (const message of record.messages) {
        if (message && typeof message === 'object') {
          inbound.push({ phoneNumberId, contactName, message: message as WhatsAppMessage })
        }
      }
    }
  }
  return inbound
}
