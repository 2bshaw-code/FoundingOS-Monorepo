import { prisma } from './auth.js'
import { getIntegrationCredentials } from './platform.js'
import { countsTowardServiceWindow } from './whatsapp-coexistence.js'
import { sendWhatsAppText } from './whatsapp.js'
import { createInboxReplyService } from './inbox-service.js'

const messageSelect = { id: true, providerMessageId: true, direction: true, messageType: true, body: true, status: true, createdAt: true } as const

export async function listInboxConversations(tenantId: string) {
  const conversations = await prisma.messagingConversation.findMany({
    where: { tenantId, channel: 'whatsapp' }, orderBy: { lastMessageAt: 'desc' }, take: 100,
    select: { id: true, channel: true, participantAddress: true, lastMessageAt: true, messages: { where: { tenantId }, orderBy: { createdAt: 'desc' }, take: 1, select: messageSelect } },
  })
  return conversations.map((conversation) => ({ ...conversation, latestMessage: conversation.messages[0] ?? null, messages: undefined }))
}

export async function inboxThread(tenantId: string, id: string) {
  const conversation = await prisma.messagingConversation.findFirst({
    where: { tenantId, id },
    select: { id: true, channel: true, participantAddress: true, lastMessageAt: true, messages: { where: { tenantId }, orderBy: { createdAt: 'desc' }, take: 200, select: messageSelect } },
  })
  if (!conversation) throw Object.assign(new Error('Conversation not found in this company.'), { status: 404 })
  return { ...conversation, messages: conversation.messages.reverse() }
}

export const replyToInbox = createInboxReplyService({
  conversation: (tenantId, id) => prisma.messagingConversation.findFirst({ where: { tenantId, id }, select: { id: true, channel: true, participantAddress: true, lastMessageAt: true } }),
  latestInbound: async (tenantId, conversationId) => (await prisma.messagingMessage.findFirst({ where: { tenantId, conversationId, direction: 'inbound', ...countsTowardServiceWindow }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }))?.createdAt ?? null,
  byRequestKey: (tenantId, key) => prisma.messagingMessage.findFirst({ where: { tenantId, intent: `web-reply:${key}` }, select: messageSelect }),
  queue: (tenantId, conversationId, key, body) => prisma.messagingMessage.create({ data: { tenantId, conversationId, providerMessageId: `web-reply:${tenantId}:${key}`, direction: 'outbound', messageType: 'text', body, status: 'queued', intent: `web-reply:${key}` }, select: messageSelect }),
  accepted: async (id, providerMessageId) => {
    const message = await prisma.messagingMessage.update({ where: { id }, data: { providerMessageId, status: 'sent' }, select: { ...messageSelect, conversationId: true } })
    await prisma.messagingConversation.update({ where: { id: message.conversationId }, data: { lastMessageAt: new Date() } })
    return message
  },
  failed: async (id, error) => { await prisma.messagingMessage.update({ where: { id }, data: { status: 'failed', raw: { error } } }) },
}, async (tenantId, recipient, body) => {
  const credentials = await getIntegrationCredentials(tenantId, 'whatsapp')
  const response = await sendWhatsAppText(recipient, body, undefined, credentials) as { messages?: { id?: string }[] }
  return response.messages?.[0]?.id ?? ''
})

export async function whatsAppDiagnostics(tenantId: string) {
  const [integration, verification, inbound, outbound, delivered, failed] = await Promise.all([
    prisma.integrationCredential.findUnique({ where: { tenantId_provider: { tenantId, provider: 'whatsapp' } }, select: { status: true, lastCheckedAt: true, lastError: true } }),
    prisma.workspaceAuditEvent.findFirst({ where: { tenantId, action: 'whatsapp.webhook_verified' }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
    prisma.messagingMessage.findFirst({ where: { tenantId, direction: 'inbound', conversation: { channel: 'whatsapp' } }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
    prisma.messagingMessage.findFirst({ where: { tenantId, direction: 'outbound', status: { in: ['sent', 'delivered', 'read'] }, conversation: { channel: 'whatsapp' } }, orderBy: { createdAt: 'desc' }, select: { createdAt: true, status: true } }),
    prisma.messagingMessage.findFirst({ where: { tenantId, direction: 'outbound', status: { in: ['delivered', 'read'] }, conversation: { channel: 'whatsapp' } }, orderBy: { createdAt: 'desc' }, select: { createdAt: true, status: true } }),
    prisma.messagingMessage.count({ where: { tenantId, direction: 'outbound', status: 'failed', createdAt: { gte: new Date(Date.now() - 24 * 60 * 60_000) } } }),
  ])
  return { credentials: integration, webhookVerifiedAt: verification?.createdAt ?? null, lastInboundAt: inbound?.createdAt ?? null, lastAcceptedReplyAt: outbound?.createdAt ?? null, lastDeliveredReplyAt: delivered?.createdAt ?? null, failedRepliesLast24Hours: failed }
}
