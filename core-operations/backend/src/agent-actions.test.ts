import assert from 'node:assert/strict'
import test from 'node:test'
import { assessReplenishmentOutcome, assertAgentActionTransition, assertRequiredWorkflowEvidence, buildBudgetReallocationProposal, buildCampaignLaunchProposal, buildCoordinationSummary, buildDeliveryRecoveryCompensation, buildDeliveryRecoveryProposal, buildEmergingSignals, buildExecutionAuditTrail, buildExpenseApprovalProposal, buildIntelligenceSnapshot, buildReceivableCollectionCompensation, buildReceivableCollectionProposal, buildReplenishmentCompensation, buildReplenishmentProposal, buildReplenishmentSimulation, detectAgentActionInteractions, getAgentWorkflowContract, registeredAgentWorkflowKinds, summarizeEconomicValue, summarizeSystemIntelligenceHealth } from './agent-actions.js'

test('replenishment proposal coordinates retail, logistics, and finance', () => {
  const proposal = buildReplenishmentProposal({
    productName: 'House Blend Coffee',
    sku: 'COF-001',
    currentStock: 8,
    reorderQuantity: 120,
    unitCostPence: 650,
    unitRetailPricePence: 1_200,
    supplier: 'Northstar Roasters',
    deliveryAddress: '1 Market Street, London',
  })
  assert.equal(proposal.kind, 'inventory.replenishment')
  assert.equal(proposal.estimatedValuePence, 78_000)
  assert.deepEqual(proposal.steps.map((step) => step.workspace), ['retail', 'logistics', 'finance'])
  assert.equal(proposal.steps.every((step) => step.status === 'pending'), true)
  const coordination = buildCoordinationSummary(proposal)
  assert.equal(coordination.workspaceCount, 3)
  assert.equal(coordination.cashImpactPence, 78_000)
  assert.deepEqual(coordination.workspaces, ['retail', 'logistics', 'finance'])
  assert.ok(coordination.decisionScore > 0)
  assert.match(coordination.expectedOutcome, /synchronized/)
  assert.equal(coordination.patternConfidence, 50)
  const simulation = buildReplenishmentSimulation(proposal)
  assert.equal(simulation.workspaces.length, 3)
  assert.match(simulation.disclaimer, /Read-only/)
  assert.match(simulation.workspaces[2].after, /£780.00/)
  assert.equal(simulation.workspaces.every((workspace) => workspace.secondOrderEffects.length === 2), true)
  assert.match(simulation.comparison.predictedDelta, /£780.00/)
})

test('completed replenishment assesses prediction accuracy from execution evidence', () => {
  const proposal = buildReplenishmentProposal({
    productName: 'House Blend Coffee',
    sku: 'COF-001',
    currentStock: 8,
    reorderQuantity: 120,
    unitCostPence: 650,
    unitRetailPricePence: 1_200,
    supplier: 'Northstar Roasters',
    deliveryAddress: '1 Market Street, London',
  })
  const assessment = assessReplenishmentOutcome(proposal, {
    result: { purchaseOrderId: 'po-1', deliveryId: 'in-1', billId: 'bill-1' },
    outcome: { summary: 'done', inventory: '120 units approved', logistics: 'inbound delivery booked', finance: '£780.00 cash commitment recorded' },
    eventRecords: [
      { type: 'workspace.record.created', source: 'retail', payload: { module: 'purchasing' } },
      { type: 'workspace.record.created', source: 'logistics', payload: { module: 'deliveries' } },
      { type: 'workspace.record.created', source: 'finance', payload: { module: 'bills' } },
    ],
  }, 78)
  assert.equal(assessment.accuracy, 100)
  assert.equal(assessment.predictedConfidence, 78)
  assert.equal(assessment.financialDeviationPence, 0)
  assert.deepEqual(assessment.economicOutcome, {
    cashGovernedPence: 78_000,
    marginProtectedPence: 66_000,
    inventoryUnitsProtected: 120,
    coordinatedHandoffs: 3,
    estimatedOperatorMinutesSaved: 24,
    basis: [
      'Cash governed uses the matched supplier-liability amount.',
      'Inventory protected uses the executed replenishment quantity.',
      'Time saved uses eight minutes per completed workspace handoff.',
      'Margin protected uses recorded unit selling price less unit cost.',
    ],
  })
  assert.deepEqual(assessment.deviations, [])
  assert.match(assessment.summary, /All 4 predicted effects matched/)
})

test('the internal workflow registry exposes only supported workflows', () => {
  assert.deepEqual(registeredAgentWorkflowKinds, ['inventory.replenishment', 'finance.receivables.collection', 'logistics.delivery.recovery', 'finance.expense.approval', 'marketing.campaign.launch', 'finance.budget.reallocation'])
  assert.deepEqual(getAgentWorkflowContract('inventory.replenishment'), {
    kind: 'inventory.replenishment',
    workspaces: ['retail', 'logistics', 'finance'],
    requiredEvidenceFields: ['historicalContext.similarSignals', 'historicalContext.completionRate', 'predictiveSignals.confidence'],
  })

})

test('expense approval and campaign launch preserve governed internal-only boundaries', () => {
  const expense = buildExpenseApprovalProposal({ description: 'Replacement laptop', requester: 'Maya Chen', category: 'Equipment', amountPence: 180_000 })
  const campaign = buildCampaignLaunchProposal({ campaignName: 'September reactivation', audience: 'Lapsed VIPs', channel: 'WhatsApp', budgetPence: 75_000 })
  const reallocation = buildBudgetReallocationProposal({ fromCategory: 'Events', toCategory: 'Retention', reason: 'Shift spend to proven channel', amountPence: 42_000 })
  assert.equal(expense.kind, 'finance.expense.approval')
  assert.equal(campaign.kind, 'marketing.campaign.launch')
  assert.equal(reallocation.kind, 'finance.budget.reallocation')
  assert.equal(getAgentWorkflowContract(expense.kind).workspaces.length, 2)
  assert.equal(getAgentWorkflowContract(campaign.kind).workspaces.length, 3)
  assert.equal(getAgentWorkflowContract(reallocation.kind).workspaces.length, 2)
})

test('receivables collection coordinates governed cash recovery without debiting a customer', () => {
  const proposal = buildReceivableCollectionProposal({ customerName: 'Harbour Cafe', invoiceReference: 'INV-1042', amountDuePence: 125_000, daysOverdue: 18, contactChannel: 'WhatsApp' })
  assert.equal(proposal.kind, 'finance.receivables.collection')
  assert.deepEqual(proposal.steps.map((step) => step.workspace), ['finance', 'retail', 'marketing'])
  assert.match(proposal.rationale, /overdue cash exposure/)
  assert.deepEqual(buildReceivableCollectionCompensation({ collectionCaseId: 'col-1', followUpId: 'crm-1', reminderId: 'rem-1' }).records.map((item) => item.status), ['Cancelled', 'Closed', 'Cancelled'])
})

test('delivery recovery coordinates service and remedy exposure without issuing a refund', () => {
  const proposal = buildDeliveryRecoveryProposal({ orderReference: 'ORD-2088', customerName: 'North & Co', issue: 'Carrier delay', orderValuePence: 64_000, promisedDate: '2026-09-19' })
  assert.equal(proposal.kind, 'logistics.delivery.recovery')
  assert.deepEqual(proposal.steps.map((step) => step.workspace), ['logistics', 'retail', 'finance'])
  assert.match(proposal.rationale, /without issuing an uncontrolled refund/)
  const compensation = buildDeliveryRecoveryCompensation({ exceptionId: 'exc-1', serviceCaseId: 'srv-1', reserveId: 'res-1' })
  assert.deepEqual(compensation.records.map((item) => item.status), ['Cancelled', 'Closed', 'Released'])
  assert.match(compensation.summary, /No refund/)
})

test('workflow evidence requirements fail closed', () => {
  assert.doesNotThrow(() => assertRequiredWorkflowEvidence(
    ['historicalContext.similarSignals', 'predictiveSignals.confidence'],
    { historicalContext: { similarSignals: 0 }, predictiveSignals: { confidence: 50 } },
  ))
  assert.throws(() => assertRequiredWorkflowEvidence(
    ['historicalContext.similarSignals', 'predictiveSignals.confidence'],
    { historicalContext: { similarSignals: 0 } },
  ), /predictiveSignals.confidence/)
})

test('agent actions require approval before execution and cannot be replayed', () => {
  assert.doesNotThrow(() => assertAgentActionTransition('proposed', 'approve'))
  assert.doesNotThrow(() => assertAgentActionTransition('proposed', 'reject'))
  assert.doesNotThrow(() => assertAgentActionTransition('approved', 'execute'))
  assert.throws(() => assertAgentActionTransition('proposed', 'execute'), { status: 409 })
  assert.throws(() => assertAgentActionTransition('completed', 'execute'), { status: 409 })
})

test('replenishment execution has deterministic internal compensation', () => {
  assert.deepEqual(buildReplenishmentCompensation({ purchaseOrderId: 'po-1', deliveryId: 'delivery-1', billId: 'bill-1' }), {
    summary: 'Cancelled the supplier order and inbound booking, and voided the scheduled supplier liability. No external payment was moved.',
    records: [
      { id: 'po-1', status: 'Cancelled', workspace: 'retail' },
      { id: 'delivery-1', status: 'Cancelled', workspace: 'logistics' },
      { id: 'bill-1', status: 'Voided', workspace: 'finance' },
    ],
  })
  assert.throws(() => buildReplenishmentCompensation({ purchaseOrderId: 'po-1' }), /incomplete/)
})

test('cross-action awareness detects shared supplier, cash, and logistics pressure', () => {
  const base = {
    kind: 'inventory.replenishment',
    status: 'proposed',
    steps: [{ workspace: 'retail' }, { workspace: 'logistics' }, { workspace: 'finance' }],
    predictiveSignals: {},
    outcomeAssessment: null,
    createdAt: new Date('2026-09-18T10:00:00.000Z'),
    executedAt: null,
  }
  const interactions = detectAgentActionInteractions([
    { ...base, id: 'one', title: 'Replenish coffee', input: { supplier: 'Northstar', sku: 'COF-1' }, estimatedValuePence: 78_000 },
    { ...base, id: 'two', title: 'Replenish filters', input: { supplier: 'Northstar', sku: 'FLT-1' }, estimatedValuePence: 145_000 },
  ], new Date('2026-09-18T11:00:00.000Z'))
  assert.equal(interactions.length, 1)
  assert.equal(interactions[0].severity, 'material')
  assert.deepEqual(interactions[0].dimensions, ['supplier', 'logistics', 'cash'])
  assert.match(interactions[0].advisory, /does not block/)
})

test('system intelligence health reports measured institutional memory', () => {
  const actions = [
    { id: 'one', kind: 'inventory.replenishment', title: 'One', status: 'completed', input: {}, steps: [], estimatedValuePence: 10_000, predictiveSignals: { confidence: 60, reliabilityScore: 70, refined: false }, outcomeAssessment: { accuracy: 80, deviations: [{ field: 'logistics.capacity' }] }, createdAt: new Date('2026-01-01'), executedAt: new Date('2026-01-02') },
    { id: 'two', kind: 'inventory.replenishment', title: 'Two', status: 'completed', input: {}, steps: [], estimatedValuePence: 20_000, predictiveSignals: { confidence: 78, reliabilityScore: 85, refined: true }, outcomeAssessment: { accuracy: 100, deviations: [{ field: 'logistics.capacity' }] }, createdAt: new Date('2026-02-01'), executedAt: new Date('2026-02-02') },
  ]
  const health = summarizeSystemIntelligenceHealth(actions, [])
  assert.equal(health.totalAssessedOutcomes, 2)
  assert.equal(health.averagePredictionAccuracy, 90)
  assert.equal(health.refinedPatterns, 1)
  assert.equal(health.confidenceImprovement, 18)
  assert.equal(health.averageReliability, 85)
  assert.deepEqual(health.recurringDeviation, {
    field: 'logistics.capacity',
    count: 2,
    insight: 'logistics.capacity deviated in 2 assessed outcomes; review this dimension when evaluating similar proposals.',
  })
})

test('intelligence snapshot reports recent accuracy progress and learning momentum', () => {
  const actions = Array.from({ length: 20 }, (_, index) => ({
    id: `action-${index}`,
    kind: 'inventory.replenishment',
    title: `Action ${index}`,
    status: 'completed',
    input: {},
    steps: [],
    estimatedValuePence: 10_000,
    predictiveSignals: { confidence: 60 + index, reliabilityScore: 84, refined: true },
    outcomeAssessment: { accuracy: index < 10 ? 78 : 90, deviations: [] },
    createdAt: new Date(2026, 0, index + 1),
    executedAt: new Date(2026, 0, index + 1),
  }))
  const snapshot = buildIntelligenceSnapshot(actions, [])
  assert.equal(snapshot.recentAccuracyTrend.change, 12)
  assert.equal(snapshot.recentAccuracyTrend.assessmentWindow, 20)
  assert.match(snapshot.recentAccuracyTrend.narrative, /improved \+12% over the last 20 assessments/)
  assert.equal(snapshot.learningMomentum.label, 'compounding')
})

test('emerging signals explain recurring deviations, interactions, and strong precedents', () => {
  const actions = [
    { id: 'one', kind: 'inventory.replenishment', title: 'Replenish coffee', status: 'completed', input: { supplier: 'Northstar', sku: 'COF-1' }, steps: [{ workspace: 'logistics' }], estimatedValuePence: 78_000, predictiveSignals: { confidence: 78, reliabilityScore: 84, averageAccuracy: 91, assessedOutcomes: 14, refined: true }, outcomeAssessment: { accuracy: 90, deviations: [{ field: 'logistics.capacity' }] }, createdAt: new Date('2026-09-01'), executedAt: new Date('2026-09-02') },
    { id: 'two', kind: 'inventory.replenishment', title: 'Replenish filters', status: 'proposed', input: { supplier: 'Northstar', sku: 'FLT-1' }, steps: [{ workspace: 'logistics' }], estimatedValuePence: 57_600, predictiveSignals: { confidence: 80, reliabilityScore: 86, averageAccuracy: 92, assessedOutcomes: 15, refined: true }, outcomeAssessment: { accuracy: 94, deviations: [{ field: 'logistics.capacity' }] }, createdAt: new Date('2026-09-10'), executedAt: null },
  ]
  const interactions = detectAgentActionInteractions(actions, new Date('2026-09-18'))
  const signals = buildEmergingSignals(actions, interactions)
  assert.deepEqual(signals.map((signal) => signal.kind), ['recurring-deviation', 'cross-action-risk', 'strong-precedent'])
  assert.equal(signals.every((signal) => signal.evidence.length >= 3), true)
  assert.match(signals[0].advisory, /advisory/)
  assert.equal(signals[2].reliability, 86)
})

test('economic value uses measured lifecycle evidence and states its methodology', () => {
  const actions = [
    { id: 'done', kind: 'inventory.replenishment', title: 'Done', status: 'completed', input: { reorderQuantity: 120, unitCostPence: 650, unitRetailPricePence: 1_200 }, steps: [{ workspace: 'retail' }, { workspace: 'logistics' }, { workspace: 'finance' }], estimatedValuePence: 78_000, predictiveSignals: {}, outcomeAssessment: { accuracy: 100 }, createdAt: new Date('2026-09-01'), executedAt: new Date('2026-09-02') },
    { id: 'rejected', kind: 'inventory.replenishment', title: 'Rejected', status: 'rejected', input: { reorderQuantity: 50, unitCostPence: 500 }, steps: [{ workspace: 'retail' }], estimatedValuePence: 25_000, predictiveSignals: {}, outcomeAssessment: null, createdAt: new Date('2026-09-03'), executedAt: null },
  ]
  const value = summarizeEconomicValue(actions)
  assert.equal(value.cashGovernedPence, 78_000)
  assert.equal(value.cashPreservedPence, 25_000)
  assert.equal(value.marginProtectedPence, 66_000)
  assert.equal(value.inventoryUnitsProtected, 120)
  assert.equal(value.riskReducedActions, 1)
  assert.equal(value.coordinatedHandoffs, 3)
  assert.equal(value.estimatedOperatorMinutesSaved, 24)
  assert.match(value.methodology.join(' '), /not claimed savings/)
})

test('execution audit trail preserves human gates and compensation evidence', () => {
  const action = { id: 'action-1', kind: 'inventory.replenishment', title: 'Replenish coffee', status: 'completed', input: {}, steps: [], estimatedValuePence: 78_000, predictiveSignals: {}, outcomeAssessment: { accuracy: 100 }, createdAt: new Date('2026-09-01'), executedAt: new Date('2026-09-02') }
  const audit = buildExecutionAuditTrail([action], [
    { id: 'approved', type: 'agent.action.approved', payload: { actionId: 'action-1', decisionBy: 'owner-1' }, createdAt: new Date('2026-09-01T10:00:00Z') },
    { id: 'completed', type: 'agent.action.completed', payload: { actionId: 'action-1', executedBy: 'owner-1', outcomeSummary: 'Three internal records created.' }, createdAt: new Date('2026-09-01T10:01:00Z') },
    { id: 'reversed', type: 'agent.action.execution.reversed', payload: { actionId: 'action-1', reversedBy: 'owner-1', compensation: { summary: 'Three internal records compensated.' } }, createdAt: new Date('2026-09-01T10:02:00Z') },
  ])
  assert.deepEqual(audit.map((entry) => entry.stage), ['reversed', 'executed', 'approved'])
  assert.equal(audit[0].actor, 'owner-1')
  assert.match(audit[2].summary, /no workspace changes executed/)
})
