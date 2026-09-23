/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Demo-mode Approvals queue — a mutable in-memory copy so approve/reject/
// execute/reverse on a demo item behaves like a real queue across a demo
// session, without ever touching a real backend or persisting to disk.
import { AgentActionTrailEvent } from '../core-operations-api'
import { ApprovalsQueueItem, ApprovalsQueueResult, ApprovalsQueueStatus, IApprovalsService } from './approvalsService'

const HOURS = 60 * 60 * 1000
const now = () => Date.now()
const isoAgo = (ms: number) => new Date(now() - ms).toISOString()

const seedQueue = (): ApprovalsQueueItem[] => [
  {
    id: 'demo-replenishment-001',
    source: 'core_operations',
    title: 'Replenish size-run for "Classic Oxford" — Store 4',
    summary: 'Stock on hand covers 3 days of demand at current velocity. A 240-unit reorder from Meridian Textiles keeps cover above the 14-day floor.',
    status: 'proposed',
    requiresApproval: true,
    createdAt: isoAgo(0.4 * HOURS),
    estimatedValuePence: 486000,
    canUndo: false,
    hasEvidenceTrail: true,
    riskLevel: 'low',
    rationale: 'Sell-through accelerated 18% week-over-week after the spring email campaign; the current purchase order cadence under-covers the next 14 days at 92% confidence.',
    aiPreview: {
      confidence: 91,
      reliabilityScore: 88,
      similarSignals: 14,
      completionRate: 96,
      decisionScore: 87,
      scoreExplanation: [
        '3 workspaces coordinated (retail, logistics, finance)',
        '£4,860.00 governed exposure, within auto-approval guardrails',
        '88% pattern reliability across 14 similar reorders',
      ],
      simulation: [
        { before: '86 units on hand with an active stockout risk in 3 days.', after: '240 units approved on a linked purchase order from Meridian Textiles.', effect: 'Availability risk moves into a governed replenishment commitment.', secondOrderEffects: ['Inbound cover extends the next threshold breach by roughly 11 days.', 'Purchase history strengthens future reorder-frequency calibration.'] },
        { before: 'No inbound delivery reserved for this replenishment.', after: 'One inbound delivery from Meridian Textiles is booked to the Store 4 stockroom.', effect: 'The inbound dependency becomes visible and traceable before stock arrives.' },
      ],
    },
  },
  {
    id: 'demo-collections-002',
    source: 'core_operations',
    title: 'Open collection case — Bright Harbor Co, 41 days overdue',
    summary: 'Invoice INV-10432 (£2,140.00) is 41 days overdue with no active collection case. Opening one starts a governed follow-up sequence.',
    status: 'proposed',
    requiresApproval: true,
    createdAt: isoAgo(1.1 * HOURS),
    estimatedValuePence: 214000,
    canUndo: false,
    hasEvidenceTrail: true,
    riskLevel: 'medium',
    rationale: 'Bright Harbor Co has settled 9 of their last 10 invoices within 10 days of a collection case opening — this pattern is well-supported.',
    aiPreview: {
      confidence: 78,
      reliabilityScore: 82,
      similarSignals: 9,
      completionRate: 90,
      decisionScore: 74,
      scoreExplanation: ['3 workspaces coordinated (finance, retail, marketing)', '£2,140.00 governed cash exposure', '82% pattern reliability across 9 prior cases'],
      simulation: [
        { before: 'INV-10432 is 41 days overdue without an active collection case.', after: 'A £2,140.00 collection case is opened.', effect: 'Cash exposure becomes owned and measurable.', secondOrderEffects: ['Collection timing enters cash forecasting.', 'The eventual outcome refines future overdue-risk confidence.'] },
      ],
    },
  },
  {
    id: 'demo-delivery-003',
    source: 'core_operations',
    title: 'Recover delayed delivery — Order #48213',
    summary: 'Carrier tracking shows no scan update in 26 hours. Rebooking with a backup carrier keeps the delivery promise intact.',
    status: 'approved',
    requiresApproval: true,
    createdAt: isoAgo(3 * HOURS),
    estimatedValuePence: 18900,
    canUndo: false,
    hasEvidenceTrail: true,
    riskLevel: 'medium',
    rationale: 'Two of the last three stalled-tracking events on this lane resolved only after a backup-carrier rebooking.',
    aiPreview: { confidence: 71, reliabilityScore: 68, similarSignals: 3, completionRate: 67, decisionScore: 65, scoreExplanation: ['3 workspaces coordinated (logistics, retail, finance)', '£189.00 governed exposure', '68% pattern reliability across 3 similar delays'] },
  },
  {
    id: 'demo-payroll-004',
    source: 'core_workforce',
    title: 'Approve overtime — Weekend cover, Store 4',
    summary: '3 shift swaps this week pushed 2 team members past standard hours. Approving keeps payroll compliant and on schedule for Friday\'s run.',
    status: 'proposed',
    requiresApproval: true,
    createdAt: isoAgo(2.4 * HOURS),
    estimatedValuePence: null,
    canUndo: false,
    hasEvidenceTrail: false,
  },
  {
    id: 'demo-marketing-005',
    source: 'core_operations',
    title: 'Launch win-back campaign — 214 lapsed customers',
    summary: 'Customers with no purchase in 60+ days who previously bought 3+ times. A governed WhatsApp campaign with a 10% code is ready to send.',
    status: 'completed',
    requiresApproval: true,
    createdAt: isoAgo(22 * HOURS),
    estimatedValuePence: 640000,
    canUndo: true,
    hasEvidenceTrail: true,
    riskLevel: 'low',
    rationale: 'This exact segment definition converted at 12.4% on the last two sends.',
    aiPreview: { confidence: 84, reliabilityScore: 79, similarSignals: 6, completionRate: 83, decisionScore: 80 },
  },
  {
    id: 'demo-fraud-006',
    source: 'core_operations',
    title: 'Hold order for manual review — Order #48260',
    summary: 'Shipping and billing address mismatch combined with a first-time high-value order (£890.00) tripped the fraud-review threshold.',
    status: 'rejected',
    requiresApproval: true,
    createdAt: isoAgo(30 * HOURS),
    estimatedValuePence: 89000,
    canUndo: false,
    hasEvidenceTrail: true,
    riskLevel: 'high',
    rationale: 'Address-mismatch + first-time high-value orders have a 34% confirmed-fraud rate historically; held pending manual contact.',
    aiPreview: { confidence: 63, reliabilityScore: 71, similarSignals: 11, completionRate: 66, decisionScore: 58 },
  },
]

export function createDemoApprovalsService(): IApprovalsService {
  let queue: ApprovalsQueueItem[] = seedQueue()

  const decide = (id: string, status: ApprovalsQueueStatus) => {
    queue = queue.map((item) => (item.id === id ? { ...item, status } : item))
  }

  const result = (): ApprovalsQueueResult => ({
    items: queue,
    coreOperationsConnected: true,
    coreWorkforceConnected: true,
  })

  return {
    async fetchQueue() {
      return result()
    },
    async approve(item) {
      decide(item.id, 'approved')
    },
    async reject(item) {
      decide(item.id, 'rejected')
    },
    async execute(item) {
      decide(item.id, 'completed')
    },
    async reverse(item) {
      decide(item.id, 'reversed')
    },
    async fetchTrail(item): Promise<AgentActionTrailEvent[]> {
      return [
        { id: `${item.id}-trail-1`, tenantId: 'demo', type: 'agent.action.proposed', source: 'core_operations', payload: { note: 'Evidence thresholds met' }, createdAt: item.createdAt },
      ]
    },
  }
}
