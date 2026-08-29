/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { prisma } from './auth.js'

const normalizedEmail = (value?: string | null) => value?.trim().toLowerCase() || undefined
const normalizedPhone = (value?: string | null) => value?.replace(/\D/g, '') || undefined

export const pipelineSummary = async (tenantId?: string) => {
  const where = tenantId ? { tenantId } : {}
  const [leads, customers, orders, messages] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.customer.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.salesOrder.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.customerMessage.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 }),
  ])
  return { leads, customers, orders, messages, metrics: { leads: leads.length, customers: customers.length, openOrders: orders.filter((order) => order.status === 'open').length, messages: messages.length, pipelineValuePence: leads.reduce((sum, lead) => sum + lead.valuePence, 0) } }
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