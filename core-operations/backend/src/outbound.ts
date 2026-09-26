/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real outbound delivery for FoundAI Autopilot: drafts the message (Claude when configured,
// otherwise a plain template) and sends it through the tenant's own Resend or WhatsApp
// connection. Nothing is marked as sent unless the provider accepted it.
import type { AutopilotDecision, AutopilotOutbound } from '@foundingos/config/autopilot'
import { prisma } from './auth.js'
import { isAiConfigured } from './ai.js'
import { getIntegrationCredentials } from './platform.js'
import { sendWhatsAppText } from './whatsapp.js'

export type OutboundRecord = { reference: string; name: string; valuePence: number | null; data: Record<string, unknown> }
export type OutboundResult = { channel: 'email' | 'whatsapp'; to: string; subject: string; body: string; providerId: string | null; draftedBy: 'foundai' | 'template' }
export class OutboundBlocked extends Error {}

const purposeBrief: Record<AutopilotOutbound, string> = {
  invoice: 'Send this invoice to the customer with the amount and a polite request to pay by the due date.',
  'payment-reminder': 'A friendly but clear reminder that this invoice is now overdue, with the amount, asking them to pay or reply if there is a problem.',
  bill: 'Send this bill to the customer with the amount and due date.',
  'delivery-rebook': 'We missed the customer on our delivery attempt. Apologise briefly and tell them we have rebooked the delivery; ask them to reply if the new slot does not suit.',
  'lead-welcome': 'A short, warm welcome to a new enquiry, thanking them and asking what they need help with.',
  'appointment-confirmation': 'Confirm the appointment and ask them to reply if they need to change it.',
  'supplier-order': 'Place this purchase order with the supplier: state the order reference and value and ask them to confirm availability and delivery date.',
  'job-offer': 'Offer the candidate the role, warmly and professionally, and ask them to reply to accept or ask questions. Do not invent salary or terms beyond what is supplied.',
}
const subjects: Record<AutopilotOutbound, string> = {
  invoice: 'Invoice', 'payment-reminder': 'Payment reminder', bill: 'Your bill', 'delivery-rebook': 'Your delivery has been rebooked',
  'lead-welcome': 'Thanks for getting in touch', 'appointment-confirmation': 'Appointment confirmed', 'supplier-order': 'Purchase order', 'job-offer': 'Your job offer',
}

const money = (pence: number | null) => pence === null ? '' : `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const text = (value: unknown) => String(value ?? '').trim()
const emailOf = (data: Record<string, unknown>) => { const value = text(data.email || data.contactEmail); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : '' }
const phoneOf = (data: Record<string, unknown>) => text(data.phone || data.contactPhone || data.whatsapp).replace(/[^\d]/g, '')

async function businessName(tenantId: string) {
  const [onboarding, brand] = await Promise.all([
    prisma.tenantOnboarding.findUnique({ where: { tenantId }, select: { businessName: true } }).catch(() => null),
    prisma.tenantBrandProfile.findUnique({ where: { tenantId }, select: { companyName: true, tradingName: true } }).catch(() => null),
  ])
  return brand?.tradingName || brand?.companyName || onboarding?.businessName || 'Our team'
}

function templateMessage(purpose: AutopilotOutbound, record: OutboundRecord, business: string) {
  const amount = money(record.valuePence)
  const due = text(record.data.dueDate)
  const ref = record.reference
  const lines: Record<AutopilotOutbound, string> = {
    invoice: `Hello,\n\nPlease find invoice ${ref}${amount ? ` for ${amount}` : ''}${due ? `, due on ${due}` : ''}.\n\nThank you for your business.`,
    'payment-reminder': `Hello,\n\nThis is a reminder that invoice ${ref}${amount ? ` for ${amount}` : ''} is now overdue${due ? ` (it was due on ${due})` : ''}. Could you let us know when we can expect payment, or reply if there is a problem?`,
    bill: `Hello,\n\nHere is your bill ${ref}${amount ? ` for ${amount}` : ''}${due ? `, due on ${due}` : ''}.`,
    'delivery-rebook': `Hello,\n\nSorry we missed you. We've rebooked your delivery (${ref}). If the new time doesn't suit, just reply to this message.`,
    'lead-welcome': `Hello ${record.name},\n\nThanks for getting in touch. What can we help you with?`,
    'appointment-confirmation': `Hello,\n\nYour appointment (${ref}) is confirmed${due ? ` for ${due}` : ''}. Reply to this message if you need to change it.`,
    'supplier-order': `Hello,\n\nWe'd like to place purchase order ${ref}${amount ? ` (${amount})` : ''} for ${record.name}. Please confirm availability and the expected delivery date.`,
    'job-offer': `Hello ${record.name},\n\nWe're delighted to offer you the role. Please reply to accept or with any questions.`,
  }
  return { subject: `${subjects[purpose]} ${purpose === 'lead-welcome' || purpose === 'job-offer' ? `from ${business}` : ref}`.trim(), body: `${lines[purpose]}\n\n${business}` }
}

async function draftWithClaude(purpose: AutopilotOutbound, record: OutboundRecord, business: string, channel: 'email' | 'whatsapp') {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': String(process.env.ANTHROPIC_API_KEY).trim(), 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: String(process.env.AI_REASONING_MODEL || 'claude-sonnet-4-5').trim(),
      max_tokens: 500,
      temperature: 0.3,
      system: `You write short business messages on behalf of ${business}. Use only the facts supplied; never invent amounts, dates, links, bank details or terms. British English. ${channel === 'whatsapp' ? 'This is a WhatsApp message: under 600 characters, no subject line, no markdown.' : 'This is a plain-text email: no markdown.'} Sign off as ${business}. Return strict JSON: {"subject": string, "body": string}.`,
      messages: [{ role: 'user', content: JSON.stringify({ task: purposeBrief[purpose], reference: record.reference, name: record.name, amount: money(record.valuePence) || null, dueDate: text(record.data.dueDate) || null, context: text(record.data.secondary) || null }) }],
    }),
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok) throw new Error(`Claude returned HTTP ${response.status}`)
  const payload = await response.json() as { content?: Array<{ type?: string; text?: string }> }
  const raw = payload.content?.find((item) => item.type === 'text')?.text ?? ''
  const parsed = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)) as { subject?: string; body?: string }
  if (!text(parsed.body)) throw new Error('Claude returned an empty message')
  return { subject: text(parsed.subject) || subjects[purpose], body: text(parsed.body) }
}

async function sendEmail(tenantId: string, to: string, subject: string, body: string) {
  const credentials = await getIntegrationCredentials(tenantId, 'resend')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${String(credentials.apiKey)}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: String(credentials.fromAddress), to: [to], subject, text: body }),
    signal: AbortSignal.timeout(15_000),
  })
  const payload = await response.json().catch(() => null) as { id?: string; message?: string } | null
  if (!response.ok) throw new Error(payload?.message || `Email provider returned HTTP ${response.status}`)
  return payload?.id ?? null
}

async function connected(tenantId: string, provider: 'resend' | 'whatsapp') {
  const record = await prisma.integrationCredential.findUnique({ where: { tenantId_provider: { tenantId, provider } }, select: { status: true } })
  return Boolean(record && ['configured', 'ready'].includes(record.status))
}

// Throws OutboundBlocked (a human needs to fix something) or a provider error; returns only on real delivery.
export async function deliverOutbound(tenantId: string, decision: AutopilotDecision, record: OutboundRecord): Promise<OutboundResult> {
  const purpose = decision.outbound!
  const email = emailOf(record.data)
  const phone = phoneOf(record.data)
  if (!email && !phone) throw new OutboundBlocked(`Add a contact email or WhatsApp number to ${record.name} so FoundAI can send this`)
  const [hasEmail, hasWhatsApp] = await Promise.all([email ? connected(tenantId, 'resend') : false, phone ? connected(tenantId, 'whatsapp') : false])
  const channel: 'email' | 'whatsapp' | null = email && hasEmail ? 'email' : phone && hasWhatsApp ? 'whatsapp' : null
  if (!channel) throw new OutboundBlocked(email ? 'Connect email (Resend) in Integrations so FoundAI can send this' : 'Connect WhatsApp in Integrations so FoundAI can send this')
  const business = await businessName(tenantId)
  let draft = templateMessage(purpose, record, business)
  let draftedBy: OutboundResult['draftedBy'] = 'template'
  if (isAiConfigured()) {
    try { draft = await draftWithClaude(purpose, record, business, channel); draftedBy = 'foundai' } catch { /* template fallback */ }
  }
  if (channel === 'email') {
    const providerId = await sendEmail(tenantId, email, draft.subject, draft.body)
    return { channel, to: email, subject: draft.subject, body: draft.body, providerId, draftedBy }
  }
  const credentials = await getIntegrationCredentials(tenantId, 'whatsapp')
  const result = await sendWhatsAppText(phone, draft.body, undefined, credentials) as { messages?: Array<{ id?: string }> }
  return { channel, to: `+${phone}`, subject: draft.subject, body: draft.body, providerId: result.messages?.[0]?.id ?? null, draftedBy }
}
