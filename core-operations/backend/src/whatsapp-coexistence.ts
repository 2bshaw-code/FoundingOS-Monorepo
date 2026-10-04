// Parses WhatsApp Business app coexistence webhooks (smb_message_echoes and history).
// Pure so it can be tested without a database.

export const HISTORY_IMPORT_INTENT = 'history_import'
export const BUSINESS_APP_ECHO_INTENT = 'business_app_echo'

export type MirroredWhatsAppMessage = {
  phoneNumberId: string
  id: string
  counterpart: string
  direction: 'inbound' | 'outbound'
  source: 'echo' | 'history'
  type: string
  body: string | null
  timestamp: number | null
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'received'
}

export type CoexistenceEvents = {
  messages: MirroredWhatsAppMessage[]
  historyDeclined: string[]
}

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const digits = (value: unknown) => text(value).replace(/\D/g, '')

const messageBody = (message: Record<string, any>) => {
  const type = text(message.type)
  const content = message[type]
  if (type === 'text') return text(content?.body) || null
  return text(content?.caption) || null
}

const timestampOf = (value: unknown) => {
  const seconds = Number(value)
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null
}

const historyStatus = (value: unknown, direction: 'inbound' | 'outbound'): MirroredWhatsAppMessage['status'] => {
  if (direction === 'inbound') return 'received'
  const status = text(value).toLowerCase()
  if (status === 'delivered' || status === 'read' || status === 'failed') return status
  if (status === 'played') return 'read'
  return 'sent'
}

export function extractCoexistenceEvents(payload: unknown): CoexistenceEvents {
  const result: CoexistenceEvents = { messages: [], historyDeclined: [] }
  if (!payload || typeof payload !== 'object' || !Array.isArray((payload as any).entry)) return result
  for (const entry of (payload as any).entry) {
    if (!Array.isArray(entry?.changes)) continue
    for (const change of entry.changes) {
      const value = change?.value
      const phoneNumberId = text(value?.metadata?.phone_number_id)
      const businessNumber = digits(value?.metadata?.display_phone_number)
      if (!phoneNumberId) continue
      if (change?.field === 'smb_message_echoes' && Array.isArray(value?.message_echoes)) {
        for (const message of value.message_echoes) {
          const id = text(message?.id)
          const counterpart = digits(message?.to)
          if (!id || !counterpart) continue
          result.messages.push({ phoneNumberId, id, counterpart, direction: 'outbound', source: 'echo', type: text(message.type) || 'unknown', body: messageBody(message), timestamp: timestampOf(message.timestamp), status: 'sent' })
        }
      }
      if (change?.field === 'history' && Array.isArray(value?.history)) {
        for (const chunk of value.history) {
          if (Array.isArray(chunk?.errors) && chunk.errors.some((error: any) => Number(error?.code) === 2593109)) {
            result.historyDeclined.push(phoneNumberId)
            continue
          }
          if (!Array.isArray(chunk?.threads)) continue
          for (const thread of chunk.threads) {
            const counterpart = digits(thread?.id)
            if (!counterpart || !Array.isArray(thread?.messages)) continue
            for (const message of thread.messages) {
              const id = text(message?.id)
              if (!id) continue
              const from = digits(message?.from)
              const direction = from && from !== counterpart && (!businessNumber || from === businessNumber) ? 'outbound' : 'inbound'
              result.messages.push({ phoneNumberId, id, counterpart, direction, source: 'history', type: text(message.type) || 'unknown', body: messageBody(message), timestamp: timestampOf(message.timestamp), status: historyStatus(message?.history_context?.status, direction) })
            }
          }
        }
      }
    }
  }
  return result
}

// Imported history must never open WhatsApp's 24-hour customer service window.
export const countsTowardServiceWindow = { OR: [{ intent: null }, { intent: { not: HISTORY_IMPORT_INTENT } }] }
