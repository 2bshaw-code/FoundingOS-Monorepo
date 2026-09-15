/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type MessagingPlatform = 'whatsapp' | 'sms' | 'telegram' | 'messenger' | 'instagram' | 'email' | 'slack' | 'rcs'

export type MessagingPayload = {
  recipient?: string
  conversationId?: string
  message?: string
  template?: string
  subject?: string
  media?: {
    url: string
    type?: string
    caption?: string
  }
  event?: Record<string, unknown>
  metadata?: Record<string, string | number | boolean | null>
  [key: string]: unknown
}

export type MessagingResult = {
  platform: MessagingPlatform
  channel: string
  status: 'queued' | 'sent' | 'received' | 'processed'
  messageId: string
  timestamp: string
  payload: MessagingPayload
}

export type MessagingAdapterContract = {
  sendMessage: (payload: MessagingPayload) => Promise<MessagingResult>
  sendMedia: (payload: MessagingPayload) => Promise<MessagingResult>
  sendTemplate: (payload: MessagingPayload) => Promise<MessagingResult>
  receiveMessage: (payload: MessagingPayload) => Promise<MessagingResult>
  receiveEvent: (payload: MessagingPayload) => Promise<MessagingResult>
}

const makeResult = (platform: MessagingPlatform, payload: MessagingPayload, status: MessagingResult['status'], channel: string): MessagingResult => ({
  platform,
  channel,
  status,
  messageId: `${platform}-${crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)}`,
  timestamp: new Date().toISOString(),
  payload,
})

const makeAdapter = (platform: MessagingPlatform, channel: string): MessagingAdapterContract => ({
  sendMessage: async (payload) => makeResult(platform, payload, 'sent', channel),
  sendMedia: async (payload) => makeResult(platform, { ...payload, media: payload.media ?? { url: 'https://founder-os.local/placeholder', type: 'image/png', caption: payload.message ?? 'Media update' } }, 'queued', channel),
  sendTemplate: async (payload) => makeResult(platform, { ...payload, template: payload.template ?? 'default-template' }, 'processed', channel),
  receiveMessage: async (payload) => makeResult(platform, payload, 'received', channel),
  receiveEvent: async (payload) => makeResult(platform, payload, 'processed', channel),
})

const adapters: Record<MessagingPlatform, MessagingAdapterContract> = {
  whatsapp: makeAdapter('whatsapp', 'whatsapp'),
  sms: makeAdapter('sms', 'sms'),
  telegram: makeAdapter('telegram', 'telegram'),
  messenger: makeAdapter('messenger', 'messenger'),
  instagram: makeAdapter('instagram', 'instagram-direct'),
  email: makeAdapter('email', 'email'),
  slack: makeAdapter('slack', 'slack'),
  rcs: makeAdapter('rcs', 'rcs'),
}

export class MessagingAdapter {
  static listPlatforms(): MessagingPlatform[] {
    return Object.keys(adapters) as MessagingPlatform[]
  }

  static async sendMessage(platform: MessagingPlatform, payload: MessagingPayload): Promise<MessagingResult> {
    const adapter = adapters[platform] ?? adapters.whatsapp
    return adapter.sendMessage(payload)
  }

  static async sendMedia(platform: MessagingPlatform, payload: MessagingPayload): Promise<MessagingResult> {
    const adapter = adapters[platform] ?? adapters.whatsapp
    return adapter.sendMedia(payload)
  }

  static async sendTemplate(platform: MessagingPlatform, payload: MessagingPayload): Promise<MessagingResult> {
    const adapter = adapters[platform] ?? adapters.whatsapp
    return adapter.sendTemplate(payload)
  }

  static async receiveMessage(platform: MessagingPlatform, payload: MessagingPayload): Promise<MessagingResult> {
    const adapter = adapters[platform] ?? adapters.whatsapp
    return adapter.receiveMessage(payload)
  }

  static async receiveEvent(platform: MessagingPlatform, payload: MessagingPayload): Promise<MessagingResult> {
    const adapter = adapters[platform] ?? adapters.whatsapp
    return adapter.receiveEvent(payload)
  }
}

export default MessagingAdapter
