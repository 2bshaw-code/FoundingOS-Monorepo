/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Realistic canned data for investor/buyer demos — enabled via the hidden
// "Demo mode" toggle on the Debug Log screen (app/(app)/debug-log.tsx,
// itself reached via a secret gesture, see home.tsx). When
// useQuantumStore().demoMode is true, the lib/services/*.demo.ts
// implementations serve this data instead of calling the real backends, so
// the full app experience can be shown with zero live tenant/backend
// connection. Only the constants genuinely shared across multiple services
// (non-CRUD, read-only) remain here — everything else now lives next to its
// owning service.
import type { PlatformEvent, TenantOnboarding, MessagingReadiness, AgentActionIntelligence, MessagingParticipant } from './core-operations-api'

const HOURS = 60 * 60 * 1000
const now = () => Date.now()
const isoAgo = (ms: number) => new Date(now() - ms).toISOString()

// Approvals demo data/mutations now live behind lib/services/approvalsService.demo.ts.

export const DEMO_EVENTS: PlatformEvent[] = [
  { id: 'demo-evt-1', tenantId: 'demo', type: 'agent.action.executed', source: 'core_operations', payload: { title: 'Win-back campaign sent to 214 customers' }, createdAt: isoAgo(0.3 * HOURS) },
  { id: 'demo-evt-2', tenantId: 'demo', type: 'inventory.threshold.breached', source: 'retail', payload: { sku: 'OXF-BLK-42' }, createdAt: isoAgo(0.8 * HOURS) },
  { id: 'demo-evt-3', tenantId: 'demo', type: 'crm.deal.stage_changed', source: 'retail', payload: { deal: 'Meridian Wholesale — Q2 restock' }, createdAt: isoAgo(1.5 * HOURS) },
  { id: 'demo-evt-4', tenantId: 'demo', type: 'workforce.shift.covered', source: 'core_workforce', payload: { store: 'Store 4' }, createdAt: isoAgo(2.2 * HOURS) },
  { id: 'demo-evt-5', tenantId: 'demo', type: 'finance.invoice.overdue', source: 'finance', payload: { customer: 'Bright Harbor Co' }, createdAt: isoAgo(3.4 * HOURS) },
  { id: 'demo-evt-6', tenantId: 'demo', type: 'logistics.delivery.delayed', source: 'logistics', payload: { order: '#48213' }, createdAt: isoAgo(4.9 * HOURS) },
  { id: 'demo-evt-7', tenantId: 'demo', type: 'agent.action.proposed', source: 'core_operations', payload: { title: 'Replenish size-run — Store 4' }, createdAt: isoAgo(6 * HOURS) },
  { id: 'demo-evt-8', tenantId: 'demo', type: 'crm.deal.won', source: 'retail', payload: { deal: 'Northside Boutiques — annual contract' }, createdAt: isoAgo(9 * HOURS) },
]

export const DEMO_ONBOARDING: TenantOnboarding = {
  tenantId: 'demo',
  businessName: 'Founder & Co.',
  ownerName: 'Alex Founder',
  industry: 'Retail',
  countryCode: 'GB',
  currency: 'GBP',
  timezone: 'Europe/London',
  completedSteps: ['business', 'owner', 'whatsapp', 'first-action'],
  goLiveStatus: 'live',
  acceptedTermsAt: isoAgo(60 * 24 * HOURS),
  completedAt: isoAgo(60 * 24 * HOURS),
}

export const DEMO_MESSAGING_READINESS: MessagingReadiness = {
  operational: true,
  activeConnections: [{ channel: 'whatsapp', externalAccountId: 'demo-whatsapp', displayName: 'Founder & Co. WhatsApp', active: true }],
  authorizedParticipants: 4,
  failedDeliveriesLast24Hours: 0,
  unrecognizedMessagesLast24Hours: 0,
  webFallbackUrl: '',
  dependencyRisk: 'none',
}

export const DEMO_MESSAGING_PARTICIPANTS: MessagingParticipant[] = [
  { id: 'demo-participant-1', tenantId: 'demo', channel: 'whatsapp', address: '+44 7700 900123', displayName: 'Alex Founder', role: 'owner', active: true, createdAt: isoAgo(90 * 24 * HOURS), updatedAt: isoAgo(1 * HOURS) },
  { id: 'demo-participant-2', tenantId: 'demo', channel: 'whatsapp', address: '+44 7700 900456', displayName: 'Priya Manager', role: 'manager', active: true, createdAt: isoAgo(60 * 24 * HOURS), updatedAt: isoAgo(4 * HOURS) },
]

// Team, Sales Pipeline, Marketing, and Workforce demo data/mutations now live
// behind their respective services in lib/services/ (teamService.demo.ts,
// pipelineService.demo.ts, marketingService.demo.ts, workforceService.demo.ts)
// so screens depend on a service interface rather than this file directly.

// Powers Guardian and Activity's emerging-signals/audit-trail views in demo
// mode — shaped exactly like the real fetchAgentActionIntelligence() payload
// so both screens render their full executive UI (confidence bars, economic
// value, reliability) without a live core-operations connection.
export const DEMO_AGENT_INTELLIGENCE: AgentActionIntelligence = {
  interactions: [
    {
      id: 'demo-interaction-1',
      actionIds: ['demo-action-a', 'demo-action-b'],
      actionTitles: ['Replenish size-run — Store 4', 'Win-back campaign — lapsed customers'],
      severity: 'watch',
      dimensions: ['sku', 'cash'],
      summary: 'Both actions draw from the same promotional budget this week.',
      evidence: ['£1,850 combined spend flagged', 'Store 4 replenishment queued first'],
      advisory: 'Sequence the win-back campaign after replenishment confirms stock.',
    },
  ],
  health: {
    totalAssessedOutcomes: 482,
    averagePredictionAccuracy: 0.91,
    refinedPatterns: 37,
    confidenceImprovement: 0.06,
    averageReliability: 0.88,
    activePatterns: 12,
    interactionCount: 1,
    recurringDeviation: { field: 'delivery_window', count: 3, insight: 'Deliveries to Store 4 consistently land a day later than promised.' },
    narrative: 'The system is learning steadily, with prediction accuracy climbing across the last four assessment windows.',
  },
  snapshot: {
    totalAssessedOutcomes: 482,
    refinedPatterns: 37,
    activeInteractions: 1,
    recentAccuracyTrend: { current: 0.91, previous: 0.85, change: 0.06, assessmentWindow: 30, narrative: 'Accuracy improved 6 points over the last 30 assessed outcomes.' },
    learningMomentum: { score: 0.82, label: 'compounding', narrative: 'Learning velocity has been climbing for three consecutive weeks.' },
    economicValue: {
      cashGovernedPence: 184_000_00,
      cashPreservedPence: 21_400_00,
      marginProtectedPence: 8_900_00,
      inventoryUnitsProtected: 640,
      riskReducedActions: 14,
      coordinatedHandoffs: 6,
      estimatedOperatorMinutesSaved: 512,
      measuredOutcomes: 482,
      narrative: 'FoundingOS has governed £184k in cash-impacting decisions this quarter, preserving an estimated £21.4k that would otherwise have been lost to stockouts and missed follow-ups.',
      methodology: ['Compares agent-recommended vs. counterfactual outcomes', 'Only counts actions with a measured, closed-loop result'],
    },
  },
  emergingSignals: [
    {
      id: 'demo-signal-1',
      kind: 'strong-precedent',
      severity: 'positive',
      title: 'Win-back campaigns are consistently reliable',
      summary: 'The last 9 win-back sends recovered at least 12% of lapsed customers, with no false positives.',
      reliability: 0.94,
      outcomeCount: 9,
      evidence: ['9/9 sends recovered ≥12% of targeted customers', 'No customer complaints logged'],
      advisory: 'Safe to auto-approve future win-back campaigns under £2,000.',
    },
    {
      id: 'demo-signal-2',
      kind: 'recurring-deviation',
      severity: 'watch',
      title: 'Store 4 deliveries running a day late',
      summary: 'Three consecutive restock deliveries to Store 4 arrived a day after the promised window.',
      reliability: 0.71,
      outcomeCount: 3,
      evidence: ['Delivery #4821 — 1 day late', 'Delivery #4790 — 1 day late', 'Delivery #4756 — 1 day late'],
      advisory: 'Consider padding Store 4 replenishment lead time by one day.',
    },
  ],
  auditTrail: [
    { id: 'demo-audit-1', actionId: 'demo-action-a', actionTitle: 'Replenish size-run — Store 4', stage: 'executed', actor: 'agent', occurredAt: isoAgo(0.3 * HOURS), summary: 'Auto-executed after founder approval.', evidence: ['Stock threshold breached', 'Approved by Alex Founder'] },
    { id: 'demo-audit-2', actionId: 'demo-action-c', actionTitle: 'Win-back campaign sent to 214 customers', stage: 'assessed', actor: 'system', occurredAt: isoAgo(1.1 * HOURS), summary: 'Outcome measured: 31 customers re-engaged within 24h.', evidence: ['31/214 re-engaged', 'No unsubscribe spikes'] },
  ],
}

