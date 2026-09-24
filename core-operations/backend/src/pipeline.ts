/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { prisma } from './auth.js'

const normalizedEmail = (value?: string | null) => value?.trim().toLowerCase() || undefined
export const normalizedPhone = (value?: string | null) => value?.replace(/\D/g, '') || undefined

export const pipelineSummary = async (tenantId?: string) => {
  const where = tenantId ? { tenantId } : {}
  const [leads, customers, orders, messages] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.customer.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.salesOrder.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.customerMessage.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 }),
  ])

  // Messaging-operations visibility, computed from the same 100 most-recent messages already
  // fetched above (no extra query) — honestly scoped to "recent activity", not a full-history
  // guarantee, which is why the metric names below say "recent"/"awaiting reply" rather than
  // implying a complete historical audit.
  const byCustomer = new Map<string, typeof messages>()
  for (const message of messages) {
    if (!message.customerId) continue
    const bucket = byCustomer.get(message.customerId) ?? []
    bucket.push(message)
    byCustomer.set(message.customerId, bucket)
  }
  let awaitingReply = 0
  const responseGapsMs: number[] = []
  for (const bucket of byCustomer.values()) {
    const ordered = [...bucket].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    if (ordered[ordered.length - 1]?.direction === 'inbound') awaitingReply += 1
    for (let index = 1; index < ordered.length; index += 1) {
      const previous = ordered[index - 1]
      const current = ordered[index]
      if (previous.direction === 'inbound' && current.direction === 'outbound') {
        responseGapsMs.push(current.createdAt.getTime() - previous.createdAt.getTime())
      }
    }
  }
  const avgResponseMinutes = responseGapsMs.length > 0
    ? Math.round(responseGapsMs.reduce((sum, gap) => sum + gap, 0) / responseGapsMs.length / 60_000)
    : null

  // Message volume trend, again from the same recent-messages window above (capped at 100
  // rows) — honestly a "recent activity" comparison, not a guaranteed full 48h count if a
  // tenant sends more than 100 messages in that window. Lets the workspace show "busier" or
  // "quieter" than yesterday instead of only a flat total.
  const now = Date.now()
  const oneDayMs = 24 * 60 * 60 * 1000
  let messagesLast24h = 0
  let messagesPrior24h = 0
  for (const message of messages) {
    const ageMs = now - message.createdAt.getTime()
    if (ageMs < oneDayMs) messagesLast24h += 1
    else if (ageMs < oneDayMs * 2) messagesPrior24h += 1
  }

  return {
    leads,
    customers,
    orders,
    messages,
    metrics: {
      leads: leads.length,
      customers: customers.length,
      openOrders: orders.filter((order) => order.status === 'open').length,
      messages: messages.length,
      pipelineValuePence: leads.reduce((sum, lead) => sum + lead.valuePence, 0),
      // Customers whose most recent message is inbound and unanswered (within the recent
      // window above) — the single most actionable messaging-ops number: "who's waiting".
      awaitingReply,
      // Average minutes between a customer's inbound message and the next outbound reply,
      // from recent conversations that actually had a reply — null (not 0) when there isn't
      // enough recent data to compute one honestly.
      avgResponseMinutes,
      // Messages in the last 24h vs. the 24h before that — from the same recent window, so
      // this is "recent trend", not a guaranteed exact count once a tenant has heavy volume.
      messagesLast24h,
      messagesPrior24h,
    },
  }
}


export const createLead = (input: Record<string, unknown>, authenticatedTenant?: string) => {
  const tenantId = authenticatedTenant || String(input.tenantId || '')
  if (!tenantId) throw new Error('Tenant context required')
  const sourceRef = input.sourceRef ? String(input.sourceRef) : undefined
  const data = {
    tenantId,
    source: String(input.source || 'manual'),
    sourceRef,
    sourceUrl: input.sourceUrl ? String(input.sourceUrl) : undefined,
    companyName: String(input.companyName || '').trim(),
    contactName: input.contactName ? String(input.contactName) : undefined,
    email: normalizedEmail(input.email ? String(input.email) : undefined),
    phone: normalizedPhone(input.phone ? String(input.phone) : undefined),
    itemTitle: input.itemTitle ? String(input.itemTitle) : undefined,
    valuePence: Math.max(0, Number(input.valuePence || 0)),
  }
  if (!data.companyName) throw new Error('Company name is required')
  return sourceRef ? prisma.lead.upsert({ where: { sourceRef }, create: data, update: data }) : prisma.lead.create({ data })
}

export const updateLeadStage = (id: string, stage: unknown, tenantId?: string) => prisma.lead.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { stage: String(stage || 'new') } })

const customerData = (input: Record<string, unknown>) => ({
  companyName: String(input.companyName || '').trim(),
  contactName: input.contactName ? String(input.contactName).trim() : undefined,
  email: normalizedEmail(input.email ? String(input.email) : undefined),
  phone: normalizedPhone(input.phone ? String(input.phone) : undefined),
  source: input.source ? String(input.source).trim() : undefined,
})

// Persists an outbound (or inbound, for future use) message against a customer's real
// conversation thread. Called right after a WhatsApp send succeeds so a quick reply from the
// console shows up immediately in the same CustomerMessage history the "View conversation"
// panel reads — otherwise a sent reply would vanish from the thread until some other process
// wrote it back.
export const recordCustomerMessage = (tenantId: string, customerId: string, direction: 'inbound' | 'outbound', body: string, channel = 'whatsapp') =>
  prisma.customerMessage.create({ data: { tenantId, customerId, direction, body, channel } })

export const listCustomers = (tenantId?: string) => prisma.customer.findMany({ where: tenantId ? { tenantId } : {}, include: { leads: true }, orderBy: { updatedAt: 'desc' }, take: 100 })
export const getCustomer = (id: string, tenantId?: string) => prisma.customer.findFirstOrThrow({ where: { id, ...(tenantId ? { tenantId } : {}) }, include: { leads: true, orders: true, messages: { orderBy: { createdAt: 'desc' }, take: 100 } } })
export const createCustomer = async (tenantId: string, input: Record<string, unknown>) => {
  const data = customerData(input)
  if (!data.companyName) throw Object.assign(new Error('Company name is required'), { status: 400 })
  if (data.email || data.phone) {
    const duplicate = await prisma.customer.findFirst({ where: { tenantId, OR: [...(data.email ? [{ email: { equals: data.email, mode: 'insensitive' as const } }] : []), ...(data.phone ? [{ phone: data.phone }] : [])] } })
    if (duplicate) throw Object.assign(new Error('Customer already exists'), { status: 409 })
  }
  return prisma.customer.create({ data: { tenantId, ...data } })
}
export const updateCustomer = async (id: string, tenantId: string | undefined, input: Record<string, unknown>) => {
  const existing = await prisma.customer.findFirstOrThrow({ where: { id, ...(tenantId ? { tenantId } : {}) } })
  const data = customerData({ ...existing, ...input })
  if (!data.companyName) throw Object.assign(new Error('Company name is required'), { status: 400 })
  return prisma.customer.update({ where: { id: existing.id }, data })
}
export const deleteCustomer = async (id: string, tenantId?: string) => {
  const customer = await prisma.customer.findFirstOrThrow({ where: { id, ...(tenantId ? { tenantId } : {}) } })
  await prisma.lead.updateMany({ where: { customerId: customer.id }, data: { customerId: null, stage: 'qualified' } })
  return prisma.customer.delete({ where: { id: customer.id } })
}

export const convertLead = async (id: string, tenantId?: string) => prisma.$transaction(async (database) => {
  const lead = await database.lead.findFirstOrThrow({ where: { id, ...(tenantId ? { tenantId } : {}) } })
  if (lead.customerId) return database.customer.findUniqueOrThrow({ where: { id: lead.customerId } })
  const email = normalizedEmail(lead.email)
  const phone = normalizedPhone(lead.phone)
  const existing = email || phone ? await database.customer.findFirst({
    where: { tenantId: lead.tenantId, OR: [...(email ? [{ email: { equals: email, mode: 'insensitive' as const } }] : []), ...(phone ? [{ phone }] : [])] },
    orderBy: { updatedAt: 'desc' },
  }) : null
  const customer = existing
    ? await database.customer.update({ where: { id: existing.id }, data: { companyName: lead.companyName || existing.companyName, contactName: lead.contactName || existing.contactName, email: email || existing.email, phone: phone || existing.phone, source: lead.source || existing.source } })
    : await database.customer.create({ data: { tenantId: lead.tenantId, companyName: lead.companyName, contactName: lead.contactName, email, phone, source: lead.source } })
  await database.lead.update({ where: { id: lead.id }, data: { customerId: customer.id, stage: 'converted' } })
  return customer
})