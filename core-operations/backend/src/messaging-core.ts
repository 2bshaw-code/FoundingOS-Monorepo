/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Prisma } from './generated/prisma/index.js'
import { prisma } from './auth.js'
import { publishEvent } from './event-feed.js'
import { classifyMessagingIntent, extractWhatsAppMessages, type MessagingIntent, type WhatsAppInbound } from './messaging-intents.js'
import { createCampaign, createInvoice, createOrder, invoiceDocument, operationsSummary, updateOrder } from './operations.js'
import { sendWhatsAppText } from './whatsapp.js'
import { getIntegrationCredentials } from './platform.js'

const json = (value: unknown): Prisma.InputJsonValue =>
  JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue

const clean = (value: unknown) => String(value ?? '').trim()
const webFallbackUrl = () => clean(process.env.FOUNDINGOS_WEB_URL) || 'https://foundingos.com/workspaces'

const allowedIntents: Record<string, MessagingIntent['type'][]> = {
  founder: ['status', 'create_order', 'mark_delivered', 'create_invoice', 'create_campaign', 'help'],
  admin: ['status', 'create_order', 'mark_delivered', 'create_invoice', 'create_campaign', 'help'],
  operator: ['status', 'create_order', 'mark_delivered', 'help'],
  driver: ['status', 'mark_delivered', 'help'],
  finance: ['status', 'create_invoice', 'help'],
  marketing: ['status', 'create_campaign', 'help'],
}

const assertIntentAllowed = (role: string, intent: MessagingIntent['type']) => {
  if (intent === 'unknown') return
  if (!(allowedIntents[role] ?? []).includes(intent)) {
    throw Object.assign(new Error(`The ${role} role cannot run the ${intent.replaceAll('_', ' ')} command.`), { status: 403 })
  }
}

const helpText = [
  'FoundingOS WhatsApp commands:',
  '/status',
  '/order Customer | items | total | delivery address',
  '/delivered ORDER-REFERENCE',
  '/invoice ORDER-REFERENCE',
  '/campaign Name | audience | objective',
].join('\n')

async function executeIntent(tenantId: string, sender: string, intent: MessagingIntent) {
  if (intent.type === 'help' || intent.type === 'unknown') {
    return intent.type === 'help'
      ? helpText
      : `I could not safely identify that action.\n\n${helpText}\n\nWeb fallback: ${webFallbackUrl()}`
  }

  if (intent.type === 'status') {
    const summary = await operationsSummary(tenantId)
    return [
      'Current FoundingOS status',
      `${summary.metrics.orders} orders`,
      `${summary.metrics.activeDeliveries} active deliveries`,
      `${summary.metrics.unpaidInvoices} unpaid invoices`,
      `${summary.metrics.lowStock} low-stock items`,
    ].join('\n')
  }

  if (intent.type === 'create_order') {
    let customer = await prisma.customer.findFirst({
      where: {
        tenantId,
        OR: [
          { companyName: { equals: intent.customer, mode: 'insensitive' } },
          { contactName: { equals: intent.customer, mode: 'insensitive' } },
          { phone: sender },
        ],
      },
    })
    customer ??= await prisma.customer.create({
      data: { tenantId, companyName: intent.customer, contactName: intent.customer, phone: sender, source: 'whatsapp' },
    })
    const order = await createOrder(tenantId, {
      customerId: customer.id,
      totalPence: intent.totalPence,
      deliveryAddress: intent.deliveryAddress,
      notes: `WhatsApp order: ${intent.detail}`,
    })
    return `Order ${order.reference} created for ${intent.customer}.${intent.totalPence ? ` Total: ${(intent.totalPence / 100).toFixed(2)}.` : ' Add the final total in FoundingOS.'}`
  }

  if (intent.type === 'mark_delivered') {
    const order = await prisma.salesOrder.findFirstOrThrow({
      where: { tenantId, reference: { equals: intent.reference, mode: 'insensitive' } },
    })
    await updateOrder(order.id, tenantId, { deliveryStatus: 'delivered', status: 'fulfilled' })
    await prisma.deliveryAssignment.updateMany({
      where: { tenantId, orderId: order.id },
      data: { status: 'delivered', completedAt: new Date() },
    })
    return `${order.reference} marked delivered. Finance can now continue the invoice and payment workflow.`
  }

  if (intent.type === 'create_invoice') {
    const order = await prisma.salesOrder.findFirstOrThrow({
      where: { tenantId, reference: { equals: intent.reference, mode: 'insensitive' } },
    })
    const invoice = await createInvoice(tenantId, {
      customerId: order.customerId,
      number: `INV-${order.reference}`,
      subtotalPence: order.totalPence,
      items: [{ description: `Order ${order.reference}`, quantity: 1, totalPence: order.totalPence }],
    })
    const document = await invoiceDocument(invoice.id, tenantId)
    return `${invoice.number} created from ${order.reference} using Brand Studio profile version ${document.brandProfileVersion}. Review and send it from Finance.`
  }

  const campaign = await createCampaign(tenantId, {
    name: intent.name,
    audience: intent.audience,
    objective: intent.objective,
    platforms: ['whatsapp'],
  })
  return `Campaign ${campaign.name} is ready as a draft for ${campaign.audience}. Review the brand-aware copy before launch.`
}

async function sendAndStoreReply(input: {
  tenantId: string
  conversationId: string
  phoneNumberId: string
  recipient: string
  intent: MessagingIntent['type']
  text: string
}) {
  const pendingId = `pending-${crypto.randomUUID()}`
  const pending = await prisma.messagingMessage.create({
    data: {
      tenantId: input.tenantId,
      conversationId: input.conversationId,
      providerMessageId: pendingId,
      direction: 'outbound',
      messageType: 'text',
      body: input.text,
      intent: input.intent,
      status: 'queued',
    },
  })

  try {
    const credentials = await getIntegrationCredentials(input.tenantId, 'whatsapp')
    const result = await sendWhatsAppText(input.recipient, input.text, input.phoneNumberId, credentials) as { messages?: Array<{ id?: string }> }
    const providerMessageId = clean(result.messages?.[0]?.id)
    await prisma.messagingMessage.update({
      where: { id: pending.id },
      data: { status: 'sent', ...(providerMessageId ? { providerMessageId } : {}) },
    })
    return true
  } catch (error) {
    await prisma.messagingMessage.update({
      where: { id: pending.id },
      data: { status: 'failed', raw: json({ error: error instanceof Error ? error.message : String(error) }) },
    })
    await publishEvent({
      tenantId: input.tenantId,
      type: 'messaging.delivery_failed',
      source: 'messaging_core',
      payload: { channel: 'whatsapp', recipient: input.recipient, intent: input.intent },
    })
    return false
  }
}

async function processInboundMessage(input: WhatsAppInbound) {
  const providerMessageId = clean(input.message.id)
  const sender = clean(input.message.from)
  if (!providerMessageId || !sender) throw new Error('WhatsApp message is missing its provider ID or sender.')

  const existing = await prisma.messagingMessage.findUnique({ where: { providerMessageId } })
  if (existing) return { providerMessageId, status: 'duplicate' as const }

  const connection = await prisma.messagingChannelConnection.findUnique({
    where: { channel_externalAccountId: { channel: 'whatsapp', externalAccountId: input.phoneNumberId } },
  })
  if (!connection?.active) {
    throw new Error(`No active tenant connection exists for WhatsApp phone number ID ${input.phoneNumberId}.`)
  }

  const conversation = await prisma.messagingConversation.upsert({
    where: {
      tenantId_channel_externalConversationId: {
        tenantId: connection.tenantId,
        channel: 'whatsapp',
        externalConversationId: sender,
      },
    },
    create: {
      tenantId: connection.tenantId,
      channel: 'whatsapp',
      externalConversationId: sender,
      participantAddress: sender,
    },
    update: { participantAddress: sender, lastMessageAt: new Date() },
  })

  const body = clean(input.message.text?.body)
  const intent = body ? classifyMessagingIntent(body) : { type: 'unknown' as const }
  await prisma.messagingMessage.create({
    data: {
      tenantId: connection.tenantId,
      conversationId: conversation.id,
      providerMessageId,
      direction: 'inbound',
      messageType: clean(input.message.type) || 'unknown',
      body: body || null,
      intent: intent.type,
      raw: json(input.message),
    },
  })
  await publishEvent({
    tenantId: connection.tenantId,
    type: 'messaging.message_received',
    source: 'messaging_core',
    payload: { channel: 'whatsapp', conversationId: conversation.id, providerMessageId, messageType: input.message.type, intent: intent.type },
  })

  const participant = await prisma.messagingParticipant.findUnique({
    where: { tenantId_channel_address: { tenantId: connection.tenantId, channel: 'whatsapp', address: sender } },
  })
  let reply: string
  if (!participant?.active) {
    reply = `This number is not authorized to run FoundingOS actions. Ask your account owner to add it in Messaging settings.\n\nWeb fallback: ${webFallbackUrl()}`
  } else {
    try {
      assertIntentAllowed(participant.role, intent.type)
      reply = await executeIntent(connection.tenantId, sender, intent)
      await publishEvent({
        tenantId: connection.tenantId,
        type: `messaging.intent_${intent.type}`,
        source: 'messaging_core',
        payload: { channel: 'whatsapp', conversationId: conversation.id, providerMessageId, participantId: participant.id },
      })
    } catch (error) {
      reply = `${error instanceof Error ? `FoundingOS could not complete that action: ${error.message}` : 'FoundingOS could not complete that action.'}\n\nNo unconfirmed action was taken. Continue in the web workspace: ${webFallbackUrl()}`
      await publishEvent({
        tenantId: connection.tenantId,
        type: 'messaging.intent_failed',
        source: 'messaging_core',
        payload: { channel: 'whatsapp', conversationId: conversation.id, providerMessageId, intent: intent.type, error: error instanceof Error ? error.message : String(error) },
      })
    }
  }

  await prisma.messagingConversation.update({
    where: { id: conversation.id },
    data: { state: json({ lastIntent: intent.type, lastProviderMessageId: providerMessageId }) },
  })
  const confirmationSent = await sendAndStoreReply({
    tenantId: connection.tenantId,
    conversationId: conversation.id,
    phoneNumberId: input.phoneNumberId,
    recipient: sender,
    intent: intent.type,
    text: reply,
  })
  return { providerMessageId, status: 'processed' as const, intent: intent.type, confirmationSent }
}

export async function processWhatsAppWebhook(payload: unknown) {
  const messages = extractWhatsAppMessages(payload)
  const results = []
  for (const message of messages) results.push(await processInboundMessage(message))
  return results
}

export const listMessagingConnections = (tenantId: string) =>
  prisma.messagingChannelConnection.findMany({ where: { tenantId }, orderBy: { channel: 'asc' } })

export const messagingReadiness = async (tenantId: string) => {
  const since = new Date(Date.now() - 24 * 60 * 60_000)
  const [connections, authorizedParticipants, failedDeliveries, unrecognizedMessages] = await Promise.all([
    prisma.messagingChannelConnection.findMany({
      where: { tenantId },
      select: { channel: true, externalAccountId: true, displayName: true, active: true },
      orderBy: { channel: 'asc' },
    }),
    prisma.messagingParticipant.count({ where: { tenantId, active: true } }),
    prisma.messagingMessage.count({ where: { tenantId, direction: 'outbound', status: 'failed', createdAt: { gte: since } } }),
    prisma.messagingMessage.count({ where: { tenantId, direction: 'inbound', intent: 'unknown', createdAt: { gte: since } } }),
  ])
  const activeConnections = connections.filter((connection) => connection.active)
  return {
    operational: activeConnections.length > 0 && authorizedParticipants > 0,
    activeConnections,
    authorizedParticipants,
    failedDeliveriesLast24Hours: failedDeliveries,
    unrecognizedMessagesLast24Hours: unrecognizedMessages,
    webFallbackUrl: webFallbackUrl(),
    dependencyRisk: 'WhatsApp availability, Meta policy, account quality, rate limits, and provider pricing remain external dependencies.',
  }
}

export const saveMessagingConnection = (tenantId: string, channel: string, input: Record<string, unknown>) => {
  const externalAccountId = clean(input.externalAccountId)
  if (!externalAccountId) throw Object.assign(new Error('External account ID is required.'), { status: 400 })
  return prisma.messagingChannelConnection.upsert({
    where: { channel_externalAccountId: { channel, externalAccountId } },
    create: { tenantId, channel, externalAccountId, displayName: clean(input.displayName) || null, active: input.active !== false },
    update: { tenantId, displayName: clean(input.displayName) || null, active: input.active !== false },
  })
}

export const listMessagingParticipants = (tenantId: string) =>
  prisma.messagingParticipant.findMany({ where: { tenantId }, orderBy: { createdAt: 'asc' } })

export const saveMessagingParticipant = (tenantId: string, input: Record<string, unknown>) => {
  const channel = clean(input.channel) || 'whatsapp'
  const address = clean(input.address)
  if (!address) throw Object.assign(new Error('Participant address is required.'), { status: 400 })
  const role = clean(input.role) || 'operator'
  if (!allowedIntents[role]) throw Object.assign(new Error('Unsupported messaging role.'), { status: 400 })
  return prisma.messagingParticipant.upsert({
    where: { tenantId_channel_address: { tenantId, channel, address } },
    create: { tenantId, channel, address, role, displayName: clean(input.displayName) || null, active: input.active !== false },
    update: { role, displayName: clean(input.displayName) || null, active: input.active !== false },
  })
}
