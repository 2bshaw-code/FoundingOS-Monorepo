export type InboxMessage = {
  id: string; providerMessageId: string; direction: string; messageType: string;
  body: string | null; status: string; createdAt: Date;
}
export type InboxConversation = { id: string; channel: string; participantAddress: string; lastMessageAt: Date }
export type InboxRepository = {
  conversation: (tenantId: string, id: string) => Promise<InboxConversation | null>
  latestInbound: (tenantId: string, id: string) => Promise<Date | null>
  byRequestKey: (tenantId: string, key: string) => Promise<InboxMessage | null>
  queue: (tenantId: string, conversationId: string, key: string, body: string) => Promise<InboxMessage>
  accepted: (id: string, providerMessageId: string) => Promise<InboxMessage>
  failed: (id: string, error: string) => Promise<void>
}

export function createInboxReplyService(repository: InboxRepository, send: (tenantId: string, recipient: string, body: string) => Promise<string>) {
  return async (tenantId: string, conversationId: string, input: { body?: unknown; consent?: unknown }, requestKey: string) => {
    const body = typeof input.body === 'string' ? input.body.trim() : ''
    if (!body || body.length > 4096) throw Object.assign(new Error('Reply must contain 1 to 4096 characters.'), { status: 400 })
    if (input.consent !== true) throw Object.assign(new Error('Confirm this contact has opted in before replying.'), { status: 400 })
    if (!/^[a-zA-Z0-9-]{16,80}$/.test(requestKey)) throw Object.assign(new Error('A valid Idempotency-Key is required.'), { status: 400 })
    const conversation = await repository.conversation(tenantId, conversationId)
    if (!conversation) throw Object.assign(new Error('Conversation not found in this company.'), { status: 404 })
    if (conversation.channel !== 'whatsapp') throw Object.assign(new Error('Only WhatsApp replies are currently supported.'), { status: 422 })
    const prior = await repository.byRequestKey(tenantId, requestKey)
    if (prior) {
      if (prior.body !== body) throw Object.assign(new Error('This request key was already used for a different reply.'), { status: 409 })
      if (['sent', 'delivered', 'read'].includes(prior.status)) return prior
      throw Object.assign(new Error('This reply is pending or failed. Refresh its status before sending again.'), { status: 409 })
    }
    const inboundAt = await repository.latestInbound(tenantId, conversationId)
    if (!inboundAt || Date.now() - inboundAt.getTime() >= 24 * 60 * 60_000) {
      throw Object.assign(new Error('The WhatsApp 24-hour reply window has closed. Ask the contact to message you again or use an approved template.'), { status: 409 })
    }
    const pending = await repository.queue(tenantId, conversationId, requestKey, body)
    try {
      const providerMessageId = await send(tenantId, conversation.participantAddress, body)
      if (!providerMessageId) throw new Error('Meta did not return a message identifier.')
      return await repository.accepted(pending.id, providerMessageId)
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'WhatsApp send failed.'
      await repository.failed(pending.id, detail)
      throw Object.assign(new Error(`Reply was not confirmed by Meta: ${detail}`), { status: 502 })
    }
  }
}
