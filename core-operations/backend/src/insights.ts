/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { prisma } from './auth.js'
import { Prisma } from './generated/prisma/index.js'

export type FeedEvent = {
  id: string
  tenantId?: string | null
  type: string
  source: string
  payload: Prisma.JsonValue
  createdAt: Date
}

type InsightType = 'prediction' | 'risk' | 'anomaly' | 'suggestion'

type GeneratedInsight = {
  type: InsightType
  source: string
  payload: Prisma.InputJsonValue
}

const json = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue

export const generateInsightsForEvent = (event: FeedEvent): GeneratedInsight[] => {
  const payload = event.payload as Record<string, unknown>
  const insights: GeneratedInsight[] = []

  if (event.type === 'inventory.low') {
    insights.push({ type: 'risk', source: event.source, payload: json({ title: 'Low inventory risk', detail: 'Replenish the affected item before the next fulfilment cycle.', eventType: event.type, payload }) })
    insights.push({ type: 'suggestion', source: event.source, payload: json({ title: 'Create replenishment task', detail: 'Review demand and create a purchase or transfer task.', eventType: event.type, payload }) })
  }
  if (event.type === 'order.confirmed') {
    insights.push({ type: 'prediction', source: event.source, payload: json({ title: 'Fulfilment path opened', detail: 'A confirmed order should now progress to shipment and invoicing.', eventType: event.type, payload }) })
  }
  if (event.type === 'shipment.created') {
    insights.push({ type: 'prediction', source: event.source, payload: json({ title: 'Delivery ETA estimate', detail: 'Monitor delivery completion against the promised fulfilment window.', eventType: event.type, payload }) })
  }
  if (event.type === 'delivery.completed') {
    insights.push({ type: 'suggestion', source: event.source, payload: json({ title: 'Release delivery follow-up', detail: 'Confirm invoice and payment follow-up for the completed delivery.', eventType: event.type, payload }) })
  }
  if (event.type === 'invoice.generated') {
    insights.push({ type: 'risk', source: event.source, payload: json({ title: 'Receivable opened', detail: 'Track the due date and send a WhatsApp reminder if payment is delayed.', eventType: event.type, payload }) })
  }
  if (event.type === 'payment.received') {
    insights.push({ type: 'prediction', source: event.source, payload: json({ title: 'Cash collection confirmed', detail: 'Update DSO and fulfilment-to-cash reporting.', eventType: event.type, payload }) })
  }
  if (event.type === 'payroll.run') {
    insights.push({ type: 'prediction', source: event.source, payload: json({ title: 'Payroll committed', detail: 'Finance should reconcile the payroll run against the next payment cycle.', eventType: event.type, payload }) })
  }
  if (event.type === 'timesheet.approved') {
    insights.push({ type: 'suggestion', source: event.source, payload: json({ title: 'Payroll readiness', detail: 'Approved time is ready for payroll validation.', eventType: event.type, payload }) })
  }
  if (event.type === 'appointment.created') {
    insights.push({ type: 'prediction', source: event.source, payload: json({ title: 'No-show watch', detail: 'Send an appointment reminder and monitor attendance risk.', eventType: event.type, payload }) })
  }
  if (event.type === 'medical.billing.generated') {
    insights.push({ type: 'suggestion', source: event.source, payload: json({ title: 'Billing reconciliation', detail: 'Reconcile medical billing with the finance ledger.', eventType: event.type, payload }) })
  }
  if (event.type === 'messaging.message_received' && payload.intent === 'unknown') {
    insights.push({ type: 'suggestion', source: event.source, payload: json({ title: 'Unrecognized WhatsApp request', detail: 'Review the conversation and decide whether this recurring request should become a supported command.', action: { label: 'Open messaging activity', href: '/modules/messaging' }, eventType: event.type, payload }) })
  }
  if (event.type === 'messaging.intent_create_order') {
    insights.push({ type: 'prediction', source: event.source, payload: json({ title: 'WhatsApp order entered operations', detail: 'The new order should now progress through stock reservation, fulfilment, delivery, and invoicing.', action: { label: 'Review orders', href: '/modules/orders' }, eventType: event.type, payload }) })
  }
  if (event.type === 'messaging.intent_mark_delivered') {
    insights.push({ type: 'suggestion', source: event.source, payload: json({ title: 'Delivery confirmed in WhatsApp', detail: 'Review the associated invoice and payment follow-up now that delivery is complete.', action: { label: 'Open fulfilment-to-cash', href: '/fulfilment-to-cash' }, eventType: event.type, payload }) })
  }
  if (event.type === 'messaging.intent_create_invoice') {
    insights.push({ type: 'risk', source: event.source, payload: json({ title: 'WhatsApp invoice awaiting review', detail: 'Confirm the branded invoice details and due date before sending it to the customer.', action: { label: 'Review finance', href: '/modules/finance' }, eventType: event.type, payload }) })
  }
  if (event.type === 'messaging.intent_create_campaign') {
    insights.push({ type: 'suggestion', source: event.source, payload: json({ title: 'WhatsApp campaign draft ready', detail: 'Review audience, inventory readiness, brand rules, and timing before launch.', action: { label: 'Review marketing', href: '/marketing' }, eventType: event.type, payload }) })
  }
  if (event.type === 'messaging.intent_failed') {
    insights.push({ type: 'risk', source: event.source, payload: json({ title: 'Messaging action failed', detail: 'No silent mutation occurred. Review the command error and complete the workflow in the web workspace if needed.', action: { label: 'Open messaging activity', href: '/modules/messaging' }, eventType: event.type, payload }) })
  }
  if (event.type === 'messaging.delivery_failed') {
    insights.push({ type: 'risk', source: event.source, payload: json({ title: 'WhatsApp confirmation failed', detail: 'The business action may have completed, but its chat confirmation was not delivered. Use the web workspace as the operational fallback and check Meta channel health.', action: { label: 'Check messaging health', href: '/modules/messaging' }, eventType: event.type, payload }) })
  }
  return insights
}

const clients = new Set<NodeJS.WritableStream>()

export const broadcastInsight = (insight: unknown) => {
  const frame = `data: ${JSON.stringify(insight)}\n\n`
  for (const client of clients) {
    try { client.write(frame) } catch { clients.delete(client) }
  }
}

export const registerInsightStreamClient = (client: NodeJS.WritableStream) => {
  clients.add(client)
  return () => clients.delete(client)
}

export const listInsights = (tenantId: string | undefined, type?: string, source?: string) =>
  prisma.insight.findMany({
    where: { ...(tenantId ? { tenantId } : {}), ...(type ? { type } : {}), ...(source ? { source } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

export const generateAndStoreInsights = async (event: FeedEvent) => {
  const generated = generateInsightsForEvent(event)
  if (!generated.length) return []
  const stored = []
  for (const insight of generated) {
    const existing = await prisma.insight.findFirst({ where: { eventId: event.id, type: insight.type } })
    if (existing) continue
    stored.push(await prisma.insight.create({
      data: { tenantId: event.tenantId, type: insight.type, source: insight.source, eventId: event.id, payload: insight.payload },
    }))
  }
  stored.forEach(broadcastInsight)
  return stored
}

export const generateInsightsFromRecentEvents = async (tenantId?: string) => {
  const events = await prisma.event.findMany({
    where: tenantId ? { tenantId } : {},
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  const generated = []
  for (const event of events) generated.push(...await generateAndStoreInsights(event))
  return generated
}
