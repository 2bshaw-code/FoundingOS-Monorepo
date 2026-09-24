/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Prisma } from './generated/prisma/index.js'
import { prisma } from './auth.js'
import { publishEvent } from './event-feed.js'
import { classifyMessagingIntent, describeWhatsAppMessageBody, extractWhatsAppMessages, type MessagingIntent, type WhatsAppInbound } from './messaging-intents.js'
import { createCampaign, createInvoice, createOrder, invoiceDocument, operationsSummary, updateOrder } from './operations.js'
import { sendWhatsAppText } from './whatsapp.js'
import { getIntegrationCredentials } from './platform.js'
import { decideAgentAction, executeAgentAction, getAgentIntelligenceSummary, reverseAgentActionExecution } from './agent-actions.js'
import { buildIntelligenceBrief, explainActionForMessaging } from './intelligence-messaging.js'
import { normalizedPhone, recordCustomerMessage } from './pipeline.js'

const json = (value: unknown): Prisma.InputJsonValue =>
  JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue

const clean = (value: unknown) => String(value ?? '').trim()
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
const webFallbackUrl = () => clean(process.env.FOUNDINGOS_WEB_URL) || 'https://foundingos.com/workspaces'
const storedIntentType = (value: unknown): MessagingIntent['type'] => {
  switch (value) {
    case 'status':
    case 'intelligence_snapshot':
    case 'agent_decision':
    case 'agent_execution':
    case 'agent_explanation':
    case 'create_order':
    case 'mark_delivered':
    case 'create_invoice':
    case 'create_campaign':
    case 'help':
      return value
    default:
      return 'unknown'
  }
}

const allowedIntents: Record<string, MessagingIntent['type'][]> = {
  founder: ['status', 'intelligence_snapshot', 'agent_decision', 'agent_execution', 'agent_explanation', 'create_order', 'mark_delivered', 'create_invoice', 'create_campaign', 'help'],
  admin: ['status', 'intelligence_snapshot', 'agent_decision', 'agent_execution', 'agent_explanation', 'create_order', 'mark_delivered', 'create_invoice', 'create_campaign', 'help'],
  operator: ['status', 'intelligence_snapshot', 'agent_explanation', 'create_order', 'mark_delivered', 'help'],
  driver: ['status', 'intelligence_snapshot', 'agent_explanation', 'mark_delivered', 'help'],
  finance: ['status', 'intelligence_snapshot', 'agent_explanation', 'create_invoice', 'help'],
  marketing: ['status', 'intelligence_snapshot', 'agent_explanation', 'create_campaign', 'help'],
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
  '/snapshot',
  'APPROVE or REJECT after an intelligence brief',
  'EXECUTE after approval; UNDO after internal execution',
  'WHY, IMPACT, ALTERNATIVES, or MORE for decision evidence',
  '/order Customer | items | total | delivery address',
  '/delivered ORDER-REFERENCE',
  '/invoice ORDER-REFERENCE',
  '/campaign Name | audience | objective',
].join('\n')

async function resolveMessagingAction(tenantId: string, reference: string | undefined, state: unknown) {
  const stateReference = clean(record(state).lastAgentActionId)
  const actionId = clean(reference) || stateReference
  if (!actionId) throw Object.assign(new Error('No decision is selected. Request an intelligence brief or include the action reference.'), { status: 409 })
  const action = await prisma.agentAction.findFirst({ where: { tenantId, id: actionId } })
  if (!action) throw Object.assign(new Error('The referenced decision was not found for this business.'), { status: 404 })
  return action
}

async function executeIntent(
  tenantId: string,
  sender: string,
  intent: MessagingIntent,
  context?: { participantUserId?: string | null; conversationState?: unknown },
) {
  if (intent.type === 'help' || intent.type === 'unknown') {
    if (intent.type === 'help') return helpText
    const selectedId = clean(record(context?.conversationState).lastAgentActionId)
    const selected = selectedId ? await prisma.agentAction.findFirst({ where: { id: selectedId, tenantId } }) : null
    const next = selected?.status === 'proposed'
      ? `For ${selected.title}, reply APPROVE, REJECT, WHY, IMPACT, or ALTERNATIVES.`
      : selected?.status === 'approved'
        ? `${selected.title} is approved but not executed. Reply EXECUTE, IMPACT, or WHY.`
        : selected?.status === 'completed'
          ? `${selected.title} completed internally. Reply UNDO, IMPACT, or MORE.`
          : 'Reply SNAPSHOT to select the latest decision.'
    return `I could not safely identify that command, so nothing changed.\n\n${next}\n\nYou can resend the same command after a weak connection; duplicate provider messages are not executed twice.\n\nWeb fallback: ${webFallbackUrl()}`
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

  if (intent.type === 'intelligence_snapshot') {
    const summary = await getAgentIntelligenceSummary(tenantId)
    const action = await prisma.agentAction.findFirst({ where: { tenantId, status: { in: ['proposed', 'approved'] } }, orderBy: { createdAt: 'desc' } })
    return buildIntelligenceBrief(summary, action)
  }

  if (intent.type === 'agent_decision') {
    if (!context?.participantUserId) throw Object.assign(new Error('This messaging participant must be linked to an active FoundingOS user before approving decisions.'), { status: 403 })
    const user = await prisma.authUser.findFirst({ where: { id: context.participantUserId, tenantId, active: true } })
    if (!user) throw Object.assign(new Error('The linked FoundingOS user is no longer active for this business.'), { status: 403 })
    if (!['founder_master', 'business_owner', 'business_manager', 'retail_manager'].includes(user.role)) {
      throw Object.assign(new Error('The linked FoundingOS user is not permitted to approve decisions.'), { status: 403 })
    }
    const action = await resolveMessagingAction(tenantId, intent.actionReference, context.conversationState)
    const updated = await decideAgentAction(tenantId, user.id, action.id, intent.decision, `messaging:${sender}:${crypto.randomUUID()}`)
    return updated.status === 'approved'
      ? `${updated.title} approved.\n\nNO EXECUTION YET\nNo workspace record or external payment has moved.\n\nNEXT\nReply EXECUTE to create the governed internal records, or IMPACT to review the evidence again.\nRef: ${updated.id}`
      : `${updated.title} rejected.\n\nRESULT\nNo workspace action executed. The immediate ${updated.estimatedValuePence ? `£${(updated.estimatedValuePence / 100).toFixed(2)} ` : ''}cash commitment was not created, and the decision remains auditable.\nRef: ${updated.id}`
  }

  if (intent.type === 'agent_execution') {
    if (!context?.participantUserId) throw Object.assign(new Error('This messaging participant must be linked to an active FoundingOS user before executing decisions.'), { status: 403 })
    const user = await prisma.authUser.findFirst({ where: { id: context.participantUserId, tenantId, active: true } })
    if (!user || !['founder_master', 'business_owner', 'business_manager', 'retail_manager'].includes(user.role)) {
      throw Object.assign(new Error('The linked FoundingOS user is not permitted to execute decisions.'), { status: 403 })
    }
    const action = await resolveMessagingAction(tenantId, intent.actionReference, context.conversationState)
    if (intent.operation === 'reverse') {
      if (action.status !== 'completed') throw Object.assign(new Error(`UNDO requires a completed internal execution. ${action.title} is currently ${action.status}.`), { status: 409 })
      const reversed = await reverseAgentActionExecution(tenantId, user.id, action.id, `messaging:${sender}:${crypto.randomUUID()}`)
      return `${action.title} reversed.\n\nCOMPENSATED\n${reversed.compensation.summary}\n\nAUDIT\nThe reversal is recorded in the execution ledger, Event Feed, and workspace audit trail.\nRef: ${action.id}`
    }
    if (action.status !== 'approved') throw Object.assign(new Error(`EXECUTE requires explicit approval. ${action.title} is currently ${action.status}. Reply APPROVE first or request a new brief.`), { status: 409 })
    const completed = await executeAgentAction(tenantId, user.id, action.id, `messaging:${sender}:${crypto.randomUUID()}`)
    return `${completed.title} executed.\n\nINTERNAL EFFECTS\n${completed.outcomeSummary || 'Governed workspace records were created.'}\n\nNEXT\nReply UNDO to compensate these internal records. No external payment was moved.\nRef: ${completed.id}`
  }

  if (intent.type === 'agent_explanation') {
    const action = await resolveMessagingAction(tenantId, intent.actionReference, context?.conversationState)
    const summary = await getAgentIntelligenceSummary(tenantId)
    return explainActionForMessaging(action, intent.detail, summary)
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
  if (existing) {
    const delivery = record(existing.raw)
    const retryReply = clean(delivery.replyBody)
    if (retryReply && delivery.confirmationSent === false) {
      const retryConnection = await prisma.messagingChannelConnection.findUnique({
        where: { channel_externalAccountId: { channel: 'whatsapp', externalAccountId: input.phoneNumberId } },
      })
      if (!retryConnection?.active || retryConnection.tenantId !== existing.tenantId) {
        throw new Error('The original tenant connection is unavailable; the stored command was not re-executed.')
      }
      const confirmationSent = await sendAndStoreReply({
        tenantId: existing.tenantId,
        conversationId: existing.conversationId,
        phoneNumberId: input.phoneNumberId,
        recipient: sender,
        intent: storedIntentType(existing.intent),
        text: retryReply,
      })
      await prisma.messagingMessage.update({
        where: { id: existing.id },
        data: { raw: json({ ...delivery, confirmationSent, replyRetriedAt: new Date().toISOString() }) },
      })
      return { providerMessageId, status: confirmationSent ? 'confirmation_retried' as const : 'confirmation_retry_failed' as const }
    }
    return { providerMessageId, status: 'duplicate' as const }
  }

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

  // The Sales Pipeline's "View conversation" panel reads a separate CustomerMessage
  // history keyed by Customer, not by MessagingConversation — so a real inbound WhatsApp
  // reply also needs to land there, matched by phone number, for it to actually show up
  // live in that panel instead of only being visible to the agent-command flow above.
  // Best-effort: most senders won't be a known Customer (e.g. a first-time lead before
  // conversion), and that's expected, not an error.
  const senderPhone = normalizedPhone(sender)
  if (senderPhone) {
    const matchedCustomer = await prisma.customer.findFirst({ where: { tenantId: connection.tenantId, phone: senderPhone } })
    if (matchedCustomer) {
      await recordCustomerMessage(connection.tenantId, matchedCustomer.id, 'inbound', describeWhatsAppMessageBody(input.message))
    }
  }

  const participant = await prisma.messagingParticipant.findUnique({
    where: { tenantId_channel_address: { tenantId: connection.tenantId, channel: 'whatsapp', address: sender } },
  })
  let reply: string
  let intentSucceeded = false
  if (!participant?.active) {
    reply = `This number is not authorized to run FoundingOS actions. Ask your account owner to add it in Messaging settings.\n\nWeb fallback: ${webFallbackUrl()}`
  } else {
    try {
      assertIntentAllowed(participant.role, intent.type)
      reply = await executeIntent(connection.tenantId, sender, intent, { participantUserId: participant.userId, conversationState: conversation.state })
      intentSucceeded = true
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
    data: {
      state: json({
        ...record(conversation.state),
        lastIntent: intent.type,
        lastProviderMessageId: providerMessageId,
        ...(intentSucceeded && 'actionReference' in intent && intent.actionReference ? { lastAgentActionId: intent.actionReference } : {}),
      }),
    },
  })
  const confirmationSent = await sendAndStoreReply({
    tenantId: connection.tenantId,
    conversationId: conversation.id,
    phoneNumberId: input.phoneNumberId,
    recipient: sender,
    intent: intent.type,
    text: reply,
  })
  await prisma.messagingMessage.update({
    where: { providerMessageId },
    data: { raw: json({ inbound: input.message, replyBody: reply, confirmationSent }) },
  })
  return { providerMessageId, status: 'processed' as const, intent: intent.type, confirmationSent }
}

export async function processWhatsAppWebhook(payload: unknown) {
  const messages = extractWhatsAppMessages(payload)
  const results = []
  for (const message of messages) results.push(await processInboundMessage(message))
  return results
}

export async function sendMessagingIntelligenceBrief(tenantId: string, participantId: string, actionId?: string) {
  const participant = await prisma.messagingParticipant.findFirst({ where: { id: participantId, tenantId, active: true } })
  if (!participant) throw Object.assign(new Error('Active messaging participant not found.'), { status: 404 })
  if (participant.channel !== 'whatsapp') throw Object.assign(new Error(`Intelligence delivery is not yet available for ${participant.channel}.`), { status: 422 })
  const connection = await prisma.messagingChannelConnection.findFirst({ where: { tenantId, channel: participant.channel, active: true } })
  if (!connection) throw Object.assign(new Error('No active WhatsApp connection is configured for this business.'), { status: 409 })
  const action = actionId
    ? await prisma.agentAction.findFirst({ where: { id: actionId, tenantId } })
    : await prisma.agentAction.findFirst({ where: { tenantId, status: { in: ['proposed', 'approved'] } }, orderBy: { createdAt: 'desc' } })
  if (actionId && !action) throw Object.assign(new Error('Agent action not found.'), { status: 404 })
  const summary = await getAgentIntelligenceSummary(tenantId)
  const existingConversation = await prisma.messagingConversation.findUnique({
    where: { tenantId_channel_externalConversationId: { tenantId, channel: participant.channel, externalConversationId: participant.address } },
  })
  const conversation = await prisma.messagingConversation.upsert({
    where: { tenantId_channel_externalConversationId: { tenantId, channel: participant.channel, externalConversationId: participant.address } },
    create: { tenantId, channel: participant.channel, externalConversationId: participant.address, participantAddress: participant.address, state: json(action ? { lastAgentActionId: action.id } : {}) },
    update: { participantAddress: participant.address, lastMessageAt: new Date(), state: json({ ...record(existingConversation?.state), ...(action ? { lastAgentActionId: action.id } : {}) }) },
  })
  const text = buildIntelligenceBrief(summary, action)
  const sent = await sendAndStoreReply({
    tenantId,
    conversationId: conversation.id,
    phoneNumberId: connection.externalAccountId,
    recipient: participant.address,
    intent: 'intelligence_snapshot',
    text,
  })
  await publishEvent({
    tenantId,
    type: sent ? 'messaging.intelligence_delivered' : 'messaging.intelligence_delivery_failed',
    source: 'messaging_core',
    payload: { channel: participant.channel, participantId: participant.id, actionId: action?.id || null, conversationId: conversation.id },
  })
  return { sent, channel: participant.channel, participantId: participant.id, actionId: action?.id || null, characters: text.length }
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

export const saveMessagingParticipant = async (tenantId: string, input: Record<string, unknown>) => {
  const channel = clean(input.channel) || 'whatsapp'
  const address = clean(input.address)
  if (!address) throw Object.assign(new Error('Participant address is required.'), { status: 400 })
  const role = clean(input.role) || 'operator'
  if (!allowedIntents[role]) throw Object.assign(new Error('Unsupported messaging role.'), { status: 400 })
  const userIdProvided = Object.prototype.hasOwnProperty.call(input, 'userId')
  const userId = clean(input.userId) || null
  if (userId) {
    const user = await prisma.authUser.findFirst({ where: { id: userId, tenantId, active: true }, select: { id: true } })
    if (!user) throw Object.assign(new Error('Messaging participant user must be active in this business.'), { status: 400 })
  }
  return prisma.messagingParticipant.upsert({
    where: { tenantId_channel_address: { tenantId, channel, address } },
    create: { tenantId, userId, channel, address, role, displayName: clean(input.displayName) || null, active: input.active !== false },
    update: { ...(userIdProvided ? { userId } : {}), role, displayName: clean(input.displayName) || null, active: input.active !== false },
  })
}
