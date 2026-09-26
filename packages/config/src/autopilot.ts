/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// FoundAI Autopilot: the single rulebook shared by the web workspaces (demo and live) and the
// Core.Operations backend scheduler. FoundAI runs routine work itself and queues anything the
// customer's policy marks as a human decision into an approval inbox.

export type AutopilotCategory = 'operations' | 'customers' | 'spending' | 'refunds' | 'people' | 'compliance'
export type AutopilotMode = 'auto' | 'ask' | 'off'
export type AutopilotPolicy = { enabled: boolean; spendLimitPence: number; categories: Record<AutopilotCategory, AutopilotMode> }

export const autopilotCategories: Array<{ id: AutopilotCategory; label: string; detail: string }> = [
  { id: 'operations', label: 'Routine operations', detail: 'Release orders, assign tickets and drivers, optimise routes, match bank lines, triage signals.' },
  { id: 'customers', label: 'Customer messages', detail: 'Send invoices, payment reminders, confirmations, welcome messages and scheduled campaigns.' },
  { id: 'spending', label: 'Spending money', detail: 'Reorder stock, approve bills, purchase orders, expenses and supplier payments — up to your spend limit.' },
  { id: 'refunds', label: 'Refunds & returns', detail: 'Approve returns and issue refunds — up to your spend limit.' },
  { id: 'people', label: 'People decisions', detail: 'Job offers, hiring moves, time off and payroll runs.' },
  { id: 'compliance', label: 'Clinical, tax & compliance', detail: 'Clinical assessments, insurance claims and regulated sign-offs.' },
]

export const defaultAutopilotPolicy: AutopilotPolicy = {
  enabled: true,
  spendLimitPence: 25_000,
  categories: { operations: 'auto', customers: 'auto', spending: 'auto', refunds: 'ask', people: 'ask', compliance: 'ask' },
}

export function normaliseAutopilotPolicy(value: unknown): AutopilotPolicy {
  const input = (value && typeof value === 'object' ? value : {}) as Partial<AutopilotPolicy>
  const modes: AutopilotMode[] = ['auto', 'ask', 'off']
  const categories = { ...defaultAutopilotPolicy.categories }
  for (const { id } of autopilotCategories) {
    const mode = input.categories?.[id]
    if (mode && modes.includes(mode)) categories[id] = mode
  }
  const limit = Number(input.spendLimitPence)
  return {
    enabled: input.enabled === undefined ? defaultAutopilotPolicy.enabled : Boolean(input.enabled),
    spendLimitPence: Number.isFinite(limit) && limit >= 0 ? Math.round(limit) : defaultAutopilotPolicy.spendLimitPence,
    categories,
  }
}

// Outbound purposes: the backend drafts the message (Claude, with a template fallback) and
// sends it by email or WhatsApp to the record's contact before the record moves on.
export type AutopilotOutbound = 'invoice' | 'payment-reminder' | 'bill' | 'delivery-rebook' | 'lead-welcome' | 'appointment-confirmation' | 'supplier-order' | 'job-offer'
type Rule = { module: string; from: string; to: string; category: AutopilotCategory; action: string; when?: 'overdue'; outbound?: AutopilotOutbound }

export const autopilotRules: Rule[] = [
  { module: 'orders', from: 'New', to: 'Picking', category: 'operations', action: 'Confirmed the order and released it to picking' },
  { module: 'fulfilment', from: 'Queued', to: 'Picking', category: 'operations', action: 'Released the order to the pick queue' },
  { module: 'returns', from: 'Requested', to: 'Approved', category: 'refunds', action: 'Approved the return' },
  { module: 'returns', from: 'Received', to: 'Refunded', category: 'refunds', action: 'Issued the refund' },
  { module: 'service', from: 'Open', to: 'Assigned', category: 'operations', action: 'Assigned the ticket to the next free teammate' },
  { module: 'inbox', from: 'Unread', to: 'Assigned', category: 'operations', action: 'Triaged and assigned the conversation' },
  { module: 'dispatch', from: 'Unassigned', to: 'Assigned', category: 'operations', action: 'Assigned a driver' },
  { module: 'routes', from: 'Planned', to: 'Optimised', category: 'operations', action: 'Optimised the route' },
  { module: 'deliveries', from: 'Attempted', to: 'Booked', category: 'customers', action: 'Messaged the customer and rebooked the delivery', outbound: 'delivery-rebook' },
  { module: 'exceptions', from: 'Open', to: 'Investigating', category: 'operations', action: 'Opened an investigation' },
  { module: 'invoices', from: 'Draft', to: 'Sent', category: 'customers', action: 'Sent the invoice', outbound: 'invoice' },
  { module: 'invoices', from: 'Sent', to: 'Overdue', category: 'customers', action: 'Marked overdue and sent a payment reminder', when: 'overdue', outbound: 'payment-reminder' },
  { module: 'billing', from: 'Draft', to: 'Issued', category: 'customers', action: 'Issued the bill', outbound: 'bill' },
  { module: 'bills', from: 'Received', to: 'Approved', category: 'spending', action: 'Checked and approved the bill' },
  { module: 'bills', from: 'Approved', to: 'Scheduled', category: 'spending', action: 'Scheduled the payment' },
  { module: 'expenses', from: 'Submitted', to: 'Review', category: 'operations', action: 'Checked the receipt against policy' },
  { module: 'expenses', from: 'Review', to: 'Approved', category: 'spending', action: 'Approved the expense' },
  { module: 'payments', from: 'Pending', to: 'Authorised', category: 'spending', action: 'Authorised the payment' },
  { module: 'reconciliation', from: 'Unmatched', to: 'Suggested', category: 'operations', action: 'Found a likely match' },
  { module: 'reconciliation', from: 'Suggested', to: 'Matched', category: 'operations', action: 'Accepted the match' },
  { module: 'purchasing', from: 'Draft', to: 'Approved', category: 'spending', action: 'Approved the purchase order' },
  { module: 'purchasing', from: 'Approved', to: 'Ordered', category: 'spending', action: 'Placed the order with the supplier', outbound: 'supplier-order' },
  { module: 'inventory', from: 'Low stock', to: 'Replenished', category: 'spending', action: 'Reordered stock from the supplier' },
  { module: 'approvals', from: 'Requested', to: 'Review', category: 'operations', action: 'Prepared the approval pack' },
  { module: 'approvals', from: 'Review', to: 'Approved', category: 'spending', action: 'Approved the request' },
  { module: 'campaigns', from: 'Draft', to: 'Scheduled', category: 'customers', action: 'Scheduled the campaign' },
  { module: 'content', from: 'Draft', to: 'Approved', category: 'customers', action: 'Checked and approved the copy' },
  { module: 'leads', from: 'New', to: 'Nurturing', category: 'customers', action: 'Sent a welcome message and started nurturing', outbound: 'lead-welcome' },
  { module: 'appointments', from: 'Booked', to: 'Confirmed', category: 'customers', action: 'Sent an appointment confirmation', outbound: 'appointment-confirmation' },
  { module: 'candidates', from: 'Applied', to: 'Screening', category: 'operations', action: 'Screened the application' },
  { module: 'candidates', from: 'Interview', to: 'Offer', category: 'people', action: 'Moved the candidate to offer' },
  { module: 'offers', from: 'Draft', to: 'Sent', category: 'people', action: 'Sent the job offer', outbound: 'job-offer' },
  { module: 'time-off', from: 'Requested', to: 'Review', category: 'operations', action: 'Checked cover and leave balance' },
  { module: 'time-off', from: 'Review', to: 'Approved', category: 'people', action: 'Approved the time off' },
  { module: 'payroll', from: 'Preparing', to: 'Review', category: 'operations', action: 'Prepared the payroll run' },
  { module: 'payroll', from: 'Review', to: 'Approved', category: 'people', action: 'Approved the payroll run' },
  { module: 'triage', from: 'New', to: 'Assessed', category: 'compliance', action: 'Recorded the clinical assessment' },
  { module: 'claims', from: 'Prepared', to: 'Submitted', category: 'compliance', action: 'Submitted the claim' },
  { module: 'signals', from: 'Detected', to: 'Enriched', category: 'operations', action: 'Enriched the signal' },
  { module: 'signals', from: 'Enriched', to: 'Reviewed', category: 'operations', action: 'Reviewed and routed the signal' },
  { module: 'anomalies', from: 'Detected', to: 'Investigating', category: 'operations', action: 'Started investigating' },
  { module: 'risks', from: 'Open', to: 'Investigating', category: 'operations', action: 'Started investigating' },
  { module: 'recommendations', from: 'Proposed', to: 'Review', category: 'operations', action: 'Prepared the recommendation' },
  { module: 'recommendations', from: 'Review', to: 'Approved', category: 'spending', action: 'Approved the recommendation' },
]

export type AutopilotRecord = { id: string; workspace: string; module: string; name: string; status: string; valuePence?: number | null; dueDate?: string | null }
export type AutopilotDecision = {
  key: string
  workspace: string
  module: string
  recordId: string
  recordName: string
  from: string
  to: string
  category: AutopilotCategory
  action: string
  valuePence: number | null
  mode: 'auto' | 'ask'
  reason: string
  outbound?: AutopilotOutbound
}

const money = (pence: number) => `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
const categoryLabel = (id: AutopilotCategory) => autopilotCategories.find((item) => item.id === id)?.label ?? id

export function planAutopilot(records: AutopilotRecord[], policy: AutopilotPolicy, now: Date = new Date(), maxAuto = 25): AutopilotDecision[] {
  if (!policy.enabled) return []
  const decisions: AutopilotDecision[] = []
  let autoCount = 0
  for (const record of records) {
    const rule = autopilotRules.find((item) => item.module === record.module && item.from === record.status && (!item.when || (record.dueDate && new Date(record.dueDate) < now)))
    if (!rule) continue
    const configured = policy.categories[rule.category]
    if (configured === 'off') continue
    const valuePence = typeof record.valuePence === 'number' && Number.isFinite(record.valuePence) ? record.valuePence : null
    const overLimit = (rule.category === 'spending' || rule.category === 'refunds') && valuePence !== null && valuePence > policy.spendLimitPence
    const mode: 'auto' | 'ask' = configured === 'auto' && !overLimit ? 'auto' : 'ask'
    if (mode === 'auto' && autoCount >= maxAuto) continue
    if (mode === 'auto') autoCount += 1
    decisions.push({
      key: `${record.workspace}:${record.module}:${record.id}:${rule.to}`,
      workspace: record.workspace,
      module: record.module,
      recordId: record.id,
      recordName: record.name,
      from: record.status,
      to: rule.to,
      category: rule.category,
      action: rule.action,
      valuePence,
      mode,
      ...(rule.outbound ? { outbound: rule.outbound } : {}),
      reason: mode === 'auto'
        ? `${categoryLabel(rule.category)} run automatically`
        : overLimit ? `${money(valuePence!)} is over your ${money(policy.spendLimitPence)} spend limit` : `${categoryLabel(rule.category)} need your approval`,
    })
  }
  return decisions
}
