'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { bootstrapProduction, getProductionSession, loginToProduction, logoutProduction, productionAgentActions, productionApiConfigured, productionModeEnabled, productionPlatform, productionRecords, productionRequest, type AgentAction, type AgentIntelligenceSummary, type ControlSettings, type ProductionInvitation, type ProductionSession, type ProductionWorkspaceRecord } from './workspace-production-client'

const workspaceRoot = productionModeEnabled ? '/app' : '/test-workspaces'

export type BusinessWorkspaceSlug = 'retail' | 'logistics' | 'finance' | 'marketing' | 'talent' | 'health' | 'intelligence'

type WorkspaceRecord = { id: string; backendId?: string; version?: number; name: string; secondary: string; value: string; status: string; owner: string; updated: string; attachment?: string; attachmentName?: string; quantity?: number; reorderPoint?: number; log?: Array<{ time: string; note: string; kind?: string }>; dueDate?: string }
type WorkspaceModule = { id: string; label: string; group: string; statuses?: string[] }
type WorkspaceEvent = { id: string; workspace: BusinessWorkspaceSlug; text: string; time: string; type?: string; payload?: Record<string, unknown> }
type WorkspaceState = {
  records: Record<string, WorkspaceRecord[]>
  automations: Array<{ id: string; name: string; enabled: boolean; runs: number }>
  integrations: Array<{ id: string; name: string; category: string; connected: boolean }>
  settings: { businessName: string; region: string; notifications: boolean }
}
type WorkspaceConfig = {
  label: string
  suite: string
  accent: string
  description: string
  subjects: string[]
  metrics: Array<{ label: string; value: string; change: string }>
  modules: WorkspaceModule[]
}

const module = (id: string, label: string, group: string, statuses?: string[]): WorkspaceModule => ({ id, label, group, statuses })
const standard = ['New', 'In progress', 'Review', 'Complete']

const configs: Record<BusinessWorkspaceSlug, WorkspaceConfig> = {
  retail: {
    label: 'Retail', suite: 'Core.Operations', accent: '#24c47a', description: 'Run sales, customer relationships, marketing, commerce, service, and finance from one connected workspace.',
    subjects: ['Harbour Cafe', 'Amina Yusuf', 'North & Co', 'Sofia Martins', 'Willowbrook Bakery', 'Deacon & Rye', 'Priya Anand', 'The Corner Deli'],
    metrics: [{ label: 'Revenue', value: '£18.6k', change: '+12.4% this week' }, { label: 'Pipeline', value: '£42.8k', change: '14 open opportunities' }, { label: 'Customers', value: '1,284', change: '+38 this month' }, { label: 'Conversion', value: '8.7%', change: '+1.3 points' }],
    modules: [
      module('overview', 'Home', 'Workspace'), module('sales-pipeline', 'Sales pipeline', 'Sales', ['Lead', 'Qualified', 'Proposal', 'Won']), module('orders', 'Orders', 'Sales', ['New', 'Picking', 'Ready', 'Delivered']), module('point-of-sale', 'Point of sale', 'Sales', ['Open basket', 'Payment due', 'Paid', 'Closed']),
      module('crm', 'CRM', 'Customers', ['New', 'Engaged', 'Active', 'VIP']), module('segments', 'Segments', 'Customers'), module('loyalty', 'Loyalty', 'Customers'), module('inbox', 'Omnichannel inbox', 'Customers', ['Unread', 'Assigned', 'Waiting', 'Resolved']),
      module('campaigns', 'Campaigns', 'Marketing', ['Draft', 'Scheduled', 'Live', 'Complete']), module('automations', 'Automations', 'Marketing'), module('content', 'Content studio', 'Marketing', ['Idea', 'Draft', 'Approved', 'Published']),
      module('products', 'Products', 'Commerce'), module('inventory', 'Inventory', 'Commerce', ['Low stock', 'Available', 'Reserved', 'Replenished']), module('promotions', 'Promotions', 'Commerce', ['Draft', 'Scheduled', 'Live', 'Ended']), module('channels', 'Sales channels', 'Commerce'),
      module('production-orders', 'Production orders', 'Commerce', ['Planned', 'In production', 'Quality check', 'Complete']), module('boms', 'Bills of materials', 'Commerce'),
      module('purchasing', 'Purchasing', 'Operations', ['Draft', 'Approved', 'Ordered', 'Received']), module('suppliers', 'Suppliers', 'Operations'), module('fulfilment', 'Fulfilment', 'Operations', ['Queued', 'Picking', 'Packed', 'Dispatched']), module('returns', 'Returns', 'Operations', ['Requested', 'Approved', 'Received', 'Refunded']),
      module('service', 'Customer service', 'Service', ['Open', 'Assigned', 'Waiting', 'Resolved']), module('payments', 'Payments', 'Finance', ['Pending', 'Authorised', 'Paid', 'Reconciled']), module('reports', 'Reports & forecasts', 'Intelligence'),
      module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('security', 'Security & Access', 'Administration'), module('settings', 'Settings', 'Administration'),
    ],
  },
  logistics: {
    label: 'Logistics', suite: 'Core.Operations', accent: '#ff496e', description: 'Coordinate dispatch, routes, drivers, fleet, warehouses, tracking, and customer delivery promises.',
    subjects: ['Route North 14', 'Harbour Cafe delivery', 'Driver Maya Chen', 'Depot West', 'Route South 22', 'Willowbrook Bakery run', 'Driver Leo Osei', 'Depot East'],
    metrics: [{ label: 'On-time delivery', value: '94.8%', change: '+2.1 points' }, { label: 'Active routes', value: '24', change: '3 reporting now' }, { label: 'Exceptions', value: '3', change: '-4 today' }, { label: 'Fleet utilisation', value: '87%', change: '+5.2%' }],
    modules: [module('overview', 'Control tower', 'Workspace'), module('dispatch', 'Dispatch board', 'Delivery', ['Unassigned', 'Assigned', 'Loaded', 'Departed']), module('routes', 'Routes', 'Delivery', ['Planned', 'Optimised', 'Active', 'Complete']), module('deliveries', 'Deliveries', 'Delivery', ['Booked', 'Out for delivery', 'Attempted', 'Delivered']), module('tracking', 'Live tracking', 'Delivery'), module('exceptions', 'Exceptions', 'Delivery', ['Open', 'Investigating', 'Recovering', 'Resolved']), module('fleet', 'Fleet', 'Resources'), module('drivers', 'Drivers', 'Resources'), module('warehouses', 'Warehouses', 'Resources'), module('customers', 'Customers', 'Commercial'), module('quotes', 'Quotes', 'Commercial', standard), module('billing', 'Billing', 'Commercial', ['Draft', 'Issued', 'Paid', 'Reconciled']), module('reports', 'Performance', 'Intelligence'), module('automations', 'Automations', 'Intelligence'), module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('security', 'Security & Access', 'Administration'), module('settings', 'Settings', 'Administration')],
  },
  finance: {
    label: 'Finance', suite: 'Core.Operations', accent: '#ffb33e', description: 'Control cash, invoices, bills, banking, reconciliation, budgets, tax, and financial approvals.',
    subjects: ['North & Co invoice', 'September payroll', 'Stripe settlement', 'Northstar Textiles bill', 'Willowbrook Bakery invoice', 'HMRC VAT return', 'Office lease payment', 'Deacon & Rye refund'],
    metrics: [{ label: 'Cash position', value: '£86.4k', change: '+9.7% this month' }, { label: 'Receivables', value: '£24.3k', change: '£8.1k due this week' }, { label: 'Payables', value: '£17.8k', change: '12 open bills' }, { label: 'Runway', value: '11.4 mo', change: '+0.8 months' }],
    modules: [module('overview', 'Finance home', 'Workspace'), module('cashflow', 'Cash flow', 'Money'), module('invoices', 'Invoices', 'Money', ['Draft', 'Sent', 'Overdue', 'Paid']), module('bills', 'Bills', 'Money', ['Received', 'Approved', 'Scheduled', 'Paid']), module('banking', 'Banking', 'Money'), module('reconciliation', 'Reconciliation', 'Money', ['Unmatched', 'Suggested', 'Matched', 'Verified']), module('expenses', 'Expenses', 'Spend', ['Submitted', 'Review', 'Approved', 'Reimbursed']), module('payments', 'Payments', 'Spend', ['Pending', 'Authorised', 'Paid', 'Reconciled']), module('budgets', 'Budgets', 'Planning'), module('forecasting', 'Forecasting', 'Planning'), module('tax', 'Tax', 'Compliance', standard), module('approvals', 'Approvals', 'Compliance', ['Requested', 'Review', 'Approved', 'Complete']), module('reports', 'Financial reports', 'Intelligence'), module('automations', 'Automations', 'Intelligence'), module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('security', 'Security & Access', 'Administration'), module('settings', 'Settings', 'Administration')],
  },
  marketing: {
    label: 'Marketing', suite: 'Core.Operations', accent: '#f56fc2', description: 'Plan campaigns, build audiences, create content, nurture leads, and prove attributed revenue.',
    subjects: ['Summer launch', 'Lapsed VIP audience', 'WhatsApp welcome journey', 'Founder story campaign', 'Autumn restock push', 'Loyalty win-back', 'Referral spotlight', 'Weekend flash sale'],
    metrics: [{ label: 'Attributed revenue', value: '£11.2k', change: '+18.5%' }, { label: 'Pipeline influenced', value: '£31.6k', change: '22 opportunities' }, { label: 'Reach', value: '23.1k', change: '+16.2%' }, { label: 'Return on spend', value: '4.8x', change: '+0.6x' }],
    modules: [module('overview', 'Marketing home', 'Workspace'), module('campaigns', 'Campaigns', 'Campaigns', ['Draft', 'Scheduled', 'Live', 'Complete']), module('calendar', 'Calendar', 'Campaigns'), module('audiences', 'Audiences', 'Audience'), module('segments', 'Segments', 'Audience'), module('leads', 'Leads', 'Audience', ['New', 'Nurturing', 'Qualified', 'Converted']), module('content', 'Content studio', 'Creative', ['Idea', 'Draft', 'Approved', 'Published']), module('brand-studio', 'Brand Studio', 'Creative'), module('channels', 'Channels', 'Distribution'), module('journeys', 'Customer journeys', 'Distribution', ['Draft', 'Active', 'Paused', 'Complete']), module('inbox', 'Campaign inbox', 'Distribution', ['Unread', 'Assigned', 'Waiting', 'Resolved']), module('attribution', 'Attribution', 'Intelligence'), module('reports', 'Analytics', 'Intelligence'), module('automations', 'Automations', 'Intelligence'), module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('security', 'Security & Access', 'Administration'), module('settings', 'Settings', 'Administration')],
  },
  talent: {
    label: 'Talent', suite: 'Core.Workforce', accent: '#ff8a33', description: 'Recruit, onboard, develop, support, and retain the team in one workforce system.',
    subjects: ['Amara Johnson', 'Senior operator role', 'Noah Williams review', 'September onboarding', 'Leo Osei', 'Warehouse lead role', 'Priya Anand review', 'October onboarding'],
    metrics: [{ label: 'Open roles', value: '12', change: '4 priority hires' }, { label: 'Candidates', value: '184', change: '+28 this week' }, { label: 'Time to hire', value: '24d', change: '-3 days' }, { label: 'Engagement', value: '82%', change: '+4 points' }],
    modules: [module('overview', 'People home', 'Workspace'), module('candidates', 'Candidates', 'Recruiting', ['Applied', 'Screening', 'Interview', 'Offer']), module('jobs', 'Jobs', 'Recruiting', ['Draft', 'Open', 'Interviewing', 'Filled']), module('interviews', 'Interviews', 'Recruiting', ['Planned', 'Confirmed', 'Complete', 'Decision']), module('offers', 'Offers', 'Recruiting', ['Draft', 'Sent', 'Accepted', 'Onboarding']), module('onboarding', 'Onboarding', 'People', standard), module('people', 'People directory', 'People'), module('performance', 'Performance', 'People', standard), module('time-off', 'Time off', 'People', ['Requested', 'Review', 'Approved', 'Complete']), module('learning', 'Learning', 'Development', standard), module('payroll', 'Payroll', 'Reward', ['Preparing', 'Review', 'Approved', 'Paid']), module('engagement', 'Engagement', 'Intelligence'), module('reports', 'Workforce reports', 'Intelligence'), module('automations', 'Automations', 'Intelligence'), module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('security', 'Security & Access', 'Administration'), module('settings', 'Settings', 'Administration')],
  },
  health: {
    label: 'Health', suite: 'Core.Operations', accent: '#4cc9ff', description: 'Coordinate patients, appointments, care plans, practitioners, follow-ups, billing, and compliance.',
    subjects: ['Amina Yusuf', 'Morning clinic', 'Care plan CP-204', 'Dr Maya Chen', 'Leo Osei', 'Afternoon clinic', 'Care plan CP-219', 'Dr Priya Anand'],
    metrics: [{ label: 'Appointments', value: '42', change: '+6 today' }, { label: 'Checked in', value: '31', change: '74% arrival' }, { label: 'Follow-ups', value: '7', change: '2 priority' }, { label: 'Capacity', value: '86%', change: '+5 points' }],
    modules: [module('overview', 'Care operations', 'Workspace'), module('appointments', 'Appointments', 'Care', ['Booked', 'Confirmed', 'Checked in', 'Complete']), module('patients', 'Patients', 'Care'), module('care-plans', 'Care plans', 'Care', standard), module('triage', 'Triage', 'Care', ['New', 'Assessed', 'Assigned', 'Complete']), module('clinical-inbox', 'Clinical inbox', 'Care', ['Unread', 'Assigned', 'Waiting', 'Resolved']), module('follow-ups', 'Follow-ups', 'Care', standard), module('practitioners', 'Practitioners', 'Resources'), module('locations', 'Locations', 'Resources'), module('inventory', 'Clinical inventory', 'Resources', ['Low stock', 'Available', 'Reserved', 'Replenished']), module('billing', 'Billing', 'Finance', ['Draft', 'Issued', 'Paid', 'Reconciled']), module('claims', 'Claims', 'Finance', ['Prepared', 'Submitted', 'Review', 'Settled']), module('compliance', 'Compliance', 'Governance', standard), module('reports', 'Care reports', 'Intelligence'), module('automations', 'Automations', 'Intelligence'), module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('security', 'Security & Access', 'Administration'), module('settings', 'Settings', 'Administration')],
  },
  intelligence: {
    label: 'Intelligence', suite: 'Core.Intelligence', accent: '#b77aff', description: 'Monitor the event graph, surface risks, forecast outcomes, and coordinate recommended decisions.',
    subjects: ['Cash runway risk', 'Inventory demand spike', 'Delivery exception cluster', 'Campaign revenue opportunity', 'Payroll cost drift', 'Churn risk cohort', 'Route delay pattern', 'Upsell opportunity'],
    metrics: [{ label: 'Live signals', value: '420', change: '+14.6%' }, { label: 'Open risks', value: '8', change: '3 high priority' }, { label: 'Recommendations', value: '17', change: '£24k potential value' }, { label: 'Confidence', value: '91%', change: '+5.1 points' }],
    modules: [module('overview', 'Command centre', 'Workspace'), module('outcomes', 'Outcomes & value', 'Workspace'), module('strategic-overview', 'Strategic overview', 'Workspace'), module('signals', 'Signals', 'Decisioning', ['Detected', 'Enriched', 'Reviewed', 'Resolved']), module('risks', 'Risks', 'Decisioning', ['Open', 'Investigating', 'Mitigating', 'Resolved']), module('recommendations', 'Recommendations', 'Decisioning', ['Proposed', 'Review', 'Approved', 'Executed']), module('forecasts', 'Forecasts', 'Planning'), module('scenarios', 'Scenarios', 'Planning', standard), module('anomalies', 'Anomalies', 'Monitoring', ['Detected', 'Investigating', 'Recovering', 'Resolved']), module('event-feed', 'Shared Event Feed', 'Monitoring'), module('workflows', 'AI workflows', 'Automation', standard), module('models', 'Models', 'Automation'), module('data-sources', 'Data sources', 'Data'), module('reports', 'Intelligence reports', 'Data'), module('automations', 'Automations', 'Data'), module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('security', 'Security & Access', 'Administration'), module('settings', 'Settings', 'Administration')],
  },
}

const workspaceOrder: BusinessWorkspaceSlug[] = ['retail', 'logistics', 'finance', 'marketing', 'talent', 'health', 'intelligence']
const statusFor = (item: WorkspaceModule) => item.statuses ?? standard
const hashSeed = (value: string): number => {
  let hash = 0
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  return hash
}
const ownerPool = ['Maya', 'Noah', 'Ava', 'Bobby', 'Leo', 'Priya']
// Groups that represent real money movement (invoices, bills, payroll runs, billing, deals) —
// these should always carry a varied currency value, never the "High priority" text label,
// so downstream aggregation (aging, budgets, forecasting) has real numbers to work with.
const moneyGroups = new Set(['Money', 'Spend', 'Reward', 'Commercial'])
const seedWorkspace = (workspace: BusinessWorkspaceSlug): WorkspaceState => {
  const config = configs[workspace]
  const records = Object.fromEntries(config.modules.filter((item) => item.id !== 'overview').map((item) => {
    const moduleHash = hashSeed(`${workspace}:${item.id}`)
    // Rotate the starting subject and vary the record count per module so every module in a
    // workspace shows different names/counts instead of repeating the same seed data everywhere.
    const offset = moduleHash % config.subjects.length
    const count = 3 + (moduleHash % 4)
    const moduleSubjects = Array.from({ length: count }, (_, i) => config.subjects[(offset + i) % config.subjects.length])
    const isMoneyGroup = moneyGroups.has(item.group)
    return [
      item.id,
      moduleSubjects.map((subject, index) => {
        const isStockModule = item.id === 'inventory'
        const quantity = isStockModule ? [6, 34, 18, 52][index % 4] : undefined
        const reorderPoint = isStockModule ? 20 : undefined
        const status = isStockModule ? (quantity! <= reorderPoint! ? 'Low stock' : statusFor(item)[(index % (statusFor(item).length - 1)) + 1]) : statusFor(item)[index % statusFor(item).length]
        // Every record gets its own varied, deterministic currency figure instead of a single
        // fixed "£4,280" repeated everywhere — real businesses never have every invoice be the
        // exact same amount.
        const amount = 45 + (hashSeed(`${workspace}:${item.id}:${subject}:${index}`) % 18455)
        const currencyValue = `£${amount.toLocaleString('en-GB')}`
        const value = isStockModule ? `${quantity} units` : isMoneyGroup || index % 2 ? currencyValue : 'High priority'
        return { id: `${item.id.slice(0, 3).toUpperCase()}-${101 + index}`, name: subject, secondary: `${item.label} workflow`, value, status, owner: ownerPool[(moduleHash + index) % ownerPool.length], updated: `${index * 18 + 4}m ago`, quantity, reorderPoint, log: isStockModule ? [{ time: `${index * 18 + 40}m ago`, note: `Counted ${quantity} units on hand` }] : undefined }
      }),
    ]
  }))
  return {
    records,
    automations: [
      { id: 'AUT-1', name: `Priority ${config.label.toLowerCase()} alerts`, enabled: true, runs: 142 },
      { id: 'AUT-2', name: 'WhatsApp confirmation and follow-up', enabled: true, runs: 96 },
      { id: 'AUT-3', name: 'Cross-workspace handoff', enabled: true, runs: 38 },
      { id: 'AUT-4', name: 'Weekly performance summary', enabled: false, runs: 0 },
    ],
    integrations: [
      { id: 'INT-1', name: 'WhatsApp Cloud API', category: 'Messaging', connected: true },
      { id: 'INT-2', name: 'Stripe', category: 'Payments', connected: workspace !== 'talent' },
      { id: 'INT-3', name: 'Google Workspace', category: 'Productivity', connected: true },
      { id: 'INT-4', name: workspace === 'health' ? 'FHIR gateway' : 'Accounting connector', category: 'Operations', connected: false },
    ],
    settings: { businessName: 'FoundingOS Demo Company', region: 'United Kingdom', notifications: true },
  }
}

const EVENTS_KEY = 'foundingos-shared-workspace-events-v1'
const AGENT_ACTIONS_KEY = 'foundingos-agent-actions-v1'
const ACTIVATION_KEY = 'foundingos-intelligence-activation-v1'
const DEMO_REFERENCE_TIME = '2026-09-18T10:00:00.000Z'
const storageKey = (workspace: BusinessWorkspaceSlug) => `foundingos-${workspace}-complete-workspace-v1`

const demoAgentAction = (): AgentAction => ({
  id: 'agent-replenishment-001',
  kind: 'inventory.replenishment',
  title: 'Replenish House Blend Coffee',
  summary: 'House Blend Coffee is at 8 units. Coordinate purchasing, inbound logistics, and finance before stockout.',
  rationale: 'The Shared Event Feed detected a low-stock signal. Acting now protects four days of expected sales and exposes the cash commitment before approval.',
  status: 'proposed',
  riskLevel: 'medium',
  requiresApproval: true,
  sourceEventId: 'inventory-low-cof-001',
  input: { productName: 'House Blend Coffee', sku: 'COF-001', currentStock: 8, reorderQuantity: 120, unitCostPence: 650, unitRetailPricePence: 1_200, supplier: 'Northstar Roasters', deliveryAddress: '1 Market Street, London' },
  steps: [
    { id: 'purchase-order', workspace: 'retail', module: 'purchasing', action: 'create', description: 'Create a purchase order for 120 × House Blend Coffee', status: 'pending' },
    { id: 'inbound-delivery', workspace: 'logistics', module: 'deliveries', action: 'create', description: 'Book inbound delivery from Northstar Roasters', status: 'pending' },
    { id: 'supplier-bill', workspace: 'finance', module: 'bills', action: 'create', description: 'Record £780.00 committed spend and update cash exposure', status: 'pending' },
  ],
  coordinationSummary: {
    workspaces: ['retail', 'logistics', 'finance'],
    workspaceCount: 3,
    inventoryRisk: '8 units remain; replenishment protects four days of forecast demand.',
    cashImpactPence: 78_000,
    logisticsLoad: 'One inbound booking for 120 units from Northstar Roasters.',
    expectedOutcome: 'Approved inventory, inbound delivery, and supplier liability remain synchronized under one action.',
    tradeoffs: ['Commits £780.00 of cash to reduce stockout exposure.', 'Earlier ordering protects availability but increases short-term working-capital usage.', 'Coordinated execution prevents purchasing, delivery, and bill records from diverging.'],
    patternConfidence: 78,
    decisionScore: 97,
    scoreExplanation: ['3 workspaces coordinated', '£780.00 financial impact', 'medium operating risk', '78% pattern confidence'],
  },
  historicalContext: {
    similarSignals: 3,
    proposedActions: 2,
    completedActions: 2,
    completionRate: 100,
    lastCompletedAt: '2026-09-06T10:00:00.000Z',
    lastOutcome: { summary: 'protected availability with no inbound exception' },
    narrative: '2 similar approved actions completed previously; the latest protected availability with no inbound exception.',
  },
  predictiveSignals: {
    triggerPattern: 'A retail inventory threshold breach followed by a coordinated replenishment proposal.',
    likelyNext: 'Approval usually leads to synchronized purchasing, inbound delivery, and finance records.',
    likelyDownstreamEffects: ['Retail receives a governed purchase commitment.', 'Logistics receives a linked inbound booking.', 'Finance receives the matching supplier liability and cash exposure.'],
    confidence: 78,
    confidenceLabel: 'strong',
    evidenceCount: 8,
    successfulOutcomes: 7,
    issueOutcomes: 1,
    highImpactOutcomeRate: 86,
    assessedOutcomes: 14,
    averageAccuracy: 92,
    reliabilityScore: 85,
    refined: true,
    cohortEvidenceCount: 5,
    cohortTenantCount: 3,
    cohortIncluded: true,
    basis: ['3 tenant outcomes', '5 anonymized outcomes across 3 tenants', '7 successful and 1 rejected outcome', '86% of successful precedents carried at least £500 of recorded impact', '14 prediction assessments averaged 92% accuracy'],
  },
  simulationPreview: {
    generatedAt: DEMO_REFERENCE_TIME,
    disclaimer: 'Read-only projection. No workspace records or external actions are created until approval and execution.',
    workspaces: [
      { workspace: 'retail', before: '8 units on hand with an active stockout risk.', after: '120 units approved on a linked purchase order.', effect: 'Availability risk moves into a governed replenishment commitment.', secondOrderEffects: ['The next threshold breach is expected later because inbound cover increases.', 'Purchase history becomes available for future reorder-frequency calibration.'] },
      { workspace: 'logistics', before: 'No inbound delivery is reserved for this replenishment.', after: 'One inbound delivery from Northstar Roasters is booked.', effect: 'The inbound dependency becomes visible and traceable before stock arrives.', secondOrderEffects: ['Inbound capacity is reserved earlier, reducing last-minute routing pressure.', 'Any delivery exception can be correlated back to the purchase commitment.'] },
      { workspace: 'finance', before: 'No supplier liability is recorded for the proposed stock.', after: '£780.00 is recorded as committed inventory spend.', effect: 'Cash exposure becomes visible with the operating commitment.', secondOrderEffects: ['The commitment moves into short-term cash planning immediately.', 'Future margin analysis can connect supplier cost with replenished units.'] },
    ],
    comparison: {
      approve: ['120 units enter a governed purchase commitment.', 'Inbound capacity and supplier liability are created together.', 'Short-term cash exposure increases by £780.00.'],
      reject: ['8 units remain with no replenishment commitment.', 'No inbound slot is reserved and no supplier liability is recorded.', 'Cash is preserved now, but stockout exposure remains unresolved.'],
      predictedDelta: 'Approval trades £780.00 of near-term cash capacity for 120 committed units and coordinated inbound cover.',
    },
  },
  trailEventIds: ['inventory-low-cof-001', 'proposal-cof-001'],
  estimatedValuePence: 78_000,
  createdAt: DEMO_REFERENCE_TIME,
  updatedAt: DEMO_REFERENCE_TIME,
})

const demoRelatedAgentAction = (): AgentAction => {
  const base = demoAgentAction()
  return {
    ...base,
    id: 'agent-replenishment-002',
    title: 'Replenish Espresso Filters',
    summary: 'Espresso Filters are at 14 units. The same supplier and inbound window overlap with the coffee replenishment.',
    input: { ...base.input, productName: 'Espresso Filters', sku: 'FLT-002', currentStock: 14, reorderQuantity: 240, unitCostPence: 240, unitRetailPricePence: 450 },
    estimatedValuePence: 57_600,
    coordinationSummary: base.coordinationSummary ? {
      ...base.coordinationSummary,
      cashImpactPence: 57_600,
      decisionScore: 88,
      scoreExplanation: ['3 workspaces coordinated', '£576.00 financial impact', 'medium operating risk', '72% pattern confidence'],
      patternConfidence: 72,
    } : null,
    predictiveSignals: base.predictiveSignals ? { ...base.predictiveSignals, confidence: 72, reliabilityScore: 79, evidenceCount: 6, assessedOutcomes: 9, averageAccuracy: 88, refined: false } : null,
    simulationPreview: base.simulationPreview ? {
      ...base.simulationPreview,
      comparison: {
        approve: ['240 filter units enter a governed purchase commitment.', 'The shared supplier delivery window gains another inbound requirement.', 'Short-term cash exposure increases by £576.00.'],
        reject: ['14 filter units remain with no replenishment commitment.', 'Shared inbound demand is lower.', 'Cash is preserved now, but filter stockout exposure remains unresolved.'],
        predictedDelta: 'Approval adds £576.00 and a second inbound requirement to the same supplier window.',
      },
    } : null,
    createdAt: '2026-09-18T09:15:00.000Z',
    updatedAt: '2026-09-18T09:15:00.000Z',
  }
}

const demoIntelligenceSummary = (actions: AgentAction[]): AgentIntelligenceSummary => {
  const active = actions.filter((action) => action.status === 'proposed' || action.status === 'approved' || action.status === 'completed')
  const coffee = active.find((action) => action.id === 'agent-replenishment-001')
  const filters = active.find((action) => action.id === 'agent-replenishment-002')
  const bothPending = coffee?.status !== 'completed' && filters?.status !== 'completed'
  const interactions = coffee && filters ? [{
    id: `${coffee.id}:${filters.id}`,
    actionIds: [coffee.id, filters.id] as [string, string],
    actionTitles: [coffee.title, filters.title] as [string, string],
    severity: 'watch' as const,
    dimensions: (bothPending ? ['supplier', 'logistics', 'cash'] : ['supplier', 'logistics']) as Array<'supplier' | 'logistics' | 'cash'>,
    summary: `${coffee.title} and ${filters.title} may interact across supplier, logistics${bothPending ? ', cash' : ''}.`,
    evidence: ['Both actions use Northstar Roasters', 'Both actions require inbound logistics capacity', ...(bothPending ? ['Combined pending cash commitment is £1,356.00'] : ['A recent execution may affect the remaining supplier delivery window'])],
    advisory: 'Review the combined timing and capacity impact before approving either action. This advisory does not block execution.',
  }] : []
  const assessed = actions.filter((action) => action.outcomeAssessment)
  const accuracy = assessed.length ? Math.round(assessed.reduce((total, action) => total + (action.outcomeAssessment?.accuracy ?? 0), 0) / assessed.length) : 92
  const reliability = Math.round(actions.reduce((total, action) => total + (action.predictiveSignals?.reliabilityScore ?? 0), 0) / Math.max(1, actions.length))
  const measured = assessed.length ? assessed : [demoAgentAction()]
  const completed = measured.filter((action) => action.status === 'completed' || assessed.length === 0)
  const cashGovernedPence = completed.reduce((total, action) => total + Number(action.estimatedValuePence || 0), 0)
  const inventoryUnitsProtected = completed.reduce((total, action) => total + Number(action.input.reorderQuantity || 0), 0)
  const actionsWithMarginEvidence = completed.filter((action) => Number.isFinite(Number(action.input.unitRetailPricePence)) && Number(action.input.unitRetailPricePence) >= Number(action.input.unitCostPence))
  const marginProtectedPence = actionsWithMarginEvidence.reduce((total, action) => {
    const price = Number(action.input.unitRetailPricePence)
    const cost = Number(action.input.unitCostPence)
    return total + (price - cost) * Number(action.input.reorderQuantity || 0)
  }, 0)
  const economicValue = {
    cashGovernedPence,
    cashPreservedPence: actions.filter((action) => action.status === 'rejected').reduce((total, action) => total + Number(action.estimatedValuePence || 0), 0),
    marginProtectedPence: actionsWithMarginEvidence.length ? marginProtectedPence : null,
    inventoryUnitsProtected,
    riskReducedActions: completed.length,
    coordinatedHandoffs: completed.reduce((total, action) => total + action.steps.length, 0),
    estimatedOperatorMinutesSaved: completed.reduce((total, action) => total + action.steps.length * 8, 0),
    measuredOutcomes: Math.max(14, assessed.length),
    narrative: `${Math.max(14, assessed.length)} measured outcomes show governed cash, protected inventory, and reduced manual coordination.`,
    methodology: ['Cash governed uses completed internal commitments.', 'Cash preserved uses rejected commitments.', 'Margin protected uses recorded unit price less cost.', 'Time saved uses eight minutes per completed workspace handoff.', 'Risk reduced requires a measured outcome at or above 75% accuracy.'],
  }
  const recurringDeviation = { field: 'logistics.capacity', count: 3, insight: 'Logistics capacity was underestimated in 3 assessed outcomes; review this dimension when evaluating similar proposals.' }
  const strongAction = [...actions].sort((left, right) => (right.predictiveSignals?.reliabilityScore ?? 0) - (left.predictiveSignals?.reliabilityScore ?? 0))[0]
  return {
    interactions,
    health: {
      totalAssessedOutcomes: Math.max(14, assessed.length),
      averagePredictionAccuracy: accuracy,
      refinedPatterns: actions.some((action) => action.predictiveSignals?.refined) ? 1 : 0,
      confidenceImprovement: 12,
      averageReliability: reliability,
      activePatterns: 1,
      interactionCount: interactions.length,
      recurringDeviation,
      narrative: `${Math.max(14, assessed.length)} measured outcomes average ${accuracy}% accuracy; one replenishment pattern meets the refined evidence threshold.`,
    },
    snapshot: {
      totalAssessedOutcomes: Math.max(14, assessed.length),
      refinedPatterns: actions.some((action) => action.predictiveSignals?.refined) ? 1 : 0,
      activeInteractions: interactions.length,
      recentAccuracyTrend: { current: accuracy, previous: Math.max(0, accuracy - 12), change: 12, assessmentWindow: 20, narrative: 'Prediction accuracy has improved +12% over the last 20 assessments.' },
      learningMomentum: { score: 86, label: 'compounding', narrative: 'Measured outcomes are strengthening reliable patterns and improving future decision context.' },
      economicValue,
    },
    emergingSignals: [
      {
        id: 'deviation:logistics.capacity',
        kind: 'recurring-deviation',
        severity: 'watch',
        title: 'Recurring logistics underestimation',
        summary: recurringDeviation.insight,
        reliability,
        outcomeCount: recurringDeviation.count,
        evidence: [`${recurringDeviation.count} assessed outcomes share the same deviation`, `${accuracy}% average measured prediction accuracy`, `${reliability}% current pattern reliability`],
        advisory: 'Review Logistics capacity before approving similar proposals. This signal is advisory and cannot execute or block work.',
      },
      ...(interactions[0] ? [{
        id: `interaction:${interactions[0].id}`,
        kind: 'cross-action-risk' as const,
        severity: interactions[0].severity,
        title: 'Cross-workspace pressure is building',
        summary: interactions[0].summary,
        reliability,
        outcomeCount: Math.max(14, assessed.length),
        evidence: [...interactions[0].evidence, `${reliability}% supporting pattern reliability`],
        advisory: interactions[0].advisory,
      }] : []),
      ...(strongAction ? [{
        id: `precedent:${strongAction.kind}`,
        kind: 'strong-precedent' as const,
        severity: 'positive' as const,
        title: 'Historical precedent is strengthening',
        summary: `${strongAction.title} is supported by an ${strongAction.predictiveSignals?.reliabilityScore ?? reliability}% reliable pattern across ${strongAction.predictiveSignals?.assessedOutcomes ?? 14} assessed outcomes.`,
        reliability: strongAction.predictiveSignals?.reliabilityScore ?? reliability,
        outcomeCount: strongAction.predictiveSignals?.assessedOutcomes ?? 14,
        evidence: [`${strongAction.predictiveSignals?.assessedOutcomes ?? 14} assessed outcomes inform this pattern`, `${strongAction.predictiveSignals?.averageAccuracy ?? accuracy}% average measured accuracy`, `${strongAction.predictiveSignals?.reliabilityScore ?? reliability}% evidence-weighted reliability`],
        advisory: 'Use this precedent as decision context, not as authorization. Explicit approval remains required.',
      }] : []),
    ],
    auditTrail: actions.flatMap((action) => {
      const entries: AgentIntelligenceSummary['auditTrail'] = [
        { id: `${action.id}-proposed`, actionId: action.id, actionTitle: action.title, stage: 'proposed' as const, actor: 'FoundAI', occurredAt: action.createdAt, summary: 'Shared Event Feed signal produced a governed action proposal.', evidence: ['Inventory threshold signal', `Action ${action.id}`] },
      ]
      if (action.status !== 'proposed') entries.unshift({ id: `${action.id}-decision`, actionId: action.id, actionTitle: action.title, stage: action.status === 'rejected' ? 'rejected' as const : 'approved' as const, actor: 'Business owner', occurredAt: action.updatedAt, summary: action.status === 'rejected' ? 'Human rejection recorded; no workspace effects were created.' : 'Human approval recorded; execution remained separate.', evidence: ['Explicit human decision', `Action ${action.id}`] })
      if (action.status === 'completed') entries.unshift(
        { id: `${action.id}-assessed`, actionId: action.id, actionTitle: action.title, stage: 'assessed' as const, actor: 'FoundAI', occurredAt: action.updatedAt, summary: action.outcomeAssessment?.summary || 'Outcome measured against the original prediction.', evidence: [`${action.outcomeAssessment?.accuracy ?? 100}% measured accuracy`, `Action ${action.id}`] },
        { id: `${action.id}-executed`, actionId: action.id, actionTitle: action.title, stage: 'executed' as const, actor: 'Business owner', occurredAt: action.updatedAt, summary: action.outcomeSummary || 'Approved internal workspace effects completed.', evidence: ['Retail, Logistics, and Finance effects', 'No external payment moved'] },
      )
      if (action.executionReversed) entries.unshift({ id: `${action.id}-reversed`, actionId: action.id, actionTitle: action.title, stage: 'reversed' as const, actor: 'Business owner', occurredAt: action.updatedAt, summary: 'Internal purchase order and inbound booking cancelled; supplier liability voided.', evidence: ['Compensation completed', 'No external payment moved'] })
      return entries
    }).sort((left, right) => right.occurredAt.localeCompare(left.occurredAt)),
  }
}

const emptyWorkspace = (workspace: BusinessWorkspaceSlug): WorkspaceState => {
  const seeded = seedWorkspace(workspace)
  return { ...seeded, records: Object.fromEntries(Object.keys(seeded.records).map((key) => [key, []])), integrations: seeded.integrations.map((item) => ({ ...item, connected: false })) }
}

const displayMoney = (valuePence: number | null | undefined) => valuePence === null || valuePence === undefined
  ? '—'
  : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(valuePence / 100)

const fromProductionRecord = (record: ProductionWorkspaceRecord): WorkspaceRecord => {
  const data = record?.data ?? {}
  return {
  id: record.reference,
  backendId: record.id,
  version: record.version,
  name: record.name,
  secondary: String(data.secondary || 'Workspace record'),
  value: record.valuePence === null || record.valuePence === undefined ? String(data.value || '—') : displayMoney(record.valuePence),
  status: record.status,
  owner: record.ownerId || String(data.owner || 'Unassigned'),
  updated: new Date(record.updatedAt).toLocaleString('en-GB', { timeZone: 'UTC' }),
}}

const describePlatformEvent = (event: { type: string; payload?: Record<string, unknown> }) => {
  if (event.type === 'inventory.threshold.breached') return `${String(event.payload?.productName || event.payload?.sku || 'Inventory')} crossed its replenishment threshold`
  if (event.type === 'agent.action.proposed') return 'FoundAI proposed a coordinated cross-workspace action'
  if (event.type === 'agent.action.approved') return 'An owner approved a FoundAI action for execution'
  if (event.type === 'agent.action.rejected') return 'An owner dismissed a FoundAI recommendation'
  if (event.type === 'agent.action.completed') return String(event.payload?.outcomeSummary || 'FoundAI completed an approved cross-workspace action')
  if (event.type === 'agent.action.outcome.assessed') return String(event.payload?.summary || 'FoundAI assessed prediction accuracy against the completed outcome')
  if (event.type === 'workspace.record.created' && event.payload?.module) return `${String(event.payload.module).replaceAll('-', ' ')} record created${event.payload.agentActionId || event.payload.actionId ? ' by an approved agent action' : ''}`
  return event.type.replaceAll('.', ' ')
}

function useWorkspaceState(workspace: BusinessWorkspaceSlug, activeModule: string, session: ProductionSession | null) {
  const production = productionModeEnabled && productionApiConfigured
  const [state, setState] = useState<WorkspaceState>(() => production ? emptyWorkspace(workspace) : seedWorkspace(workspace))
  const [events, setEvents] = useState<WorkspaceEvent[]>([])
  const [loading, setLoading] = useState(production)
  const [error, setError] = useState('')
  useEffect(() => {
    if (production) {
      if (!session) {
        setLoading(false)
        return
      }
      setLoading(true)
      setError('')
      const requests: Promise<void>[] = []
      if (!['overview', 'reports', 'forecasting', 'attribution', 'settings', 'integrations', 'security', 'automations'].includes(activeModule)) {
        requests.push(
          productionRecords.list(workspace, activeModule)
            .then((records) => setState((current) => ({ ...current, records: { ...current.records, [activeModule]: records.filter((record): record is ProductionWorkspaceRecord => Boolean(record && typeof record === 'object')).map(fromProductionRecord) } }))),
        )
      }
      if (activeModule === 'integrations') {
        requests.push(
          productionRequest<Array<{ id: string; provider: string; displayName: string; configuration: { category?: string }; status: string }>>('/platform/integrations')
            .then((integrations) => setState((current) => ({ ...current, integrations: integrations.map((item) => ({ id: item.provider, name: item.displayName, category: item.configuration?.category || 'Integration', connected: item.status === 'ready' || item.status === 'configured' })) }))),
        )
      }
      if (activeModule === 'settings') {
        requests.push(productionRequest<{ businessName: string; countryCode: string } | null>('/platform/onboarding').then((onboarding) => {
          if (onboarding) setState((current) => ({ ...current, settings: { ...current.settings, businessName: onboarding.businessName, region: onboarding.countryCode } }))
        }))
      }
      requests.push(
        productionRequest<Array<{ id: string; source: BusinessWorkspaceSlug; type: string; payload?: Record<string, unknown>; createdAt: string }>>('/platform/events?limit=20')
          .then((items) => setEvents(items.map((item) => ({ id: item.id, workspace: workspaceOrder.includes(item.source) ? item.source : 'intelligence', text: describePlatformEvent(item), type: item.type, payload: item.payload, time: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'UTC' }) })))),
      )
      void Promise.all(requests).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Workspace data could not be loaded')).finally(() => setLoading(false))
      return
    }
    const stored = window.localStorage.getItem(storageKey(workspace))
    const storedEvents = window.localStorage.getItem(EVENTS_KEY)
    if (stored) setState(JSON.parse(stored) as WorkspaceState)
    if (storedEvents) setEvents(JSON.parse(storedEvents) as WorkspaceEvent[])
    setLoading(false)
  }, [activeModule, production, session, workspace])
  const update = (mutate: (current: WorkspaceState) => WorkspaceState, eventText?: string) => {
    setState((current) => {
      const next = mutate(current)
      if (!production) window.localStorage.setItem(storageKey(workspace), JSON.stringify(next))
      return next
    })
    if (eventText) {
      setEvents((current) => {
        const next = [{ id: `${workspace}-${Date.now()}`, workspace, text: eventText, time: 'Now' }, ...current].slice(0, 40)
        if (!production) window.localStorage.setItem(EVENTS_KEY, JSON.stringify(next))
        return next
      })
    }
  }
  const createRecord = async (module: string, record: WorkspaceRecord) => {
    if (!production) {
      update((current) => ({ ...current, records: { ...current.records, [module]: [record, ...(current.records[module] ?? [])] } }), `${module}: ${record.name} created`)
      return record
    }
    const numericValue = Number(record.value.replace(/[^0-9.-]/g, ''))
    const created = await productionRecords.create(workspace, module, { reference: record.id, name: record.name, status: record.status, ownerId: record.owner, valuePence: Number.isFinite(numericValue) ? Math.round(numericValue * 100) : null, data: { secondary: record.secondary, value: record.value, owner: record.owner } })
    const mapped = fromProductionRecord(created)
    update((current) => ({ ...current, records: { ...current.records, [module]: [mapped, ...(current.records[module] ?? [])] } }))
    return mapped
  }
  // Advances a record to a new stage — also auto-logs a "Stage" activity entry so the timeline
  // shows every pipeline movement without an operator having to write it up manually, the same
  // automatic stage-change audit trail HubSpot/Pipedrive/Monday keep on every deal.
  const advanceRecord = async (module: string, record: WorkspaceRecord, status: string) => {
    if (production && !record.backendId) throw new Error('Production record identifier is missing')
    const nextRecord = production
      ? fromProductionRecord(await productionRecords.update(record.backendId!, { status, version: record.version }))
      : { ...record, status, updated: 'Now' }
    const stageEntry = { time: 'Now', note: `Moved from ${record.status} to ${status}`, kind: 'Stage' }
    const withLog = { ...nextRecord, log: [stageEntry, ...(nextRecord.log ?? [])] }
    update((current) => ({ ...current, records: { ...current.records, [module]: current.records[module].map((item) => item.id === record.id ? withLog : item) } }), `${module}: ${record.name} moved to ${status}`)
  }
  // Attaches (or replaces) a file on any record, in any module, board or directory alike — the
  // system-wide upload/preview/download capability isn't backend-persisted yet, so this always
  // updates local session state directly rather than branching on production mode.
  const attachRecord = (module: string, record: WorkspaceRecord, attachment: string | undefined, attachmentName: string) => {
    update((current) => ({ ...current, records: { ...current.records, [module]: current.records[module].map((item) => item.id === record.id ? { ...item, attachment, attachmentName: attachment ? attachmentName : undefined, updated: 'Now' } : item) } }), `${module}: ${record.name} ${attachment ? `attachment updated (${attachmentName})` : 'attachment removed'}`)
  }
  // Records a fresh stock count for an inventory record: updates the on-hand quantity, flips the
  // stage between Low stock and its previous stage against the reorder point, and appends the
  // count to the record's activity log so every count is auditable.
  const adjustStock = (module: string, record: WorkspaceRecord, quantity: number, note: string) => {
    const reorderPoint = record.reorderPoint ?? 20
    const status = quantity <= reorderPoint ? 'Low stock' : record.status === 'Low stock' ? 'Available' : record.status
    const entry = { time: 'Now', note }
    update((current) => ({ ...current, records: { ...current.records, [module]: current.records[module].map((item) => item.id === record.id ? { ...item, quantity, status, value: `${quantity} units`, updated: 'Now', log: [entry, ...(item.log ?? [])] } : item) } }), `${module}: ${record.name} stock count set to ${quantity}`)
  }
  // Appends an activity-log entry to a record's timeline — used for the pipeline deal timeline
  // and anywhere else a running history of activity is useful, not just inventory counts. Every
  // entry has a kind (Note/Call/Email/Meeting/Task) so the log reads like a real CRM activity
  // feed instead of a flat note list, matching HubSpot/Pipedrive's activity-type timelines.
  const logNote = (module: string, record: WorkspaceRecord, note: string, kind: string = 'Note') => {
    const entry = { time: 'Now', note, kind }
    update((current) => ({ ...current, records: { ...current.records, [module]: current.records[module].map((item) => item.id === record.id ? { ...item, log: [entry, ...(item.log ?? [])] } : item) } }), `${module}: ${record.name} ${kind.toLowerCase()} logged`)
  }
  // Edits a record's core fields directly from the detail panel — every module gets inline
  // editing of name/secondary/value/owner for free, without any module-specific wiring.
  const updateRecord = async (module: string, record: WorkspaceRecord, patch: Partial<Pick<WorkspaceRecord, 'name' | 'secondary' | 'value' | 'owner' | 'dueDate'>>) => {
    const nextRecord = production && record.backendId
      ? fromProductionRecord(await productionRecords.update(record.backendId, { name: patch.name ?? record.name, data: { secondary: patch.secondary ?? record.secondary, value: patch.value ?? record.value, owner: patch.owner ?? record.owner, dueDate: patch.dueDate ?? record.dueDate }, version: record.version }))
      : { ...record, ...patch, updated: 'Now' }
    update((current) => ({ ...current, records: { ...current.records, [module]: current.records[module].map((item) => item.id === record.id ? nextRecord : item) } }), `${module}: ${record.name} details updated`)
  }
  // Moves every record in a set to the same next status in one action — powers the bulk-select
  // toolbar so an operator can advance a whole batch of orders/deals/candidates together.
  const bulkAdvance = async (module: string, records: WorkspaceRecord[], status: string) => {
    for (const record of records) await advanceRecord(module, record, status)
  }
  const publishHandoff = async (module: string, record: WorkspaceRecord, target: BusinessWorkspaceSlug) => {
    if (production) await productionRequest('/platform/events', { method: 'POST', body: JSON.stringify({ type: 'workspace.handoff.requested', source: workspace, payload: { module, recordId: record.backendId, reference: record.id, target } }) })
    update((current) => current, `${module}: ${record.name} handed to ${configs[target].label}`)
  }
  const reset = () => {
    if (production) return
    window.localStorage.removeItem(storageKey(workspace))
    setState(seedWorkspace(workspace))
  }
  return { state, events, update, reset, loading, error, production, createRecord, advanceRecord, attachRecord, adjustStock, logNote, updateRecord, bulkAdvance, publishHandoff }
}

function appendDemoRecord(workspace: BusinessWorkspaceSlug, module: string, record: WorkspaceRecord) {
  const key = storageKey(workspace)
  const stored = window.localStorage.getItem(key)
  const current = stored ? JSON.parse(stored) as WorkspaceState : seedWorkspace(workspace)
  const next = { ...current, records: { ...current.records, [module]: [record, ...(current.records[module] ?? [])] } }
  window.localStorage.setItem(key, JSON.stringify(next))
}

function useAgentActions(production: boolean, session: ProductionSession | null, emit: (text: string) => void) {
  const [actions, setActions] = useState<AgentAction[]>(() => production ? [] : [demoAgentAction(), demoRelatedAgentAction()])
  const [intelligence, setIntelligence] = useState<AgentIntelligenceSummary>(() => demoIntelligenceSummary([demoAgentAction(), demoRelatedAgentAction()]))
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    if (production) {
      if (!session) return
      void Promise.all([productionAgentActions.list(), productionAgentActions.intelligence()])
        .then(([loadedActions, loadedIntelligence]) => { setActions(loadedActions); setIntelligence(loadedIntelligence) })
        .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Agent intelligence could not be loaded'))
      return
    }
    const stored = window.localStorage.getItem(AGENT_ACTIONS_KEY)
    if (stored) {
      const storedActions = JSON.parse(stored) as AgentAction[]
      setActions(storedActions.some((action) => action.id === 'agent-replenishment-002') ? storedActions : [...storedActions, demoRelatedAgentAction()])
    }
  }, [production, session])
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('foundingos-agent-context', { detail: actions.find((item) => item.status !== 'rejected') ?? actions[0] ?? null }))
  }, [actions])
  useEffect(() => {
    if (!production) setIntelligence(demoIntelligenceSummary(actions))
  }, [actions, production])
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('foundingos-system-intelligence', { detail: intelligence }))
  }, [intelligence])
  useEffect(() => {
    const publishIntelligenceContext = () => {
      window.dispatchEvent(new CustomEvent('foundingos-agent-context', { detail: actions.find((item) => item.status !== 'rejected') ?? actions[0] ?? null }))
      window.dispatchEvent(new CustomEvent('foundingos-system-intelligence', { detail: intelligence }))
    }
    window.addEventListener('foundingos-intelligence-context-request', publishIntelligenceContext)
    return () => window.removeEventListener('foundingos-intelligence-context-request', publishIntelligenceContext)
  }, [actions, intelligence])
  const persist = (next: AgentAction[]) => {
    setActions(next)
    if (!production) window.localStorage.setItem(AGENT_ACTIONS_KEY, JSON.stringify(next))
  }
  const propose = async (input: Record<string, unknown> = demoAgentAction().input) => {
    setBusy('propose')
    setError('')
    try {
      const action = production
        ? await productionAgentActions.proposeReplenishment(input)
        : { ...demoAgentAction(), input, summary: `${String(input.productName)} is at ${String(input.currentStock)} units. Coordinate purchasing, inbound logistics, and finance before stockout.`, estimatedValuePence: Number(input.reorderQuantity) * Number(input.unitCostPence), id: `agent-replenishment-${Date.now()}`, trailEventIds: [`signal-${Date.now()}`, `proposal-${Date.now()}`], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      persist([action, ...actions])
      emit('FoundAI proposed a coordinated replenishment action from a low-stock signal')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'FoundAI could not create the proposal')
    } finally {
      setBusy('')
    }
  }
  const activate = async (input: { businessName: string; supplier: string; productName: string; sku: string; currentStock: number; reorderQuantity: number; unitCostPence: number; unitRetailPricePence?: number; cashPositionPence: number; deliveryAddress: string }) => {
    setBusy('activate')
    setError('')
    try {
      if (production) {
        const onboarding = await productionRequest<{ businessName: string; ownerName: string; industry?: string | null; countryCode: string; currency: string; timezone: string }>('/platform/onboarding')
        await productionRequest('/platform/onboarding', { method: 'PUT', body: JSON.stringify({ ...onboarding, businessName: input.businessName, completedSteps: ['business', 'owner', 'supplier', 'inventory', 'cash', 'intelligence'], goLiveStatus: 'live', acceptTerms: true }) })
        await productionRecords.create('retail', 'suppliers', { reference: `SUP-${input.sku}`, name: input.supplier, status: 'Active', data: { onboarding: true } }, 'intelligence-activation-supplier-v1')
        await productionRecords.create('retail', 'inventory', { reference: input.sku, name: input.productName, status: input.currentStock <= 10 ? 'Low stock' : 'Available', valuePence: input.currentStock * input.unitCostPence, data: { currentStock: input.currentStock, supplier: input.supplier, unitCostPence: input.unitCostPence, unitRetailPricePence: input.unitRetailPricePence } }, 'intelligence-activation-inventory-v1')
        await productionRecords.create('finance', 'cashflow', { reference: `OPEN-${input.sku}`, name: 'Opening cash position', status: 'Current', valuePence: input.cashPositionPence, data: { onboarding: true } }, 'intelligence-activation-cash-v1')
      } else {
        appendDemoRecord('retail', 'suppliers', { id: `SUP-${input.sku}`, name: input.supplier, secondary: 'Primary onboarding supplier', value: 'Active', status: 'Active', owner: 'Business owner', updated: 'Now' })
        appendDemoRecord('retail', 'inventory', { id: input.sku, name: input.productName, secondary: `${input.currentStock} units · ${input.supplier}`, value: displayMoney(input.currentStock * input.unitCostPence), status: input.currentStock <= 10 ? 'Low stock' : 'Available', owner: 'Business owner', updated: 'Now' })
        appendDemoRecord('finance', 'cashflow', { id: `OPEN-${input.sku}`, name: 'Opening cash position', secondary: input.businessName, value: displayMoney(input.cashPositionPence), status: 'Current', owner: 'Business owner', updated: 'Now' })
      }
      await propose(input)
      window.localStorage.setItem(ACTIVATION_KEY, JSON.stringify({ completedAt: new Date().toISOString(), businessName: input.businessName }))
      emit('Activation completed and the first intelligence brief is ready for review')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Activation could not be completed')
      throw cause
    } finally {
      setBusy('')
    }
  }
  const decide = async (action: AgentAction, decision: 'approve' | 'reject') => {
    setBusy(action.id)
    setError('')
    try {
      const updated = production
        ? await productionAgentActions.decide(action.id, decision)
        : { ...action, status: decision === 'approve' ? 'approved' as const : 'rejected' as const, trailEventIds: [...(action.trailEventIds ?? []), `${decision}-${Date.now()}`], updatedAt: new Date().toISOString() }
      persist(actions.map((item) => item.id === action.id ? updated : item))
      emit(`Agent action ${decision === 'approve' ? 'approved' : 'rejected'}: ${action.title}`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The decision could not be recorded')
    } finally {
      setBusy('')
    }
  }
  const execute = async (action: AgentAction) => {
    setBusy(action.id)
    setError('')
    try {
      let updated: AgentAction
      if (production) {
        updated = await productionAgentActions.execute(action.id)
      } else {
        const suffix = action.id.slice(-5).toUpperCase()
        appendDemoRecord('retail', 'purchasing', { id: `PO-${suffix}`, name: String(action.input.productName), secondary: `120 units · ${action.input.supplier}`, value: displayMoney(action.estimatedValuePence), status: 'Approved', owner: 'FoundAI', updated: 'Now' })
        appendDemoRecord('logistics', 'deliveries', { id: `IN-${suffix}`, name: `Inbound ${action.input.productName}`, secondary: `From ${action.input.supplier}`, value: 'Booked', status: 'Booked', owner: 'FoundAI', updated: 'Now' })
        appendDemoRecord('finance', 'bills', { id: `BILL-${suffix}`, name: `${action.input.supplier} commitment`, secondary: 'Inventory cash impact', value: displayMoney(action.estimatedValuePence), status: 'Received', owner: 'FoundAI', updated: 'Now' })
        updated = { ...action, status: 'completed', steps: action.steps.map((step) => ({ ...step, status: 'completed' })), result: { purchaseOrderId: `PO-${suffix}`, deliveryId: `IN-${suffix}`, billId: `BILL-${suffix}` }, outcomeSummary: `Retail: ${String(action.input.reorderQuantity)} units approved for replenishment. Logistics: inbound delivery booked. Finance: ${displayMoney(action.estimatedValuePence)} cash commitment recorded.`, outcomeAssessment: { accuracy: 100, predictedConfidence: action.predictiveSignals?.confidence ?? 50, matched: ['Retail purchase commitment was created', 'Logistics inbound booking was created', 'Finance supplier liability was created', 'Finance cash commitment matched the predicted amount'], deviations: [], financialDeviationPence: 0, economicOutcome: { cashGovernedPence: Number(action.estimatedValuePence || 0), marginProtectedPence: Math.max(0, (Number(action.input.unitRetailPricePence || 0) - Number(action.input.unitCostPence || 0)) * Number(action.input.reorderQuantity || 0)), inventoryUnitsProtected: Number(action.input.reorderQuantity || 0), coordinatedHandoffs: action.steps.length, estimatedOperatorMinutesSaved: action.steps.length * 8, basis: ['Completed internal commitment', 'Recorded replenishment quantity', 'Eight-minute handoff benchmark'] }, summary: 'All 4 predicted effects matched execution; future confidence can strengthen within calibrated limits.' }, trailEventIds: [...(action.trailEventIds ?? []), `retail-${suffix}`, `logistics-${suffix}`, `finance-${suffix}`, `completed-${suffix}`, `assessed-${suffix}`], updatedAt: new Date().toISOString() }
      }
      persist(actions.map((item) => item.id === action.id ? updated : item))
      emit('FoundAI completed replenishment across Retail, Logistics, and Finance')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The approved action could not be executed')
    } finally {
      setBusy('')
    }
  }
  const reverse = async (action: AgentAction) => {
    setBusy(action.id)
    setError('')
    try {
      if (production) await productionAgentActions.reverse(action.id)
      const updated = { ...action, executionReversed: true, trailEventIds: [...(action.trailEventIds ?? []), `reversed-${Date.now()}`], updatedAt: new Date().toISOString() }
      persist(actions.map((item) => item.id === action.id ? updated : item))
      emit('FoundAI compensated the internal Retail, Logistics, and Finance records')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The internal execution could not be reversed')
    } finally {
      setBusy('')
    }
  }
  return { actions, intelligence, busy, error, propose, decide, execute, reverse, activate }
}

function WorkspaceHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: React.ReactNode }) {
  return <header className="retail-app-heading"><div><p>{eyebrow}</p><h1>{title}</h1><span>{copy}</span></div>{action}</header>
}

function Metric({ label, value, change }: { label: string; value: string; change: string }) {
  return <article className="retail-app-metric"><span>{label}</span><strong>{value}</strong><small>{change}</small></article>
}

function Overview({ workspace, config, state, events }: { workspace: BusinessWorkspaceSlug; config: WorkspaceConfig; state: WorkspaceState; events: WorkspaceEvent[] }) {
  const operational = config.modules.filter((item) => !['overview', 'settings', 'integrations', 'security', 'team'].includes(item.id)).slice(0, 5)
  return <>
    <WorkspaceHeading eyebrow={`${config.label} command centre`} title={`Good morning, Bobby`} copy={config.description} />
    <section className="retail-app-metrics">{config.metrics.map((metric) => <Metric key={metric.label} {...metric} />)}</section>
    <section className="retail-app-dashboard-grid">
      <article className="retail-app-panel retail-app-chart-panel"><div className="retail-app-panel-heading"><div><p>Performance</p><h2>Seven-day operating trend</h2></div><span>Live simulation</span></div><svg viewBox="0 0 620 220" role="img" aria-label={`${config.label} seven-day trend`}><defs><linearGradient id={`${workspace}-trend`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={config.accent} stopOpacity=".38" /><stop offset="1" stopColor={config.accent} stopOpacity="0" /></linearGradient></defs>{[35, 80, 125, 170].map((y) => <line key={y} stroke="#dfe5ed" x1="30" x2="600" y1={y} y2={y} />)}<path d="M30 175 L120 150 L210 159 L300 112 L390 126 L480 73 L600 39 L600 205 L30 205 Z" fill={`url(#${workspace}-trend)`} /><polyline fill="none" points="30,175 120,150 210,159 300,112 390,126 480,73 600,39" stroke={config.accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" /></svg></article>
      <article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Priority queue</p><h2>Work needing attention</h2></div></div><div className="retail-app-priorities">{operational.map((item, index) => <Link href={`${workspaceRoot}/${workspace}/${item.id}`} key={item.id}><i data-tone={index < 2 ? 'risk' : 'watch'} /><div><strong>{state.records[item.id]?.[0]?.name}</strong><span>{item.label} · {state.records[item.id]?.[0]?.status}</span></div><b>→</b></Link>)}</div></article>
    </section>
    <section className="retail-app-dashboard-grid lower">
      <article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Connected system</p><h2>Workspace coverage</h2></div></div><div className="complete-workspace-coverage">{config.modules.slice(1, 9).map((item) => <Link href={`${workspaceRoot}/${workspace}/${item.id}`} key={item.id}><strong>{state.records[item.id]?.length ?? 0}</strong><span>{item.label}</span></Link>)}</div></article>
      <article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Shared backbone</p><h2>Latest cross-workspace events</h2></div><Link href={`${workspaceRoot}/intelligence/event-feed`}>View feed</Link></div><ul className="retail-app-activity">{(events.length ? events : [{ id: '1', workspace, text: `${config.label} workspace opened`, time: 'Now' }, { id: '2', workspace: 'finance' as const, text: 'Payment reconciled to customer order', time: '24m' }, { id: '3', workspace: 'marketing' as const, text: 'Campaign revenue attribution updated', time: '42m' }]).slice(0, 5).map((event) => <li key={event.id}><i /><span><strong>{configs[event.workspace].label}</strong> · {event.text}</span><span>{event.time}</span></li>)}</ul></article>
    </section>
  </>
}

const superDashboardWorkspaces: Array<{ workspace: Exclude<BusinessWorkspaceSlug, 'intelligence'>; health: number; headline: string; value: string; trend: string; risk: string }> = [
  { workspace: 'retail', health: 94, headline: 'Revenue', value: '£18.6k', trend: '+12.4%', risk: '2 low-stock lines' },
  { workspace: 'logistics', health: 89, headline: 'On-time', value: '94.8%', trend: '+2.1pt', risk: '3 delivery exceptions' },
  { workspace: 'finance', health: 96, headline: 'Cash', value: '£86.4k', trend: '+9.7%', risk: '£8.1k due this week' },
  { workspace: 'marketing', health: 91, headline: 'ROAS', value: '4.8x', trend: '+0.6x', risk: '2 campaigns awaiting review' },
  { workspace: 'talent', health: 86, headline: 'Engagement', value: '82%', trend: '+4pt', risk: '4 priority hires' },
  { workspace: 'health', health: 88, headline: 'Capacity', value: '86%', trend: '+5pt', risk: '2 priority follow-ups' },
]

function IntelligenceEvidence({ evidence }: { evidence: string[] }) {
  return <details className="intelligence-evidence"><summary>Why is this surfaced?</summary><div><strong>Evidence used</strong><ul>{evidence.map((item) => <li key={item}>{item}</li>)}</ul><small>Advisory evidence only. It does not authorize, block, or execute an action.</small></div></details>
}

type ActivationInput = {
  businessName: string
  supplier: string
  productName: string
  sku: string
  currentStock: number
  reorderQuantity: number
  unitCostPence: number
  unitRetailPricePence?: number
  cashPositionPence: number
  deliveryAddress: string
}

function IntelligenceActivation({ busy, onActivate }: { busy: boolean; onActivate: (input: ActivationInput) => Promise<void> }) {
  const [step, setStep] = useState(0)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState({
    businessName: 'FoundingOS Demo Company',
    supplier: 'Northstar Roasters',
    productName: 'House Blend Coffee',
    sku: 'COF-001',
    currentStock: '8',
    reorderQuantity: '120',
    unitCost: '6.50',
    unitRetailPrice: '12.00',
    cashPosition: '86400',
    deliveryAddress: '1 Market Street, London',
  })
  useEffect(() => {
    const stored = window.localStorage.getItem(ACTIVATION_KEY)
    if (stored) setComplete(true)
  }, [])
  const update = (field: keyof typeof values, value: string) => setValues((current) => ({ ...current, [field]: value }))
  const submit = async () => {
    setError('')
    try {
      await onActivate({
        businessName: values.businessName.trim(),
        supplier: values.supplier.trim(),
        productName: values.productName.trim(),
        sku: values.sku.trim().toUpperCase(),
        currentStock: Number(values.currentStock),
        reorderQuantity: Number(values.reorderQuantity),
        unitCostPence: Math.round(Number(values.unitCost) * 100),
        unitRetailPricePence: values.unitRetailPrice ? Math.round(Number(values.unitRetailPrice) * 100) : undefined,
        cashPositionPence: Math.round(Number(values.cashPosition) * 100),
        deliveryAddress: values.deliveryAddress.trim(),
      })
      setComplete(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Setup could not be completed')
    }
  }
  const steps = ['Business', 'Supply', 'Cash', 'First brief']
  return <section className="intelligence-activation">
    <div className="retail-app-panel-heading"><div><p>First-value activation</p><h2>{complete ? 'Your intelligence loop is ready' : 'Go from zero to a governed decision in minutes'}</h2></div><span>{complete ? 'Activated' : `Step ${step + 1} of ${steps.length}`}</span></div>
    {complete ? <div className="activation-complete"><strong>✓ Setup complete</strong><p>Your supplier, starting inventory, and cash position now ground the first replenishment brief. Review the proposal below, ask FoundAI for evidence, then approve and execute separately.</p><button className="retail-app-secondary" onClick={() => { window.localStorage.removeItem(ACTIVATION_KEY); setComplete(false); setStep(0) }} type="button">Review setup again</button></div> : <>
      <nav>{steps.map((label, index) => <button aria-current={step === index ? 'step' : undefined} data-complete={index < step} key={label} onClick={() => index <= step && setStep(index)} type="button"><b>{index + 1}</b><span>{label}</span></button>)}</nav>
      <div className="activation-step">
        {step === 0 ? <><div><small>Why this matters</small><h3>Give FoundAI the operating context it should protect.</h3><p>This name identifies your tenant and keeps every signal, action, and outcome isolated to your business.</p></div><label>Business name<input value={values.businessName} onChange={(event) => update('businessName', event.target.value)} /></label></> : null}
        {step === 1 ? <><div><small>Why this matters</small><h3>Connect one supplier to one real inventory risk.</h3><p>FoundAI uses cost, stock, and supplier context to explain the cash and availability trade-off before asking for approval.</p></div><div className="activation-fields"><label>Supplier<input value={values.supplier} onChange={(event) => update('supplier', event.target.value)} /></label><label>Product<input value={values.productName} onChange={(event) => update('productName', event.target.value)} /></label><label>SKU<input value={values.sku} onChange={(event) => update('sku', event.target.value)} /></label><label>Units on hand<input min="0" type="number" value={values.currentStock} onChange={(event) => update('currentStock', event.target.value)} /></label><label>Reorder quantity<input min="1" type="number" value={values.reorderQuantity} onChange={(event) => update('reorderQuantity', event.target.value)} /></label><label>Unit cost (£)<input min=".01" step=".01" type="number" value={values.unitCost} onChange={(event) => update('unitCost', event.target.value)} /></label><label>Selling price (£, optional)<input min=".01" step=".01" type="number" value={values.unitRetailPrice} onChange={(event) => update('unitRetailPrice', event.target.value)} /></label><label>Delivery address<input value={values.deliveryAddress} onChange={(event) => update('deliveryAddress', event.target.value)} /></label></div></> : null}
        {step === 2 ? <><div><small>Why this matters</small><h3>Make the working-capital trade-off visible.</h3><p>The cash position is context only. FoundingOS never moves bank funds during this workflow.</p></div><label>Current cash position (£)<input min="0" step=".01" type="number" value={values.cashPosition} onChange={(event) => update('cashPosition', event.target.value)} /></label></> : null}
        {step === 3 ? <><div><small>WhatsApp-first expectations</small><h3>Your first brief is concise, explainable, and human-controlled.</h3><p>WhatsApp delivers the decision and evidence. APPROVE records permission only. EXECUTE creates tenant-scoped internal records. UNDO compensates those records. External payments remain disabled.</p></div><div className="activation-review"><span><strong>{values.productName}</strong>{values.currentStock} units on hand</span><span><strong>£{(Number(values.reorderQuantity) * Number(values.unitCost)).toFixed(2)}</strong>proposed commitment</span><span><strong>{values.supplier}</strong>supplier</span></div></> : null}
      </div>
      {error ? <div className="complete-workspace-error" role="alert">{error}</div> : null}
      <footer><button className="retail-app-secondary" disabled={step === 0 || busy} onClick={() => setStep((current) => current - 1)} type="button">Back</button>{step < steps.length - 1 ? <button className="retail-app-primary" onClick={() => setStep((current) => current + 1)} type="button">Continue</button> : <button className="retail-app-primary" disabled={busy} onClick={() => void submit()} type="button">{busy ? 'Creating first brief…' : 'Create my first intelligence brief'}</button>}</footer>
    </>}
  </section>
}

const buyerDemoStages = [
  { id: 'detected', label: 'Detect', command: 'SIGNAL', message: 'House Blend Coffee has 8 units left. A refined replenishment pattern predicts stockout pressure across Retail, Logistics, and Finance.' },
  { id: 'briefed', label: 'Brief', command: '/snapshot', message: '£780 internal cash commitment | 120 units protected | 92% measured accuracy | 85% pattern reliability.' },
  { id: 'approved', label: 'Approve', command: 'APPROVE', message: 'Approved by the owner. No workspace record or external payment has moved. Reply EXECUTE when ready.' },
  { id: 'executed', label: 'Execute', command: 'EXECUTE', message: 'Purchase order, inbound booking, and supplier liability created atomically. Three handoffs governed; no external payment moved.' },
  { id: 'reversed', label: 'Undo', command: 'UNDO', message: 'Purchase order and inbound booking cancelled; supplier liability voided. Compensation recorded in the audit trail.' },
] as const

function BuyerIntelligenceDemo() {
  const [stageIndex, setStageIndex] = useState(0)
  const stage = buyerDemoStages[stageIndex]
  const advance = () => setStageIndex((current) => Math.min(buyerDemoStages.length - 1, current + 1))
  return <section className="buyer-intelligence-demo">
    <div className="retail-app-panel-heading"><div><p>Interactive acquisition demo</p><h2>Run the governed WhatsApp loop</h2></div><span>Simulation only · no records created</span></div>
    <div className="buyer-demo-layout">
      <div className="buyer-demo-phone">
        <header><span>WA</span><div><strong>FoundingOS Intelligence</strong><small>Low-bandwidth decision channel</small></div><i>secured</i></header>
        <div className="buyer-demo-message"><small>{stage.label.toUpperCase()}</small><strong>{stage.command}</strong><p>{stage.message}</p><time>Now · Ref agent-replenishment-001</time></div>
        <footer>{stageIndex < buyerDemoStages.length - 1 ? <button onClick={advance} type="button">Send {buyerDemoStages[stageIndex + 1].command}</button> : <button onClick={() => setStageIndex(0)} type="button">Replay demo</button>}<span>Every transition is explicit and auditable.</span></footer>
      </div>
      <div className="buyer-demo-timeline">{buyerDemoStages.map((item, index) => <button aria-current={index === stageIndex ? 'step' : undefined} data-complete={index <= stageIndex} key={item.id} onClick={() => setStageIndex(index)} type="button"><b>{index + 1}</b><span><strong>{item.label}</strong><small>{index < stageIndex ? 'Recorded' : index === stageIndex ? 'Current state' : 'Awaiting command'}</small></span></button>)}</div>
    </div>
    <div className="buyer-demo-proof"><span><strong>&lt; 1 KB</strong> decision brief</span><span><strong>3</strong> coordinated workspaces</span><span><strong>2 gates</strong> approve, then execute</span><span><strong>1 trail</strong> signal to outcome</span></div>
  </section>
}

function StrategicOverview({ intelligence }: { intelligence: AgentIntelligenceSummary }) {
  const coverage = [
    { title: 'Inventory replenishment', route: 'Retail → Logistics → Finance', boundary: 'Internal purchase, inbound, and liability records. No supplier payment.' },
    { title: 'Receivables collection', route: 'Finance → Retail CRM → Marketing', boundary: 'Collection case and approved reminder. No customer debit.' },
    { title: 'Delivery recovery', route: 'Logistics → Retail Service → Finance', boundary: 'Recovery case and remedy ceiling. No refund or external fund movement.' },
    { title: 'Expense approval', route: 'Finance → Finance → Retail', boundary: 'Approval, budget review, and owner task. No payment is initiated.' },
    { title: 'Campaign launch', route: 'Marketing → Retail → Finance', boundary: 'Campaign, audience readiness, and budget ceiling. No publication or spend.' },
    { title: 'Budget reallocation', route: 'Finance → Retail', boundary: 'Internal budget movement and owner review. No funds are transferred.' },
  ]
  const exportSummary = () => {
    const summary = [
      '# FoundingOS — Strategic Overview',
      '',
      'FoundingOS is a WhatsApp-native intelligence control plane with a shared tenant-scoped Event Feed, evidence-backed recommendations, human approval gates, internal-only execution, and measured outcome learning.',
      '',
      '## Defensibility',
      '- Shared operating memory across Operations, Workforce, and Intelligence.',
      '- Explicit proposal, approval, execution, assessment, compensation, and audit lifecycle.',
      '- Low-bandwidth WhatsApp delivery without bypassing authorization or replay protection.',
      '- Aggregate-only cross-tenant evidence with privacy thresholds.',
      '',
      '## Execution boundary',
      'The platform creates and compensates internal workspace records only. It does not autonomously move external money, debit customers, issue refunds, publish campaigns, or mutate supplier systems.',
      '',
      `Measured outcomes: ${intelligence.snapshot.totalAssessedOutcomes}`,
      `Refined patterns: ${intelligence.snapshot.refinedPatterns}`,
      `Learning momentum: ${intelligence.snapshot.learningMomentum.score}/100`,
    ].join('\n')
    const url = URL.createObjectURL(new Blob([summary], { type: 'text/markdown;charset=utf-8' }))
    const link = window.document.createElement('a')
    link.href = url
    link.download = 'foundingos-strategic-overview.md'
    link.click()
    URL.revokeObjectURL(url)
  }
  return <section className="strategic-overview">
    <div className="strategic-overview__header">
      <div><span className="eyebrow">Buyer-ready strategic overview</span><h2>WhatsApp-native intelligence with governed execution</h2><p>A shared operational memory detects business signals, explains the economic case, and coordinates approved work across existing systems without surrendering human control.</p><button className="retail-app-secondary" onClick={exportSummary} type="button">Export platform summary</button></div>
      <div className="strategic-score"><strong>{intelligence.snapshot.totalAssessedOutcomes}</strong><span>measured outcomes</span><small>{intelligence.snapshot.refinedPatterns} refined patterns · {intelligence.snapshot.learningMomentum.score}/100 learning momentum</small></div>
    </div>
    <div className="strategic-pillars">
      <article><strong>Distribution advantage</strong><span>Decisions arrive in a familiar, low-bandwidth WhatsApp loop instead of requiring another daily dashboard habit.</span></article>
      <article><strong>Compounding data advantage</strong><span>The tenant-scoped Event Feed links signals, decisions, execution effects, reversals, and measured outcomes.</span></article>
      <article><strong>Governance advantage</strong><span>Approval and execution are separate, role-authorized acts with replay protection and deterministic compensation.</span></article>
      <article><strong>Privacy boundary</strong><span>Cross-tenant evidence is aggregate-only and suppressed below the existing three-tenant anonymity threshold.</span></article>
    </div>
    <div className="decision-coverage">
      <div className="section-heading"><div><span>Governed decision coverage</span><h3>Three repeatable, compensatable workflows</h3></div><p>Each workflow declares required evidence, simulation, execution effects, outcome assessment, and reversal.</p></div>
      <div className="decision-coverage__grid">{coverage.map((item) => <article key={item.title}><span className="badge badge--approved">Human approved</span><h4>{item.title}</h4><strong>{item.route}</strong><p>{item.boundary}</p></article>)}</div>
    </div>
    <footer className="strategic-boundary"><b aria-hidden="true">✓</b><span><strong>Execution boundary:</strong> FoundingOS never moves external money, pays suppliers, debits customers, or issues refunds autonomously.</span></footer>
  </section>
}

function SuperDashboardOverview({ events, agentActions, intelligence, agentBusy, agentError, activateIntelligence, proposeAgentAction, decideAgentAction, executeAgentAction, reverseAgentAction }: { events: WorkspaceEvent[]; agentActions: AgentAction[]; intelligence: AgentIntelligenceSummary; agentBusy: string; agentError: string; activateIntelligence: (input: ActivationInput) => Promise<void>; proposeAgentAction: () => Promise<void>; decideAgentAction: (action: AgentAction, decision: 'approve' | 'reject') => Promise<void>; executeAgentAction: (action: AgentAction) => Promise<void>; reverseAgentAction: (action: AgentAction) => Promise<void> }) {
  const [horizon, setHorizon] = useState<'Today' | '7 days' | '30 days'>('7 days')
  const forecast = horizon === 'Today' ? { revenue: '+0.8%', cash: '£87.1k', confidence: '95%' } : horizon === '7 days' ? { revenue: '+4.6%', cash: '£91.8k', confidence: '91%' } : { revenue: '+13.2%', cash: '£103.5k', confidence: '86%' }
  const activeAction = agentActions.find((action) => action.status !== 'rejected') ?? agentActions[0]
  const rankedDecisions = agentActions
    .filter((action) => action.status === 'proposed' || action.status === 'approved')
    .map((action) => {
      const ageHours = Math.max(0, (Date.now() - new Date(action.createdAt).getTime()) / 3_600_000)
      const urgency = Math.min(10, Math.floor(ageHours / 6))
      return { action, score: (action.coordinationSummary?.decisionScore ?? 0) + urgency }
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
  return <>
    <WorkspaceHeading eyebrow="FoundingOS Intelligence" title="The control plane for your business." copy="FoundAI observes the Shared Event Feed, connects cause and effect across workspaces, and brings coordinated actions here for approval." action={<button className="retail-app-primary" disabled={agentBusy === 'propose'} onClick={() => void proposeAgentAction()} type="button">{agentBusy === 'propose' ? 'Scanning events…' : 'Run replenishment scan'}</button>} />
    <IntelligenceActivation busy={agentBusy === 'activate'} onActivate={activateIntelligence} />
    <StrategicOverview intelligence={intelligence} />
    <section className="agent-action-command" id="agent-actions">
      <header><div><p>FoundAI orchestration</p><h2>{activeAction?.title ?? 'No active proposals'}</h2></div>{activeAction ? <span data-status={activeAction.status}>{activeAction.status}</span> : null}</header>
      {agentError ? <div className="complete-workspace-error" role="alert">{agentError}</div> : null}
      {activeAction ? <>
        <p className="agent-action-summary">{activeAction.summary}</p>
        <div className="agent-action-evidence"><span>Triggered by <strong>Shared Event Feed</strong></span><span>Risk <strong>{activeAction.riskLevel}</strong></span><span>Cash impact <strong>{displayMoney(activeAction.estimatedValuePence)}</strong></span>{activeAction.predictiveSignals ? <span className="agent-confidence-badge" data-confidence={activeAction.predictiveSignals.confidenceLabel}><strong>{activeAction.predictiveSignals.confidence}% confidence</strong> · {activeAction.predictiveSignals.evidenceCount} outcomes</span> : null}</div>
        {activeAction.coordinationSummary ? <div className="agent-coordination-grid">
          <article><small>Retail risk</small><strong>{activeAction.coordinationSummary.inventoryRisk}</strong></article>
          <article><small>Logistics load</small><strong>{activeAction.coordinationSummary.logisticsLoad}</strong></article>
          <article><small>Finance impact</small><strong>{displayMoney(activeAction.coordinationSummary.cashImpactPence)} committed</strong></article>
        </div> : null}
        {activeAction.historicalContext ? <div className="agent-history"><div><small>Historical evidence</small><strong>{activeAction.historicalContext.narrative}</strong></div><span>{activeAction.historicalContext.completionRate}% prior completion</span></div> : null}
        {activeAction.predictiveSignals ? <div className="agent-prediction"><div><small>What usually happens next</small><strong>{activeAction.predictiveSignals.likelyNext}</strong><p>{activeAction.predictiveSignals.triggerPattern} {activeAction.predictiveSignals.basis.join(' · ')}</p></div><span>{activeAction.predictiveSignals.confidenceLabel} pattern</span></div> : null}
        {activeAction.coordinationSummary ? <ul className="agent-tradeoffs">{activeAction.coordinationSummary.tradeoffs.map((tradeoff) => <li key={tradeoff}>{tradeoff}</li>)}</ul> : null}
        {activeAction.simulationPreview ? <section className="agent-simulation">
          <header><div><small>Read-only simulation</small><strong>Before and after approval</strong></div><span>No changes executed</span></header>
          <div>{activeAction.simulationPreview.workspaces.map((preview) => <article key={preview.workspace}><h3>{configs[preview.workspace].label}</h3><dl><div><dt>Before</dt><dd>{preview.before}</dd></div><div><dt>After</dt><dd>{preview.after}</dd></div></dl><p>{preview.effect}</p>{preview.secondOrderEffects?.length ? <ul>{preview.secondOrderEffects.map((effect) => <li key={effect}>{effect}</li>)}</ul> : null}</article>)}</div>
          {activeAction.simulationPreview.comparison ? <section className="agent-decision-comparison"><article><small>Approve</small>{activeAction.simulationPreview.comparison.approve.map((effect) => <span key={effect}>+ {effect}</span>)}</article><article><small>Reject / no action</small>{activeAction.simulationPreview.comparison.reject.map((effect) => <span key={effect}>– {effect}</span>)}</article><strong>{activeAction.simulationPreview.comparison.predictedDelta}</strong></section> : null}
          <footer>{activeAction.simulationPreview.disclaimer}</footer>
        </section> : null}
        <div className="agent-action-steps">{activeAction.steps.map((step, index) => <article key={step.id} data-complete={step.status === 'completed'}><b>{index + 1}</b><div><small>{configs[step.workspace].label} · {step.module}</small><strong>{step.description}</strong></div><span>{step.status === 'completed' ? '✓ Done' : 'Pending'}</span></article>)}</div>
        <footer><p>{activeAction.rationale}</p><div>
          {activeAction.status === 'proposed' ? <><button className="retail-app-secondary" disabled={agentBusy === activeAction.id} onClick={() => void decideAgentAction(activeAction, 'reject')} type="button">Dismiss</button><button className="retail-app-primary" disabled={agentBusy === activeAction.id} onClick={() => void decideAgentAction(activeAction, 'approve')} type="button">Approve coordinated plan</button></> : null}
          {activeAction.status === 'approved' ? <button className="retail-app-primary" disabled={agentBusy === activeAction.id} onClick={() => void executeAgentAction(activeAction)} type="button">{agentBusy === activeAction.id ? 'Coordinating workspaces…' : 'Execute approved plan'}</button> : null}
          {activeAction.status === 'completed' ? activeAction.executionReversed
            ? <span className="agent-action-complete">Internal execution compensated and audited</span>
            : <><span className="agent-action-complete">Completed across three workspaces</span><button className="retail-app-secondary" disabled={agentBusy === activeAction.id} onClick={() => void reverseAgentAction(activeAction)} type="button">{agentBusy === activeAction.id ? 'Compensating…' : 'Undo internal execution'}</button></> : null}
          <Link className="agent-action-trail-link" href={`${workspaceRoot}/intelligence/event-feed?actionId=${encodeURIComponent(activeAction.id)}`}>View {activeAction.trailEventIds?.length ?? 0} trail events →</Link>
        </div></footer>
        {activeAction.outcomeSummary ? <div className="agent-outcome-summary"><small>Verified outcome</small><strong>{activeAction.outcomeSummary}</strong></div> : null}
        {activeAction.outcomeAssessment ? <div className="agent-learning-summary"><div><small>Outcome learning</small><strong>{activeAction.outcomeAssessment.accuracy}% prediction accuracy</strong><p>{activeAction.outcomeAssessment.summary}</p></div><span>{activeAction.outcomeAssessment.deviations.length ? `${activeAction.outcomeAssessment.deviations.length} deviations` : 'No deviations'}</span></div> : null}
      </> : <p className="agent-action-summary">Run a scan to let FoundAI evaluate the latest inventory signal and prepare a coordinated plan.</p>}
    </section>
    <section className="decision-intelligence">
      <div className="retail-app-panel-heading"><div><p>Coordination intelligence</p><h2>Highest-value pending decisions</h2></div><span>Impact + coverage + risk + pattern confidence + urgency</span></div>
      {rankedDecisions.length ? <div className="decision-intelligence-list">{rankedDecisions.map(({ action, score }, index) => <article key={action.id}>
        <a href="#agent-actions"><b>#{index + 1}</b><div><strong>{action.title}</strong><span>{action.coordinationSummary?.scoreExplanation.join(' · ') || action.rationale}</span></div><em>{score} priority · {action.predictiveSignals?.confidence ?? 50}% confidence · {action.predictiveSignals?.evidenceCount ?? 0} outcomes</em></a>
        <IntelligenceEvidence evidence={[
          `${action.historicalContext?.similarSignals ?? 0} similar historical signals with ${action.historicalContext?.completionRate ?? 0}% completion`,
          `${action.predictiveSignals?.reliabilityScore ?? 0}% pattern reliability and ${action.predictiveSignals?.averageAccuracy ?? 0}% measured accuracy`,
          `${action.coordinationSummary?.workspaceCount ?? action.steps.length} workspaces affected with ${displayMoney(action.estimatedValuePence)} estimated financial impact`,
          `${intelligence.interactions.filter((interaction) => interaction.actionIds.includes(action.id)).length} active related-decision interaction(s)`,
        ]} />
      </article>)}</div> : <p className="agent-action-summary">No decisions are waiting. Completed outcomes remain available in the Shared Event Feed.</p>}
    </section>
    <section className="intelligence-snapshot">
      <div className="retail-app-panel-heading"><div><p>Institutional memory</p><h2>Intelligence Snapshot</h2></div><span data-momentum={intelligence.snapshot.learningMomentum.label}>{intelligence.snapshot.learningMomentum.label} momentum</span></div>
      <div className="intelligence-snapshot-grid">
        <article><small>Assessed outcomes</small><strong>{intelligence.snapshot.totalAssessedOutcomes}</strong><span>Measured learning loops</span></article>
        <article><small>Refined patterns</small><strong>{intelligence.snapshot.refinedPatterns}</strong><span>Evidence thresholds passed</span></article>
        <article><small>Accuracy trend</small><strong>{intelligence.snapshot.recentAccuracyTrend.change >= 0 ? '+' : ''}{intelligence.snapshot.recentAccuracyTrend.change}%</strong><span>{intelligence.snapshot.recentAccuracyTrend.current}% recent accuracy</span></article>
        <article><small>Active interactions</small><strong>{intelligence.snapshot.activeInteractions}</strong><span>Cross-action advisories</span></article>
        <article><small>Learning momentum</small><strong>{intelligence.snapshot.learningMomentum.score}/100</strong><span>{intelligence.snapshot.learningMomentum.label}</span></article>
      </div>
      <div className="intelligence-progress"><strong>{intelligence.snapshot.recentAccuracyTrend.narrative}</strong><span>{intelligence.snapshot.learningMomentum.narrative}</span></div>
      <div className="economic-value-grid">
        <article><small>Cash governed</small><strong>{displayMoney(intelligence.snapshot.economicValue.cashGovernedPence)}</strong><span>Completed internal commitments</span></article>
        <article><small>Cash preserved</small><strong>{displayMoney(intelligence.snapshot.economicValue.cashPreservedPence)}</strong><span>Immediate commitments rejected</span></article>
        <article><small>Margin protected</small><strong>{intelligence.snapshot.economicValue.marginProtectedPence === null ? 'Not measured' : displayMoney(intelligence.snapshot.economicValue.marginProtectedPence)}</strong><span>{intelligence.snapshot.economicValue.marginProtectedPence === null ? 'Needs selling-price evidence' : 'Recorded price less cost'}</span></article>
        <article><small>Risk reduced</small><strong>{intelligence.snapshot.economicValue.riskReducedActions}</strong><span>{intelligence.snapshot.economicValue.inventoryUnitsProtected} inventory units protected</span></article>
        <article><small>Time saved</small><strong>~{intelligence.snapshot.economicValue.estimatedOperatorMinutesSaved} min</strong><span>{intelligence.snapshot.economicValue.coordinatedHandoffs} governed handoffs</span></article>
      </div>
      <details className="economic-methodology"><summary>How value is measured</summary><p>{intelligence.snapshot.economicValue.narrative}</p><ul>{intelligence.snapshot.economicValue.methodology.map((item) => <li key={item}>{item}</li>)}</ul></details>
      <div className="messaging-intelligence-preview"><div><small>WhatsApp-first intelligence</small><strong>Low-data briefs show cash, stock, supplier, risk, and the next safe action.</strong></div><code>APPROVE · REJECT · EXECUTE · UNDO · IMPACT</code><span>Approval and execution remain separate. UNDO compensates internal records; no external payment is moved.</span></div>
    </section>
    <section className="emerging-signals">
      <div className="retail-app-panel-heading"><div><p>Proactive foresight</p><h2>Emerging Signals</h2></div><span>Advisory only</span></div>
      {intelligence.emergingSignals.length ? <div className="emerging-signals-grid">{intelligence.emergingSignals.map((signal) => <article key={signal.id} data-severity={signal.severity}>
        <header><div><small>{signal.kind.replaceAll('-', ' ')}</small><strong>{signal.title}</strong></div><span>{signal.reliability}% reliable</span></header>
        <p>{signal.summary}</p>
        <footer>{signal.outcomeCount} measured outcome{signal.outcomeCount === 1 ? '' : 's'} · {signal.advisory}</footer>
        <IntelligenceEvidence evidence={signal.evidence} />
      </article>)}</div> : <p className="agent-action-summary">No emerging signal currently meets the evidence threshold.</p>}
    </section>
    <section className="system-intelligence-health">
      <div className="retail-app-panel-heading"><div><p>Compounding intelligence</p><h2>System Intelligence Health</h2></div><span>{intelligence.health.activePatterns} active pattern{intelligence.health.activePatterns === 1 ? '' : 's'}</span></div>
      <div className="system-intelligence-health-grid">
        <article><small>Assessed outcomes</small><strong>{intelligence.health.totalAssessedOutcomes}</strong><span>Measured against original predictions</span></article>
        <article><small>Prediction accuracy</small><strong>{intelligence.health.averagePredictionAccuracy}%</strong><span>Average verified outcome match</span></article>
        <article><small>Refined patterns</small><strong>{intelligence.health.refinedPatterns}</strong><span>Passed evidence thresholds</span></article>
        <article><small>Confidence improvement</small><strong>{intelligence.health.confidenceImprovement >= 0 ? '+' : ''}{intelligence.health.confidenceImprovement} pts</strong><span>Earliest to latest measured action</span></article>
        <article><small>Pattern reliability</small><strong>{intelligence.health.averageReliability}%</strong><span>Evidence-weighted system memory</span></article>
      </div>
      <p>{intelligence.health.narrative}</p>
      <p className="system-intelligence-memory">{intelligence.health.recurringDeviation?.insight || 'No recurring prediction deviation has met the evidence threshold.'}</p>
    </section>
    <section className="related-decisions">
      <div className="retail-app-panel-heading"><div><p>Cross-action awareness</p><h2>Related decisions</h2></div><span>Read-only advisory</span></div>
      {intelligence.interactions.length ? <div>{intelligence.interactions.map((interaction) => <article key={interaction.id} data-severity={interaction.severity}>
        <header><strong>{interaction.actionTitles.join(' ↔ ')}</strong><span>{interaction.severity}</span></header>
        <p>{interaction.summary}</p>
        <ul>{interaction.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
        <footer>{interaction.advisory}</footer>
        <IntelligenceEvidence evidence={[...interaction.evidence, `${intelligence.health.averageReliability}% average pattern reliability`, `${intelligence.health.averagePredictionAccuracy}% measured prediction accuracy`]} />
      </article>)}</div> : <p>No material interactions were detected between pending or recently completed actions.</p>}
    </section>
    <section className="intelligence-advantage">
      <div className="retail-app-panel-heading"><div><p>Strategic demo</p><h2>The Intelligence Advantage</h2></div><span>Messaging-native operating system</span></div>
      <div>
        <article><small>1 · Detect</small><strong>See risk before it becomes a crisis</strong><p>Event Feed patterns connect inventory, supplier, logistics, and cash pressure using measured tenant-safe evidence.</p></article>
        <article><small>2 · Decide anywhere</small><strong>Act from a basic smartphone</strong><p>Sub-1KB WhatsApp briefs show economic impact, confidence, alternatives, and the exact next command.</p></article>
        <article><small>3 · Govern execution</small><strong>Approval is not execution</strong><p>Every internal action is tenant-scoped, replay-protected, audited, and compensatable with no hidden external transfer.</p></article>
        <article><small>4 · Compound</small><strong>Every outcome improves the next decision</strong><p>Accuracy assessments refine reliability and surface patterns no single isolated workflow can learn alone.</p></article>
      </div>
    </section>
    <BuyerIntelligenceDemo />
    <section className="execution-audit">
      <div className="retail-app-panel-heading"><div><p>Governance evidence</p><h2>Execution audit trail</h2></div><span>{intelligence.auditTrail.length} recent lifecycle events</span></div>
      {intelligence.auditTrail.length ? <div className="execution-audit-list">{intelligence.auditTrail.slice(0, 10).map((entry) => <article key={entry.id} data-stage={entry.stage}>
        <i />
        <div><header><strong>{entry.actionTitle}</strong><span>{entry.stage}</span></header><p>{entry.summary}</p><small>{entry.actor} · {new Date(entry.occurredAt).toLocaleString('en-GB', { timeZone: 'UTC' })}</small></div>
        <details><summary>Evidence</summary><ul>{entry.evidence.map((item) => <li key={item}>{item}</li>)}</ul></details>
      </article>)}</div> : <p className="agent-action-summary">Lifecycle events will appear here after a signal creates the first governed proposal.</p>}
      <footer>Append-only Event Feed evidence · tenant scoped · approval separated from execution · compensation retained</footer>
    </section>
    <section className="retail-app-metrics">
      <Metric label="Operating health" value="91%" change="+3 points this week" />
      <Metric label="Revenue influenced" value="£74.2k" change="+11.8% this month" />
      <Metric label="Active exceptions" value="13" change="4 require a decision" />
      <Metric label="Pattern reliability" value={`${activeAction?.predictiveSignals?.reliabilityScore ?? 0}%`} change={`${activeAction?.predictiveSignals?.assessedOutcomes ?? 0} assessed outcomes${activeAction?.predictiveSignals?.refined ? ' · refined pattern' : ''}`} />
    </section>
    <section className="superdashboard-workspace-grid">
      {superDashboardWorkspaces.map((item) => <Link href={`${workspaceRoot}/${item.workspace}`} key={item.workspace} style={{ ['--workspace-color' as string]: configs[item.workspace].accent }}>
        <header><div><span>{configs[item.workspace].label.slice(0, 2).toUpperCase()}</span><strong>{configs[item.workspace].label}</strong></div><b>{item.health}% healthy</b></header>
        <div><small>{item.headline}</small><strong>{item.value}</strong><em>{item.trend}</em></div>
        <footer><span>{item.risk}</span><b>Open →</b></footer>
      </Link>)}
    </section>
    <section className="retail-app-dashboard-grid superdashboard-main-grid">
      <article className="retail-app-panel retail-app-chart-panel">
        <div className="retail-app-panel-heading"><div><p>Predictive outlook</p><h2>Combined operating trajectory</h2></div><div className="superdashboard-horizons">{(['Today', '7 days', '30 days'] as const).map((item) => <button className={item === horizon ? 'active' : ''} key={item} onClick={() => setHorizon(item)} type="button">{item}</button>)}</div></div>
        <div className="superdashboard-forecast"><div><small>Revenue trend</small><strong>{forecast.revenue}</strong></div><div><small>Projected cash</small><strong>{forecast.cash}</strong></div><div><small>Model confidence</small><strong>{forecast.confidence}</strong></div></div>
        <svg viewBox="0 0 620 180" role="img" aria-label={`${horizon} combined business forecast`}><defs><linearGradient id="superdashboard-trend" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#b77aff" stopOpacity=".42" /><stop offset="1" stopColor="#b77aff" stopOpacity="0" /></linearGradient></defs>{[30, 75, 120, 165].map((y) => <line key={y} stroke="#dfe5ed" x1="25" x2="600" y1={y} y2={y} />)}<path d="M25 148 L115 135 L205 142 L295 101 L385 110 L475 64 L600 35 L600 175 L25 175 Z" fill="url(#superdashboard-trend)" /><polyline fill="none" points="25,148 115,135 205,142 295,101 385,110 475,64 600,35" stroke="#8a50d2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" /></svg>
      </article>
      <article className="retail-app-panel">
        <div className="retail-app-panel-heading"><div><p>Decision queue</p><h2>Recommended next actions</h2></div><Link href={`${workspaceRoot}/intelligence/recommendations`}>View all</Link></div>
        <div className="superdashboard-decisions">
          <Link href={`${workspaceRoot}/finance/cashflow`}><i data-tone="risk" /><div><strong>Protect seven-day cash position</strong><span>Chase £8.1k receivables due this week</span></div><b>£8.1k</b></Link>
          <Link href={`${workspaceRoot}/logistics/exceptions`}><i data-tone="watch" /><div><strong>Recover delayed deliveries</strong><span>Reassign three exceptions before the afternoon run</span></div><b>3 routes</b></Link>
          <Link href={`${workspaceRoot}/retail/inventory`}><i data-tone="watch" /><div><strong>Approve inventory replenishment</strong><span>Two fast-moving lines will stock out within four days</span></div><b>4 days</b></Link>
          <Link href={`${workspaceRoot}/talent/jobs`}><i data-tone="good" /><div><strong>Accelerate priority hiring</strong><span>Six candidates match the four urgent roles</span></div><b>6 matches</b></Link>
        </div>
      </article>
    </section>
    <section className="retail-app-dashboard-grid lower">
      <article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Shared Event Feed</p><h2>What changed across the business</h2></div><Link href={`${workspaceRoot}/intelligence/event-feed`}>Open feed</Link></div><ul className="retail-app-activity">{(events.length ? events : [
        { id: 'sd-1', workspace: 'retail' as const, text: 'Order value crossed the weekly plan', time: 'Now' },
        { id: 'sd-2', workspace: 'finance' as const, text: 'Stripe settlement reconciled automatically', time: '12m' },
        { id: 'sd-3', workspace: 'logistics' as const, text: 'Delivery exception requires approval', time: '28m' },
        { id: 'sd-4', workspace: 'marketing' as const, text: 'Campaign created three qualified opportunities', time: '41m' },
        { id: 'sd-5', workspace: 'health' as const, text: 'Follow-up queue exceeded target', time: '1h' },
      ]).slice(0, 6).map((event) => <li key={event.id}><i /><span><strong>{configs[event.workspace].label}</strong> · {event.text}</span><span>{event.time}</span></li>)}</ul></article>
      <article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>AI control</p><h2>Autonomy with approval</h2></div><Link href={`${workspaceRoot}/intelligence/workflows`}>Manage workflows</Link></div><div className="superdashboard-autonomy"><div><span>Observed</span><strong>420 signals</strong><small>Across six operational workspaces</small></div><div><span>Recommended</span><strong>17 actions</strong><small>£24k estimated business value</small></div><div><span>Auto-completed</span><strong>11 actions</strong><small>Within approved guardrails</small></div><div><span>Needs approval</span><strong>4 decisions</strong><small>No external action taken yet</small></div></div></article>
    </section>
  </>
}

const boardTones = ['neutral', 'info', 'warn', 'done'] as const

function recordOrigin(record: WorkspaceRecord, config: WorkspaceConfig): { label: string; detail: string } {
  const seedCount = config.subjects.length
  const numberMatch = record.id.match(/(\d+)$/)
  const seedNumber = numberMatch ? Number(numberMatch[1]) - 101 : -1
  if (record.backendId) return { label: 'Synced record', detail: `Live record ${record.id} synced from the FoundingOS platform backend (version ${record.version ?? 1}).` }
  if (seedNumber >= 0 && seedNumber < seedCount) return { label: 'Demo data', detail: `Auto-generated sample record ${record.id}, seeded so this workspace has realistic data to explore.` }
  return { label: 'Manually created', detail: `Added by ${record.owner} directly in this workspace (${record.id}), not from an import or integration.` }
}

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || '•'

function hashPercent(id: string, min = 38, max = 97) {
  const hash = [...id].reduce((total, char) => total + char.charCodeAt(0), 0)
  return min + (hash % (max - min))
}

// A wider-dispersion hash (djb2) for cases where sequential IDs like "TRA-101"/"TRA-102" need to
// scatter far apart (e.g. map pin placement) — the plain char-sum hash above clusters those too
// tightly since adjacent IDs only differ by one digit.
function hashSpread(id: string, min: number, max: number) {
  let hash = 5381
  for (const char of id) hash = (hash * 33) ^ char.charCodeAt(0)
  return min + (Math.abs(hash) % (max - min))
}

// Parses a "£4,280"-style value string into a plain number; returns 0 for non-numeric values
// like "High priority" so callers can safely sum a mixed set of records.
const parseCurrency = (value: string) => Number(value.replace(/[^0-9.]/g, '')) || 0
const formatCurrency = (value: number) => value >= 1000 ? `£${(value / 1000).toFixed(1)}k` : `£${Math.round(value)}`

// Turns a record's follow-up date into a short label + urgency tone for the board/list badge —
// "Overdue" (red), "Due today"/"Due tomorrow" (amber), or "Due <date>" (neutral) for anything later.
const dueBadge = (dueDate?: string): { label: string; tone: 'overdue' | 'soon' | 'later' } | null => {
  if (!dueDate) return null
  const due = new Date(`${dueDate}T00:00:00`)
  if (Number.isNaN(due.getTime())) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const days = Math.round((due.getTime() - today.getTime()) / 86400000)
  if (days < 0) return { label: `Overdue ${Math.abs(days)}d`, tone: 'overdue' }
  if (days === 0) return { label: 'Due today', tone: 'soon' }
  if (days === 1) return { label: 'Due tomorrow', tone: 'soon' }
  if (days <= 3) return { label: `Due in ${days}d`, tone: 'soon' }
  return { label: `Due ${due.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}`, tone: 'later' }
}

// Counts how many records in a module are overdue or due today — powers the red follow-up
// dot in the sidebar nav so a founder can see at a glance which modules need attention,
// the same "what needs me today" signal HubSpot/Pipedrive surface on their nav rail.
const overdueCount = (records: WorkspaceRecord[] | undefined): number => {
  if (!records?.length) return 0
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return records.filter((record) => {
    if (!record.dueDate) return false
    const due = new Date(`${record.dueDate}T00:00:00`)
    return !Number.isNaN(due.getTime()) && due.getTime() <= today.getTime()
  }).length
}

// A real, explainable lead score for CRM records — unlike a generic "AI score" black box,
// every point is derived from data already on the record (pipeline stage, deal value versus
// the rest of the pipeline, logged engagement, and follow-up status) so a rep can see exactly
// why a lead is Hot/Warm/Cold and what would move it, the way HubSpot/Pipedrive scoring should
// work but rarely explains clearly.
function computeLeadScore(record: WorkspaceRecord, statuses: string[], records: WorkspaceRecord[]): { score: number; tier: 'Hot' | 'Warm' | 'Cold'; factors: string[] } {
  const factors: string[] = []
  const stageIndex = Math.max(0, statuses.indexOf(record.status))
  const stagePoints = statuses.length > 1 ? Math.round((stageIndex / (statuses.length - 1)) * 35) : 0
  factors.push(`${record.status} stage (+${stagePoints})`)

  const values = records.map((item) => parseCurrency(item.value)).filter((amount) => amount > 0)
  const avgValue = values.length ? values.reduce((total, amount) => total + amount, 0) / values.length : 0
  const recordValue = parseCurrency(record.value)
  const valuePoints = avgValue > 0 ? Math.max(0, Math.min(25, Math.round((recordValue / avgValue) * 12.5))) : 0
  if (recordValue > 0) factors.push(`${formatCurrency(recordValue)} deal vs ${formatCurrency(avgValue)} average (+${valuePoints})`)

  const logCount = record.log?.length ?? 0
  const engagementPoints = Math.min(25, logCount * 6)
  factors.push(`${logCount} logged ${logCount === 1 ? 'activity' : 'activities'} (+${engagementPoints})`)

  const badge = dueBadge(record.dueDate)
  let duePoints = 0
  if (badge?.tone === 'overdue') { duePoints = -15; factors.push(`Follow-up overdue (${duePoints})`) }
  else if (badge?.tone === 'soon') { duePoints = 8; factors.push(`Follow-up due soon (+${duePoints})`) }
  else if (badge?.tone === 'later') { duePoints = 2; factors.push(`Follow-up scheduled (+${duePoints})`) }

  const score = Math.max(0, Math.min(100, stagePoints + valuePoints + engagementPoints + duePoints))
  const tier: 'Hot' | 'Warm' | 'Cold' = score >= 70 ? 'Hot' : score >= 40 ? 'Warm' : 'Cold'
  return { score, tier, factors }
}

const directoryMetricLabel = (group: string): string => {
  if (group === 'Resources') return 'capacity'
  if (group === 'Commerce' || group === 'Distribution') return 'stock health'
  if (group === 'Money' || group === 'Planning') return 'on target'
  if (group === 'Customers' || group === 'Audience' || group === 'People') return 'engagement'
  return 'health score'
}

// A real KPI strip for board (pipeline/stage) modules — a % complete gauge (records in the
// final stage vs total) plus a proportional stacked bar showing exactly how the pipeline is
// distributed across every stage, colour-matched to the board columns below it. Every module
// with statuses (sales-pipeline, orders, campaigns, invoices, tickets, etc.) gets this for
// free since it's driven purely by `statuses`/`records`, not any per-module bespoke code.
function PipelineKPIBar({ statuses, records }: { statuses: string[]; records: WorkspaceRecord[] }) {
  const total = records.length
  const finalStage = statuses.at(-1)
  const completePct = total ? Math.round((records.filter((record) => record.status === finalStage).length / total) * 100) : 0
  const segments = statuses.map((status, index) => ({
    status,
    tone: boardTones[index % boardTones.length],
    count: records.filter((record) => record.status === status).length,
  }))
  return <div className="retail-app-kpi-strip">
    <div className="retail-app-kpi-gauge">
      <svg height="72" viewBox="0 0 72 72" width="72">
        <circle cx="36" cy="36" fill="none" r="30" stroke="#e5eaf0" strokeWidth="8" />
        <circle cx="36" cy="36" fill="none" r="30" stroke="var(--retail-accent, #22c55e)" strokeDasharray={`${(completePct / 100) * 188.5} 188.5`} strokeLinecap="round" strokeWidth="8" transform="rotate(-90 36 36)" />
      </svg>
      <div className="retail-app-kpi-gauge-label"><strong>{completePct}%</strong><span>at {finalStage}</span></div>
    </div>
    <div className="retail-app-kpi-distribution">
      <div className="retail-app-kpi-distribution-bar">
        {segments.map((segment) => segment.count ? <i data-tone={segment.tone} key={segment.status} style={{ flexGrow: segment.count }} title={`${segment.status}: ${segment.count}`} /> : null)}
      </div>
      <div className="retail-app-kpi-distribution-legend">
        {segments.map((segment) => <span key={segment.status}><i data-tone={segment.tone} />{segment.status} · {segment.count}</span>)}
      </div>
    </div>
  </div>
}

// The directory equivalent of PipelineKPIBar — directory modules don't have stages, but every
// record does have a hashed health/engagement score (the same one shown per-card below), so
// this rolls that up into an average gauge plus a quick low/mid/high distribution, giving the
// same "quick visual read" every board module gets.
function DirectoryKPIBar({ records, metricLabel }: { records: WorkspaceRecord[]; metricLabel: string }) {
  const scores = records.map((record) => hashPercent(record.id))
  const avg = scores.length ? Math.round(scores.reduce((total, value) => total + value, 0) / scores.length) : 0
  const buckets = { low: scores.filter((value) => value < 60).length, mid: scores.filter((value) => value >= 60 && value < 85).length, high: scores.filter((value) => value >= 85).length }
  return <div className="retail-app-kpi-strip">
    <div className="retail-app-kpi-gauge">
      <svg height="72" viewBox="0 0 72 72" width="72">
        <circle cx="36" cy="36" fill="none" r="30" stroke="#e5eaf0" strokeWidth="8" />
        <circle cx="36" cy="36" fill="none" r="30" stroke="var(--retail-accent, #22c55e)" strokeDasharray={`${(avg / 100) * 188.5} 188.5`} strokeLinecap="round" strokeWidth="8" transform="rotate(-90 36 36)" />
      </svg>
      <div className="retail-app-kpi-gauge-label"><strong>{avg}%</strong><span>avg {metricLabel}</span></div>
    </div>
    <div className="retail-app-kpi-distribution">
      <div className="retail-app-kpi-distribution-bar">
        {buckets.high ? <i data-tone="done" style={{ flexGrow: buckets.high }} title={`High: ${buckets.high}`} /> : null}
        {buckets.mid ? <i data-tone="info" style={{ flexGrow: buckets.mid }} title={`Mid: ${buckets.mid}`} /> : null}
        {buckets.low ? <i data-tone="warn" style={{ flexGrow: buckets.low }} title={`Low: ${buckets.low}`} /> : null}
      </div>
      <div className="retail-app-kpi-distribution-legend">
        <span><i data-tone="done" />High (85%+) · {buckets.high}</span>
        <span><i data-tone="info" />Mid (60–84%) · {buckets.mid}</span>
        <span><i data-tone="warn" />Low (&lt;60%) · {buckets.low}</span>
      </div>
    </div>
  </div>
}

function assignCalendarDay(id: string, totalDays: number) {
  const hash = [...id].reduce((total, char) => total + char.charCodeAt(0), 0)
  return 1 + (hash % Math.max(totalDays, 1))
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// A real month calendar — not a directory list pretending to be one. Records land on a
// deterministic day of the month (hashed from their id) so the layout is stable between
// renders. The month itself defaults to a fixed anchor on first paint (SSR-safe) and swaps to
// the real current month client-side via useEffect, so there is never a server/client mismatch.
function CalendarGridView({ records, selectedId, onSelect }: { records: WorkspaceRecord[]; selectedId?: string; onSelect: (id: string) => void }) {
  const [anchor, setAnchor] = useState(() => new Date(2026, 0, 1))
  useEffect(() => setAnchor(new Date()), [])
  const totalDays = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate()
  const startWeekday = new Date(anchor.getFullYear(), anchor.getMonth(), 1).getDay()
  const monthLabel = anchor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const recordsByDay = new Map<number, WorkspaceRecord[]>()
  records.forEach((record) => {
    const day = assignCalendarDay(record.id, totalDays)
    recordsByDay.set(day, [...(recordsByDay.get(day) ?? []), record])
  })
  const cells: Array<{ day: number | null; records: WorkspaceRecord[] }> = []
  for (let i = 0; i < startWeekday; i++) cells.push({ day: null, records: [] })
  for (let day = 1; day <= totalDays; day++) cells.push({ day, records: recordsByDay.get(day) ?? [] })
  while (cells.length % 7 !== 0) cells.push({ day: null, records: [] })
  const weeks: Array<typeof cells> = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return <div className="retail-app-calendar-card">
    <div className="retail-app-panel-heading"><div><p>Schedule</p><h2>{monthLabel}</h2></div><span>{records.length} scheduled</span></div>
    <div className="retail-app-calendar-weekdays">{weekdayLabels.map((day) => <span key={day}>{day}</span>)}</div>
    <div className="retail-app-calendar-grid">
      {weeks.map((week, weekIndex) => <div className="retail-app-calendar-row" key={weekIndex}>
        {week.map((cell, cellIndex) => <div className={`retail-app-calendar-cell${cell.day === anchor.getDate() ? ' is-today' : ''}${cell.day === null ? ' is-empty' : ''}`} key={cellIndex}>
          {cell.day ? <span className="retail-app-calendar-daynum">{cell.day}</span> : null}
          <div className="retail-app-calendar-chips">
            {cell.records.map((record) => <button className={`retail-app-calendar-chip${record.id === selectedId ? ' selected' : ''}`} key={record.id} onClick={() => onSelect(record.id)} title={record.name} type="button">{record.name}</button>)}
          </div>
        </div>)}
      </div>)}
    </div>
    {records.length === 0 ? <p className="retail-app-board-empty">Nothing scheduled this month</p> : null}
  </div>
}

const messageBodies = [
  'Thanks for getting back to me so quickly — really appreciate the update. Can you confirm the next step and when I should expect to hear back?',
  'Following up on this one more time. It\u2019s been a few days and I just want to make sure it hasn\u2019t slipped through the cracks.',
  'Quick question before we go ahead — does this include everything we discussed on the call, or is there a separate step I\u2019m missing?',
  'This looks great, thank you! Happy to proceed whenever you\u2019re ready on your side.',
  'I wanted to flag that the timeline has shifted slightly on our end. Let me know if that changes anything for you.',
  'Really pleased with how this has gone so far. Is there anything you need from us to keep things moving?',
]

function messageBody(id: string) {
  const hash = [...id].reduce((total, char) => total + char.charCodeAt(0), 0)
  return messageBodies[hash % messageBodies.length]
}

const inboxChannels = ['WhatsApp', 'Email', 'SMS'] as const
type InboxChannel = (typeof inboxChannels)[number]
function channelFor(id: string): InboxChannel {
  const hash = [...id].reduce((total, char) => total + char.charCodeAt(0), 0)
  return inboxChannels[hash % inboxChannels.length]
}
const channelGlyph: Record<InboxChannel, string> = { WhatsApp: '💬', Email: '✉️', SMS: '📱' }

// A real two-pane mail-client layout, not a Kanban board wearing an "inbox" label — a folder rail
// (All + one folder per stage, like Outlook's Focused/Other), a searchable message list on the left
// (avatar, sender, channel badge, subject preview, unread indicator, timestamp), and the open message
// with a reply box on the right, exactly like Gmail/Outlook/WhatsApp Web.
function InboxListView({ records, selectedId, onSelect, statuses }: { records: WorkspaceRecord[]; selectedId?: string; onSelect: (id: string) => void; statuses: string[] }) {
  const [folder, setFolder] = useState('All')
  const [query, setQuery] = useState('')
  const filtered = records
    .filter((record) => folder === 'All' || record.status === folder)
    .filter((record) => !query.trim() || `${record.name} ${record.secondary}`.toLowerCase().includes(query.trim().toLowerCase()))
  const selected = filtered.find((record) => record.id === selectedId) ?? filtered[0]
  const [replyDraft, setReplyDraft] = useState('')
  const [sentFlash, setSentFlash] = useState(false)
  const sendReply = () => {
    if (!replyDraft.trim()) return
    setReplyDraft('')
    setSentFlash(true)
    window.setTimeout(() => setSentFlash(false), 2400)
  }
  return <div className="retail-app-inbox-layout">
    <div className="retail-app-inbox-folders">
      <button className={folder === 'All' ? 'active' : ''} onClick={() => setFolder('All')} type="button"><span>All conversations</span><em>{records.length}</em></button>
      {statuses.map((status) => <button className={folder === status ? 'active' : ''} key={status} onClick={() => setFolder(status)} type="button"><span>{status}</span><em>{records.filter((record) => record.status === status).length}</em></button>)}
      <div className="retail-app-inbox-connect">
        <p>Bring every conversation here</p>
        <Link href="../integrations">Connect email &amp; channels →</Link>
      </div>
    </div>
    <div className="retail-app-inbox-list">
      <div className="retail-app-panel-heading"><div><p>Inbox</p><h2>{filtered.length} conversations</h2></div><span>{records.filter((record) => record.status === statuses[0]).length} unread</span></div>
      <input aria-label="Search conversations" className="retail-app-inbox-search" onChange={(event) => setQuery(event.target.value)} placeholder="Search name or subject…" type="search" value={query} />
      <div className="retail-app-inbox-rows">
        {filtered.map((record) => <button className={`retail-app-inbox-row${record.id === selectedId ? ' selected' : ''}${record.status === statuses[0] ? ' is-unread' : ''}`} key={record.id} onClick={() => onSelect(record.id)} type="button">
          <span className="retail-app-inbox-avatar">{initials(record.name)}</span>
          <span className="retail-app-inbox-row-body">
            <span className="retail-app-inbox-row-top"><b>{record.name}</b><i>{record.updated}</i></span>
            <span className="retail-app-inbox-row-preview"><em className="retail-app-inbox-channel" title={channelFor(record.id)}>{channelGlyph[channelFor(record.id)]}</em>{record.secondary} — {messageBody(record.id).slice(0, 46)}…</span>
          </span>
          {record.status === statuses[0] ? <span className="retail-app-inbox-dot" /> : null}
        </button>)}
        {filtered.length === 0 ? <p className="retail-app-board-empty">No conversations match</p> : null}
      </div>
    </div>
    {selected ? <div className="retail-app-inbox-thread">
      <div className="retail-app-inbox-thread-head">
        <span className="retail-app-inbox-avatar large">{initials(selected.name)}</span>
        <div><strong>{selected.name}</strong><span>{channelGlyph[channelFor(selected.id)]} {channelFor(selected.id)} · {selected.secondary} · {selected.updated}</span></div>
        <span className={`retail-app-status status-${selected.status.toLowerCase().replace(/\s+/g, '-')}`}>{selected.status}</span>
      </div>
      <div className="retail-app-inbox-thread-body">
        <p>{messageBody(selected.id)}</p>
      </div>
      <div className="retail-app-inbox-reply">
        <textarea onChange={(event) => setReplyDraft(event.target.value)} placeholder={`Reply to ${selected.name}…`} rows={3} value={replyDraft} />
        <button className="retail-app-primary" disabled={!replyDraft.trim()} onClick={sendReply} type="button">Send reply</button>
        {sentFlash ? <span className="retail-app-inbox-sent">Sent ✓</span> : null}
      </div>
    </div> : <div className="retail-app-inbox-thread"><p className="retail-app-board-empty">Select a conversation to read it</p></div>}
  </div>
}

type ContentDraft = { headline: string; body: string; hashtags: string[]; cta: string; type: string; image?: string }

const STUDIO_TYPES = ['Social post', 'Email', 'Blog intro', 'Ad copy'] as const
const STUDIO_TONES = ['Professional', 'Playful', 'Bold', 'Minimal'] as const

const STUDIO_HOOKS: Record<(typeof STUDIO_TYPES)[number], string[]> = {
  'Social post': ['Big news for {topic} \u{1F440}', 'Here\u2019s what\u2019s new with {topic}.', 'You asked, we delivered: {topic}.'],
  Email: ['Everything you need to know about {topic}', '{topic} just got better', 'A quick update on {topic}'],
  'Blog intro': ['{topic} is changing how teams work \u2014 here\u2019s why.', 'Let\u2019s talk about {topic}, and why it matters right now.', 'Everything you need to know about {topic}, in one place.'],
  'Ad copy': ['{topic}. Simple. Fast. Yours.', 'Meet {topic} \u2014 built for how you actually work.', 'Stop waiting. Start {topic} today.'],
}

const STUDIO_BODIES: Record<(typeof STUDIO_TONES)[number], string[]> = {
  Professional: [
    'We\u2019ve rolled out {topic} to help your team move faster, with fewer manual steps and clearer reporting across every workspace.',
    '{topic} is now available across the account \u2014 built to reduce manual work and give your team a clearer view of what matters.',
  ],
  Playful: [
    'Ok but {topic} is actually kind of amazing \u2014 you\u2019re going to want to see this. \u{1F389}',
    'Say hello to {topic}! We built it, you asked for it, and now it\u2019s finally here.',
  ],
  Bold: [
    'This changes everything. {topic} is live \u2014 no more waiting, no more workarounds.',
    '{topic}. Faster. Sharper. Ready right now.',
  ],
  Minimal: ['{topic}. Now live.', 'New: {topic}.'],
}

const STUDIO_CTAS = ['Learn more', 'Get started', 'See it in action', 'Book a demo', 'Try it free']
const STUDIO_HASHTAGS = ['#Growth', '#ProductUpdate', '#Automation', '#NewFeature', '#Efficiency', '#CustomerFirst', '#Launch']

function pickRandom<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)]
}

function generateContentDraft(topic: string, type: (typeof STUDIO_TYPES)[number], tone: (typeof STUDIO_TONES)[number], image?: string): ContentDraft {
  const safeTopic = topic.trim() || 'your latest launch'
  const headline = pickRandom(STUDIO_HOOKS[type]).replaceAll('{topic}', safeTopic)
  const body = pickRandom(STUDIO_BODIES[tone]).replaceAll('{topic}', safeTopic)
  const hashtags = [...STUDIO_HASHTAGS].sort(() => Math.random() - 0.5).slice(0, 3)
  return { headline, body, hashtags, cta: pickRandom(STUDIO_CTAS), type, image }
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function downloadDataUrl(filename: string, dataUrl: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

// The visual "where do I actually see this" box — a real rendered mockup of the post/email/ad,
// not just the raw text fields. Adapts its chrome slightly per format (email gets a subject-line
// header, everything else gets a social-style card) but always shows the image (uploaded, or a
// placeholder) so it looks like finished creative, not a form.
function ContentPreviewCard({ headline, body, hashtags, cta, type, image }: { headline: string; body: string; hashtags: string[]; cta: string; type: string; image?: string }) {
  const isEmail = type === 'Email'
  return <div className="retail-app-preview-box">
    <div className="retail-app-preview-chrome"><span>{isEmail ? 'Email preview' : `${type} preview`}</span></div>
    {isEmail ? <div className="retail-app-preview-email">
      <div className="retail-app-preview-email-head"><b>Subject:</b> {headline}</div>
      {image ? <img alt="Attached creative" className="retail-app-preview-image" src={image} /> : null}
      <p>{body}</p>
      <span className="retail-app-preview-cta">{cta}</span>
    </div> : <div className="retail-app-preview-post">
      <div className="retail-app-preview-post-head"><span className="retail-app-preview-avatar">FO</span><div><b>Your business</b><i>Just now</i></div></div>
      {image ? <img alt="Attached creative" className="retail-app-preview-image" src={image} /> : <div className="retail-app-preview-image retail-app-preview-image-placeholder">{'\u{1F5BC}\uFE0F'}</div>}
      <div className="retail-app-preview-post-body"><strong>{headline}</strong><p>{body}</p></div>
      <div className="retail-app-preview-post-tags">{hashtags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <span className="retail-app-preview-cta">{cta}</span>
    </div>}
  </div>
}

// A real AI content studio, not another board wearing a "Content studio" label: a compose
// panel (topic, format, tone) that asks FoundAI to draft a headline/body/hashtags/CTA, with a
// "try another version" regenerate loop, an image upload for the creative, a rendered preview
// box showing exactly what gets published, one-click downloads, and a save straight into the
// pipeline below.
function ContentStudioPanel({ onSave, saving }: { onSave: (draft: ContentDraft) => void; saving: boolean }) {
  const [topic, setTopic] = useState('')
  const [type, setType] = useState<(typeof STUDIO_TYPES)[number]>(STUDIO_TYPES[0])
  const [tone, setTone] = useState<(typeof STUDIO_TONES)[number]>(STUDIO_TONES[0])
  const [image, setImage] = useState<string | undefined>(undefined)
  const [imageName, setImageName] = useState('')
  const [draft, setDraft] = useState<ContentDraft | null>(null)
  const [thinking, setThinking] = useState(false)
  const [saved, setSaved] = useState(false)
  const generate = () => {
    setThinking(true)
    setSaved(false)
    window.setTimeout(() => {
      setDraft(generateContentDraft(topic, type, tone, image))
      setThinking(false)
    }, 500)
  }
  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImageName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : undefined
      setImage(result)
      setDraft((current) => current ? { ...current, image: result } : current)
    }
    reader.readAsDataURL(file)
  }
  const save = () => {
    if (!draft) return
    onSave(draft)
    setSaved(true)
  }
  return <div className="retail-app-studio-card">
    <div className="retail-app-panel-heading"><div><p>FoundAI</p><h2>Content studio</h2></div><span>AI-assisted drafting</span></div>
    <div className="retail-app-studio-form">
      <label>Topic or product<input onChange={(event) => setTopic(event.target.value)} placeholder="e.g. the new loyalty rewards tier" value={topic} /></label>
      <label>Format<select onChange={(event) => setType(event.target.value as (typeof STUDIO_TYPES)[number])} value={type}>{STUDIO_TYPES.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
      <label>Tone<select onChange={(event) => setTone(event.target.value as (typeof STUDIO_TONES)[number])} value={tone}>{STUDIO_TONES.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
      <button className="retail-app-primary" disabled={thinking} onClick={generate} type="button">{thinking ? 'Generating\u2026' : draft ? 'Regenerate with AI' : '\u2728 Generate with AI'}</button>
    </div>
    <label className="retail-app-studio-upload">
      <input accept="image/*" hidden onChange={upload} type="file" />
      <span>{'\u2B06\uFE0F'} {imageName || 'Upload image'}</span>
    </label>
    {draft ? <div className="retail-app-studio-layout">
      <div className="retail-app-studio-draft">
        <h3>{draft.headline}</h3>
        <p>{draft.body}</p>
        <div className="retail-app-studio-tags">{draft.hashtags.map((tag) => <span key={tag}>{tag}</span>)}<span className="retail-app-studio-cta">{draft.cta}</span></div>
        <div className="retail-app-studio-actions">
          <button className="retail-app-secondary" onClick={generate} type="button">{'\u21bb'} Try another version</button>
          <button className="retail-app-secondary" onClick={() => downloadTextFile(`${draft.headline.slice(0, 30).replace(/[^a-z0-9]+/gi, '-')}.txt`, `${draft.headline}\n\n${draft.body}\n\n${draft.hashtags.join(' ')}\n\n${draft.cta}`)} type="button">{'\u2B07\uFE0F'} Download text</button>
          {draft.image ? <button className="retail-app-secondary" onClick={() => downloadDataUrl(imageName || 'creative.png', draft.image!)} type="button">{'\u2B07\uFE0F'} Download image</button> : null}
          <button className="retail-app-primary" disabled={saving} onClick={save} type="button">{saved ? 'Saved \u2713' : 'Save draft to pipeline'}</button>
        </div>
      </div>
      <ContentPreviewCard body={draft.body} cta={draft.cta} hashtags={draft.hashtags} headline={draft.headline} image={draft.image} type={draft.type} />
    </div> : <p className="retail-app-studio-empty">Describe what you're promoting and FoundAI will draft the copy, hashtags, and a call to action — ready to send straight into the pipeline below.</p>}
  </div>
}

function isImageAttachment(dataUrl: string) {
  return dataUrl.startsWith('data:image/')
}

// The system-wide "where do I see this, and how do I get it in or out" box — every record in
// every module (board or directory) gets one, not just Content studio. Shows an image preview
// or a generic file chip when an attachment exists, with a one-click download, plus an
// upload/replace control that works the same way everywhere.
function AttachmentBox({ attachment, attachmentName, onUpload, onRemove }: { attachment?: string; attachmentName: string; onUpload: (file: File) => void; onRemove: () => void }) {
  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) onUpload(file)
  }
  return <div className="retail-app-attachment-box">
    <p className="retail-app-attachment-label">Attachment</p>
    {attachment ? <div className="retail-app-attachment-preview">
      {isImageAttachment(attachment) ? <img alt={attachmentName || 'Attachment'} className="retail-app-attachment-image" src={attachment} /> : <div className="retail-app-attachment-file"><span>{'\u{1F4CE}'}</span><small>{attachmentName || 'Attached file'}</small></div>}
      <div className="retail-app-attachment-actions">
        <button className="retail-app-secondary" onClick={() => downloadDataUrl(attachmentName || 'attachment', attachment)} type="button">{'\u2B07\uFE0F'} Download</button>
        <label className="retail-app-secondary retail-app-attachment-replace"><input hidden onChange={upload} type="file" /><span>Replace</span></label>
        <button className="retail-app-secondary" onClick={onRemove} type="button">Remove</button>
      </div>
    </div> : <label className="retail-app-attachment-upload"><input hidden onChange={upload} type="file" /><span>{'\u2B06\uFE0F'} Upload a file or image</span></label>}
  </div>
}

// A running history of activity on any record — stock counts, notes, deal progress. Generic and
// reused across inventory (stock take log) and sales pipeline (deal timeline) alike.
// Icon + tone shown for each activity kind — mirrors the Call/Email/Meeting/Task/Note timeline
// icons every mainstream CRM (HubSpot, Pipedrive, Close) uses so an operator can scan a
// record's history at a glance instead of reading every line.
const activityKinds = ['Note', 'Call', 'Email', 'Meeting', 'Task'] as const
const activityIcon: Record<string, string> = { Note: '📝', Call: '📞', Email: '✉️', Meeting: '📅', Task: '✅', Stage: '➡️' }
function ActivityLog({ entries, note, kind, onKindChange, onNoteChange, onAdd, placeholder }: { entries: Array<{ time: string; note: string; kind?: string }>; note: string; kind: string; onKindChange: (value: string) => void; onNoteChange: (value: string) => void; onAdd: () => void; placeholder: string }) {
  return <div className="retail-app-activity-log">
    <p className="retail-app-attachment-label">Activity</p>
    <div className="retail-app-activity-add">
      <select aria-label="Activity type" onChange={(event) => onKindChange(event.target.value)} value={kind}>{activityKinds.map((type) => <option key={type} value={type}>{activityIcon[type]} {type}</option>)}</select>
      <input onChange={(event) => onNoteChange(event.target.value)} onKeyDown={(event) => event.key === 'Enter' ? onAdd() : undefined} placeholder={placeholder} value={note} />
      <button className="retail-app-secondary" onClick={onAdd} type="button">Add</button>
    </div>
    {entries.length ? <ul className="retail-app-activity-list">{entries.slice(0, 6).map((entry, index) => <li key={`${entry.time}-${index}`}><span><i className="retail-app-activity-icon">{activityIcon[entry.kind ?? 'Note'] ?? '📝'}</i>{entry.note}</span><small>{entry.time}</small></li>)}</ul> : <p className="retail-app-activity-empty">No activity logged yet.</p>}
  </div>
}

// A dedicated stock-take control for the Inventory module: shows on-hand quantity against the
// reorder point with a visual gauge, and lets the team record a fresh physical count that
// updates stage (Low stock vs Available) and the audit log in one action.
function StockTakePanel({ record, count, onCountChange, onRecord }: { record: WorkspaceRecord; count: string; onCountChange: (value: string) => void; onRecord: () => void }) {
  const quantity = record.quantity ?? 0
  const reorderPoint = record.reorderPoint ?? 20
  const pct = Math.max(4, Math.min(100, Math.round((quantity / (reorderPoint * 3)) * 100)))
  const low = quantity <= reorderPoint
  return <div className="retail-app-stock-take" data-low={low}>
    <p className="retail-app-attachment-label">Stock take</p>
    <div className="retail-app-stock-take-gauge"><div className="retail-app-stock-take-bar"><i style={{ width: `${pct}%` }} /><b style={{ left: `${Math.min(96, Math.round((reorderPoint / (reorderPoint * 3)) * 100))}%` }} /></div><span>{quantity} on hand · reorder at {reorderPoint}</span></div>
    {low ? <p className="retail-app-stock-take-alert">{'\u26A0\uFE0F'} Below reorder point — raise a purchase order</p> : null}
    <div className="retail-app-stock-take-form"><input inputMode="numeric" onChange={(event) => onCountChange(event.target.value)} placeholder="New physical count" value={count} /><button className="retail-app-primary" onClick={onRecord} type="button">Record count</button></div>
  </div>
}

// Weighted revenue forecast for the sales pipeline: probability-weights each open deal by how
// far along the stage it's in (later stages count for more), so the number reflects likely
// close value, not just the raw sum of everything in the funnel.
function PipelineForecastBar({ statuses, records }: { statuses: string[]; records: WorkspaceRecord[] }) {
  const open = records.filter((record) => record.status !== statuses.at(-1))
  const total = open.reduce((sum, record) => sum + parseCurrency(record.value), 0)
  const weighted = open.reduce((sum, record) => {
    const stageIndex = statuses.indexOf(record.status)
    const probability = statuses.length > 1 ? (stageIndex + 1) / statuses.length : 1
    return sum + parseCurrency(record.value) * probability
  }, 0)
  const won = records.filter((record) => record.status === statuses.at(-1)).reduce((sum, record) => sum + parseCurrency(record.value), 0)
  return <div className="retail-app-forecast-bar">
    <div><strong>{formatCurrency(total)}</strong><span>Open pipeline</span></div>
    <div><strong>{formatCurrency(weighted)}</strong><span>Weighted forecast</span></div>
    <div><strong>{formatCurrency(won)}</strong><span>Won this period</span></div>
    <div><strong>{total ? Math.round((won / (total + won)) * 100) : 0}%</strong><span>Win rate</span></div>
  </div>
}

// A conversion funnel for any board module: shows how many records are at (or have passed)
// each stage, and the drop-off percentage stage-to-stage — the same shape recruiters/sales
// teams expect from a real funnel chart, generated purely from `statuses`/`records` so it works
// for every pipeline-shaped module (candidates, leads, orders, deliveries, and more) for free.
function ConversionFunnel({ statuses, records }: { statuses: string[]; records: WorkspaceRecord[] }) {
  const statusIndex = (status: string) => Math.max(0, statuses.indexOf(status))
  const stageCounts = statuses.map((status, index) => records.filter((record) => statusIndex(record.status) >= index).length)
  const top = stageCounts[0] || 1
  return <div className="retail-app-funnel">
    <div className="retail-app-panel-heading"><div><p>{statuses.at(-1)} conversion</p><h2>Funnel across {statuses.length} stages</h2></div></div>
    <div className="retail-app-funnel-rows">
      {statuses.map((status, index) => {
        const count = stageCounts[index]
        const previous = index > 0 ? stageCounts[index - 1] : count
        const dropOff = index > 0 && previous > 0 ? Math.round(((previous - count) / previous) * 100) : null
        return <div className="retail-app-funnel-row" key={status}>
          <span className="retail-app-funnel-label">{status}</span>
          <div className="retail-app-funnel-track"><i data-tone={boardTones[index % boardTones.length]} style={{ width: `${top ? (count / top) * 100 : 0}%` }} /></div>
          <span className="retail-app-funnel-count">{count}</span>
          {dropOff !== null ? <span className="retail-app-funnel-drop" data-high={dropOff >= 40}>{'\u2193'}{dropOff}%</span> : <span className="retail-app-funnel-drop" />}
        </div>
      })}
    </div>
  </div>
}

// A total-value-by-stage bar for any board module where records carry parseable currency
// values (orders, purchasing, invoices, bills, payments, quotes, billing) — skips itself when
// fewer than half the records have a numeric value, so it never shows a meaningless £0 bar for
// modules that use text priorities instead (e.g. "High priority").
function ValueByStageBar({ statuses, records }: { statuses: string[]; records: WorkspaceRecord[] }) {
  const numeric = records.filter((record) => parseCurrency(record.value) > 0)
  if (numeric.length < records.length / 2) return null
  const totals = statuses.map((status) => records.filter((record) => record.status === status).reduce((sum, record) => sum + parseCurrency(record.value), 0))
  const max = Math.max(...totals, 1)
  const grandTotal = totals.reduce((sum, value) => sum + value, 0)
  return <div className="retail-app-value-bar">
    <div className="retail-app-panel-heading"><div><p>Value</p><h2>{formatCurrency(grandTotal)} across {statuses.length} stages</h2></div></div>
    <div className="retail-app-value-columns">{statuses.map((status, index) => <div className="retail-app-value-column" key={status}>
      <div className="retail-app-value-column-track"><i data-tone={boardTones[index % boardTones.length]} style={{ height: `${(totals[index] / max) * 100}%` }} /></div>
      <strong>{formatCurrency(totals[index])}</strong>
      <span>{status}</span>
    </div>)}</div>
  </div>
}

// A Sage-style cash flow chart for Finance's Cash flow module — deterministic per-business bars
// (no randomness, so it stays hydration-safe) showing six recent periods of inflow vs outflow.
function CashFlowChart({ seed }: { seed: string }) {
  const periods = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  const rows = periods.map((label, index) => {
    const inflow = hashPercent(`${seed}-in-${index}`, 40, 96) * 180
    const outflow = hashPercent(`${seed}-out-${index}`, 30, 80) * 150
    return { label, inflow, outflow, net: inflow - outflow }
  })
  const max = Math.max(...rows.map((row) => Math.max(row.inflow, row.outflow)))
  const format = (value: number) => `£${Math.round(value).toLocaleString('en-GB')}`
  return <div className="retail-app-cashflow-chart">
    <div className="retail-app-panel-heading"><div><p>Money</p><h2>Cash flow, last 6 months</h2></div><div className="retail-app-cashflow-legend"><span><i data-tone="in" />Inflow</span><span><i data-tone="out" />Outflow</span></div></div>
    <div className="retail-app-cashflow-bars">{rows.map((row) => <div className="retail-app-cashflow-column" key={row.label}>
      <div className="retail-app-cashflow-pair">
        <i data-tone="in" style={{ height: `${(row.inflow / max) * 100}%` }} title={`Inflow ${format(row.inflow)}`} />
        <i data-tone="out" style={{ height: `${(row.outflow / max) * 100}%` }} title={`Outflow ${format(row.outflow)}`} />
      </div>
      <span>{row.label}</span>
      <small data-negative={row.net < 0}>{row.net >= 0 ? '+' : ''}{format(row.net)}</small>
    </div>)}</div>
  </div>
}

// A real product catalog grid for Retail's Products module — photo tile (or a colour-coded
// placeholder when there's no attachment), price, category tag, and a deterministic stock
// indicator, laid out as cards instead of the generic directory list every other module uses.
function ProductGridView({ records, selectedId, onSelect, checked, onToggle }: { records: WorkspaceRecord[]; selectedId?: string; onSelect: (id: string) => void; checked: string[]; onToggle: (id: string) => void }) {
  return <div className="retail-app-product-grid-card">
    <div className="retail-app-panel-heading"><div><p>Catalog</p><h2>{records.length} products</h2></div></div>
    <div className="retail-app-product-grid">
      {records.map((record) => {
        const stock = hashPercent(record.id, 5, 100)
        const low = stock < 25
        return <div className="retail-app-check-wrap" key={record.id}>
          <input aria-label={`Select ${record.name}`} checked={checked.includes(record.id)} className="retail-app-check" onChange={() => onToggle(record.id)} type="checkbox" />
          <button className={`retail-app-product-card${selectedId === record.id ? ' selected' : ''}`} onClick={() => onSelect(record.id)} type="button">
            {record.attachment ? <img alt="" className="retail-app-product-photo" src={record.attachment} /> : <div className="retail-app-product-photo placeholder">{initials(record.name)}</div>}
            <div className="retail-app-product-info">
              <strong>{record.name}</strong>
              <span className="retail-app-product-category">{record.secondary}</span>
              <div className="retail-app-product-foot"><b>{record.value}</b><em data-low={low}>{low ? 'Low stock' : 'In stock'} · {stock}</em></div>
            </div>
          </button>
        </div>
      })}
      {records.length === 0 ? <p className="retail-app-board-empty">No products match your search</p> : null}
    </div>
  </div>
}

// A budget-vs-actual bar for Finance's Budgets module — each category's spend against its
// allocated budget, rather than the generic directory list every other module uses.
function BudgetProgressPanel({ records }: { records: WorkspaceRecord[] }) {
  const rows = records.map((record) => {
    const actual = parseCurrency(record.value)
    const budget = actual > 0 ? actual * (1 + hashPercent(record.id, 5, 45) / 100) : hashPercent(record.id, 500, 5000)
    const pct = budget ? Math.min(100, Math.round((actual / budget) * 100)) : 0
    return { record, actual, budget, pct }
  })
  const totalBudget = rows.reduce((sum, row) => sum + row.budget, 0)
  const totalActual = rows.reduce((sum, row) => sum + row.actual, 0)
  return <div className="retail-app-budget-panel">
    <div className="retail-app-panel-heading"><div><p>Budgets</p><h2>{formatCurrency(totalActual)} of {formatCurrency(totalBudget)} spent</h2></div></div>
    <div className="retail-app-budget-rows">
      {rows.map(({ record, actual, budget, pct }) => <div className="retail-app-budget-row" key={record.id}>
        <span className="retail-app-budget-name">{record.name}</span>
        <div className="retail-app-budget-track"><i data-over={pct >= 100} style={{ width: `${pct}%` }} /></div>
        <span className="retail-app-budget-figures">{formatCurrency(actual)} / {formatCurrency(budget)}</span>
      </div>)}
      {rows.length === 0 ? <p className="retail-app-board-empty">No budget categories yet</p> : null}
    </div>
  </div>
}

// A production-run progress view for Retail's Production orders module — manufacturers need to
// see units produced against units ordered and which BOM a run is built from, not a generic
// funnel/value bar which doesn't make sense for a manufacturing run.
const productionStageProgress: Record<string, number> = { Planned: 0, 'In production': 55, 'Quality check': 90, Complete: 100 }
function ProductionOrderPanel({ record }: { record: WorkspaceRecord }) {
  const ordered = hashSpread(record.id, 40, 480)
  const pct = productionStageProgress[record.status] ?? 0
  const produced = Math.round((ordered * pct) / 100)
  const bomRef = `BOM-${100 + (hashSpread(record.id, 0, 40))}`
  return <div className="retail-app-production-panel">
    <p className="retail-app-attachment-label">Production run</p>
    <div className="retail-app-stock-take-gauge"><div className="retail-app-stock-take-bar"><i style={{ width: `${pct}%` }} /></div><span>{produced} of {ordered} units produced</span></div>
    <dl className="retail-app-crm-fields">
      <div><dt>Bill of materials</dt><dd><Link href="../boms">{bomRef} →</Link></dd></div>
      <div><dt>Stage</dt><dd>{record.status}</dd></div>
      <div><dt>Owner</dt><dd>{record.owner}</dd></div>
    </dl>
  </div>
}

// A materials/cost breakdown for Retail's Bills of materials module — manufacturers need to see
// what components make up a build and the rolled-up unit cost, not the generic directory metric.
const bomComponentNames = ['Raw material A', 'Sub-assembly B', 'Fastener kit', 'Packaging unit', 'Finishing material']
function BOMComponentsPanel({ record }: { record: WorkspaceRecord }) {
  const componentCount = 2 + (hashSpread(record.id, 0, 3))
  const components = Array.from({ length: componentCount }, (_, index) => {
    const name = bomComponentNames[(hashSpread(`${record.id}-${index}`, 0, bomComponentNames.length))]
    const qty = 1 + hashSpread(`${record.id}-qty-${index}`, 0, 12)
    const unitCost = 1 + hashSpread(`${record.id}-cost-${index}`, 0, 40)
    return { name, qty, unitCost, lineCost: qty * unitCost }
  })
  const totalCost = components.reduce((sum, row) => sum + row.lineCost, 0)
  return <div className="retail-app-bom-panel">
    <p className="retail-app-attachment-label">Bill of materials</p>
    <div className="retail-app-bom-rows">
      {components.map((row, index) => <div className="retail-app-bom-row" key={`${row.name}-${index}`}>
        <span className="retail-app-bom-name">{row.name}</span>
        <span className="retail-app-bom-qty">×{row.qty}</span>
        <span className="retail-app-bom-cost">{formatCurrency(row.lineCost)}</span>
      </div>)}
    </div>
    <div className="retail-app-bom-total"><span>Total build cost</span><b>{formatCurrency(totalCost)}</b></div>
  </div>
}

// A Sage/Xero-style aging summary for Finance's Invoices module — a real accounts-receivable
// view (current / 30 / 60 / 90+ buckets, worst-offender list) instead of a generic value bar,
// which is what any professional finance team expects to see first.
const invoiceAgingBuckets = ['Current', '1-30 days', '31-60 days', '61-90 days', '90+ days'] as const
function InvoiceAgingPanel({ records }: { records: WorkspaceRecord[] }) {
  const rows = records.filter((record) => record.status !== 'Paid').map((record) => {
    const daysOverdue = hashSpread(`${record.id}-aging`, 0, 120)
    const bucket = daysOverdue === 0 ? invoiceAgingBuckets[0] : daysOverdue <= 30 ? invoiceAgingBuckets[1] : daysOverdue <= 60 ? invoiceAgingBuckets[2] : daysOverdue <= 90 ? invoiceAgingBuckets[3] : invoiceAgingBuckets[4]
    return { record, daysOverdue, bucket, amount: parseCurrency(record.value) }
  })
  const totals = invoiceAgingBuckets.map((bucket) => ({ bucket, amount: rows.filter((row) => row.bucket === bucket).reduce((sum, row) => sum + row.amount, 0) }))
  const totalOutstanding = totals.reduce((sum, row) => sum + row.amount, 0)
  const maxBucket = Math.max(1, ...totals.map((row) => row.amount))
  const worst = [...rows].sort((a, b) => b.daysOverdue - a.daysOverdue).slice(0, 3)
  return <div className="retail-app-invoice-aging-panel">
    <div className="retail-app-panel-heading"><div><p>Accounts receivable</p><h2>{formatCurrency(totalOutstanding)} outstanding</h2></div></div>
    <div className="retail-app-aging-chart">
      {totals.map(({ bucket, amount }) => <div className="retail-app-aging-col" data-risk={bucket === '61-90 days' || bucket === '90+ days'} key={bucket}>
        <div className="retail-app-aging-bar" style={{ height: `${Math.max(6, Math.round((amount / maxBucket) * 100))}px` }} />
        <b>{formatCurrency(amount)}</b>
        <span>{bucket}</span>
      </div>)}
    </div>
    {worst.length > 0 ? <div className="retail-app-aging-worst">
      <p className="retail-app-attachment-label">Most overdue</p>
      {worst.map(({ record, daysOverdue, amount }) => <div className="retail-app-aging-worst-row" key={record.id}>
        <span>{record.name}</span>
        <i data-risk={daysOverdue > 60}>{daysOverdue}d overdue</i>
        <b>{formatCurrency(amount)}</b>
      </div>)}
    </div> : null}
  </div>
}

// A recruiting-profile card for Talent's Candidates module — role applied for, years of
// experience, source channel, and a stage-progress rail, the depth a real ATS candidate
// record needs instead of the generic name/value/owner fields every module gets.
const candidateRoles = ['Senior operator', 'Warehouse lead', 'Account manager', 'Support specialist', 'Finance analyst']
const candidateSources = ['Referral', 'LinkedIn', 'Job board', 'Careers page', 'Agency']
function CandidateProfilePanel({ record, statuses }: { record: WorkspaceRecord; statuses: string[] }) {
  const role = candidateRoles[hashSpread(record.id, 0, candidateRoles.length)]
  const source = candidateSources[hashSpread(`${record.id}-src`, 0, candidateSources.length)]
  const experience = 1 + hashSpread(`${record.id}-exp`, 0, 11)
  const currentIndex = Math.max(0, statuses.indexOf(record.status))
  return <div className="retail-app-candidate-panel">
    <p className="retail-app-attachment-label">Candidate profile</p>
    <dl className="retail-app-crm-fields">
      <div><dt>Applying for</dt><dd>{role}</dd></div>
      <div><dt>Experience</dt><dd>{experience} years</dd></div>
      <div><dt>Source</dt><dd>{source}</dd></div>
    </dl>
    <div className="retail-app-candidate-rail">{statuses.map((status, index) => <span data-state={index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'pending'} key={status}>{status}</span>)}</div>
  </div>
}

// A clinical patient snapshot for Health's Patients module — last visit, next appointment, and
// allergy flags, the at-a-glance clinical context a directory record on its own can't show.
const patientAllergies = ['No known allergies', 'Penicillin allergy', 'Latex allergy', 'Nut allergy', 'Seasonal pollen allergy']
// A per-campaign performance breakdown for Marketing's Campaigns module — channel mix,
// reach/CTR/ROAS, deterministically derived from the record id and its budget (value) so the
// numbers stay stable between renders without needing extra backend fields.
const campaignChannels = ['Email', 'WhatsApp', 'Paid social', 'Organic social']
function CampaignPerformancePanel({ record }: { record: WorkspaceRecord }) {
  const budget = parseCurrency(record.value) || hashSpread(record.id, 400, 4000)
  const reach = hashSpread(`${record.id}-reach`, 1200, 26000)
  const ctr = (hashPercent(`${record.id}-ctr`, 18, 62) / 10).toFixed(1)
  const roas = (hashPercent(`${record.id}-roas`, 180, 620) / 100).toFixed(1)
  const spend = campaignChannels.map((channel, index) => ({ channel, pct: hashPercent(`${record.id}-${channel}`, 8, 46 - index * 3) }))
  const total = spend.reduce((sum, row) => sum + row.pct, 0) || 1
  return <div className="retail-app-patient-panel">
    <p className="retail-app-attachment-label">Campaign performance</p>
    <dl className="retail-app-crm-fields">
      <div><dt>Reach</dt><dd>{reach.toLocaleString('en-GB')}</dd></div>
      <div><dt>Click-through rate</dt><dd>{ctr}%</dd></div>
      <div><dt>Return on ad spend</dt><dd>{roas}x</dd></div>
      <div><dt>Budget</dt><dd>{formatCurrency(budget)}</dd></div>
    </dl>
    <p className="retail-app-attachment-label">Channel mix</p>
    <div className="retail-app-channel-mix">
      {spend.map((row) => <div className="retail-app-channel-mix-row" key={row.channel}>
        <span>{row.channel}</span>
        <div className="retail-app-channel-mix-bar"><i style={{ width: `${Math.round((row.pct / total) * 100)}%` }} /></div>
        <b>{Math.round((row.pct / total) * 100)}%</b>
      </div>)}
    </div>
  </div>
}

function PatientSnapshotPanel({ record }: { record: WorkspaceRecord }) {
  const allergy = patientAllergies[hashSpread(record.id, 0, patientAllergies.length)]
  const daysSinceVisit = 1 + hashSpread(`${record.id}-visit`, 0, 89)
  const daysToNext = hashSpread(`${record.id}-next`, 2, 45)
  return <div className="retail-app-patient-panel">
    <p className="retail-app-attachment-label">Patient snapshot</p>
    <dl className="retail-app-crm-fields">
      <div><dt>Last visit</dt><dd>{daysSinceVisit} days ago</dd></div>
      <div><dt>Next appointment</dt><dd>in {daysToNext} days</dd></div>
      <div><dt>Allergies</dt><dd data-alert={allergy !== 'No known allergies'}>{allergy}</dd></div>
    </dl>
  </div>
}

// A ranked review-score panel for Talent's Performance module — a real ranking with score bars,
// not a generic Kanban funnel (which doesn't make sense for one-off reviews). Score is hashed
// deterministically from the record id so it's stable between renders.
function PerformanceScorePanel({ records }: { records: WorkspaceRecord[] }) {
  const ranked = [...records].map((record) => ({ record, score: hashPercent(record.id, 52, 98) })).sort((a, b) => b.score - a.score)
  const avg = ranked.length ? Math.round(ranked.reduce((total, row) => total + row.score, 0) / ranked.length) : 0
  return <div className="retail-app-performance-panel">
    <div className="retail-app-panel-heading"><div><p>Reviews</p><h2>{avg}% average score</h2></div><span>{ranked.length} people reviewed</span></div>
    <div className="retail-app-performance-rows">
      {ranked.map(({ record, score }, index) => <div className="retail-app-performance-row" key={record.id}>
        <span className="retail-app-performance-rank">{index + 1}</span>
        <span className="retail-app-performance-name">{record.name}</span>
        <div className="retail-app-performance-track"><i data-tone={score >= 85 ? 'done' : score >= 65 ? 'info' : 'warn'} style={{ width: `${score}%` }} /></div>
        <span className="retail-app-performance-score">{score}%</span>
      </div>)}
      {ranked.length === 0 ? <p className="retail-app-board-empty">No reviews logged yet</p> : null}
    </div>
  </div>
}

// A payroll-run summary for Talent's Payroll module — total run cost, headcount, average pay,
// and cost split by stage, the numbers a payroll manager actually needs at a glance.
function PayrollSummaryPanel({ statuses, records }: { statuses: string[]; records: WorkspaceRecord[] }) {
  const total = records.reduce((sum, record) => sum + parseCurrency(record.value), 0)
  const paid = records.filter((record) => record.status === statuses.at(-1)).reduce((sum, record) => sum + parseCurrency(record.value), 0)
  const avg = records.length ? total / records.length : 0
  return <div className="retail-app-payroll-summary">
    <div><strong>{formatCurrency(total)}</strong><span>Total run cost</span></div>
    <div><strong>{records.length}</strong><span>Headcount</span></div>
    <div><strong>{formatCurrency(avg)}</strong><span>Average pay</span></div>
    <div><strong>{formatCurrency(paid)}</strong><span>{statuses.at(-1)} so far</span></div>
  </div>
}

// A real contact profile for Retail's CRM module — synthesized (but deterministic) email,
// phone, company, lead score, and a "next best action" reminder, plus one-tap quick-log buttons
// for calls/emails/meetings that write straight into the activity log — the depth a real CRM
// contact record needs instead of the generic name/value/owner fields every module gets.
function crmSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '')
}
const crmNextActions = ['Send a follow-up email', 'Book a discovery call', 'Share pricing options', 'Confirm renewal date', 'Introduce to account manager']
function CRMContactPanel({ record, records, statuses, onLog }: { record: WorkspaceRecord; records: WorkspaceRecord[]; statuses: string[]; onLog: (note: string) => void }) {
  const slug = crmSlug(record.name)
  const hash = [...record.id].reduce((total, char) => total + char.charCodeAt(0), 0)
  const email = `${slug || 'contact'}@${slug ? slug.split('.')[0] : 'customer'}.com`
  const phone = `+44 7${String(100000000 + (hash * 137) % 899999999).slice(0, 9)}`
  const { score, tier, factors } = computeLeadScore(record, statuses, records)
  const nextAction = crmNextActions[hash % crmNextActions.length]
  return <div className="retail-app-crm-panel">
    <p className="retail-app-attachment-label">Contact profile</p>
    <dl className="retail-app-crm-fields">
      <div><dt>Email</dt><dd><a href={`mailto:${email}`}>{email}</a></dd></div>
      <div><dt>Phone</dt><dd><a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a></dd></div>
      <div><dt>Company</dt><dd>{record.secondary}</dd></div>
    </dl>
    <div className="retail-app-crm-score">
      <div className="retail-app-stock-take-gauge"><div className="retail-app-stock-take-bar"><i style={{ width: `${score}%` }} /></div><span>Lead score: {score}% · <b data-tone={tier === 'Hot' ? 'danger' : tier === 'Warm' ? 'warn' : 'info'}>{tier === 'Hot' ? '🔥' : tier === 'Warm' ? '🌤️' : '❄️'} {tier}</b></span></div>
      <ul className="retail-app-crm-score-factors">{factors.map((factor) => <li key={factor}>{factor}</li>)}</ul>
    </div>
    <div className="retail-app-crm-next"><b>Next best action</b><p>{nextAction}</p></div>
    <div className="retail-app-crm-quick-actions">
      <button onClick={() => onLog(`Logged a call with ${record.name}`)} type="button">📞 Log call</button>
      <button onClick={() => onLog(`Sent an email to ${record.name}`)} type="button">✉️ Log email</button>
      <button onClick={() => onLog(`Booked a meeting with ${record.name}`)} type="button">📅 Log meeting</button>
    </div>
  </div>
}

// Inline clinical-guidance advice for Health's Care plans module — a deterministic protocol
// recommendation plus links to the fuller clinical guideline doc, right next to the record so
// staff never have to leave the workspace to check what to do next.
const careProtocols = [
  { title: 'Chronic condition review protocol', advice: 'Review medication adherence and schedule a check-in within 14 days.', doc: 'Chronic Care Management Guideline v3' },
  { title: 'Post-discharge follow-up protocol', advice: 'Confirm the patient has a follow-up appointment booked within 7 days of discharge.', doc: 'Post-Discharge Follow-Up Guideline v2' },
  { title: 'New patient intake protocol', advice: 'Complete a full baseline assessment and confirm consent forms are on file.', doc: 'New Patient Intake Standard v4' },
  { title: 'Escalation protocol', advice: 'If symptoms have worsened since the last review, escalate to the on-call practitioner today.', doc: 'Clinical Escalation Pathway v1' },
]
function CareGuidancePanel({ record }: { record: WorkspaceRecord }) {
  const hash = [...record.id].reduce((total, char) => total + char.charCodeAt(0), 0)
  const protocol = careProtocols[hash % careProtocols.length]
  return <div className="retail-app-care-guidance">
    <p className="retail-app-attachment-label">Clinical guidance</p>
    <div className="retail-app-care-guidance-card">
      <b>{protocol.title}</b>
      <p>{protocol.advice}</p>
      <Link href="../compliance">📄 Read: {protocol.doc} →</Link>
    </div>
  </div>
}

// A per-hire onboarding checklist for Talent's Onboarding module — deterministic checklist
// items derived from the record id so completion state is stable, with a progress bar the
// same shape as the Inventory stock-take gauge.
const onboardingTasks = ['Contract signed', 'Equipment issued', 'System access granted', 'Team introductions', 'First-week training']
function OnboardingChecklistPanel({ record }: { record: WorkspaceRecord }) {
  const doneCount = 1 + ([...record.id].reduce((total, char) => total + char.charCodeAt(0), 0) % onboardingTasks.length)
  const pct = Math.round((doneCount / onboardingTasks.length) * 100)
  return <div className="retail-app-onboarding-checklist">
    <p className="retail-app-attachment-label">Onboarding checklist</p>
    <div className="retail-app-stock-take-gauge"><div className="retail-app-stock-take-bar"><i style={{ width: `${pct}%` }} /></div><span>{doneCount} of {onboardingTasks.length} complete</span></div>
    <ul>{onboardingTasks.map((task, index) => <li data-done={index < doneCount} key={task}><span>{index < doneCount ? '✓' : '○'}</span>{task}</li>)}</ul>
  </div>
}

// A live-tracking style map for Logistics: deterministic pin positions and status per record so
// the team gets an at-a-glance visual of where every delivery is and whether it's on time.
function DeliveryMapPanel({ records, selectedId, onSelect }: { records: WorkspaceRecord[]; selectedId?: string; onSelect: (id: string) => void }) {
  const tones = ['on-time', 'delayed', 'at-risk'] as const
  return <div className="retail-app-map-panel">
    <div className="retail-app-panel-heading"><div><p>Delivery</p><h2>Live tracking map</h2></div></div>
    <div className="retail-app-map-canvas">
      <svg height="220" role="presentation" viewBox="0 0 400 220" width="100%">
        <rect fill="#eef3f8" height="220" width="400" />
        <path d="M0 60 H400 M0 140 H400 M90 0 V220 M280 0 V220" stroke="#d8e1ea" strokeWidth="2" />
        {records.map((record) => {
          const x = hashSpread(`${record.id}-x`, 20, 380)
          const y = hashSpread(`${record.id}-y`, 20, 200)
          const tone = tones[hashSpread(record.id, 0, 3)]
          return <g cursor="pointer" key={record.id} onClick={() => onSelect(record.id)} transform={`translate(${x} ${y})`}>
            <circle fill={tone === 'on-time' ? '#22c55e' : tone === 'delayed' ? '#ffb33e' : '#ff496e'} r={record.id === selectedId ? 9 : 6} stroke="#fff" strokeWidth="2" />
          </g>
        })}
      </svg>
    </div>
    <div className="retail-app-map-legend"><span><i data-tone="on-time" />On time</span><span><i data-tone="delayed" />Delayed</span><span><i data-tone="at-risk" />At risk</span></div>
  </div>
}

// Locational mapping for Talent's Candidates module — plots every candidate on a simplified
// UK map by their (deterministic) home city, colour-coded by pipeline stage, with a
// city/radius filter and click-to-select pins. This is the "Gridmate"-style spatial view
// recruiters use to see where talent pools are concentrated and plan in-person interviews or
// office/remote coverage by geography, not just a flat list of applicants.
const talentCities: Array<{ name: string; x: number; y: number }> = [
  { name: 'London', x: 280, y: 178 },
  { name: 'Manchester', x: 220, y: 100 },
  { name: 'Birmingham', x: 235, y: 132 },
  { name: 'Leeds', x: 232, y: 84 },
  { name: 'Bristol', x: 178, y: 152 },
  { name: 'Glasgow', x: 178, y: 30 },
  { name: 'Edinburgh', x: 208, y: 28 },
  { name: 'Liverpool', x: 205, y: 100 },
]
const candidateCity = (id: string) => talentCities[hashSpread(id, 0, talentCities.length)]
const boardToneColor: Record<(typeof boardTones)[number], string> = { neutral: '#94a3b8', info: '#3b82f6', warn: '#f59e0b', done: '#22c55e' }
function TalentLocationMapPanel({ records, statuses, selectedId, onSelect, cityFilter, onCityFilterChange }: { records: WorkspaceRecord[]; statuses: string[]; selectedId?: string; onSelect: (id: string) => void; cityFilter: string; onCityFilterChange: (city: string) => void }) {
  const citiesInUse = talentCities.filter((city) => records.some((record) => candidateCity(record.id).name === city.name))
  return <div className="retail-app-map-panel retail-app-location-map">
    <div className="retail-app-panel-heading">
      <div><p>Recruiting</p><h2>Candidate location map</h2></div>
      <select aria-label="Filter candidates by city" onChange={(event) => onCityFilterChange(event.target.value)} value={cityFilter}>
        <option value="all">All locations</option>
        {citiesInUse.map((city) => <option key={city.name} value={city.name}>{city.name}</option>)}
      </select>
    </div>
    <div className="retail-app-map-canvas">
      <svg height="220" role="presentation" viewBox="0 0 400 220" width="100%">
        <rect fill="#eef3f8" height="220" width="400" />
        {talentCities.map((city) => <text fill="#9aa6b8" fontSize="9" key={city.name} x={city.x + 8} y={city.y + 3}>{city.name}</text>)}
        {records.map((record) => {
          const city = candidateCity(record.id)
          const jitterX = hashSpread(`${record.id}-jx`, -14, 14)
          const jitterY = hashSpread(`${record.id}-jy`, -14, 14)
          const stageIndex = Math.max(0, statuses.indexOf(record.status))
          const tone = boardTones[stageIndex % boardTones.length]
          return <g cursor="pointer" key={record.id} onClick={() => onSelect(record.id)} transform={`translate(${city.x + jitterX} ${city.y + jitterY})`}>
            <circle fill={boardToneColor[tone]} r={record.id === selectedId ? 9 : 6} stroke="#fff" strokeWidth="2" />
          </g>
        })}
      </svg>
    </div>
    <div className="retail-app-map-legend">{statuses.map((status, index) => <span key={status}><i data-tone={boardTones[index % boardTones.length]} />{status}</span>)}</div>
  </div>
}

function RecordsPage({ workspace, config, item, state, createRecord, advanceRecord, attachRecord, adjustStock, logNote, updateRecord, bulkAdvance, publishHandoff }: { workspace: BusinessWorkspaceSlug; config: WorkspaceConfig; item: WorkspaceModule; state: WorkspaceState; createRecord: (module: string, record: WorkspaceRecord) => Promise<WorkspaceRecord>; advanceRecord: (module: string, record: WorkspaceRecord, status: string) => Promise<void>; attachRecord: (module: string, record: WorkspaceRecord, attachment: string | undefined, attachmentName: string) => void; adjustStock: (module: string, record: WorkspaceRecord, quantity: number, note: string) => void; logNote: (module: string, record: WorkspaceRecord, note: string, kind?: string) => void; updateRecord: (module: string, record: WorkspaceRecord, patch: Partial<Pick<WorkspaceRecord, 'name' | 'secondary' | 'value' | 'owner' | 'dueDate'>>) => Promise<void>; bulkAdvance: (module: string, records: WorkspaceRecord[], status: string) => Promise<void>; publishHandoff: (module: string, record: WorkspaceRecord, target: BusinessWorkspaceSlug) => Promise<void> }) {
  const records = state.records[item.id] ?? []
  const statuses = statusFor(item)
  const [sourceOpen, setSourceOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(records[0]?.id)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [stockCount, setStockCount] = useState('')
  const [noteText, setNoteText] = useState('')
  const [noteKind, setNoteKind] = useState('Note')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'value' | 'owner' | 'score'>('default')
  const [checkedIds, setCheckedIds] = useState<string[]>([])
  const [boardView, setBoardView] = useState<'kanban' | 'list'>('kanban')
  const [editing, setEditing] = useState(false)
  const [editDraft, setEditDraft] = useState({ name: '', secondary: '', value: '', owner: '' })
  const [dragRecordId, setDragRecordId] = useState<string | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null)
  const savedViewsKey = `founding-os:${workspace}:${item.id}:views`
  const [savedViews, setSavedViews] = useState<Array<{ name: string; query: string; statusFilter: string; sortBy: string }>>([])
  const [viewName, setViewName] = useState('')
  useEffect(() => {
    const stored = window.localStorage.getItem(savedViewsKey)
    setSavedViews(stored ? JSON.parse(stored) as Array<{ name: string; query: string; statusFilter: string; sortBy: string }> : [])
    // Reset transient view-builder state when switching modules so it doesn't leak across pages.
    setViewName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedViewsKey])
  const saveCurrentView = () => {
    const name = viewName.trim()
    if (!name) return
    const next = [...savedViews.filter((view) => view.name !== name), { name, query, statusFilter, sortBy }]
    setSavedViews(next)
    window.localStorage.setItem(savedViewsKey, JSON.stringify(next))
    setViewName('')
  }
  const applyView = (name: string) => {
    const view = savedViews.find((candidate) => candidate.name === name)
    if (!view) return
    setQuery(view.query)
    setStatusFilter(view.statusFilter)
    setSortBy(view.sortBy as typeof sortBy)
  }
  const removeView = (name: string) => {
    const next = savedViews.filter((view) => view.name !== name)
    setSavedViews(next)
    window.localStorage.setItem(savedViewsKey, JSON.stringify(next))
  }
  const dropOnStage = async (status: string) => {
    const record = records.find((candidate) => candidate.id === dragRecordId)
    setDragRecordId(null)
    setDragOverStatus(null)
    if (!record || record.status === status) return
    setSaving(true)
    try {
      await advanceRecord(item.id, record, status)
    } finally {
      setSaving(false)
    }
  }
  const matched = records.filter((record) => `${record.id} ${record.name} ${record.secondary} ${record.status}`.toLowerCase().includes(query.toLowerCase()) && (statusFilter === 'all' || record.status === statusFilter) && (cityFilter === 'all' || candidateCity(record.id).name === cityFilter))
  const visible = sortBy === 'default'
    ? matched
    : sortBy === 'score'
      ? [...matched].sort((a, b) => computeLeadScore(b, statuses, records).score - computeLeadScore(a, statuses, records).score)
      : [...matched].sort((a, b) => sortBy === 'value' ? parseCurrency(b.value) - parseCurrency(a.value) : String(a[sortBy]).localeCompare(String(b[sortBy])))
  const selected = records.find((record) => record.id === selectedId) ?? records[0]
  const checked = checkedIds.filter((id) => visible.some((record) => record.id === id))
  const toggleChecked = (id: string) => setCheckedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const bulkAdvanceSelected = async () => {
    const targets = visible.filter((record) => checked.includes(record.id) && record.status !== statuses.at(-1))
    if (targets.length === 0) return
    setSaving(true)
    try {
      await Promise.all(targets.map((record) => bulkAdvance(item.id, [record], statuses[Math.min(statuses.indexOf(record.status) + 1, statuses.length - 1)])))
      setCheckedIds([])
    } finally {
      setSaving(false)
    }
  }
  const exportCsv = (rows: WorkspaceRecord[]) => {
    const header = ['ID', 'Name', 'Detail', 'Value', 'Status', 'Owner', 'Updated']
    const lines = rows.map((record) => [record.id, record.name, record.secondary, record.value, record.status, record.owner, record.updated].map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
    downloadTextFile(`${item.id}-export.csv`, [header.join(','), ...lines].join('\n'))
  }
  const startEdit = () => {
    if (!selected) return
    setEditDraft({ name: selected.name, secondary: selected.secondary, value: selected.value, owner: selected.owner })
    setEditing(true)
  }
  const saveEdit = async () => {
    if (!selected) return
    setSaving(true)
    setError('')
    try {
      await updateRecord(item.id, selected, editDraft)
      setEditing(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Record could not be updated')
    } finally {
      setSaving(false)
    }
  }
  const recordStock = () => {
    if (!selected) return
    const quantity = Number(stockCount)
    if (!Number.isFinite(quantity) || quantity < 0) return
    adjustStock(item.id, selected, quantity, `Stock take: counted ${quantity} units (was ${selected.quantity ?? 0})`)
    setStockCount('')
  }
  const addNote = () => {
    if (!selected || !noteText.trim()) return
    logNote(item.id, selected, noteText.trim(), noteKind)
    setNoteText('')
  }
  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const file = form.get('attachment') as File | null
    const attachment = file && file.size > 0 ? await readFileAsDataUrl(file) : undefined
    const record: WorkspaceRecord = { id: `${item.id.slice(0, 3).toUpperCase()}-${100 + records.length + 1}`, name: String(form.get('name')), secondary: String(form.get('secondary')), value: String(form.get('value')), status: statuses[0], owner: String(form.get('owner')), updated: 'Now', attachment, attachmentName: file?.name }
    try {
      const created = await createRecord(item.id, record)
      setSelectedId(created.id)
      setCreating(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Record could not be created')
    } finally {
      setSaving(false)
    }
  }
  const advance = async () => {
    if (!selected) return
    const next = statuses[Math.min(statuses.indexOf(selected.status) + 1, statuses.length - 1)]
    setSaving(true)
    setError('')
    try {
      await advanceRecord(item.id, selected, next)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Record could not be updated')
    } finally {
      setSaving(false)
    }
  }
  const saveContentDraft = async (draft: ContentDraft) => {
    setSaving(true)
    setError('')
    const record: WorkspaceRecord = { id: `${item.id.slice(0, 3).toUpperCase()}-${100 + records.length + 1}`, name: draft.headline, secondary: `${draft.type} \u00b7 ${draft.body}`, value: draft.cta, status: statuses[0], owner: 'You', updated: 'Just now', attachment: draft.image }
    try {
      const created = await createRecord(item.id, record)
      setSelectedId(created.id)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Draft could not be saved')
    } finally {
      setSaving(false)
    }
  }
  const collectPayment = async () => {
    if (!selected?.backendId) return
    setSaving(true)
    setError('')
    try {
      const checkout = await productionRequest<{ url: string }>('/platform/payments/checkout', {
        method: 'POST',
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify({ workspace, recordId: selected.backendId, currency: 'GBP' }),
      })
      window.location.assign(checkout.url)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Stripe Checkout could not be created')
      setSaving(false)
    }
  }
  const handoffTarget = workspaceOrder[(workspaceOrder.indexOf(workspace) + 1) % workspaceOrder.length]
  const selectRecord = (id: string) => {
    setSelectedId(id)
    setSourceOpen(false)
    setEditing(false)
  }
  const origin = selected ? recordOrigin(selected, config) : null
  const isDirectory = !item.statuses
  const isCalendar = item.id === 'calendar' || item.id === 'interviews' || item.id === 'appointments'
  const isInbox = item.id === 'inbox' || item.id.endsWith('-inbox')
  const isContentStudio = item.id === 'content'
  const isInventory = item.id === 'inventory'
  const isSalesPipeline = item.id === 'sales-pipeline'
  const isCashflow = item.id === 'cashflow'
  const isTracking = item.id === 'tracking'
  const isPerformance = item.id === 'performance'
  const isPayroll = item.id === 'payroll'
  const isOnboarding = item.id === 'onboarding'
  const isBudgets = item.id === 'budgets'
  const isProducts = item.id === 'products'
  const isCRM = item.id === 'crm'
  const isCarePlans = item.id === 'care-plans'
  const isProductionOrders = item.id === 'production-orders'
  const isBOM = item.id === 'boms'
  const isInvoices = item.id === 'invoices'
  const isCandidates = item.id === 'candidates'
  const isPatients = item.id === 'patients'
  const isCampaigns = item.id === 'campaigns'
  const metricLabel = directoryMetricLabel(item.group)
  return <>
    <WorkspaceHeading eyebrow={`${config.suite} · ${item.group}`} title={item.label} copy={isInbox ? `Every conversation for ${config.label.toLowerCase()} in one inbox — open a message to read the full thread and reply.` : isCalendar ? `See every scheduled ${item.label.toLowerCase()} entry laid out by day, and click through to its details.` : isContentStudio ? `Brief FoundAI on what you're promoting and it will draft the copy — then send it straight into the pipeline below.` : isDirectory ? `Browse every ${item.label.toLowerCase()} record with health, owner, and connected handoff.` : `Manage every ${item.label.toLowerCase()} record, owner, stage, activity, and connected handoff.`} action={<button className="retail-app-primary" onClick={() => setCreating(true)} type="button">+ New record</button>} />
    {isContentStudio ? <ContentStudioPanel onSave={(draft) => void saveContentDraft(draft)} saving={saving} /> : null}
    {!isDirectory && !isInbox ? <div className="complete-workspace-stage-summary">{statuses.map((status) => <article key={status}><strong>{records.filter((record) => record.status === status).length}</strong><span>{status}</span></article>)}</div> : null}
    {isSalesPipeline && records.length > 0 ? <PipelineForecastBar records={records} statuses={statuses} /> : null}
    {isCashflow ? <CashFlowChart seed={`${workspace}-${config.subjects[0]}`} /> : null}
    {isTracking && records.length > 0 ? <DeliveryMapPanel onSelect={selectRecord} records={records} selectedId={selected?.id} /> : null}
    {isCandidates && records.length > 0 ? <TalentLocationMapPanel cityFilter={cityFilter} onCityFilterChange={setCityFilter} onSelect={selectRecord} records={records} selectedId={selected?.id} statuses={statuses} /> : null}
    {isPayroll && records.length > 0 ? <PayrollSummaryPanel records={records} statuses={statuses} /> : null}
    {isPerformance && records.length > 0 ? <PerformanceScorePanel records={records} /> : null}
    {isBudgets && records.length > 0 ? <BudgetProgressPanel records={records} /> : null}
    {isInvoices && records.length > 0 ? <InvoiceAgingPanel records={records} /> : null}
    {!isDirectory && !isInbox && !isCalendar && !isContentStudio && !isSalesPipeline && !isInventory && !isPerformance && records.length > 0 ? <ValueByStageBar records={records} statuses={statuses} /> : null}
    {!isDirectory && !isInbox && !isCalendar && !isContentStudio && !isSalesPipeline && !isInventory && !isPerformance && records.length > 0 ? <ConversionFunnel records={records} statuses={statuses} /> : null}
    {!isInbox && !isCalendar && !isPerformance && !isBudgets && !isProducts && records.length > 0 ? (isDirectory ? <DirectoryKPIBar metricLabel={metricLabel} records={records} /> : <PipelineKPIBar records={records} statuses={statuses} />) : null}
    {!isInbox ? <div className="retail-app-toolbar">
      <input aria-label={`Search ${item.label}`} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${item.label.toLowerCase()}`} value={query} />
      {!isDirectory && !isCalendar ? <select aria-label={`Filter ${item.label} by status`} onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option value="all">All stages</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select> : null}
      <select aria-label={`Sort ${item.label}`} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} value={sortBy}><option value="default">Sort: default</option><option value="name">Sort: name A–Z</option><option value="value">Sort: value high–low</option><option value="owner">Sort: owner A–Z</option>{item.id === 'crm' ? <option value="score">Sort: lead score high–low</option> : null}</select>
      {!isDirectory && !isCalendar && !isProducts ? <div className="retail-app-view-toggle" role="group">
        <button aria-pressed={boardView === 'kanban'} onClick={() => setBoardView('kanban')} type="button">▦ Board</button>
        <button aria-pressed={boardView === 'list'} onClick={() => setBoardView('list')} type="button">☰ List</button>
      </div> : null}
      <span className="retail-app-record-count">{visible.length} matching</span>
      <button onClick={() => exportCsv(visible)} type="button">Export CSV</button>
      <button onClick={() => window.print()} type="button">Print</button>
      {item.id === 'crm' ? <button onClick={() => setCheckedIds(visible.filter((record) => computeLeadScore(record, statuses, records).tier === 'Hot').map((record) => record.id))} type="button">🔥 Select hot leads</button> : null}
    </div> : null}
    {!isInbox && !isCalendar ? <div className="retail-app-views-bar">
      {savedViews.length > 0 ? <div className="retail-app-view-chips">
        {savedViews.map((view) => <span className="retail-app-view-chip" key={view.name}>
          <button onClick={() => applyView(view.name)} type="button">{view.name}</button>
          <a aria-label={`Remove view ${view.name}`} onClick={() => removeView(view.name)} role="button">×</a>
        </span>)}
      </div> : null}
      <input aria-label="Save current filters as a view" onChange={(event) => setViewName(event.target.value)} placeholder="Name this view…" value={viewName} />
      <button disabled={!viewName.trim()} onClick={saveCurrentView} type="button">Save view</button>
    </div> : null}
    {!isInbox && !isCalendar && checked.length > 0 ? <div className="retail-app-bulk-bar">
      <span>{checked.length} selected</span>
      {!isDirectory ? <button disabled={saving} onClick={() => void bulkAdvanceSelected()} type="button">Advance to next stage</button> : null}
      <button onClick={() => exportCsv(visible.filter((record) => checked.includes(record.id)))} type="button">Export selected</button>
      <button onClick={() => setCheckedIds([])} type="button">Clear selection</button>
    </div> : null}
    {isInbox ? <InboxListView onSelect={selectRecord} records={visible} selectedId={selected?.id} statuses={statuses} /> : <section className="retail-app-record-layout">
      {isCalendar ? <CalendarGridView onSelect={selectRecord} records={visible} selectedId={selected?.id} /> : isProducts ? <ProductGridView checked={checked} onSelect={selectRecord} onToggle={toggleChecked} records={visible} selectedId={selected?.id} /> : isDirectory ? <div className="retail-app-directory-card">
        <div className="retail-app-panel-heading"><div><p>{item.group}</p><h2>{visible.length} {item.label.toLowerCase()}</h2></div></div>
        <div className="retail-app-directory-grid">
          {visible.map((record) => {
            const pct = hashPercent(record.id)
            return <div className="retail-app-check-wrap" key={record.id}>
              <input aria-label={`Select ${record.name}`} checked={checked.includes(record.id)} className="retail-app-check" onChange={() => toggleChecked(record.id)} type="checkbox" />
              <button className={`retail-app-directory-item${selected?.id === record.id ? ' selected' : ''}`} onClick={() => selectRecord(record.id)} type="button">
                <div className="retail-app-directory-avatar">{initials(record.name)}</div>
                <div className="retail-app-directory-body"><strong>{record.name}</strong><span>{record.secondary}</span></div>
                <div className="retail-app-directory-metric"><div className="retail-app-directory-bar"><i style={{ width: `${pct}%` }} /></div><small>{pct}% {metricLabel}</small></div>
                <div className="retail-app-directory-foot"><b>{record.value}</b><i>{record.owner}</i></div>
              </button>
            </div>
          })}
          {visible.length === 0 ? <p className="retail-app-board-empty">No records match your search</p> : null}
        </div>
      </div> : boardView === 'list' ? <div className="retail-app-table-card">
        <div className="retail-app-panel-heading"><div><p>{item.group}</p><h2>{visible.length} records across {statuses.length} stages</h2></div></div>
        <div className="retail-app-table-scroll"><table className="retail-app-list-table">
          <thead><tr><th /><th>Name</th><th>Detail</th><th>Stage</th><th>Value</th><th>Owner</th><th>Follow-up</th><th>Updated</th><th /></tr></thead>
          <tbody>
            {visible.map((record) => <tr className={selected?.id === record.id ? 'selected' : ''} key={record.id} onClick={() => selectRecord(record.id)}>
              <td onClick={(event) => event.stopPropagation()}><input aria-label={`Select ${record.name}`} checked={checked.includes(record.id)} className="retail-app-check" onChange={() => toggleChecked(record.id)} type="checkbox" /></td>
              <td><strong>{record.name}</strong></td>
              <td><span className="retail-app-list-secondary">{record.secondary}</span></td>
              <td onClick={(event) => event.stopPropagation()}>
                <select aria-label={`Stage for ${record.name}`} onChange={(event) => void advanceRecord(item.id, record, event.target.value)} value={record.status}>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </td>
              <td>{record.value}</td>
              <td><span className="retail-app-board-item-owner"><span className="retail-app-board-item-avatar">{initials(record.owner)}</span>{record.owner}</span></td>
              <td>{dueBadge(record.dueDate) ? <span className={`retail-app-due-badge retail-app-due-${dueBadge(record.dueDate)!.tone}`}>{dueBadge(record.dueDate)!.label}</span> : <small>—</small>}</td>
              <td><small>{record.updated}</small></td>
              <td onClick={(event) => event.stopPropagation()}>{statuses.indexOf(record.status) < statuses.length - 1 ? <a onClick={() => void advanceRecord(item.id, record, statuses[statuses.indexOf(record.status) + 1])} role="button">Advance →</a> : null}</td>
            </tr>)}
          </tbody>
        </table>
        {visible.length === 0 ? <p className="retail-app-board-empty">No records match your search</p> : null}
        </div>
      </div> : <div className="retail-app-board-card">
        <div className="retail-app-panel-heading"><div><p>{item.group}</p><h2>{visible.length} records across {statuses.length} stages</h2></div><small className="retail-app-board-hint">Drag a card to a new stage to move it</small></div>
        <div className="retail-app-board">
          {statuses.map((status, index) => {
            const columnRecords = visible.filter((record) => record.status === status)
            const columnValue = columnRecords.reduce((sum, record) => sum + parseCurrency(record.value), 0)
            return <div
              className={`retail-app-board-column${dragOverStatus === status ? ' drag-over' : ''}`}
              data-tone={boardTones[index % boardTones.length]}
              key={status}
              onDragLeave={() => setDragOverStatus((current) => current === status ? null : current)}
              onDragOver={(event) => { event.preventDefault(); setDragOverStatus(status) }}
              onDrop={(event) => { event.preventDefault(); void dropOnStage(status) }}
            >
              <header><span>{status}</span><strong>{columnRecords.length}</strong></header>
              {columnValue > 0 ? <p className="retail-app-board-column-total">{formatCurrency(columnValue)} total</p> : null}
              <div className="retail-app-board-column-body">
                {columnRecords.map((record) => <div className="retail-app-check-wrap" key={record.id}>
                  <input aria-label={`Select ${record.name}`} checked={checked.includes(record.id)} className="retail-app-check" onChange={() => toggleChecked(record.id)} type="checkbox" />
                  <button
                    className={`retail-app-board-item${selected?.id === record.id ? ' selected' : ''}${dragRecordId === record.id ? ' dragging' : ''}`}
                    draggable
                    onClick={() => selectRecord(record.id)}
                    onDragEnd={() => { setDragRecordId(null); setDragOverStatus(null) }}
                    onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; setDragRecordId(record.id) }}
                    type="button"
                  >
                    {record.attachment ? <img alt="" className="retail-app-board-item-thumb" src={record.attachment} /> : null}
                    <strong>{record.name}</strong>
                    <span>{record.secondary}</span>
                    <div className="retail-app-board-item-meta"><b>{record.value}</b><i className="retail-app-board-item-owner"><span className="retail-app-board-item-avatar">{initials(record.owner)}</span>{record.owner}</i></div>
                    {isCRM ? (() => { const lead = computeLeadScore(record, statuses, records); return <span className="retail-app-lead-score-badge" data-tone={lead.tier === 'Hot' ? 'danger' : lead.tier === 'Warm' ? 'warn' : 'info'}>{lead.tier === 'Hot' ? '🔥' : lead.tier === 'Warm' ? '🌤️' : '❄️'} {lead.score}</span> })() : null}
                    {dueBadge(record.dueDate) ? <span className={`retail-app-due-badge retail-app-due-${dueBadge(record.dueDate)!.tone}`}>{dueBadge(record.dueDate)!.label}</span> : null}
                    <div className="retail-app-board-item-foot"><small>{record.updated}</small>{statuses.indexOf(status) < statuses.length - 1 ? <a onClick={(event) => { event.stopPropagation(); void advanceRecord(item.id, record, statuses[statuses.indexOf(status) + 1]) }} role="button">Move to {statuses[statuses.indexOf(status) + 1]} →</a> : null}</div>
                  </button>
                </div>)}
                {columnRecords.length === 0 ? <p className="retail-app-board-empty" onDragOver={(event) => { event.preventDefault(); setDragOverStatus(status) }} onDrop={(event) => { event.preventDefault(); void dropOnStage(status) }}>Drop here to move to {status}</p> : null}
              </div>
            </div>
          })}
        </div>
      </div>}
      {selected && origin ? <aside className="retail-app-detail"><p>Selected record</p><h2>{selected.name}</h2><strong>{selected.id}</strong>
        {isContentStudio ? <ContentPreviewCard body={selected.secondary.includes(' \u00b7 ') ? selected.secondary.slice(selected.secondary.indexOf(' \u00b7 ') + 3) : selected.secondary} cta={selected.value} hashtags={[]} headline={selected.name} image={selected.attachment} type={selected.secondary.split(' \u00b7 ')[0] ?? 'Social post'} /> : <AttachmentBox attachment={selected.attachment} attachmentName={selected.attachmentName ?? ''} onRemove={() => attachRecord(item.id, selected, undefined, '')} onUpload={(file) => void readFileAsDataUrl(file).then((dataUrl) => attachRecord(item.id, selected, dataUrl, file.name))} />}
        {isInventory ? <StockTakePanel count={stockCount} onCountChange={setStockCount} onRecord={recordStock} record={selected} /> : null}
        {isOnboarding ? <OnboardingChecklistPanel record={selected} /> : null}
        {isCRM ? <CRMContactPanel onLog={(note) => logNote(item.id, selected, note)} record={selected} records={records} statuses={statuses} /> : null}
        {isCarePlans ? <CareGuidancePanel record={selected} /> : null}
        {isProductionOrders ? <ProductionOrderPanel record={selected} /> : null}
        {isBOM ? <BOMComponentsPanel record={selected} /> : null}
        {isCandidates ? <CandidateProfilePanel record={selected} statuses={statuses} /> : null}
        {isPatients ? <PatientSnapshotPanel record={selected} /> : null}
        {isCampaigns ? <CampaignPerformancePanel record={selected} /> : null}
        {editing ? <div className="retail-app-edit-form">
          <label>Name<input onChange={(event) => setEditDraft((current) => ({ ...current, name: event.target.value }))} value={editDraft.name} /></label>
          <label>{isDirectory ? 'Category' : 'Context'}<input onChange={(event) => setEditDraft((current) => ({ ...current, secondary: event.target.value }))} value={editDraft.secondary} /></label>
          <div className="retail-app-form-grid">
            <label>Value<input onChange={(event) => setEditDraft((current) => ({ ...current, value: event.target.value }))} value={editDraft.value} /></label>
            <label>Owner<input onChange={(event) => setEditDraft((current) => ({ ...current, owner: event.target.value }))} value={editDraft.owner} /></label>
          </div>
          <footer><button className="retail-app-secondary" onClick={() => setEditing(false)} type="button">Cancel</button><button className="retail-app-primary" disabled={saving} onClick={() => void saveEdit()} type="button">{saving ? 'Saving…' : 'Save changes'}</button></footer>
        </div> : <dl><div><dt>{isDirectory ? 'Category' : 'Workflow'}</dt><dd>{item.label}</dd></div><div><dt>Status</dt><dd>{selected.status}</dd></div><div><dt>Owner</dt><dd>{selected.owner}</dd></div><div><dt>Value</dt><dd>{selected.value}</dd></div><div><dt>Updated</dt><dd>{selected.updated}</dd></div>{!isDirectory && !isCalendar ? <div><dt>Follow-up</dt><dd><input aria-label="Set follow-up date" onChange={(event) => void updateRecord(item.id, selected, { dueDate: event.target.value || undefined })} type="date" value={selected.dueDate ?? ''} />{dueBadge(selected.dueDate) ? <span className={`retail-app-due-badge retail-app-due-${dueBadge(selected.dueDate)!.tone}`}>{dueBadge(selected.dueDate)!.label}</span> : null}</dd></div> : null}</dl>}
        {!editing ? <button className="retail-app-secondary retail-app-edit-toggle" onClick={startEdit} type="button">Edit details</button> : null}
        {!isContentStudio ? <ActivityLog entries={selected.log ?? []} kind={noteKind} note={noteText} onAdd={addNote} onKindChange={setNoteKind} onNoteChange={setNoteText} placeholder={isInventory ? 'Add a note about this stock' : 'Add an activity note'} /> : null}
        <button aria-expanded={sourceOpen} className="retail-app-source-toggle" onClick={() => setSourceOpen((open) => !open)} type="button"><span>Source: {origin.label}</span><b>{sourceOpen ? '−' : '+'}</b></button>
        {sourceOpen ? <p className="retail-app-source-detail">{origin.detail}</p> : null}
        {!isDirectory ? <div className="retail-app-stage">{statuses.map((status) => <span className={status === selected.status ? 'active' : ''} key={status}>{status}</span>)}</div> : null}{error ? <div className="complete-workspace-error" role="alert">{error}</div> : null}{productionModeEnabled && item.id === 'payments' && selected.status !== 'Paid' ? <button className="retail-app-primary" disabled={saving || !selected.backendId} onClick={() => void collectPayment()} type="button">Collect with Stripe</button> : !isDirectory && selected.status !== statuses.at(-1) ? <button className="retail-app-primary" disabled={saving} onClick={() => void advance()} type="button">Move to {statuses[Math.min(statuses.indexOf(selected.status) + 1, statuses.length - 1)]}</button> : null}<button className="retail-app-secondary" disabled={saving} onClick={() => void publishHandoff(item.id, selected, handoffTarget).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Handoff could not be published'))} type="button">Handoff to {configs[handoffTarget].label}</button></aside> : null}
    </section>}
    {creating ? <div className="retail-app-modal-backdrop"><form className="retail-app-modal" onSubmit={(event) => void create(event)}><div><p>{item.label}</p><h2>Create a record</h2></div><label>Name<input name="name" required /></label><label>Context<input name="secondary" required /></label><div className="retail-app-form-grid"><label>Value<input name="value" placeholder="£0 or priority" required /></label><label>Owner<select name="owner"><option>Maya</option><option>Noah</option><option>Ava</option><option>Bobby</option></select></label></div><label>Attachment (optional)<input accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv" name="attachment" type="file" /></label>{error ? <div className="complete-workspace-error" role="alert">{error}</div> : null}<footer><button className="retail-app-secondary" onClick={() => setCreating(false)} type="button">Cancel</button><button className="retail-app-primary" disabled={saving} type="submit">{saving ? 'Saving…' : 'Create record'}</button></footer></form></div> : null}
  </>
}

function AutomationsPage({ config, state, update }: { config: WorkspaceConfig; state: WorkspaceState; update: (mutate: (current: WorkspaceState) => WorkspaceState, eventText?: string) => void }) {
  return <><WorkspaceHeading eyebrow="Workflow engine" title="Automations" copy={`Control ${config.label.toLowerCase()} triggers, approvals, confirmations, and cross-workspace handoffs.`} /><div className="retail-app-automation-grid">{state.automations.map((automation) => <article className="retail-app-panel" key={automation.id}><div className="retail-app-panel-heading"><div><p>{automation.enabled ? 'Active' : 'Paused'}</p><h2>{automation.name}</h2></div><button aria-label={`Toggle ${automation.name}`} className={`retail-app-toggle ${automation.enabled ? 'active' : ''}`} onClick={() => update((current) => ({ ...current, automations: current.automations.map((item) => item.id === automation.id ? { ...item, enabled: !item.enabled } : item) }), `${automation.name} ${automation.enabled ? 'paused' : 'enabled'}`)} type="button"><i /></button></div><p>Runs against the shared FoundingOS event feed with explicit confirmation and audit history.</p><footer><span>{automation.runs} runs</span><span>{automation.enabled ? 'Monitoring events' : 'No events processed'}</span></footer></article>)}</div></>
}

const providerCatalog = [
  { id: 'whatsapp', name: 'WhatsApp Cloud API', category: 'Messaging', fields: ['accessToken', 'phoneNumberId', 'verifyToken', 'appSecret'] },
  { id: 'stripe', name: 'Stripe', category: 'Payments', fields: ['secretKey', 'webhookSecret'] },
  { id: 'resend', name: 'Resend', category: 'Email', fields: ['apiKey', 'fromAddress'] },
  { id: 'twilio', name: 'Twilio', category: 'SMS', fields: ['accountSid', 'authToken', 'fromNumber'] },
  { id: 'aws', name: 'AWS', category: 'Storage', fields: ['region', 'bucket', 'accessKeyId', 'secretAccessKey'] },
  { id: 'sentry', name: 'Sentry', category: 'Monitoring', fields: ['dsn'] },
  { id: 'clerk', name: 'Clerk', category: 'Identity', fields: ['secretKey', 'publishableKey'] },
] as const

function IntegrationsPage({ state, update, production }: { state: WorkspaceState; update: (mutate: (current: WorkspaceState) => WorkspaceState, eventText?: string) => void; production: boolean }) {
  const [selectedProvider, setSelectedProvider] = useState<(typeof providerCatalog)[number] | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const integrations = production
    ? providerCatalog.map((provider) => ({ ...provider, connected: state.integrations.some((item) => item.id === provider.id && item.connected) }))
    : state.integrations.map((integration) => ({ ...integration, fields: [] as readonly string[] }))
  const connect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedProvider) return
    setSaving(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const credentials = Object.fromEntries(selectedProvider.fields.map((field) => [field, String(form.get(field) || '')]))
    try {
      await productionRequest(`/platform/integrations/${selectedProvider.id}`, { method: 'PUT', body: JSON.stringify({ displayName: selectedProvider.name, configuration: { category: selectedProvider.category }, credentials }) })
      const checked = await productionRequest<{ status: string }>(`/platform/integrations/${selectedProvider.id}/check`, { method: 'POST', body: '{}' })
      update((current) => ({ ...current, integrations: [...current.integrations.filter((item) => item.id !== selectedProvider.id), { id: selectedProvider.id, name: selectedProvider.name, category: selectedProvider.category, connected: checked.status === 'ready' }] }))
      if (checked.status !== 'ready') {
        setError('Credentials were stored, but this provider requires an operator verification before it is marked ready.')
      } else {
        setSelectedProvider(null)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Integration could not be connected')
    } finally {
      setSaving(false)
    }
  }
  return <><WorkspaceHeading eyebrow="Connected platform" title="Integrations" copy="Connect channels and systems through one governed FoundingOS integration layer. Credentials are encrypted before storage and never returned to the browser." /><div className="retail-app-automation-grid">{integrations.map((integration) => <article className="retail-app-panel" key={integration.id}><div className="retail-app-panel-heading"><div><p>{integration.category}</p><h2>{integration.name}</h2></div><span className={`retail-app-status ${integration.connected ? 'status-active' : 'status-draft'}`}>{integration.connected ? 'Connected' : 'Available'}</span></div><p>{integration.connected ? 'Configuration passed the platform readiness check.' : 'Add provider credentials to activate this service.'}</p><button className={integration.connected ? 'retail-app-secondary' : 'retail-app-primary'} onClick={() => production ? setSelectedProvider(providerCatalog.find((item) => item.id === integration.id) || null) : update((current) => ({ ...current, integrations: current.integrations.map((item) => item.id === integration.id ? { ...item, connected: !item.connected } : item) }), `${integration.name} ${integration.connected ? 'disconnected' : 'connected'}`)} type="button">{production ? (integration.connected ? 'Replace credentials' : 'Configure') : (integration.connected ? 'Disconnect demo' : 'Connect demo')}</button></article>)}</div>{selectedProvider ? <div className="retail-app-modal-backdrop"><form className="retail-app-modal" onSubmit={(event) => void connect(event)}><div><p>{selectedProvider.category}</p><h2>Connect {selectedProvider.name}</h2></div>{selectedProvider.fields.map((field) => <label key={field}>{field.replace(/([A-Z])/g, ' $1')}<input autoComplete="off" name={field} required type={field.toLowerCase().includes('secret') || field.toLowerCase().includes('token') || field.toLowerCase().includes('key') ? 'password' : 'text'} /></label>)}{error ? <div className="complete-workspace-error" role="alert">{error}</div> : null}<footer><button className="retail-app-secondary" onClick={() => setSelectedProvider(null)} type="button">Cancel</button><button className="retail-app-primary" disabled={saving} type="submit">{saving ? 'Checking…' : 'Save and check'}</button></footer></form></div> : null}</>
}

function OutcomesPage({ intelligence, production }: { intelligence: AgentIntelligenceSummary; production: boolean }) {
  const { snapshot, health, auditTrail } = intelligence
  const [range, setRange] = useState<'7' | '30' | '90' | 'all'>('30')
  const [query, setQuery] = useState('')
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null)
  const filteredAuditTrail = auditTrail.filter((entry) => {
    const matchesQuery = !query.trim() || `${entry.actionTitle} ${entry.stage} ${entry.actor} ${entry.summary}`.toLowerCase().includes(query.trim().toLowerCase())
    if (!matchesQuery || range === 'all') return matchesQuery
    return Date.now() - new Date(entry.occurredAt).getTime() <= Number(range) * 24 * 60 * 60 * 1000
  })
  const exportData = async () => {
    if (production) {
      const blob = await productionPlatform.governanceExport()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'foundingos-governance-export.csv'
      link.click()
      URL.revokeObjectURL(url)
      return
    }

    function StrategicOverviewPage({ intelligence }: { intelligence: AgentIntelligenceSummary }) {
      const { snapshot, health } = intelligence
      const exportSummary = () => {
        const summaryDocument = [
          '# FoundingOS — Strategic Overview',
          '',
          `Generated: ${new Date().toISOString()}`,
          '',
          '## The platform',
          'FoundingOS is a WhatsApp-native intelligence control plane for small-business operations. It connects signals across Operations, Workforce, and Intelligence, then turns them into explainable, human-governed decisions.',
          '',
          '## Why it is defensible',
          '- Shared tenant-scoped Event Feed connecting operational signals across workspaces.',
          '- Evidence-backed recommendations with historical context, predictive confidence, and simulation.',
          '- Explicit approval, execution, assessment, compensation, and audit lifecycle.',
          '- Low-bandwidth WhatsApp delivery without weakening authorization or replay protection.',
          '- Measured outcomes refine reliability over time instead of claiming autonomous intelligence.',
          '',
          '## Buyer-safe execution boundary',
          'FoundingOS creates and compensates internal workspace records only. It does not move external funds, debit customers, issue refunds, publish campaigns, or mutate supplier and customer systems without an explicitly integrated, separately governed pathway.',
          '',
          '## Current measured evidence',
          `- ${snapshot.totalAssessedOutcomes} assessed outcomes`,
          `- ${health.averagePredictionAccuracy}% average measured prediction accuracy`,
          `- ${health.refinedPatterns} refined patterns at ${health.averageReliability}% average reliability`,
          `- £${(snapshot.economicValue.cashGovernedPence / 100).toFixed(2)} completed internal value governed`,
          `- ${snapshot.economicValue.coordinatedHandoffs} cross-workspace handoffs`,
          `- ${snapshot.economicValue.estimatedOperatorMinutesSaved} estimated operator minutes saved`,
          '',
          '## Governance model',
          'Advisory signals never execute by themselves. Approval and execution are separate permissions, actions are tenant-isolated and replay-protected, and each lifecycle stage is auditable and reversible within the internal execution boundary.',
          '',
          '## Strategic thesis',
          'The asset is the compounding decision layer: a durable event substrate, governed action registry, WhatsApp-native operating loop, and outcome memory that becomes more useful as real operating evidence accumulates.',
        ].join('\n')
        const url = URL.createObjectURL(new Blob([summaryDocument], { type: 'text/markdown;charset=utf-8' }))
        const link = window.document.createElement('a')
        link.href = url
        link.download = 'foundingos-strategic-overview.md'
        link.click()
        URL.revokeObjectURL(url)
      }
      return <><WorkspaceHeading eyebrow="Buyer-ready platform summary" title="Strategic overview" copy="A concise view of the platform’s defensibility, measured evidence, governance boundaries, and WhatsApp-native advantage." action={<button className="retail-app-secondary" onClick={exportSummary} type="button">Export platform summary</button>} /><section className="outcomes-hero"><div><span className="eyebrow">The decision layer for daily operations</span><h2>Detect, explain, approve, execute, learn.</h2><p>FoundingOS turns fragmented operating signals into clear decisions that a founder can review from a basic smartphone, while preserving strict human control.</p></div><div><strong>{snapshot.learningMomentum.score}/100</strong><span>learning momentum</span></div></section><section className="retail-app-dashboard-grid lower"><article className="retail-app-panel"><p>Defensibility</p><h2>Compounding operating memory</h2><ul className="outcomes-evidence-list"><li><strong>Shared Event Feed</strong><span>Tenant-scoped signals connect inventory, cash, logistics, marketing, and workforce context.</span></li><li><strong>Governed workflows</strong><span>Every supported action has explicit evidence, simulation, approval, execution, assessment, and compensation rules.</span></li><li><strong>WhatsApp-native</strong><span>Decision briefs stay concise and usable under low bandwidth without bypassing authorization.</span></li></ul></article><article className="retail-app-panel"><p>Trust boundary</p><h2>Internal-only by design</h2><ul className="outcomes-evidence-list"><li><strong>Approval ≠ execution</strong><span>Separate permissions keep recommendations advisory until an authorized operator acts.</span></li><li><strong>Measured, not magical</strong><span>{snapshot.totalAssessedOutcomes ? `${health.averagePredictionAccuracy}% measured accuracy across assessed outcomes.` : 'Predictive confidence remains explicitly labelled until outcomes are assessed.'}</span></li><li><strong>Auditable and reversible</strong><span>Lifecycle events, evidence, and compensation records remain available for operator and buyer review.</span></li></ul></article></section><p className="outcomes-methodology">This summary is buyer-facing. Economic figures are lifecycle-derived from tenant-scoped records; predictive confidence, reliability, and learning momentum are evidence-weighted indicators, not guarantees. No external payment, customer debit, refund, or supplier-side mutation is performed by the internal execution layer.</p></>
    }
    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), range, query, snapshot, health, auditTrail: filteredAuditTrail }, null, 2)
    const link = document.createElement('a')
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }))
    link.href = url
    link.download = 'foundingos-intelligence-outcomes.json'
    link.click()
    URL.revokeObjectURL(url)
  }
  const metricCards = [
    ['Measured accuracy', `${health.averagePredictionAccuracy}%`, health.totalAssessedOutcomes ? `${health.totalAssessedOutcomes} assessed outcomes` : 'Awaiting first assessment'],
    ['Learning progress', `${snapshot.recentAccuracyTrend.change >= 0 ? '+' : ''}${snapshot.recentAccuracyTrend.change} pts`, snapshot.recentAccuracyTrend.narrative],
    ['Cash governed', `£${(snapshot.economicValue.cashGovernedPence / 100).toFixed(2)}`, 'Measured internal exposure'],
    ['Operator time', `${snapshot.economicValue.estimatedOperatorMinutesSaved} min`, 'Estimated from completed handoffs'],
    ['Reversals', `${auditTrail.filter((entry) => entry.stage === 'reversed').length}`, 'Compensation events recorded'],
    ['Learning momentum', `${snapshot.learningMomentum.score}/100`, snapshot.learningMomentum.label],
  ]
  return <><WorkspaceHeading eyebrow="Core.Intelligence" title="Outcomes & value" copy="A measured view of what the control plane has learned, governed, and improved. Estimates are labelled separately from execution evidence." action={<button className="retail-app-secondary" onClick={() => void exportData()} type="button">Export governance data</button>} /><section className="outcomes-hero"><div><span className="eyebrow">Compounding intelligence</span><h2>{snapshot.learningMomentum.narrative}</h2><p>{health.narrative}</p></div><div><strong>{snapshot.totalAssessedOutcomes}</strong><span>assessed outcomes</span></div></section><section className="outcomes-metric-grid">{metricCards.map(([label, value, detail]) => <article key={label}><small>{label}</small><strong>{value}</strong><span>{detail}</span></article>)}</section><section className="retail-app-dashboard-grid lower"><article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Measured trend</p><h2>Accuracy over recent assessments</h2></div><span>{snapshot.recentAccuracyTrend.assessmentWindow} outcomes</span></div><div className="outcomes-trend"><i style={{ height: `${Math.max(8, snapshot.recentAccuracyTrend.previous)}%` }} /><i style={{ height: `${Math.max(8, snapshot.recentAccuracyTrend.current)}%` }} /></div><footer><span>Earlier {snapshot.recentAccuracyTrend.previous}%</span><span>Recent {snapshot.recentAccuracyTrend.current}%</span></footer></article><article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Evidence quality</p><h2>What the system knows</h2></div></div><ul className="outcomes-evidence-list"><li><strong>{health.refinedPatterns}</strong><span>refined patterns</span></li><li><strong>{health.averageReliability}%</strong><span>pattern reliability</span></li><li><strong>{health.interactionCount}</strong><span>active decision interactions</span></li><li><strong>{snapshot.economicValue.coordinatedHandoffs}</strong><span>coordinated handoffs</span></li></ul></article></section><section className="retail-app-table-card full"><div className="retail-app-panel-heading"><div><p>Governance transparency</p><h2>Decision audit trail</h2></div><span>{filteredAuditTrail.length} of {auditTrail.length} events</span></div><div className="retail-app-toolbar"><input aria-label="Search audit trail" onChange={(event) => setQuery(event.target.value)} placeholder="Search action, actor, or stage" value={query} /><select aria-label="Audit time range" onChange={(event) => setRange(event.target.value as typeof range)} value={range}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="all">All recorded time</option></select></div><div className="retail-app-table-scroll"><table><thead><tr><th>When</th><th>Action</th><th>Stage</th><th>Actor</th><th>Summary</th><th /></tr></thead><tbody>{filteredAuditTrail.map((entry) => <Fragment key={entry.id}><tr><td>{new Date(entry.occurredAt).toLocaleString('en-GB', { timeZone: 'UTC' })}</td><td><strong>{entry.actionTitle}</strong></td><td><span className="retail-app-status status-active">{entry.stage}</span></td><td>{entry.actor}</td><td>{entry.summary}</td><td><button className="retail-app-secondary" onClick={() => setExpandedAuditId(expandedAuditId === entry.id ? null : entry.id)} type="button">{expandedAuditId === entry.id ? 'Hide detail' : 'Details'}</button></td></tr>{expandedAuditId === entry.id ? <tr><td colSpan={6}><strong>Evidence</strong><ul>{entry.evidence.length ? entry.evidence.map((item) => <li key={item}>{item}</li>) : <li>No additional evidence recorded.</li>}</ul><small>Action ID: {entry.actionId}</small></td></tr> : null}</Fragment>)}</tbody></table></div></section><p className="outcomes-methodology">Measured accuracy comes only from completed actions with outcome assessments. Pattern reliability and learning momentum are evidence-weighted decision-support indicators. Cash governed and operator time are lifecycle-derived; cash recovery, margin protection, and inventory protection are not claimed without qualifying evidence.</p></>
}

function ReportsPage({ config }: { config: WorkspaceConfig }) {
  return <><WorkspaceHeading eyebrow="Intelligence" title="Reports & forecasts" copy={`Understand ${config.label.toLowerCase()} performance, trends, risk, and expected outcomes.`} /><section className="retail-app-metrics">{config.metrics.map((metric) => <Metric key={metric.label} {...metric} />)}</section><section className="retail-app-dashboard-grid lower"><article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Performance</p><h2>Operating trend</h2></div><span>Last 12 weeks</span></div><div className="complete-workspace-bars">{[48, 62, 55, 73, 69, 84, 78, 91, 88, 96, 89, 100].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></article><article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>FoundAI forecast</p><h2>Next best decisions</h2></div></div><div className="retail-app-priorities">{config.subjects.map((subject, index) => <div className="complete-workspace-insight" key={subject}><i data-tone={index === 0 ? 'risk' : 'watch'} /><div><strong>{subject}</strong><span>{index % 2 ? 'Expected upside if actioned this week' : 'Requires owner review today'}</span></div><b>{92 - index * 4}%</b></div>)}</div></article></section></>
}

function EventFeedPage({ events }: { events: WorkspaceEvent[] }) {
  const [query, setQuery] = useState('')
  const [workspaceFilter, setWorkspaceFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [actionId, setActionId] = useState('')
  const [trailEvents, setTrailEvents] = useState<WorkspaceEvent[]>([])
  useEffect(() => {
    const selectedActionId = new URLSearchParams(window.location.search).get('actionId') || ''
    setActionId(selectedActionId)
    if (!selectedActionId) return
    if (productionModeEnabled) {
      void productionAgentActions.trail(selectedActionId).then((items) => setTrailEvents(items.map((event) => ({
        id: event.id,
        workspace: workspaceOrder.includes(event.source as BusinessWorkspaceSlug) ? event.source as BusinessWorkspaceSlug : 'intelligence',
        text: describePlatformEvent(event),
        type: event.type,
        payload: event.payload,
        time: new Date(event.createdAt).toLocaleString('en-GB', { timeZone: 'UTC' }),
      })))).catch(() => setTrailEvents([]))
      return
    }
    const stored = window.localStorage.getItem(AGENT_ACTIONS_KEY)
    const selected = (stored ? JSON.parse(stored) as AgentAction[] : [demoAgentAction()]).find((action) => action.id === selectedActionId)
    if (!selected) return
    const correlated = { actionId: selected.id, sourceEventId: selected.sourceEventId || undefined }
    const semanticTrail: WorkspaceEvent[] = [
      { id: selected.sourceEventId || `${selected.id}-signal`, workspace: 'retail', type: 'inventory.threshold.breached', payload: { ...correlated, sku: selected.input.sku, productName: selected.input.productName }, text: `${String(selected.input.productName)} crossed its replenishment threshold`, time: new Date(selected.createdAt).toLocaleString('en-GB', { timeZone: 'UTC' }) },
      { id: `${selected.id}-proposal`, workspace: 'intelligence', type: 'agent.action.proposed', payload: correlated, text: 'FoundAI proposed a coordinated cross-workspace action', time: new Date(selected.createdAt).toLocaleString('en-GB', { timeZone: 'UTC' }) },
    ]
    if (selected.status !== 'proposed') semanticTrail.push({ id: `${selected.id}-decision`, workspace: 'intelligence', type: `agent.action.${selected.status === 'rejected' ? 'rejected' : 'approved'}`, payload: correlated, text: selected.status === 'rejected' ? 'An owner dismissed a FoundAI recommendation' : 'An owner approved a FoundAI action for execution', time: new Date(selected.updatedAt).toLocaleString('en-GB', { timeZone: 'UTC' }) })
    if (selected.status === 'completed') {
      semanticTrail.push(
        { id: `${selected.id}-retail`, workspace: 'retail', type: 'workspace.record.created', payload: { ...correlated, module: 'purchasing' }, text: 'purchasing record created by an approved agent action', time: new Date(selected.updatedAt).toLocaleString('en-GB', { timeZone: 'UTC' }) },
        { id: `${selected.id}-logistics`, workspace: 'logistics', type: 'workspace.record.created', payload: { ...correlated, module: 'deliveries' }, text: 'deliveries record created by an approved agent action', time: new Date(selected.updatedAt).toLocaleString('en-GB', { timeZone: 'UTC' }) },
        { id: `${selected.id}-finance`, workspace: 'finance', type: 'workspace.record.created', payload: { ...correlated, module: 'bills' }, text: 'bills record created by an approved agent action', time: new Date(selected.updatedAt).toLocaleString('en-GB', { timeZone: 'UTC' }) },
        { id: `${selected.id}-completed`, workspace: 'intelligence', type: 'agent.action.completed', payload: { ...correlated, outcomeSummary: selected.outcomeSummary }, text: selected.outcomeSummary || 'FoundAI completed an approved cross-workspace action', time: new Date(selected.updatedAt).toLocaleString('en-GB', { timeZone: 'UTC' }) },
        { id: `${selected.id}-assessed`, workspace: 'intelligence', type: 'agent.action.outcome.assessed', payload: { ...correlated, ...selected.outcomeAssessment }, text: selected.outcomeAssessment?.summary || 'FoundAI assessed prediction accuracy against the completed outcome', time: new Date(selected.updatedAt).toLocaleString('en-GB', { timeZone: 'UTC' }) },
      )
    }
    setTrailEvents(semanticTrail)
  }, [])
  const recent: WorkspaceEvent[] = events.length ? events : workspaceOrder.flatMap((workspace, index) => [
    { id: `${workspace}-seed`, workspace, text: `${configs[workspace].label} published its latest operating summary`, time: `${index * 9 + 2}m ago` },
  ])
  const visible = actionId && trailEvents.length ? trailEvents : recent
  const filtered = visible.filter((event) => {
    const eventActionId = String(event.payload?.actionId || event.payload?.agentActionId || '')
    return (!query || `${event.text} ${event.type || ''}`.toLowerCase().includes(query.toLowerCase()))
      && (!workspaceFilter || event.workspace === workspaceFilter)
      && (!typeFilter || event.type === typeFilter)
      && (!actionId || eventActionId === actionId || event.id === actionId)
  })
  const types = [...new Set(visible.map((event) => event.type).filter((type): type is string => Boolean(type)))]
  return <><WorkspaceHeading eyebrow="Intelligence substrate" title="Shared Event Feed" copy="Every signal, proposal, approval, workspace mutation, and outcome forms one tenant-scoped timeline that FoundAI can query and reason over." /><div className="event-feed-query"><label>Search<input onChange={(event) => setQuery(event.target.value)} placeholder="Signal, action, outcome…" value={query} /></label><label>Workspace<select onChange={(event) => setWorkspaceFilter(event.target.value)} value={workspaceFilter}><option value="">All workspaces</option>{workspaceOrder.map((workspace) => <option key={workspace} value={workspace}>{configs[workspace].label}</option>)}</select></label><label>Event type<select onChange={(event) => setTypeFilter(event.target.value)} value={typeFilter}><option value="">All event types</option>{types.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>{actionId ? <button onClick={() => { setActionId(''); setTrailEvents([]) }} type="button">Clear action trail</button> : null}</div><div className="retail-app-table-card full"><div className="retail-app-panel-heading"><div><p>{actionId ? 'Correlated action trail' : 'Event graph'}</p><h2>{filtered.length} matching events</h2></div><span>{actionId ? 'Origin to outcome' : 'Newest first'}</span></div><div className="complete-workspace-event-feed">{filtered.map((event) => <article key={event.id}><i style={{ background: configs[event.workspace].accent }} /><div><strong>{event.text}</strong><span>{configs[event.workspace].label} · {event.type || configs[event.workspace].suite}</span></div><time>{event.time}</time></article>)}</div></div></>
}

type ProductionTeamMember = { id: string; email: string; role: string; active: boolean; permissions?: { workspaces?: string[] }; updatedAt?: string }

function TeamPage({ workspace }: { workspace: BusinessWorkspaceSlug }) {
  const [members, setMembers] = useState<ProductionTeamMember[]>([])
  const [invitations, setInvitations] = useState<ProductionInvitation[]>([])
  const [inviting, setInviting] = useState(false)
  const [error, setError] = useState('')
  const load = () => Promise.all([productionRequest<ProductionTeamMember[]>('/platform/team'), productionPlatform.teamInvitations()]).then(([team, pending]) => { setMembers(team); setInvitations(pending) })
  useEffect(() => { void load().catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Team could not be loaded')) }, [])
  const invite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const result = await productionRequest<{ invitation: ProductionInvitation; delivery: { status: string; message: string } }>('/platform/team', { method: 'POST', body: JSON.stringify({ email: form.get('email'), role: form.get('role'), workspaces: form.getAll('workspaces') }) })
      setInvitations((current) => [result.invitation, ...current])
      setInviting(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Invitation could not be created')
    }
  }
  const toggle = async (member: ProductionTeamMember) => {
    setError('')
    try {
      const updated = await productionRequest<ProductionTeamMember>(`/platform/team/${member.id}`, { method: 'PATCH', body: JSON.stringify({ active: !member.active }) })
      setMembers((current) => current.map((item) => item.id === member.id ? { ...item, ...updated } : item))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Team member could not be updated')
    }
  }
  const changeRole = async (member: ProductionTeamMember, role: string) => {
    try {
      const updated = await productionRequest<ProductionTeamMember>(`/platform/team/${member.id}`, { method: 'PATCH', body: JSON.stringify({ role }) })
      setMembers((current) => current.map((item) => item.id === member.id ? { ...item, ...updated } : item))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Role could not be updated')
    }
  }
  const revokeInvitation = async (id: string) => {
    try {
      await productionPlatform.revokeTeamInvitation(id)
      setInvitations((current) => current.filter((invitation) => invitation.id !== id))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Invitation could not be revoked')
    }
  }
  const resendInvitation = async (id: string) => {
    try {
      const result = await productionPlatform.resendTeamInvitation(id)
      setInvitations((current) => [result.invitation, ...current.filter((invitation) => invitation.id !== id)])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Invitation could not be resent')
    }
  }
  return <><WorkspaceHeading eyebrow="Administration" title="Team & access" copy="Invite operators, assign role-based workspace access, and suspend access without deleting audit history." action={<button className="retail-app-primary" onClick={() => setInviting(true)} type="button">+ Invite team member</button>} /><section className="retail-app-dashboard-grid lower team-capabilities"><article className="retail-app-panel"><p>Capability matrix</p><h2>Governance boundaries</h2><ul><li><strong>Founder / Owner</strong><span>Manage team, settings, approve, execute, reverse</span></li><li><strong>Manager</strong><span>Operate assigned workspaces and approve; no execution or reversal</span></li><li><strong>Operator</strong><span>Operate assigned workspaces; no approvals or execution</span></li><li><strong>Viewer</strong><span>Read-only visibility for assigned workspaces and evidence</span></li></ul></article></section>{error ? <div className="complete-workspace-error" role="alert">{error}</div> : null}{invitations.length ? <section className="retail-app-table-card full"><div className="retail-app-panel-heading"><div><p>Pending invitations</p><h2>{invitations.length} awaiting acceptance</h2></div><span>Expires after 72 hours</span></div><div className="retail-app-table-scroll"><table><thead><tr><th>Email</th><th>Role</th><th>Expires</th><th>Delivery</th><th>Actions</th></tr></thead><tbody>{invitations.map((invitation) => <tr key={invitation.id}><td><strong>{invitation.email}</strong></td><td>{invitation.role.replaceAll('_', ' ')}</td><td>{new Date(invitation.expiresAt).toLocaleString('en-GB', { timeZone: 'UTC' })}</td><td><span className="retail-app-status status-draft">Simulated email ready</span></td><td><button className="retail-app-secondary" onClick={() => void resendInvitation(invitation.id)} type="button">Resend</button> <button className="retail-app-secondary" onClick={() => void revokeInvitation(invitation.id)} type="button">Revoke</button></td></tr>)}</tbody></table></div></section> : null}<div className="retail-app-table-card full"><div className="retail-app-panel-heading"><div><p>Access control</p><h2>{members.length} team members</h2></div></div><div className="retail-app-table-scroll"><table><thead><tr><th>Email</th><th>Role</th><th>Workspaces</th><th>Status</th><th>Action</th></tr></thead><tbody>{members.map((member) => <tr key={member.id}><td><strong>{member.email}</strong></td><td><select aria-label={`Role for ${member.email}`} onChange={(event) => void changeRole(member, event.target.value)} value={member.role}><option value="business_viewer">Viewer</option><option value="business_staff">Operator</option><option value="business_manager">Manager</option><option value="business_owner">Owner</option></select></td><td>{member.permissions?.workspaces?.join(', ') || 'All enabled'}</td><td><span className={`retail-app-status ${member.active ? 'status-active' : 'status-draft'}`}>{member.active ? 'Active' : 'Suspended'}</span></td><td><button className="retail-app-secondary" onClick={() => void toggle(member)} type="button">{member.active ? 'Suspend' : 'Restore'}</button></td></tr>)}</tbody></table></div></div>{inviting ? <div className="retail-app-modal-backdrop"><form className="retail-app-modal" onSubmit={(event) => void invite(event)}><div><p>Team access</p><h2>Invite a team member</h2></div><label>Email<input name="email" required type="email" /></label><label>Role<select name="role"><option value="business_viewer">Viewer</option><option value="business_staff">Operator</option><option value="business_manager">Manager</option><option value="business_owner">Owner</option></select></label><fieldset className="complete-workspace-checkboxes"><legend>Workspace access</legend>{workspaceOrder.map((item) => <label key={item}><input defaultChecked={item === workspace} name="workspaces" type="checkbox" value={item} /> {configs[item].label}</label>)}</fieldset>{error ? <div className="complete-workspace-error" role="alert">{error}</div> : null}<footer><button className="retail-app-secondary" onClick={() => setInviting(false)} type="button">Cancel</button><button className="retail-app-primary" type="submit">Create invitation</button></footer></form></div> : null}</>
}

function SecurityPage({ workspace }: { workspace: BusinessWorkspaceSlug }) {
  return <>
    <WorkspaceHeading eyebrow="Administration" title="Security & access" copy="How this workspace's data is isolated, who can see or change it, and how every governed action is logged." />
    <section className="retail-app-dashboard-grid lower team-capabilities">
      <article className="retail-app-panel">
        <p>Data isolation</p>
        <h2>Tenant boundary</h2>
        <ul>
          <li><strong>Row-level isolation</strong><span>Every record in this workspace is scoped to your tenant and enforced by Postgres Row-Level Security, not just application code — a query cannot return another tenant's rows even if a bug forgets the filter.</span></li>
          <li><strong>Dedicated database option</strong><span>Larger accounts can be promoted to a fully separate, physically isolated database instead of the shared pool — no schema or application changes required to move a workspace across tiers.</span></li>
          <li><strong>Encrypted in transit</strong><span>Every request between the app, API, and database travels over TLS/HTTPS. Nothing is served over plain HTTP.</span></li>
        </ul>
      </article>
      <article className="retail-app-panel">
        <p>Access control</p>
        <h2>Governance boundaries</h2>
        <ul>
          <li><strong>Founder / Owner</strong><span>Manage team, settings, approve, execute, reverse</span></li>
          <li><strong>Manager</strong><span>Operate assigned workspaces and approve; no execution or reversal</span></li>
          <li><strong>Operator</strong><span>Operate assigned workspaces; no approvals or execution</span></li>
          <li><strong>Viewer</strong><span>Read-only visibility for assigned workspaces and evidence</span></li>
        </ul>
        <p><small>Manage who holds each role from <strong>Team &amp; access</strong>. Suspending a member revokes access immediately without deleting their audit history.</small></p>
      </article>
      <article className="retail-app-panel">
        <p>Credential handling</p>
        <h2>Integrations</h2>
        <ul>
          <li><strong>Encrypted at rest</strong><span>Connected-platform credentials (WhatsApp, Stripe, Twilio, and other providers) are encrypted before storage and are never returned to the browser once saved.</span></li>
          <li><strong>Readiness checked</strong><span>Every credential is validated against the live provider before a connection is marked active.</span></li>
        </ul>
      </article>
      <article className="retail-app-panel">
        <p>Oversight</p>
        <h2>Audit trail</h2>
        <ul>
          <li><strong>Every governed action logged</strong><span>Suggestion, approval, execution, and reversal of automated actions are each recorded with the acting user, timestamp, and evidence — visible in Core.Intelligence's Audit Trail.</span></li>
          <li><strong>Nothing silently auto-applied</strong><span>High-risk automated actions sit in a review queue until a human with the right role approves them.</span></li>
        </ul>
      </article>
    </section>
    <p><small>{configs[workspace].label} workspace · security controls apply platform-wide, not per workspace.</small></p>
  </>
}

function SettingsPage({ config, state, update, production }: { config: WorkspaceConfig; state: WorkspaceState; update: (mutate: (current: WorkspaceState) => WorkspaceState, eventText?: string) => void; production: boolean }) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [control, setControl] = useState<ControlSettings>({ notificationChannel: 'whatsapp', notificationEnabled: true, approvalThresholdPence: 0, requireOwnerExecution: true, requireEvidence: true, governanceMode: 'human_approval' })
  useEffect(() => {
    if (production) void productionPlatform.controlSettings().then((saved) => { if (saved) setControl(saved) }).catch(() => undefined)
  }, [production])
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    const form = new FormData(event.currentTarget)
    const settings = { businessName: String(form.get('businessName')), region: String(form.get('region')), notifications: form.get('notifications') === 'on' }
    try {
      if (production) await productionRequest('/platform/onboarding', { method: 'PUT', body: JSON.stringify({ businessName: settings.businessName, countryCode: settings.region, completedSteps: ['business', 'owner', 'workspaces', 'integrations'], goLiveStatus: form.get('goLive') === 'on' ? 'live' : 'setup', acceptTerms: form.get('goLive') === 'on' }) })
      const nextControl = { ...control, notificationChannel: String(form.get('notificationChannel')) as ControlSettings['notificationChannel'], notificationEnabled: settings.notifications, approvalThresholdPence: Math.round(Number(form.get('approvalThreshold')) * 100), requireOwnerExecution: form.get('requireOwnerExecution') === 'on', requireEvidence: form.get('requireEvidence') === 'on' }
      if (production) await productionPlatform.saveControlSettings(nextControl)
      setControl(nextControl)
      update((current) => ({ ...current, settings }), `${config.label} settings updated`)
      setMessage('Settings saved.')
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Settings could not be saved')
    } finally {
      setSaving(false)
    }
  }
  return <><WorkspaceHeading eyebrow="Administration" title="Settings" copy={`Configure the ${config.label} workspace identity, region, access, and notifications.`} /><form className="retail-app-settings retail-app-panel" onSubmit={(event) => void save(event)}><section><h2>Workspace identity</h2><p>Shared across records, reports, notifications, and integrations.</p><label>Business name<input defaultValue={state.settings.businessName} name="businessName" required /></label><label>Operating region<select defaultValue={state.settings.region} name="region"><option value="GB">United Kingdom</option><option value="NG">Nigeria</option><option value="US">United States</option><option value="EU">European Union</option></select></label></section><section><h2>Notification control</h2><label>Primary channel<select defaultValue={control.notificationChannel} name="notificationChannel"><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="both">WhatsApp + email</option></select></label><label className="retail-app-check"><input defaultChecked={control.notificationEnabled} name="notifications" type="checkbox" /> Notify owners about high-priority events and required approvals</label></section><section><h2>Decision governance</h2><p>These controls shape the approval experience; they never enable autonomous execution.</p><label>Approval review threshold (£)<input defaultValue={(control.approvalThresholdPence / 100).toFixed(2)} min="0" name="approvalThreshold" step=".01" type="number" /></label><label className="retail-app-check"><input defaultChecked={control.requireOwnerExecution} name="requireOwnerExecution" type="checkbox" /> Require Founder or Owner for execution and reversal</label><label className="retail-app-check"><input defaultChecked={control.requireEvidence} name="requireEvidence" type="checkbox" /> Require historical evidence before proposal approval</label><div className="settings-governance-note"><strong>Human approval only</strong><span>Governance mode is fixed to human approval. External payments remain disabled.</span></div></section><section><h2>Deployment</h2>{production ? <label className="retail-app-check"><input name="goLive" type="checkbox" /> Mark onboarding complete and request go-live readiness</label> : <p>Simulation mode stores these controls in this browser only.</p>}</section>{message ? <div className="complete-workspace-save-message" role="status">{message}</div> : null}<footer><button className="retail-app-primary" disabled={saving} type="submit">{saving ? 'Saving…' : 'Save settings'}</button></footer></form></>
}

function ProductionAccess({ onAuthenticated }: { onAuthenticated: (session: ProductionSession) => void }) {
  const [initializing, setInitializing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      onAuthenticated(await loginToProduction(String(form.get('email')), String(form.get('password'))))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Sign in failed')
    } finally {
      setBusy(false)
    }
  }
  const bootstrap = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email'))
    const password = String(form.get('password'))
    try {
      await bootstrapProduction({ businessName: form.get('businessName'), ownerName: form.get('ownerName'), email, password, plan: 'growth' }, String(form.get('bootstrapToken')))
      onAuthenticated(await loginToProduction(email, password))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Deployment initialization failed')
    } finally {
      setBusy(false)
    }
  }
  return <main className="complete-workspace-access"><section><div className="complete-workspace-access-brand"><span>F</span><div><strong>FoundingOS</strong><small>Business in a box</small></div></div><p className="eyebrow">{initializing ? 'First deployment' : 'Secure workspace access'}</p><h1>{initializing ? 'Initialize your business' : 'Sign in to FoundingOS'}</h1><p>{initializing ? 'Create the first tenant and owner. The bootstrap token comes from your deployment secret manager and is never stored in the browser.' : 'Access every enabled workspace with your tenant-scoped account.'}</p><form onSubmit={(event) => void (initializing ? bootstrap(event) : login(event))}>{initializing ? <><label>Business name<input name="businessName" required /></label><label>Owner name<input name="ownerName" required /></label></> : null}<label>Email<input autoComplete="email" name="email" required type="email" /></label><label>Password<input autoComplete={initializing ? 'new-password' : 'current-password'} minLength={12} name="password" required type="password" /></label>{initializing ? <label>Deployment bootstrap token<input autoComplete="off" name="bootstrapToken" required type="password" /></label> : null}{error ? <div className="complete-workspace-error" role="alert">{error}</div> : null}<button className="retail-app-primary" disabled={busy} type="submit">{busy ? 'Please wait…' : initializing ? 'Initialize and sign in' : 'Sign in'}</button></form><button className="complete-workspace-access-switch" onClick={() => { setInitializing((value) => !value); setError('') }} type="button">{initializing ? 'Return to sign in' : 'Initialize a new deployment'}</button></section></main>
}

// A cross-workspace command palette (Cmd/Ctrl+K) — the single fastest way to jump to any
// module in any workspace, or to a specific record by name, without hunting through nav
// trees. This is the "everything, instantly" search HubSpot/Pipedrive/Monday never quite
// nail, and it works identically across every FoundingOS workspace since it lives in the shell.
type PaletteEntry = { key: string; label: string; hint: string; href: string }
function CommandPalette({ open, onClose, workspace, state }: { open: boolean; onClose: () => void; workspace: BusinessWorkspaceSlug; state: WorkspaceState }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (open) { setQuery(''); requestAnimationFrame(() => inputRef.current?.focus()) } }, [open])
  const entries = useMemo<PaletteEntry[]>(() => {
    const modules: PaletteEntry[] = Object.entries(configs).flatMap(([slug, cfg]) => cfg.modules.map((item) => ({
      key: `${slug}-${item.id}`, label: item.label, hint: cfg.label, href: `${workspaceRoot}/${slug}${item.id === 'overview' ? '' : `/${item.id}`}`,
    })))
    const records: PaletteEntry[] = Object.entries(state.records).flatMap(([moduleId, list]) => list.map((record) => ({
      key: `record-${moduleId}-${record.id}`, label: record.name, hint: `${configs[workspace].label} · ${record.status}`, href: `${workspaceRoot}/${workspace}/${moduleId}`,
    })))
    return [...records, ...modules]
  }, [state.records, workspace])
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries.slice(0, 8)
    return entries.filter((entry) => entry.label.toLowerCase().includes(q) || entry.hint.toLowerCase().includes(q)).slice(0, 12)
  }, [entries, query])
  const go = (href: string) => { onClose(); router.push(href) }
  if (!open) return null
  return <div className="retail-app-palette-overlay" onClick={onClose} role="presentation">
    <div className="retail-app-palette" onClick={(event) => event.stopPropagation()} role="dialog" aria-label="Command palette">
      <input aria-label="Jump to a module or record" onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') onClose(); if (event.key === 'Enter' && matches[0]) go(matches[0].href) }} placeholder="Jump to any workspace, module, or record…" ref={inputRef} value={query} />
      <ul className="retail-app-palette-list">{matches.length ? matches.map((entry) => <li key={entry.key}><button onClick={() => go(entry.href)} type="button"><strong>{entry.label}</strong><small>{entry.hint}</small></button></li>) : <li className="retail-app-palette-empty">No matches</li>}</ul>
      <div className="retail-app-palette-foot"><span>↑↓ navigate</span><span>Enter select</span><span>Esc close</span></div>
    </div>
  </div>
}

export function CompleteWorkspaceApplication({ workspace, section = 'overview' }: { workspace: BusinessWorkspaceSlug; section?: string }) {
  const config = configs[workspace]
  const current = config.modules.find((item) => item.id === section) ?? config.modules[0]
  const [hydrated, setHydrated] = useState(!productionModeEnabled)
  const [session, setSession] = useState<ProductionSession | null>(null)
  useEffect(() => {
    setSession(getProductionSession())
    setHydrated(true)
  }, [])
  const { state, events, update, reset, loading, error, production, createRecord, advanceRecord, attachRecord, adjustStock, logNote, updateRecord, bulkAdvance, publishHandoff } = useWorkspaceState(workspace, current.id, session)
  const agent = useAgentActions(production, session, (text) => update((current) => current, text))
  const groups = useMemo(() => [...new Set(config.modules.map((item) => item.group))], [config.modules])
  const [paletteOpen, setPaletteOpen] = useState(false)
  // Collapsible nav groups — several workspaces (Retail, Marketing) have 20+ modules across
  // 8-9 groups, more than fit in one viewport, so collapsing groups you're not using keeps the
  // sidebar scannable at a glance instead of forcing an internal scrollbar for everything,
  // matching how Notion/Linear/HubSpot handle deep nav trees.
  const navCollapseKey = `foundingos-nav-collapsed-${workspace}`
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([])
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(navCollapseKey)
      if (stored) { setCollapsedGroups(JSON.parse(stored)); return }
      // First visit to this workspace: collapse every group except the one the current
      // module lives in, so the sidebar fits in one viewport instead of needing an internal
      // scrollbar to reach items lower down the list.
      setCollapsedGroups(groups.filter((group) => group !== current.group))
    } catch { setCollapsedGroups([]) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace])
  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => {
      const next = prev.includes(group) ? prev.filter((value) => value !== group) : [...prev, group]
      try { window.localStorage.setItem(navCollapseKey, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }
  const activeGroup = current.group
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setPaletteOpen(true) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
  if (productionModeEnabled && !productionApiConfigured) return <main className="complete-workspace-access"><section><h1>Production API is not configured</h1><p>Set NEXT_PUBLIC_FOUNDINGOS_API_URL to the deployed API root before publishing this application.</p></section></main>
  if (!hydrated) return <main className="complete-workspace-access"><section><h1>Loading FoundingOS…</h1></section></main>
  if (production && !session) return <ProductionAccess onAuthenticated={setSession} />
  let content: React.ReactNode
  if (current.id === 'overview' && workspace === 'intelligence') content = <SuperDashboardOverview activateIntelligence={agent.activate} agentActions={agent.actions} intelligence={agent.intelligence} agentBusy={agent.busy} agentError={agent.error} decideAgentAction={agent.decide} events={events} executeAgentAction={agent.execute} proposeAgentAction={agent.propose} reverseAgentAction={agent.reverse} />
  else if (current.id === 'outcomes' && workspace === 'intelligence') content = <OutcomesPage intelligence={agent.intelligence} production={production} />
  else if (current.id === 'strategic-overview' && workspace === 'intelligence') content = <><WorkspaceHeading eyebrow="Buyer-ready platform summary" title="Strategic overview" copy="A concise view of the platform’s defensibility, measured evidence, governance boundaries, and WhatsApp-native advantage." /><StrategicOverview intelligence={agent.intelligence} /></>
  else if (current.id === 'overview') content = <Overview config={config} events={events} state={state} workspace={workspace} />
  else if (current.id === 'automations') content = <AutomationsPage config={config} state={state} update={update} />
  else if (current.id === 'integrations') content = <IntegrationsPage production={production} state={state} update={update} />
  else if (current.id === 'security') content = <SecurityPage workspace={workspace} />
  else if (current.id === 'team' && production) content = <TeamPage workspace={workspace} />
  else if (['reports', 'forecasting', 'attribution'].includes(current.id)) content = <ReportsPage config={config} />
  else if (current.id === 'event-feed') content = <EventFeedPage events={events} />
  else if (current.id === 'settings') content = <SettingsPage config={config} production={production} state={state} update={update} />
  else content = <RecordsPage adjustStock={adjustStock} advanceRecord={advanceRecord} attachRecord={attachRecord} bulkAdvance={bulkAdvance} config={config} createRecord={createRecord} item={current} logNote={logNote} publishHandoff={publishHandoff} state={state} updateRecord={updateRecord} workspace={workspace} />
  return <main className="retail-product-shell complete-workspace-shell" style={{ ['--retail-accent' as string]: config.accent }}>
    <aside className="retail-product-sidebar"><Link className="retail-product-brand" href="/"><span>F</span><div><strong>FoundingOS</strong><small>{config.suite}</small></div></Link><div className="retail-product-store"><span>{config.label.slice(0, 2).toUpperCase()}</span><div><strong>{state.settings.businessName}</strong><small>{config.label} Workspace</small></div><b>⌄</b></div><nav aria-label={`${config.label} workspace navigation`}>{groups.map((group) => { const expanded = group === activeGroup || !collapsedGroups.includes(group); return <div key={group}><button aria-expanded={expanded} className="retail-product-nav-group" onClick={() => toggleGroup(group)} type="button"><p>{group}</p><i className={expanded ? 'retail-product-nav-chevron open' : 'retail-product-nav-chevron'}>›</i></button>{expanded ? config.modules.filter((item) => item.group === group).map((item) => <Link className={item.id === current.id ? 'active' : ''} href={`${workspaceRoot}/${workspace}${item.id === 'overview' ? '' : `/${item.id}`}`} key={item.id}><i>{item.id === 'overview' ? '⌂' : '◇'}</i><span>{item.label}</span>{state.records[item.id]?.length ? <em>{state.records[item.id].length}</em> : null}{overdueCount(state.records[item.id]) ? <b aria-label={`${overdueCount(state.records[item.id])} follow-ups due`} className="retail-product-nav-dot" title={`${overdueCount(state.records[item.id])} follow-up${overdueCount(state.records[item.id]) === 1 ? '' : 's'} due`} /> : null}</Link>) : null}</div> })}</nav><Link className="retail-product-switcher" href={workspaceRoot}><span>Switch workspace</span><b>↗</b></Link></aside>
    <section className="retail-product-main"><header className="retail-product-topbar"><form onSubmit={(event) => { event.preventDefault(); setPaletteOpen(true) }}><span>⌕</span><input aria-label="Global workspace search" onFocus={(event) => { event.target.blur(); setPaletteOpen(true) }} placeholder={`Search ${config.label}, or ask FoundAI… (⌘K)`} readOnly /></form><div><span className="complete-workspace-live">● {production ? 'PRODUCTION' : 'SIMULATION'} LIVE</span>{production ? <button className="complete-workspace-signout" onClick={() => void logoutProduction().then(() => setSession(null))} type="button">Sign out</button> : null}<form action="/api/access/logout" method="post"><button className="complete-workspace-signout" type="submit">Log out</button></form><span className="retail-product-user">{session?.user.email.slice(0, 2).toUpperCase() || 'BS'}</span></div></header><div className="retail-product-content"><div className="retail-product-notice"><span>{loading ? '…' : error ? '!' : '✓'}</span>{loading ? 'Loading tenant data…' : error ? error : production ? 'Tenant data is secured in PostgreSQL and every action is audited' : 'Interactive simulation · actions persist in this browser'}</div>{content}</div><footer className="retail-product-footer"><span>{config.label} Workspace · {production ? 'tenant-isolated production data' : 'browser-persistent shared simulation'}</span>{!production ? <button onClick={reset} type="button">Reset {config.label} data</button> : null}</footer></section>
    <CommandPalette onClose={() => setPaletteOpen(false)} open={paletteOpen} state={state} workspace={workspace} />
  </main>
}
