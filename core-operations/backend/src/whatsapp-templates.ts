/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// WhatsApp only allows free-form business messages within 24 hours of the customer's last
// message. Outside that window FoundAI sends one of these Meta-approved utility templates.
// Owners submit them once from the Autopilot rules panel; Meta reviews them (usually minutes).
import type { AutopilotOutbound } from '@foundingos/config/autopilot'
import { prisma } from './auth.js'
import { getIntegrationCredentials } from './platform.js'

export const TEMPLATE_LANGUAGE = 'en_GB'
type TemplateInput = { reference: string; name: string; business: string; amount: string; due: string }
type TemplateDefinition = { name: string; text: string; example: string[]; params: (input: TemplateInput) => string[] }

// 'owner-approval' goes to the business owner (not customers) when FoundAI needs a decision.
export type WhatsAppTemplatePurpose = AutopilotOutbound | 'owner-approval'

export const whatsappTemplates: Record<WhatsAppTemplatePurpose, TemplateDefinition> = {
  invoice: {
    name: 'foundingos_invoice',
    text: 'Hello, here is invoice {{1}} from {{2}} for {{3}}, due {{4}}. Reply to this message with any questions.',
    example: ['INV-1042', 'Harbour Cafe', '£420.00', '30 September'],
    params: (i) => [i.reference, i.business, i.amount, i.due],
  },
  'payment-reminder': {
    name: 'foundingos_payment_reminder',
    text: 'Hello, a reminder from {{1}} that invoice {{2}} for {{3}} is now overdue. Please reply to let us know when payment will be made, or if there is a problem.',
    example: ['Harbour Cafe', 'INV-1042', '£420.00'],
    params: (i) => [i.business, i.reference, i.amount],
  },
  bill: {
    name: 'foundingos_bill',
    text: 'Hello, {{1}} has issued your bill {{2}} for {{3}}, due {{4}}. Reply to this message with any questions.',
    example: ['Harbour Cafe', 'BIL-101', '£120.00', '30 September'],
    params: (i) => [i.business, i.reference, i.amount, i.due],
  },
  'delivery-rebook': {
    name: 'foundingos_delivery_rebook',
    text: 'Hello, sorry we missed you. {{1}} has rebooked your delivery {{2}}. Reply to this message if the new time does not suit you.',
    example: ['Harbour Cafe', 'DEL-2210'],
    params: (i) => [i.business, i.reference],
  },
  'lead-welcome': {
    name: 'foundingos_enquiry_reply',
    text: 'Hello {{1}}, thank you for your enquiry with {{2}}. Reply to this message and tell us how we can help.',
    example: ['Sam', 'Harbour Cafe'],
    params: (i) => [i.name, i.business],
  },
  'appointment-confirmation': {
    name: 'foundingos_appointment_confirmation',
    text: 'Hello, your appointment {{1}} with {{2}} is confirmed for {{3}}. Reply to this message if you need to change it.',
    example: ['APT-310', 'Harbour Clinic', '30 September'],
    params: (i) => [i.reference, i.business, i.due],
  },
  'supplier-order': {
    name: 'foundingos_purchase_order',
    text: 'Hello, {{1}} would like to place purchase order {{2}} for {{3}} ({{4}}). Please reply to confirm availability and the delivery date.',
    example: ['Harbour Cafe', 'PO-2201', 'Coffee beans', '£260.00'],
    params: (i) => [i.business, i.reference, i.name, i.amount],
  },
  'job-offer': {
    name: 'foundingos_job_offer',
    text: 'Hello {{1}}, {{2}} is delighted to offer you the role. Please reply to this message to accept or to ask any questions.',
    example: ['Mei', 'Harbour Cafe'],
    params: (i) => [i.name, i.business],
  },
  'owner-approval': {
    name: 'foundingos_owner_approval',
    text: 'FoundAI needs your OK: {{1}}. Reply YES to approve or NO to decline.',
    example: ['Send invoice INV-1042 to Harbour Cafe (£420.00)'],
    params: (i) => [i.name],
  },
}

const graph = (version: unknown) => `https://graph.facebook.com/${String(version || process.env.WHATSAPP_GRAPH_VERSION || 'v22.0')}`
const clean = (value: string, fallback: string) => (value.trim() || fallback).replace(/\s+/g, ' ').slice(0, 200)

export function templateParams(purpose: WhatsAppTemplatePurpose, input: TemplateInput) {
  const safe = { reference: clean(input.reference, 'your reference'), name: clean(input.name, 'there'), business: clean(input.business, 'our team'), amount: clean(input.amount, 'the agreed amount'), due: clean(input.due, 'on receipt') }
  return whatsappTemplates[purpose].params(safe)
}

async function whatsappAccount(tenantId: string) {
  const credentials = await getIntegrationCredentials(tenantId, 'whatsapp')
  const record = await prisma.integrationCredential.findUnique({ where: { tenantId_provider: { tenantId, provider: 'whatsapp' } }, select: { configuration: true } })
  const configuration = (record?.configuration && typeof record.configuration === 'object' ? record.configuration : {}) as Record<string, unknown>
  const businessAccountId = String(credentials.businessAccountId || configuration.businessAccountId || '').trim()
  return { credentials, businessAccountId }
}

export async function listWhatsAppTemplateStatus(tenantId: string) {
  const { credentials, businessAccountId } = await whatsappAccount(tenantId)
  if (!businessAccountId) return { businessAccountId: null, templates: Object.values(whatsappTemplates).map((t) => ({ name: t.name, status: 'NOT_SUBMITTED' })) }
  const response = await fetch(`${graph(credentials.graphVersion)}/${encodeURIComponent(businessAccountId)}/message_templates?fields=name,status,language&limit=200`, {
    headers: { Authorization: `Bearer ${String(credentials.accessToken)}` },
    signal: AbortSignal.timeout(10_000),
  })
  const body = await response.json().catch(() => null) as { data?: Array<{ name: string; status: string; language: string }>; error?: { message?: string } } | null
  if (!response.ok) throw Object.assign(new Error(body?.error?.message || `WhatsApp returned HTTP ${response.status}`), { status: 502 })
  const found = new Map((body?.data ?? []).filter((t) => t.language === TEMPLATE_LANGUAGE).map((t) => [t.name, t.status]))
  return { businessAccountId, templates: Object.values(whatsappTemplates).map((t) => ({ name: t.name, status: found.get(t.name) ?? 'NOT_SUBMITTED' })) }
}

export async function submitWhatsAppTemplates(tenantId: string, actorId: string) {
  const { credentials, businessAccountId } = await whatsappAccount(tenantId)
  if (!businessAccountId) throw Object.assign(new Error('Add your WhatsApp Business Account ID in Integrations first'), { status: 409 })
  const current = await listWhatsAppTemplateStatus(tenantId)
  const results: Array<{ name: string; status: string; error?: string }> = []
  for (const template of Object.values(whatsappTemplates)) {
    const existing = current.templates.find((t) => t.name === template.name)?.status
    if (existing && existing !== 'NOT_SUBMITTED' && existing !== 'REJECTED') { results.push({ name: template.name, status: existing }); continue }
    const response = await fetch(`${graph(credentials.graphVersion)}/${encodeURIComponent(businessAccountId)}/message_templates`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${String(credentials.accessToken)}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: template.name, language: TEMPLATE_LANGUAGE, category: 'UTILITY', components: [{ type: 'BODY', text: template.text, example: { body_text: [template.example] } }] }),
      signal: AbortSignal.timeout(10_000),
    })
    const body = await response.json().catch(() => null) as { status?: string; error?: { message?: string; error_user_msg?: string } } | null
    results.push(response.ok ? { name: template.name, status: body?.status ?? 'PENDING' } : { name: template.name, status: 'ERROR', error: body?.error?.error_user_msg || body?.error?.message || `HTTP ${response.status}` })
  }
  await prisma.workspaceAuditEvent.create({ data: { tenantId, actorId, action: 'whatsapp.templates.submitted', workspace: 'intelligence', metadata: JSON.parse(JSON.stringify(results)) } })
  return { businessAccountId, templates: results }
}

// True when the customer messaged us in the last 24 hours, so free-form text is allowed.
export async function insideServiceWindow(tenantId: string, phoneDigits: string) {
  const since = new Date(Date.now() - 24 * 60 * 60_000)
  const inbound = await prisma.messagingMessage.findFirst({
    where: { tenantId, direction: 'inbound', createdAt: { gte: since }, conversation: { channel: 'whatsapp', participantAddress: { in: [phoneDigits, `+${phoneDigits}`] } } },
    select: { id: true },
  })
  return Boolean(inbound)
}

export async function sendWhatsAppTemplate(to: string, purpose: WhatsAppTemplatePurpose, params: string[], credentials: Record<string, unknown>) {
  const template = whatsappTemplates[purpose]
  const response = await fetch(`${graph(credentials.graphVersion)}/${String(credentials.phoneNumberId)}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${String(credentials.accessToken)}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp', recipient_type: 'individual', to, type: 'template',
      template: { name: template.name, language: { code: TEMPLATE_LANGUAGE }, components: [{ type: 'body', parameters: params.map((text) => ({ type: 'text', text })) }] },
    }),
    signal: AbortSignal.timeout(10_000),
  })
  const body = await response.json().catch(() => null) as { messages?: Array<{ id?: string }>; error?: { message?: string; code?: number } } | null
  if (!response.ok) {
    const error = new Error(body?.error?.message || `WhatsApp returned HTTP ${response.status}`) as Error & { templateMissing?: boolean }
    error.templateMissing = body?.error?.code === 132001 || body?.error?.code === 132000
    throw error
  }
  const rendered = params.reduce((text, value, index) => text.replace(`{{${index + 1}}}`, value), template.text)
  return { providerId: body?.messages?.[0]?.id ?? null, body: rendered }
}
