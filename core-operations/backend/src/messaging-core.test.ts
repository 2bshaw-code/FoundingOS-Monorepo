import assert from 'node:assert/strict'
import test from 'node:test'
import { classifyMessagingIntent, describeWhatsAppMessageBody, extractWhatsAppMessages } from './messaging-intents.js'
import { buildIntelligenceBrief, explainActionForMessaging } from './intelligence-messaging.js'

test('classifies structured and natural-language orders', () => {
  assert.deepEqual(classifyMessagingIntent('/order John | 2x Blue T-shirts | £45.50 | 4 High Street'), {
    type: 'create_order',
    customer: 'John',
    detail: '2x Blue T-shirts',
    totalPence: 4550,
    deliveryAddress: '4 High Street',
  })
  assert.deepEqual(classifyMessagingIntent('New order for Sarah - 3 notebooks, deliver tomorrow'), {
    type: 'create_order',
    customer: 'Sarah',
    detail: '3 notebooks, deliver tomorrow',
    totalPence: 0,
  })
})

test('classifies operational commands', () => {
  assert.deepEqual(classifyMessagingIntent('today'), { type: 'status' })
  assert.deepEqual(classifyMessagingIntent('/delivered ORD-42'), { type: 'mark_delivered', reference: 'ORD-42' })
  assert.deepEqual(classifyMessagingIntent('/invoice ORD-42'), { type: 'create_invoice', reference: 'ORD-42' })
  assert.deepEqual(classifyMessagingIntent('/campaign Summer Sale | returning customers | Reactivation'), {
    type: 'create_campaign',
    name: 'Summer Sale',
    audience: 'returning customers',
    objective: 'Reactivation',
  })
})

test('classifies human-approved intelligence commands', () => {
  assert.deepEqual(classifyMessagingIntent('Approve action-42'), { type: 'agent_decision', decision: 'approve', actionReference: 'action-42' })
  assert.deepEqual(classifyMessagingIntent('REJECT'), { type: 'agent_decision', decision: 'reject', actionReference: undefined })
  assert.deepEqual(classifyMessagingIntent('why'), { type: 'agent_explanation', detail: 'why', actionReference: undefined })
  assert.deepEqual(classifyMessagingIntent('impact'), { type: 'agent_explanation', detail: 'impact', actionReference: undefined })
  assert.deepEqual(classifyMessagingIntent("What's the impact?"), { type: 'agent_explanation', detail: 'impact', actionReference: undefined })
  assert.deepEqual(classifyMessagingIntent('show me the evidence'), { type: 'agent_explanation', detail: 'why', actionReference: undefined })
  assert.deepEqual(classifyMessagingIntent('tell me more'), { type: 'agent_explanation', detail: 'more', actionReference: undefined })
  assert.deepEqual(classifyMessagingIntent('execute action-42'), { type: 'agent_execution', operation: 'execute', actionReference: 'action-42' })
  assert.deepEqual(classifyMessagingIntent('undo'), { type: 'agent_execution', operation: 'reverse', actionReference: undefined })
  assert.deepEqual(classifyMessagingIntent('/snapshot'), { type: 'intelligence_snapshot' })
})

test('formats concise low-bandwidth intelligence with traceable decisions', () => {
  const action = {
    id: 'action-42', title: 'Replenish coffee', status: 'proposed', summary: 'Low stock', rationale: 'Protect sales', riskLevel: 'medium', estimatedValuePence: 78_000,
    input: { currentStock: 8, reorderQuantity: 120, supplier: 'Northstar' },
    steps: [{ workspace: 'retail' }, { workspace: 'logistics' }, { workspace: 'finance' }],
    coordinationSummary: { scoreExplanation: ['3 workspaces coordinated', '£780 financial impact'] },
    historicalContext: { similarSignals: 14, completionRate: 86 },
    predictiveSignals: { confidence: 78, reliabilityScore: 84, averageAccuracy: 91, assessedOutcomes: 14 },
    simulationPreview: { comparison: { approve: ['120 units enter a governed commitment.'], reject: ['Stockout exposure remains.'], predictedDelta: 'Approval trades cash for stock cover.' } },
    outcomeAssessment: null,
  }
  const summary = {
    interactions: [{ id: 'related', actionIds: ['action-42', 'action-43'] as [string, string], actionTitles: ['Coffee', 'Filters'] as [string, string], severity: 'watch' as const, dimensions: ['supplier' as const], summary: 'Two actions share a supplier.', evidence: ['Northstar'], advisory: 'Review timing.' }],
    health: { totalAssessedOutcomes: 14, averagePredictionAccuracy: 91, refinedPatterns: 1, confidenceImprovement: 12, averageReliability: 84, activePatterns: 1, interactionCount: 1, recurringDeviation: null, narrative: 'Healthy' },
    emergingSignals: [{ id: 'signal', kind: 'cross-action-risk' as const, severity: 'watch' as const, title: 'Supplier pressure', summary: 'Two orders share one window.', reliability: 84, outcomeCount: 14, evidence: ['Northstar'], advisory: 'Review timing.' }],
    snapshot: {
      totalAssessedOutcomes: 14,
      refinedPatterns: 1,
      activeInteractions: 1,
      recentAccuracyTrend: { current: 91, previous: 79, change: 12, assessmentWindow: 20, narrative: 'Prediction accuracy has improved +12% over the last 20 assessments.' },
      learningMomentum: { score: 86, label: 'compounding' as const, narrative: 'Learning.' },
      economicValue: { cashGovernedPence: 780_000, cashPreservedPence: 57_600, marginProtectedPence: 660_000, inventoryUnitsProtected: 1_200, riskReducedActions: 10, coordinatedHandoffs: 42, estimatedOperatorMinutesSaved: 336, measuredOutcomes: 14, narrative: 'Measured.', methodology: ['Measured only.'] },
    },
    auditTrail: [{ id: 'audit-1', actionId: 'action-42', actionTitle: 'Replenish coffee', stage: 'assessed' as const, actor: 'FoundAI', occurredAt: '2026-09-18T10:00:00.000Z', summary: 'Outcome assessed.', evidence: ['Event assessed'] }],
  }
  const brief = buildIntelligenceBrief(summary, action)
  assert.match(brief, /£7,800.00 governed/)
  assert.match(brief, /NEXT\nReply APPROVE or REJECT/)
  assert.match(brief, /Advisory only/)
  assert.ok(brief.length < 1_000)
  assert.match(explainActionForMessaging(action, 'more', summary), /Audit: 1 lifecycle events/)
  assert.match(explainActionForMessaging(action, 'impact', summary), /AFTER: 120 units governed/)
  assert.match(explainActionForMessaging(action, 'impact', summary), /MARGIN:/)
})

test('extracts inbound WhatsApp messages with account context', () => {
  assert.deepEqual(extractWhatsAppMessages({
    object: 'whatsapp_business_account',
    entry: [{
      changes: [{
        value: {
          metadata: { phone_number_id: 'phone-1' },
          contacts: [{ profile: { name: 'Bobby' } }],
          messages: [{ id: 'wamid.1', from: '447700900000', type: 'text', text: { body: '/status' } }],
        },
      }],
    }],
  }), [{
    phoneNumberId: 'phone-1',
    contactName: 'Bobby',
    message: { id: 'wamid.1', from: '447700900000', type: 'text', text: { body: '/status' } },
  }])
})

test('describes non-text WhatsApp messages honestly, without inventing content', () => {
  assert.equal(describeWhatsAppMessageBody({ type: 'text', text: { body: 'Hello there' } }), 'Hello there')
  assert.equal(describeWhatsAppMessageBody({ type: 'image', image: { caption: 'Here is the invoice' } }), '📷 Photo: Here is the invoice')
  assert.equal(describeWhatsAppMessageBody({ type: 'image' }), '📷 Photo (not yet viewable in FoundingOS)')
  assert.equal(describeWhatsAppMessageBody({ type: 'document', document: { filename: 'contract.pdf' } }), '📎 Document: contract.pdf')
  assert.equal(describeWhatsAppMessageBody({ type: 'audio' }), '🎤 Voice note (not yet playable in FoundingOS)')
  assert.equal(describeWhatsAppMessageBody({ type: 'location', location: { name: 'Shop' } }), '📍 Shared location: Shop')
  assert.equal(describeWhatsAppMessageBody({ type: 'unsupported_type' }), 'Sent a unsupported type message (not yet supported in FoundingOS)')
})
