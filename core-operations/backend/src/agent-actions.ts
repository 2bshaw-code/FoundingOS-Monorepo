/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Prisma } from './generated/prisma/index.js'
import { prisma } from './auth.js'
import { predictEventPattern, summarizeEventPattern, type PredictivePattern } from './event-feed.js'

export const agentActionStatuses = ['proposed', 'approved', 'rejected', 'completed'] as const
export type AgentActionStatus = typeof agentActionStatuses[number]
export type AgentActionStep = {
  id: string
  workspace: 'retail' | 'logistics' | 'finance' | 'marketing'
  module: string
  action: string
  description: string
  status: 'pending' | 'completed'
}

export type ReplenishmentInput = {
  productName: string
  sku: string
  currentStock: number
  reorderQuantity: number
  unitCostPence: number
  unitRetailPricePence?: number
  supplier: string
  deliveryAddress: string
}

export type HistoricalContext = Awaited<ReturnType<typeof summarizeEventPattern>>
export type CoordinationSummary = {
  workspaces: AgentActionStep['workspace'][]
  workspaceCount: number
  inventoryRisk: string
  cashImpactPence: number
  logisticsLoad: string
  expectedOutcome: string
  tradeoffs: string[]
  patternConfidence: number
  decisionScore: number
  scoreExplanation: string[]
}
export type SimulationPreview = {
  generatedAt: string
  disclaimer: string
  workspaces: Array<{
    workspace: AgentActionStep['workspace']
    before: string
    after: string
    effect: string
    secondOrderEffects: string[]
  }>
  comparison: {
    approve: string[]
    reject: string[]
    predictedDelta: string
  }
}
export type OutcomeAssessment = {
  accuracy: number
  predictedConfidence: number
  matched: string[]
  deviations: Array<{ field: string; predicted: string; actual: string; delta: string }>
  financialDeviationPence: number
  economicOutcome: {
    cashGovernedPence: number
    marginProtectedPence: number | null
    inventoryUnitsProtected: number
    coordinatedHandoffs: number
    estimatedOperatorMinutesSaved: number
    basis: string[]
  }
  summary: string
}
type IntelligenceAction = {
  id: string
  kind: string
  title: string
  status: string
  input: unknown
  steps: unknown
  estimatedValuePence: number | null
  predictiveSignals: unknown
  outcomeAssessment: unknown
  createdAt: Date
  executedAt: Date | null
}
export type ActionInteraction = {
  id: string
  actionIds: [string, string]
  actionTitles: [string, string]
  severity: 'watch' | 'material'
  dimensions: Array<'supplier' | 'sku' | 'cash' | 'logistics'>
  summary: string
  evidence: string[]
  advisory: string
}
export type SystemIntelligenceHealth = {
  totalAssessedOutcomes: number
  averagePredictionAccuracy: number
  refinedPatterns: number
  confidenceImprovement: number
  averageReliability: number
  activePatterns: number
  interactionCount: number
  recurringDeviation: { field: string; count: number; insight: string } | null
  narrative: string
}
export type EmergingSignal = {
  id: string
  kind: 'recurring-deviation' | 'cross-action-risk' | 'strong-precedent'
  severity: 'watch' | 'material' | 'positive'
  title: string
  summary: string
  reliability: number
  outcomeCount: number
  evidence: string[]
  advisory: string
}
export type IntelligenceSnapshot = {
  totalAssessedOutcomes: number
  refinedPatterns: number
  activeInteractions: number
  recentAccuracyTrend: {
    current: number
    previous: number
    change: number
    assessmentWindow: number
    narrative: string
  }
  learningMomentum: {
    score: number
    label: 'establishing' | 'building' | 'compounding'
    narrative: string
  }
  economicValue: {
    cashGovernedPence: number
    cashPreservedPence: number
    marginProtectedPence: number | null
    inventoryUnitsProtected: number
    riskReducedActions: number
    coordinatedHandoffs: number
    estimatedOperatorMinutesSaved: number
    measuredOutcomes: number
    narrative: string
    methodology: string[]
  }
}
export type ExecutionAuditEntry = {
  id: string
  actionId: string
  actionTitle: string
  stage: 'proposed' | 'approved' | 'rejected' | 'executed' | 'assessed' | 'reversed'
  actor: string
  occurredAt: string
  summary: string
  evidence: string[]
}

type BuiltProposal =
  | ReturnType<typeof buildReplenishmentProposal>
  | ReturnType<typeof buildReceivableCollectionProposal>
  | ReturnType<typeof buildDeliveryRecoveryProposal>
  | ReturnType<typeof buildExpenseApprovalProposal>
  | ReturnType<typeof buildCampaignLaunchProposal>
  | ReturnType<typeof buildBudgetReallocationProposal>
type WorkflowExecution = {
  result: Record<string, string>
  outcome: Record<string, string> & { summary: string }
  eventRecords: Array<{ type: string; source: string; payload: Record<string, unknown> }>
}
type WorkflowContext = {
  tx: Prisma.TransactionClient
  tenantId: string
  actorId: string
  actionId: string
  proposal: BuiltProposal
}
type AgentWorkflowDefinition = {
  kind: string
  coordinationTemplate: {
    workspaces: AgentActionStep['workspace'][]
    requiredEvidenceFields: string[]
  }
  buildProposal: (input: Record<string, unknown>) => BuiltProposal
  buildCoordinationSummary: (proposal: BuiltProposal, prediction: PredictivePattern) => CoordinationSummary
  buildSimulationPreview: (proposal: BuiltProposal) => SimulationPreview
  execute: (context: WorkflowContext) => Promise<WorkflowExecution>
  summarizeOutcome: (outcome: WorkflowExecution['outcome']) => string
  assessOutcome: (proposal: BuiltProposal, execution: WorkflowExecution, predictedConfidence: number) => OutcomeAssessment
  buildCompensation: (effects: unknown) => {
    summary: string
    records: Array<{ id: string; status: string; workspace: string }>
  }
}

const json = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue
const stringArray = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
const requiredText = (value: unknown, label: string, max = 160) => {
  const result = String(value ?? '').trim()
  if (!result) throw Object.assign(new Error(`${label} is required`), { status: 400 })
  return result.slice(0, max)
}
const positiveInteger = (value: unknown, label: string, maximum: number) => {
  const result = Number(value)
  if (!Number.isInteger(result) || result <= 0 || result > maximum) throw Object.assign(new Error(`${label} must be a positive whole number`), { status: 400 })
  return result
}
const record = (value: unknown) => value && typeof value === 'object' ? value as Record<string, unknown> : {}
const lower = (value: unknown) => String(value || '').trim().toLowerCase()
const actionWorkspaces = (action: IntelligenceAction) => Array.isArray(action.steps)
  ? [...new Set(action.steps.map((step) => lower(record(step).workspace)).filter(Boolean))]
  : []
const optionalPositiveInteger = (value: unknown, label: string, maximum: number) => {
  if (value === undefined || value === null || value === '') return undefined
  return positiveInteger(value, label, maximum)
}
const proposalFor = <Kind extends BuiltProposal['kind']>(proposal: BuiltProposal, kind: Kind) => {
  if (proposal.kind !== kind) throw Object.assign(new Error(`Workflow proposal kind must be ${kind}`), { status: 422 })
  return proposal as Extract<BuiltProposal, { kind: Kind }>
}

export function summarizeEconomicValue(actions: IntelligenceAction[]): IntelligenceSnapshot['economicValue'] {
  let cashGovernedPence = 0
  let cashPreservedPence = 0
  let marginProtectedPence = 0
  let hasMarginEvidence = false
  let inventoryUnitsProtected = 0
  let riskReducedActions = 0
  let coordinatedHandoffs = 0
  let estimatedOperatorMinutesSaved = 0
  let measuredOutcomes = 0

  for (const action of actions) {
    const input = record(action.input)
    const assessment = record(action.outcomeAssessment)
    const accuracy = Number(assessment.accuracy)
    const quantity = Math.max(0, Number(input.reorderQuantity || 0))
    const stepCount = actionWorkspaces(action).length
    if (action.status === 'rejected') cashPreservedPence += Math.max(0, Number(action.estimatedValuePence || 0))
    if (action.status !== 'completed' || !Number.isFinite(accuracy)) continue
    measuredOutcomes += 1
    cashGovernedPence += Math.max(0, Number(action.estimatedValuePence || 0))
    inventoryUnitsProtected += quantity
    coordinatedHandoffs += stepCount
    estimatedOperatorMinutesSaved += stepCount * 8
    if (accuracy >= 75) riskReducedActions += 1
    const unitRetailPricePence = Number(input.unitRetailPricePence)
    const unitCostPence = Number(input.unitCostPence)
    if (Number.isFinite(unitRetailPricePence) && Number.isFinite(unitCostPence) && unitRetailPricePence >= unitCostPence) {
      marginProtectedPence += Math.round((unitRetailPricePence - unitCostPence) * quantity)
      hasMarginEvidence = true
    }
  }

  return {
    cashGovernedPence,
    cashPreservedPence,
    marginProtectedPence: hasMarginEvidence ? marginProtectedPence : null,
    inventoryUnitsProtected,
    riskReducedActions,
    coordinatedHandoffs,
    estimatedOperatorMinutesSaved,
    measuredOutcomes,
    narrative: measuredOutcomes
      ? `${measuredOutcomes} measured outcome${measuredOutcomes === 1 ? '' : 's'} governed £${(cashGovernedPence / 100).toFixed(2)} across ${coordinatedHandoffs} workspace handoffs and protected ${inventoryUnitsProtected} inventory units.`
      : 'Economic value measurement begins when the first approved action completes and its outcome is assessed.',
    methodology: [
      'Cash governed is completed internal commitment value; it is not claimed savings.',
      'Cash preserved is the immediate commitment avoided by recorded rejections.',
      'Margin protected is reported only when both unit cost and selling-price evidence exist.',
      'Time saved uses a conservative eight-minute benchmark per completed cross-workspace handoff.',
      'Risk reduced counts completed actions with at least 75% measured outcome accuracy.',
    ],
  }
}

export function buildExecutionAuditTrail(
  actions: IntelligenceAction[],
  events: Array<{ id: string; type: string; payload: unknown; createdAt: Date }>,
): ExecutionAuditEntry[] {
  const titles = new Map(actions.map((action) => [action.id, action.title]))
  const stages: Record<string, ExecutionAuditEntry['stage']> = {
    'agent.action.proposed': 'proposed',
    'agent.action.approved': 'approved',
    'agent.action.rejected': 'rejected',
    'agent.action.completed': 'executed',
    'agent.action.outcome.assessed': 'assessed',
    'agent.action.execution.reversed': 'reversed',
  }
  return events.flatMap((event) => {
    const stage = stages[event.type]
    const payload = record(event.payload)
    const actionId = String(payload.actionId || '')
    if (!stage || !actionId || !titles.has(actionId)) return []
    const actor = String(payload.decisionBy || payload.executedBy || payload.reversedBy || 'FoundingOS workflow')
    const summary = stage === 'approved'
      ? 'Human approval recorded; no workspace changes executed.'
      : stage === 'rejected'
        ? 'Human rejection recorded; the proposed cash commitment was not created.'
        : stage === 'executed'
          ? String(payload.outcomeSummary || 'Approved internal workspace effects completed.')
          : stage === 'assessed'
            ? String(payload.summary || 'The actual outcome was assessed against the original prediction.')
            : stage === 'reversed'
              ? String(record(payload.compensation).summary || 'Internal execution effects were compensated.')
              : 'Shared Event Feed signal produced a governed action proposal.'
    return [{
      id: event.id,
      actionId,
      actionTitle: titles.get(actionId)!,
      stage,
      actor,
      occurredAt: event.createdAt.toISOString(),
      summary,
      evidence: [
        `Event ${event.type}`,
        `Action ${actionId}`,
        ...(payload.sourceEventId ? [`Origin ${String(payload.sourceEventId)}`] : []),
      ],
    }]
  }).sort((left, right) => right.occurredAt.localeCompare(left.occurredAt)).slice(0, 50)
}

export function detectAgentActionInteractions(actions: IntelligenceAction[], now = new Date()): ActionInteraction[] {
  const recentCutoff = now.getTime() - 30 * 24 * 60 * 60_000
  const relevant = actions.filter((action) =>
    ['proposed', 'approved', 'executing'].includes(action.status)
    || (action.status === 'completed' && Boolean(action.executedAt) && action.executedAt!.getTime() >= recentCutoff))
  const interactions: ActionInteraction[] = []
  for (let leftIndex = 0; leftIndex < relevant.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < relevant.length; rightIndex += 1) {
      const left = relevant[leftIndex]
      const right = relevant[rightIndex]
      const leftInput = record(left.input)
      const rightInput = record(right.input)
      const dimensions: ActionInteraction['dimensions'] = []
      const evidence: string[] = []
      if (lower(leftInput.supplier) && lower(leftInput.supplier) === lower(rightInput.supplier)) {
        dimensions.push('supplier')
        evidence.push(`Both actions use ${String(leftInput.supplier)}`)
      }
      if (lower(leftInput.sku) && lower(leftInput.sku) === lower(rightInput.sku)) {
        dimensions.push('sku')
        evidence.push(`Both actions affect SKU ${String(leftInput.sku)}`)
      }
      const commonWorkspaces = actionWorkspaces(left).filter((workspace) => actionWorkspaces(right).includes(workspace))
      if (commonWorkspaces.includes('logistics')) {
        dimensions.push('logistics')
        evidence.push('Both actions require inbound logistics capacity')
      }
      const combinedCash = (left.estimatedValuePence || 0) + (right.estimatedValuePence || 0)
      const bothPending = left.status !== 'completed' && right.status !== 'completed'
      if (bothPending && combinedCash > 0) {
        dimensions.push('cash')
        evidence.push(`Combined pending cash commitment is £${(combinedCash / 100).toFixed(2)}`)
      }
      const meaningful = dimensions.includes('supplier') || dimensions.includes('sku') || dimensions.length >= 2
      if (!meaningful) continue
      const severity = dimensions.includes('sku') || combinedCash >= 200_000 ? 'material' : 'watch'
      interactions.push({
        id: [left.id, right.id].sort().join(':'),
        actionIds: [left.id, right.id],
        actionTitles: [left.title, right.title],
        severity,
        dimensions: [...new Set(dimensions)],
        summary: `${left.title} and ${right.title} may interact across ${[...new Set(dimensions)].join(', ')}.`,
        evidence,
        advisory: 'Review the combined timing and capacity impact before approving either action. This advisory does not block execution.',
      })
    }
  }
  return interactions.slice(0, 20)
}

export function summarizeSystemIntelligenceHealth(actions: IntelligenceAction[], interactions: ActionInteraction[]): SystemIntelligenceHealth {
  const assessments = actions.map((action) => record(action.outcomeAssessment)).filter((assessment) => Number.isFinite(Number(assessment.accuracy)))
  const accuracies = assessments.map((assessment) => Math.min(100, Math.max(0, Number(assessment.accuracy))))
  const patterns = new Map<string, { refined: boolean; reliability: number; confidence: number; createdAt: Date }>()
  for (const action of [...actions].sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime())) {
    const prediction = record(action.predictiveSignals)
    if (!Object.keys(prediction).length) continue
    patterns.set(action.kind, {
      refined: Boolean(prediction.refined),
      reliability: Number(prediction.reliabilityScore || 0),
      confidence: Number(prediction.confidence || 0),
      createdAt: action.createdAt,
    })
  }
  const confidenceHistory = actions
    .map((action) => ({ confidence: Number(record(action.predictiveSignals).confidence || 0), createdAt: action.createdAt }))
    .filter((item) => item.confidence > 0)
    .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
  const confidenceImprovement = confidenceHistory.length > 1
    ? confidenceHistory.at(-1)!.confidence - confidenceHistory[0].confidence
    : 0
  const patternValues = [...patterns.values()]
  const averagePredictionAccuracy = accuracies.length ? Math.round(accuracies.reduce((total, value) => total + value, 0) / accuracies.length) : 0
  const averageReliability = patternValues.length ? Math.round(patternValues.reduce((total, pattern) => total + pattern.reliability, 0) / patternValues.length) : 0
  const refinedPatterns = patternValues.filter((pattern) => pattern.refined).length
  const deviationCounts = new Map<string, number>()
  for (const assessment of assessments) {
    const deviations = Array.isArray(assessment.deviations) ? assessment.deviations : []
    for (const deviation of deviations) {
      const field = String(record(deviation).field || '').trim()
      if (field) deviationCounts.set(field, (deviationCounts.get(field) || 0) + 1)
    }
  }

  const recurringEntry = [...deviationCounts.entries()].sort((left, right) => right[1] - left[1])[0]
  const recurringDeviation = recurringEntry && recurringEntry[1] >= 2
    ? {
        field: recurringEntry[0],
        count: recurringEntry[1],
        insight: `${recurringEntry[0]} deviated in ${recurringEntry[1]} assessed outcomes; review this dimension when evaluating similar proposals.`,
      }
    : null
  return {
    totalAssessedOutcomes: assessments.length,
    averagePredictionAccuracy,
    refinedPatterns,
    confidenceImprovement,
    averageReliability,
    activePatterns: patterns.size,
    interactionCount: interactions.length,
    recurringDeviation,
    narrative: assessments.length
      ? `${assessments.length} measured outcome${assessments.length === 1 ? '' : 's'} average ${averagePredictionAccuracy}% accuracy; ${refinedPatterns} pattern${refinedPatterns === 1 ? '' : 's'} meet the refined evidence threshold.`
      : 'Outcome learning is ready; the first completed action will establish the initial measured accuracy baseline.',
  }
}

export function buildIntelligenceSnapshot(
  actions: IntelligenceAction[],
  interactions: ActionInteraction[],
  health = summarizeSystemIntelligenceHealth(actions, interactions),
): IntelligenceSnapshot {
  const measured = actions
    .map((action) => ({ accuracy: Number(record(action.outcomeAssessment).accuracy), createdAt: action.createdAt }))
    .filter((item) => Number.isFinite(item.accuracy))
    .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
    .slice(-20)
  const midpoint = Math.max(1, Math.floor(measured.length / 2))
  const previousValues = measured.length > 1 ? measured.slice(0, midpoint).map((item) => item.accuracy) : measured.map((item) => item.accuracy)
  const currentValues = measured.length > 1 ? measured.slice(midpoint).map((item) => item.accuracy) : measured.map((item) => item.accuracy)
  const average = (values: number[]) => values.length ? Math.round(values.reduce((total, value) => total + value, 0) / values.length) : 0
  const previous = average(previousValues)
  const current = average(currentValues)
  const change = current - previous
  const score = Math.min(100, Math.max(0, Math.round(
    health.averagePredictionAccuracy * .45
    + health.averageReliability * .35
    + Math.min(10, health.refinedPatterns * 4)
    + Math.max(-10, Math.min(10, change)),
  )))
  const label = score >= 80 && health.totalAssessedOutcomes >= 10
    ? 'compounding'
    : score >= 50 || health.totalAssessedOutcomes >= 4
      ? 'building'
      : 'establishing'
  return {
    totalAssessedOutcomes: health.totalAssessedOutcomes,
    refinedPatterns: health.refinedPatterns,
    activeInteractions: interactions.length,
    recentAccuracyTrend: {
      current,
      previous,
      change,
      assessmentWindow: measured.length,
      narrative: measured.length > 1
        ? `Prediction accuracy has ${change >= 0 ? 'improved' : 'changed'} ${change >= 0 ? '+' : ''}${change}% over the last ${measured.length} assessments.`
        : 'More assessed outcomes are needed to establish an accuracy trend.',
    },
    learningMomentum: {
      score,
      label,
      narrative: label === 'compounding'
        ? 'Measured outcomes are strengthening reliable patterns and improving future decision context.'
        : label === 'building'
          ? 'Outcome evidence is accumulating and beginning to strengthen repeatable patterns.'
          : 'The system is establishing its first measured baselines from completed actions.',
    },
    economicValue: summarizeEconomicValue(actions),
  }
}

export function buildEmergingSignals(
  actions: IntelligenceAction[],
  interactions: ActionInteraction[],
  health = summarizeSystemIntelligenceHealth(actions, interactions),
): EmergingSignal[] {
  const signals: EmergingSignal[] = []
  if (health.recurringDeviation) {
    signals.push({
      id: `deviation:${health.recurringDeviation.field}`,
      kind: 'recurring-deviation',
      severity: 'watch',
      title: 'Recurring prediction deviation',
      summary: health.recurringDeviation.insight,
      reliability: health.averageReliability,
      outcomeCount: health.recurringDeviation.count,
      evidence: [
        `${health.recurringDeviation.count} assessed outcomes share the same deviation`,
        `${health.averagePredictionAccuracy}% average measured prediction accuracy`,
        `${health.averageReliability}% current pattern reliability`,
      ],
      advisory: 'Review this dimension before approving similar proposals. This signal is advisory and cannot execute or block work.',
    })
  }
  const leadingInteraction = [...interactions].sort((left, right) =>
    (right.severity === 'material' ? 1 : 0) - (left.severity === 'material' ? 1 : 0)
    || right.dimensions.length - left.dimensions.length)[0]
  if (leadingInteraction) {
    signals.push({
      id: `interaction:${leadingInteraction.id}`,
      kind: 'cross-action-risk',
      severity: leadingInteraction.severity,
      title: 'Cross-workspace pressure is building',
      summary: leadingInteraction.summary,
      reliability: health.averageReliability,
      outcomeCount: health.totalAssessedOutcomes,
      evidence: [...leadingInteraction.evidence, `${health.averageReliability}% supporting pattern reliability`],
      advisory: leadingInteraction.advisory,
    })
  }
  const strongestPrecedent = actions
    .map((action) => ({ action, prediction: record(action.predictiveSignals) }))
    .filter(({ prediction }) => Boolean(prediction.refined) || Number(prediction.reliabilityScore || 0) >= 75)
    .sort((left, right) => Number(right.prediction.reliabilityScore || 0) - Number(left.prediction.reliabilityScore || 0))[0]
  if (strongestPrecedent) {
    const reliability = Number(strongestPrecedent.prediction.reliabilityScore || 0)
    const outcomes = Number(strongestPrecedent.prediction.assessedOutcomes || health.totalAssessedOutcomes)
    signals.push({
      id: `precedent:${strongestPrecedent.action.kind}`,
      kind: 'strong-precedent',
      severity: 'positive',
      title: 'Historical precedent is strengthening',
      summary: `${strongestPrecedent.action.title} is supported by a ${reliability}% reliable pattern across ${outcomes} assessed outcomes.`,
      reliability,
      outcomeCount: outcomes,
      evidence: [
        `${outcomes} assessed outcomes inform this pattern`,
        `${Number(strongestPrecedent.prediction.averageAccuracy || health.averagePredictionAccuracy)}% average measured accuracy`,
        `${reliability}% evidence-weighted reliability`,
      ],
      advisory: 'Use this precedent as decision context, not as authorization. Explicit approval remains required.',
    })
  }
  return signals.slice(0, 3)
}

export function buildReplenishmentProposal(input: Record<string, unknown>) {
  const normalized: ReplenishmentInput = {
    productName: requiredText(input.productName, 'Product name'),
    sku: requiredText(input.sku, 'SKU', 64),
    currentStock: Math.max(0, Math.round(Number(input.currentStock || 0))),
    reorderQuantity: positiveInteger(input.reorderQuantity, 'Reorder quantity', 100_000),
    unitCostPence: positiveInteger(input.unitCostPence, 'Unit cost', 100_000_000),
    unitRetailPricePence: optionalPositiveInteger(input.unitRetailPricePence, 'Unit retail price', 100_000_000),
    supplier: requiredText(input.supplier, 'Supplier'),
    deliveryAddress: requiredText(input.deliveryAddress, 'Delivery address', 300),
  }
  const inventoryCostPence = normalized.reorderQuantity * normalized.unitCostPence
  if (!Number.isSafeInteger(inventoryCostPence)) throw Object.assign(new Error('Estimated inventory cost is too large'), { status: 400 })
  const steps: AgentActionStep[] = [
    { id: 'purchase-order', workspace: 'retail', module: 'purchasing', action: 'create', description: `Create a purchase order for ${normalized.reorderQuantity} × ${normalized.productName}`, status: 'pending' },
    { id: 'inbound-delivery', workspace: 'logistics', module: 'deliveries', action: 'create', description: `Book inbound delivery from ${normalized.supplier}`, status: 'pending' },
    { id: 'supplier-bill', workspace: 'finance', module: 'bills', action: 'create', description: `Record £${(inventoryCostPence / 100).toFixed(2)} committed spend and update cash exposure`, status: 'pending' },
  ]
  return {
    kind: 'inventory.replenishment' as const,
    title: `Replenish ${normalized.productName}`,
    summary: `${normalized.productName} is at ${normalized.currentStock} units. Coordinate purchasing, inbound logistics, and finance before stockout.`,
    rationale: 'The Shared Event Feed detected a low-stock signal. Coordinating the dependent work now reduces lost sales and gives Finance visibility before cash is committed.',
    riskLevel: inventoryCostPence >= 100_000 ? 'high' : 'medium',
    estimatedValuePence: inventoryCostPence,
    input: normalized,
    steps,
  }
}

export function buildReceivableCollectionProposal(input: Record<string, unknown>) {
  const customerName = requiredText(input.customerName, 'Customer name')
  const invoiceReference = requiredText(input.invoiceReference, 'Invoice reference', 80)
  const amountDuePence = positiveInteger(input.amountDuePence, 'Amount due', 100_000_000)
  const daysOverdue = positiveInteger(input.daysOverdue, 'Days overdue', 3_650)
  const contactChannel = requiredText(input.contactChannel || 'WhatsApp', 'Contact channel', 40)
  const steps: AgentActionStep[] = [
    { id: 'collection-case', workspace: 'finance', module: 'collections', action: 'create', description: `Open a governed collection case for ${invoiceReference}`, status: 'pending' },
    { id: 'customer-follow-up', workspace: 'retail', module: 'crm', action: 'create', description: `Create an owner-visible follow-up for ${customerName}`, status: 'pending' },
    { id: 'payment-reminder', workspace: 'marketing', module: 'automations', action: 'create', description: `Schedule one approved ${contactChannel} payment reminder`, status: 'pending' },
  ]
  return {
    kind: 'finance.receivables.collection' as const,
    title: `Recover ${invoiceReference}`,
    summary: `${invoiceReference} is ${daysOverdue} days overdue. Coordinate Finance, CRM, and one governed customer reminder.`,
    rationale: 'The Shared Event Feed detected overdue cash exposure. Coordinating the case, relationship context, and approved reminder prevents fragmented collection activity.',
    riskLevel: amountDuePence >= 100_000 ? 'high' as const : 'medium' as const,
    estimatedValuePence: amountDuePence,
    input: { customerName, invoiceReference, amountDuePence, daysOverdue, contactChannel },
    steps,
  }
}

export function buildDeliveryRecoveryProposal(input: Record<string, unknown>) {
  const orderReference = requiredText(input.orderReference, 'Order reference', 80)
  const customerName = requiredText(input.customerName, 'Customer name')
  const issue = requiredText(input.issue, 'Delivery issue', 240)
  const orderValuePence = positiveInteger(input.orderValuePence, 'Order value', 100_000_000)
  const promisedDate = requiredText(input.promisedDate, 'Promised date', 80)
  const steps: AgentActionStep[] = [
    { id: 'delivery-exception', workspace: 'logistics', module: 'exceptions', action: 'create', description: `Open and assign recovery for ${orderReference}`, status: 'pending' },
    { id: 'customer-service-case', workspace: 'retail', module: 'service', action: 'create', description: `Create a customer recovery case for ${customerName}`, status: 'pending' },
    { id: 'financial-reserve', workspace: 'finance', module: 'approvals', action: 'create', description: `Reserve up to £${(orderValuePence / 100).toFixed(2)} for an approved remedy`, status: 'pending' },
  ]
  return {
    kind: 'logistics.delivery.recovery' as const,
    title: `Recover delivery ${orderReference}`,
    summary: `${orderReference} has a delivery exception: ${issue}. Coordinate recovery, customer service, and financial exposure.`,
    rationale: 'The Shared Event Feed detected a delivery promise at risk. Coordinating the operational response and remedy ceiling protects trust without issuing an uncontrolled refund.',
    riskLevel: orderValuePence >= 50_000 ? 'high' as const : 'medium' as const,
    estimatedValuePence: orderValuePence,
    input: { orderReference, customerName, issue, orderValuePence, promisedDate },
    steps,
  }
}

export function buildExpenseApprovalProposal(input: Record<string, unknown>) {
    const description = requiredText(input.description, 'Expense description', 180)
    const requester = requiredText(input.requester, 'Requester')
    const category = requiredText(input.category || 'Operating expense', 'Expense category', 80)
    const amountPence = positiveInteger(input.amountPence, 'Expense amount', 100_000_000)
    return {
      kind: 'finance.expense.approval' as const,
      title: `Review expense: ${description}`,
      summary: `A £${(amountPence / 100).toFixed(2)} ${category.toLowerCase()} request from ${requester} is ready for governed review.`,
      rationale: 'FoundAI coordinates a finance approval, an owner-visible request, and a budget variance record before any external payment is considered.',
      riskLevel: amountPence >= 100_000 ? 'high' as const : 'medium' as const,
      estimatedValuePence: amountPence,
      input: { description, requester, category, amountPence },
      steps: [
        { id: 'expense-approval', workspace: 'finance', module: 'approvals', action: 'create', description: `Create approval request for ${description}`, status: 'pending' as const },
        { id: 'expense-budget', workspace: 'finance', module: 'budgets', action: 'create', description: 'Record the budget impact for review', status: 'pending' as const },
        { id: 'expense-owner-task', workspace: 'retail', module: 'crm', action: 'create', description: 'Create an owner-visible finance follow-up', status: 'pending' as const },
      ],
    }
  }

export function buildCampaignLaunchProposal(input: Record<string, unknown>) {
    const campaignName = requiredText(input.campaignName, 'Campaign name')
    const audience = requiredText(input.audience, 'Audience', 120)
    const channel = requiredText(input.channel || 'WhatsApp', 'Campaign channel', 40)
    const budgetPence = positiveInteger(input.budgetPence, 'Campaign budget', 100_000_000)
    return {
      kind: 'marketing.campaign.launch' as const,
      title: `Launch campaign: ${campaignName}`,
      summary: `${campaignName} is ready for a governed ${channel} launch to ${audience}.`,
      rationale: 'FoundAI coordinates campaign approval, audience readiness, and a finance budget record without publishing or spending externally.',
      riskLevel: budgetPence >= 100_000 ? 'high' as const : 'medium' as const,
      estimatedValuePence: budgetPence,
      input: { campaignName, audience, channel, budgetPence },
      steps: [
        { id: 'campaign-record', workspace: 'marketing', module: 'campaigns', action: 'create', description: `Create ${campaignName} as approved`, status: 'pending' as const },
        { id: 'campaign-audience', workspace: 'retail', module: 'segments', action: 'create', description: `Record audience readiness for ${audience}`, status: 'pending' as const },
        { id: 'campaign-budget', workspace: 'finance', module: 'budgets', action: 'create', description: 'Record the internal campaign budget ceiling', status: 'pending' as const },
      ],
    }
  }

export function buildBudgetReallocationProposal(input: Record<string, unknown>) {
    const fromCategory = requiredText(input.fromCategory, 'Source budget category', 80)
    const toCategory = requiredText(input.toCategory, 'Destination budget category', 80)
    const reason = requiredText(input.reason, 'Reallocation reason', 180)
    const amountPence = positiveInteger(input.amountPence, 'Reallocation amount', 100_000_000)
    return {
      kind: 'finance.budget.reallocation' as const,
      title: `Review budget reallocation: ${fromCategory} to ${toCategory}`,
      summary: `Move £${(amountPence / 100).toFixed(2)} between internal budget categories for governed review.`,
      rationale: 'FoundAI records the proposed budget movement and owner context without transferring funds or changing an external account.',
      riskLevel: amountPence >= 100_000 ? 'high' as const : 'medium' as const,
      estimatedValuePence: amountPence,
      input: { fromCategory, toCategory, reason, amountPence },
      steps: [
        { id: 'budget-reallocation', workspace: 'finance', module: 'budgets', action: 'create', description: `Record the proposed movement from ${fromCategory} to ${toCategory}`, status: 'pending' as const },
        { id: 'budget-owner-review', workspace: 'retail', module: 'crm', action: 'create', description: 'Create an owner-visible budget review task', status: 'pending' as const },
      ],
  }
}

export function buildCoordinationSummary(proposal: ReturnType<typeof buildReplenishmentProposal>, prediction?: PredictivePattern): CoordinationSummary {
  const workspaces: AgentActionStep['workspace'][] = [...new Set<AgentActionStep['workspace']>(proposal.steps.map((step) => step.workspace as AgentActionStep['workspace']))]
  const financialScore = Math.min(50, Math.round(proposal.estimatedValuePence / 2_000))
  const coverageScore = workspaces.length * 10
  const riskScore = proposal.riskLevel === 'high' ? 20 : 12
  const patternConfidence = prediction?.confidence ?? 50
  const confidenceScore = Math.round(patternConfidence / 5)
  const decisionScore = financialScore + coverageScore + riskScore + confidenceScore
  return {
    workspaces,
    workspaceCount: workspaces.length,
    inventoryRisk: `${proposal.input.currentStock} units remain; replenishment protects availability while demand continues.`,
    cashImpactPence: proposal.estimatedValuePence,
    logisticsLoad: `One inbound booking for ${proposal.input.reorderQuantity} units from ${proposal.input.supplier}.`,
    expectedOutcome: 'Approved inventory, inbound delivery, and supplier liability remain synchronized under one action.',
    tradeoffs: [
      `Commits £${(proposal.estimatedValuePence / 100).toFixed(2)} of cash to reduce stockout exposure.`,
      'Earlier ordering improves availability but increases short-term working-capital usage.',
      'A single coordinated execution prevents purchasing, delivery, and bill records from diverging.',
    ],
    patternConfidence,
    decisionScore,
    scoreExplanation: [
      `${workspaces.length} workspaces coordinated`,
      `£${(proposal.estimatedValuePence / 100).toFixed(2)} financial impact`,
      `${proposal.riskLevel} operating risk`,
      `${patternConfidence}% pattern confidence`,
    ],
  }
}

export function buildReplenishmentSimulation(proposal: ReturnType<typeof buildReplenishmentProposal>): SimulationPreview {
  return {
    generatedAt: new Date().toISOString(),
    disclaimer: 'Read-only projection. No workspace records or external actions are created until approval and execution.',
    workspaces: [
      {
        workspace: 'retail',
        before: `${proposal.input.currentStock} units on hand with an active stockout risk.`,
        after: `${proposal.input.reorderQuantity} units approved on a linked purchase order.`,
        effect: 'Availability risk moves into a governed replenishment commitment.',
        secondOrderEffects: [
          'The next threshold breach is expected later because inbound cover increases.',
          'Purchase history becomes available for future reorder-frequency calibration.',
        ],
      },
      {
        workspace: 'logistics',
        before: 'No inbound delivery is reserved for this replenishment.',
        after: `One inbound delivery from ${proposal.input.supplier} is booked to ${proposal.input.deliveryAddress}.`,
        effect: 'The inbound dependency becomes visible and traceable before stock arrives.',
        secondOrderEffects: [
          'Inbound capacity is reserved earlier, reducing last-minute routing pressure.',
          'Any delivery exception can be correlated back to the purchase commitment.',
        ],
      },
      {
        workspace: 'finance',
        before: 'No supplier liability is recorded for the proposed stock.',
        after: `£${(proposal.estimatedValuePence / 100).toFixed(2)} is recorded as committed inventory spend.`,
        effect: 'Cash exposure becomes visible at the same moment as the operating commitment.',
        secondOrderEffects: [
          'The commitment moves into short-term cash planning immediately.',
          'Future margin analysis can connect supplier cost with replenished units.',
        ],
      },
    ],
    comparison: {
      approve: [
        `${proposal.input.reorderQuantity} units enter a governed purchase commitment.`,
        'Inbound capacity and the supplier liability are created together.',
        `Short-term cash exposure increases by £${(proposal.estimatedValuePence / 100).toFixed(2)}.`,
      ],
      reject: [
        `${proposal.input.currentStock} units remain with no replenishment commitment.`,
        'No inbound slot is reserved and no supplier liability is recorded.',
        'Cash is preserved now, but stockout exposure remains unresolved.',
      ],
      predictedDelta: `Approval trades £${(proposal.estimatedValuePence / 100).toFixed(2)} of near-term cash capacity for ${proposal.input.reorderQuantity} committed units and coordinated inbound cover.`,
    },
  }
}

export function assessReplenishmentOutcome(
  proposal: ReturnType<typeof buildReplenishmentProposal>,
  execution: WorkflowExecution,
  predictedConfidence: number,
): OutcomeAssessment {
  const expected = [
    { source: 'retail', module: 'purchasing', description: 'Retail purchase commitment was created' },
    { source: 'logistics', module: 'deliveries', description: 'Logistics inbound booking was created' },
    { source: 'finance', module: 'bills', description: 'Finance supplier liability was created' },
  ]
  const matched: string[] = []
  const deviations: OutcomeAssessment['deviations'] = []
  for (const item of expected) {
    const actual = execution.eventRecords.find((event) => event.source === item.source && event.payload.module === item.module)
    if (actual) matched.push(item.description)
    else deviations.push({ field: `${item.source}.${item.module}`, predicted: 'created', actual: 'missing', delta: '1 expected record not created' })
  }
  const expectedCash = proposal.estimatedValuePence
  const actualCash = Number(execution.outcome.finance.match(/£([\d.]+)/)?.[1] || 0) * 100
  const financialDeviationPence = Math.round(actualCash - expectedCash)
  if (financialDeviationPence === 0) matched.push('Finance cash commitment matched the predicted amount')
  else deviations.push({
    field: 'finance.cashImpactPence',
    predicted: String(expectedCash),
    actual: String(Math.round(actualCash)),
    delta: String(financialDeviationPence),
  })
  const accuracy = Math.round((matched.length / (expected.length + 1)) * 100)
  return {
    accuracy,
    predictedConfidence,
    matched,
    deviations,
    financialDeviationPence,
    economicOutcome: {
      cashGovernedPence: expectedCash,
      marginProtectedPence: proposal.input.unitRetailPricePence
        ? Math.max(0, (proposal.input.unitRetailPricePence - proposal.input.unitCostPence) * proposal.input.reorderQuantity)
        : null,
      inventoryUnitsProtected: proposal.input.reorderQuantity,
      coordinatedHandoffs: proposal.steps.length,
      estimatedOperatorMinutesSaved: proposal.steps.length * 8,
      basis: [
        'Cash governed uses the matched supplier-liability amount.',
        'Inventory protected uses the executed replenishment quantity.',
        'Time saved uses eight minutes per completed workspace handoff.',
        proposal.input.unitRetailPricePence
          ? 'Margin protected uses recorded unit selling price less unit cost.'
          : 'Margin protected is not measured because no unit selling price was supplied.',
      ],
    },
    summary: deviations.length
      ? `${matched.length} of ${expected.length + 1} predicted effects matched; ${deviations.length} deviation${deviations.length === 1 ? '' : 's'} will refine future confidence.`
      : `All ${expected.length + 1} predicted effects matched execution; future confidence can strengthen within calibrated limits.`,
  }
}

const buildDecisionScore = (proposal: BuiltProposal, prediction: PredictivePattern | undefined) => {
  const workspaces: AgentActionStep['workspace'][] = [...new Set<AgentActionStep['workspace']>(proposal.steps.map((step) => step.workspace as AgentActionStep['workspace']))]
  const patternConfidence = prediction?.confidence ?? 50
  return {
    workspaces,
    patternConfidence,
    decisionScore: Math.min(50, Math.round(proposal.estimatedValuePence / 2_000))
      + workspaces.length * 10
      + (proposal.riskLevel === 'high' ? 20 : 12)
      + Math.round(patternConfidence / 5),
  }
}

export function buildReceivableCoordinationSummary(proposal: ReturnType<typeof buildReceivableCollectionProposal>, prediction?: PredictivePattern): CoordinationSummary {
  const score = buildDecisionScore(proposal, prediction)
  return {
    ...score,
    workspaceCount: score.workspaces.length,
    inventoryRisk: `${proposal.input.daysOverdue} overdue days increase collection and relationship risk.`,
    cashImpactPence: proposal.estimatedValuePence,
    logisticsLoad: 'No physical movement; one customer communication is coordinated with Finance and CRM.',
    expectedOutcome: 'One collection case, CRM follow-up, and approved reminder remain linked under one action.',
    tradeoffs: [
      `Places £${(proposal.estimatedValuePence / 100).toFixed(2)} of overdue cash under active governance.`,
      'A timely reminder improves collection cadence but must preserve the customer relationship.',
      'Execution schedules an internal reminder record only; it does not debit the customer.',
    ],
    scoreExplanation: [
      `${score.workspaces.length} workspaces coordinated`,
      `£${(proposal.estimatedValuePence / 100).toFixed(2)} overdue exposure`,
      `${proposal.riskLevel} collection risk`,
      `${score.patternConfidence}% pattern confidence`,
    ],
  }
}

export function buildDeliveryRecoveryCoordinationSummary(proposal: ReturnType<typeof buildDeliveryRecoveryProposal>, prediction?: PredictivePattern): CoordinationSummary {
  const score = buildDecisionScore(proposal, prediction)
  return {
    ...score,
    workspaceCount: score.workspaces.length,
    inventoryRisk: `Order ${proposal.input.orderReference} is at risk of a failed customer promise.`,
    cashImpactPence: proposal.estimatedValuePence,
    logisticsLoad: `One delivery exception requires recovery before ${proposal.input.promisedDate}.`,
    expectedOutcome: 'Logistics recovery, customer communication, and remedy exposure remain synchronized under one action.',
    tradeoffs: [
      `Governs up to £${(proposal.estimatedValuePence / 100).toFixed(2)} of customer-value exposure.`,
      'Earlier recovery may consume delivery capacity but reduces service and refund risk.',
      'Execution creates an approval reserve only; it never issues a refund automatically.',
    ],
    scoreExplanation: [
      `${score.workspaces.length} workspaces coordinated`,
      `£${(proposal.estimatedValuePence / 100).toFixed(2)} customer-value exposure`,
      `${proposal.riskLevel} delivery risk`,
      `${score.patternConfidence}% pattern confidence`,
    ],
  }
}

export function buildReceivableCollectionSimulation(proposal: ReturnType<typeof buildReceivableCollectionProposal>): SimulationPreview {
  return {
    generatedAt: new Date().toISOString(),
    disclaimer: 'Read-only projection. No reminder is sent and no customer account is changed until approval and execution.',
    workspaces: [
      { workspace: 'finance', before: `${proposal.input.invoiceReference} is ${proposal.input.daysOverdue} days overdue without an active collection case.`, after: `A £${(proposal.estimatedValuePence / 100).toFixed(2)} collection case is opened.`, effect: 'Cash exposure becomes owned and measurable.', secondOrderEffects: ['Collection timing enters cash forecasting.', 'The eventual outcome refines future overdue-risk confidence.'] },
      { workspace: 'retail', before: 'The customer relationship has no linked collection follow-up.', after: `A CRM follow-up is assigned for ${proposal.input.customerName}.`, effect: 'Commercial context stays visible beside the finance action.', secondOrderEffects: ['The owner can coordinate the tone before contact.', 'Future service activity remains linked to the invoice.'] },
      { workspace: 'marketing', before: 'No governed payment reminder is scheduled.', after: `One ${proposal.input.contactChannel} reminder is scheduled for approval-safe delivery.`, effect: 'The follow-up channel becomes explicit and auditable.', secondOrderEffects: ['Duplicate reminders are avoided.', 'Response outcomes can improve future cadence.'] },
    ],
    comparison: {
      approve: ['Open one coordinated collection case.', 'Schedule one traceable reminder.', `Place £${(proposal.estimatedValuePence / 100).toFixed(2)} of overdue exposure under governance.`],
      reject: ['Do not contact the customer.', 'Preserve the current relationship state.', 'Leave the overdue exposure without a coordinated owner.'],
      predictedDelta: `Approval coordinates recovery of £${(proposal.estimatedValuePence / 100).toFixed(2)} in overdue exposure without moving money.`,
    },
  }
}

export function buildDeliveryRecoverySimulation(proposal: ReturnType<typeof buildDeliveryRecoveryProposal>): SimulationPreview {
  return {
    generatedAt: new Date().toISOString(),
    disclaimer: 'Read-only projection. No refund, payment, or external carrier instruction is issued until approval and execution.',
    workspaces: [
      { workspace: 'logistics', before: `${proposal.input.orderReference} has an uncoordinated exception.`, after: 'A recovery case is assigned with the promised date attached.', effect: 'The operational exception gains ownership and traceability.', secondOrderEffects: ['Recovery capacity becomes visible.', 'Resolution timing feeds future exception patterns.'] },
      { workspace: 'retail', before: `${proposal.input.customerName} has no linked service recovery case.`, after: 'A customer service case is created and linked to the order.', effect: 'Customer communication stays synchronized with delivery recovery.', secondOrderEffects: ['Repeated contacts are reduced.', 'The relationship history retains the recovery outcome.'] },
      { workspace: 'finance', before: 'No remedy ceiling is visible to approvers.', after: `Up to £${(proposal.estimatedValuePence / 100).toFixed(2)} is reserved for a separately approved remedy.`, effect: 'Potential exposure is visible without issuing funds.', secondOrderEffects: ['Finance can forecast the maximum downside.', 'Any later credit remains separately authorized.'] },
    ],
    comparison: {
      approve: ['Assign delivery recovery.', 'Open one linked customer service case.', 'Record a remedy ceiling without issuing a refund.'],
      reject: ['Leave the delivery exception unassigned.', 'Create no customer recovery record.', 'Keep cash unchanged while service risk remains unresolved.'],
      predictedDelta: `Approval governs £${(proposal.estimatedValuePence / 100).toFixed(2)} of customer-value risk without moving money.`,
    },
  }
}

type AdditionalProposal = ReturnType<typeof buildExpenseApprovalProposal> | ReturnType<typeof buildCampaignLaunchProposal> | ReturnType<typeof buildBudgetReallocationProposal>
function buildAdditionalCoordinationSummary(proposal: AdditionalProposal, prediction?: PredictivePattern): CoordinationSummary {
    const workspaces: AgentActionStep['workspace'][] = [...new Set<AgentActionStep['workspace']>(proposal.steps.map((step) => step.workspace as AgentActionStep['workspace']))]
    const confidence = prediction?.confidence ?? 50
    return {
      workspaces,
      workspaceCount: workspaces.length,
      inventoryRisk: proposal.kind === 'marketing.campaign.launch' ? 'No inventory mutation; audience readiness remains advisory.' : proposal.kind === 'finance.budget.reallocation' ? 'No inventory mutation; budget movement remains internal and pending review.' : 'No inventory mutation; expense exposure remains inside Finance governance.',
      cashImpactPence: proposal.estimatedValuePence,
      logisticsLoad: 'No logistics capacity required.',
      expectedOutcome: 'Internal approval, budget context, and owner-visible follow-up remain synchronized.',
      tradeoffs: [
        `Govern £${(proposal.estimatedValuePence / 100).toFixed(2)} before any external commitment.`,
        'Approval improves traceability but does not publish, pay, or spend externally.',
        'Rejecting keeps cash unchanged while the underlying request remains unresolved.',
      ],
      patternConfidence: confidence,
      decisionScore: Math.min(100, Math.round(proposal.estimatedValuePence / 2_000) + workspaces.length * 10 + Math.round(confidence / 5)),
      scoreExplanation: [`${workspaces.length} workspaces coordinated`, `£${(proposal.estimatedValuePence / 100).toFixed(2)} governed exposure`, `${confidence}% pattern confidence`],
    }
  }

function buildAdditionalSimulation(proposal: AdditionalProposal): SimulationPreview {
    return {
      generatedAt: new Date().toISOString(),
      disclaimer: 'Read-only projection. Approval and execution are separate human-controlled steps.',
      workspaces: proposal.steps.map((step) => ({ workspace: step.workspace as AgentActionStep['workspace'], before: 'No linked governed record', after: step.description, effect: 'Internal record only', secondOrderEffects: ['Improves audit completeness', 'Does not move external funds'] })),
      comparison: {
        approve: ['Create the linked internal records.', 'Expose one coordinated audit trail.', 'Keep external publication or payment disabled.'],
        reject: ['Create no new records.', 'Preserve cash and budget state.', 'Leave the originating request for manual handling.'],
        predictedDelta: `Approval governs £${(proposal.estimatedValuePence / 100).toFixed(2)} of internal exposure without external execution.`,
      },
  }
}

const assessStandardWorkflowOutcome = (
  proposal: BuiltProposal,
  execution: WorkflowExecution,
  predictedConfidence: number,
  expected: Array<{ source: string; module: string; description: string }>,
): OutcomeAssessment => {
  const matched: string[] = []
  const deviations: OutcomeAssessment['deviations'] = []
  for (const item of expected) {
    const actual = execution.eventRecords.find((event) => event.source === item.source && event.payload.module === item.module)
    if (actual) matched.push(item.description)
    else deviations.push({ field: `${item.source}.${item.module}`, predicted: 'created', actual: 'missing', delta: '1 expected record not created' })
  }
  const accuracy = Math.round((matched.length / expected.length) * 100)
  return {
    accuracy,
    predictedConfidence,
    matched,
    deviations,
    financialDeviationPence: 0,
    economicOutcome: {
      cashGovernedPence: proposal.estimatedValuePence,
      marginProtectedPence: null,
      inventoryUnitsProtected: 0,
      coordinatedHandoffs: proposal.steps.length,
      estimatedOperatorMinutesSaved: proposal.steps.length * 8,
      basis: ['Financial exposure uses the approved action value.', 'Time saved uses eight minutes per completed workspace handoff.', 'No recovered cash, refund, or margin is claimed until later outcome evidence exists.'],
    },
    summary: deviations.length
      ? `${matched.length} of ${expected.length} predicted effects matched; ${deviations.length} deviation${deviations.length === 1 ? '' : 's'} will refine future confidence.`
      : `All ${expected.length} predicted effects matched execution; the governed workflow completed without moving external funds.`,
  }
}

export function assertAgentActionTransition(status: string, operation: 'approve' | 'reject' | 'execute') {
  const valid = operation === 'execute' ? status === 'approved' : status === 'proposed'
  if (!valid) throw Object.assign(new Error(`Cannot ${operation} an agent action with status ${status}`), { status: 409 })
}

async function executeReplenishmentWorkflow({ tx, tenantId, actorId, actionId, proposal }: WorkflowContext): Promise<WorkflowExecution> {
  const replenishment = proposalFor(proposal, 'inventory.replenishment')
  const reference = actionId.slice(-8).toUpperCase()
  const common = { tenantId, createdBy: actorId, updatedBy: actorId }
  const purchaseOrder = await tx.workspaceRecord.create({
    data: { ...common, workspace: 'retail', module: 'purchasing', reference: `PO-${reference}`, name: `${replenishment.input.productName} replenishment`, status: 'Approved', ownerId: actorId, valuePence: replenishment.estimatedValuePence, data: json({ sku: replenishment.input.sku, quantity: replenishment.input.reorderQuantity, supplier: replenishment.input.supplier, agentActionId: actionId }) },
  })
  const delivery = await tx.workspaceRecord.create({
    data: { ...common, workspace: 'logistics', module: 'deliveries', reference: `IN-${reference}`, name: `Inbound ${replenishment.input.productName}`, status: 'Booked', ownerId: actorId, valuePence: null, data: json({ supplier: replenishment.input.supplier, deliveryAddress: replenishment.input.deliveryAddress, purchaseOrderId: purchaseOrder.id, agentActionId: actionId }) },
  })
  const bill = await tx.workspaceRecord.create({
    data: { ...common, workspace: 'finance', module: 'bills', reference: `BILL-${reference}`, name: `${replenishment.input.supplier} inventory commitment`, status: 'Received', ownerId: actorId, valuePence: replenishment.estimatedValuePence, data: json({ purchaseOrderId: purchaseOrder.id, expectedCashImpactPence: replenishment.estimatedValuePence, agentActionId: actionId }) },
  })
  return {
    result: { purchaseOrderId: purchaseOrder.id, deliveryId: delivery.id, billId: bill.id },
    outcome: {
      summary: 'created synchronized purchasing, inbound delivery, and supplier bill records',
      inventory: `${replenishment.input.reorderQuantity} units approved for replenishment`,
      logistics: 'inbound delivery booked',
      finance: `£${(replenishment.estimatedValuePence / 100).toFixed(2)} cash commitment recorded`,
    },
    eventRecords: [
      { type: 'workspace.record.created', source: 'retail', payload: { module: 'purchasing', recordId: purchaseOrder.id, reference: purchaseOrder.reference } },
      { type: 'workspace.record.created', source: 'logistics', payload: { module: 'deliveries', recordId: delivery.id, reference: delivery.reference } },
      { type: 'workspace.record.created', source: 'finance', payload: { module: 'bills', recordId: bill.id, reference: bill.reference } },
    ],
  }
}

async function executeReceivableCollectionWorkflow({ tx, tenantId, actorId, actionId, proposal }: WorkflowContext): Promise<WorkflowExecution> {
  const collection = proposalFor(proposal, 'finance.receivables.collection')
  const reference = actionId.slice(-8).toUpperCase()
  const common = { tenantId, createdBy: actorId, updatedBy: actorId }
  const collectionCase = await tx.workspaceRecord.create({
    data: { ...common, workspace: 'finance', module: 'collections', reference: `COL-${reference}`, name: `${collection.input.invoiceReference} collection`, status: 'Active', ownerId: actorId, valuePence: collection.estimatedValuePence, data: json({ ...collection.input, agentActionId: actionId }) },
  })
  const followUp = await tx.workspaceRecord.create({
    data: { ...common, workspace: 'retail', module: 'crm', reference: `CRM-${reference}`, name: `${collection.input.customerName} payment follow-up`, status: 'Assigned', ownerId: actorId, valuePence: null, data: json({ invoiceReference: collection.input.invoiceReference, collectionCaseId: collectionCase.id, agentActionId: actionId }) },
  })
  const reminder = await tx.workspaceRecord.create({
    data: { ...common, workspace: 'marketing', module: 'automations', reference: `REM-${reference}`, name: `${collection.input.invoiceReference} payment reminder`, status: 'Scheduled', ownerId: actorId, valuePence: null, data: json({ channel: collection.input.contactChannel, customerName: collection.input.customerName, collectionCaseId: collectionCase.id, agentActionId: actionId }) },
  })
  return {
    result: { collectionCaseId: collectionCase.id, followUpId: followUp.id, reminderId: reminder.id },
    outcome: { summary: 'created a synchronized collection case, CRM follow-up, and approved reminder', finance: `£${(collection.estimatedValuePence / 100).toFixed(2)} overdue exposure placed under governance`, retail: 'customer follow-up assigned', marketing: `${collection.input.contactChannel} reminder scheduled` },
    eventRecords: [
      { type: 'workspace.record.created', source: 'finance', payload: { module: 'collections', recordId: collectionCase.id, reference: collectionCase.reference } },
      { type: 'workspace.record.created', source: 'retail', payload: { module: 'crm', recordId: followUp.id, reference: followUp.reference } },
      { type: 'workspace.record.created', source: 'marketing', payload: { module: 'automations', recordId: reminder.id, reference: reminder.reference } },
    ],
  }
}

async function executeDeliveryRecoveryWorkflow({ tx, tenantId, actorId, actionId, proposal }: WorkflowContext): Promise<WorkflowExecution> {
  const recovery = proposalFor(proposal, 'logistics.delivery.recovery')
  const reference = actionId.slice(-8).toUpperCase()
  const common = { tenantId, createdBy: actorId, updatedBy: actorId }
  const exception = await tx.workspaceRecord.create({
    data: { ...common, workspace: 'logistics', module: 'exceptions', reference: `EXC-${reference}`, name: `${recovery.input.orderReference} recovery`, status: 'Assigned', ownerId: actorId, valuePence: recovery.estimatedValuePence, data: json({ ...recovery.input, agentActionId: actionId }) },
  })
  const serviceCase = await tx.workspaceRecord.create({
    data: { ...common, workspace: 'retail', module: 'service', reference: `SRV-${reference}`, name: `${recovery.input.customerName} delivery recovery`, status: 'Open', ownerId: actorId, valuePence: null, data: json({ orderReference: recovery.input.orderReference, exceptionId: exception.id, agentActionId: actionId }) },
  })
  const reserve = await tx.workspaceRecord.create({
    data: { ...common, workspace: 'finance', module: 'approvals', reference: `RSV-${reference}`, name: `${recovery.input.orderReference} remedy ceiling`, status: 'Reserved', ownerId: actorId, valuePence: recovery.estimatedValuePence, data: json({ orderReference: recovery.input.orderReference, exceptionId: exception.id, externalPaymentMoved: false, agentActionId: actionId }) },
  })
  return {
    result: { exceptionId: exception.id, serviceCaseId: serviceCase.id, reserveId: reserve.id },
    outcome: { summary: 'created synchronized delivery recovery, customer service, and remedy-reserve records', logistics: 'delivery exception assigned', retail: 'customer service recovery opened', finance: `£${(recovery.estimatedValuePence / 100).toFixed(2)} remedy ceiling recorded without issuing funds` },
    eventRecords: [
      { type: 'workspace.record.created', source: 'logistics', payload: { module: 'exceptions', recordId: exception.id, reference: exception.reference } },
      { type: 'workspace.record.created', source: 'retail', payload: { module: 'service', recordId: serviceCase.id, reference: serviceCase.reference } },
      { type: 'workspace.record.created', source: 'finance', payload: { module: 'approvals', recordId: reserve.id, reference: reserve.reference } },
    ],
  }
}

async function executeExpenseApprovalWorkflow({ tx, tenantId, actorId, actionId, proposal }: WorkflowContext): Promise<WorkflowExecution> {
  const expense = proposalFor(proposal, 'finance.expense.approval')
  const reference = actionId.slice(-8).toUpperCase()
  const common = { tenantId, createdBy: actorId, updatedBy: actorId }
  const approval = await tx.workspaceRecord.create({ data: { ...common, workspace: 'finance', module: 'approvals', reference: `EXP-${reference}`, name: expense.input.description, status: 'Approved', ownerId: actorId, valuePence: expense.estimatedValuePence, data: json({ ...expense.input, agentActionId: actionId, externalPaymentMoved: false }) } })
  const budget = await tx.workspaceRecord.create({ data: { ...common, workspace: 'finance', module: 'budgets', reference: `BUD-${reference}`, name: `${expense.input.category} budget review`, status: 'Review', ownerId: actorId, valuePence: expense.estimatedValuePence, data: json({ approvalId: approval.id, agentActionId: actionId }) } })
  const task = await tx.workspaceRecord.create({ data: { ...common, workspace: 'retail', module: 'crm', reference: `TASK-${reference}`, name: `${expense.input.requester} expense follow-up`, status: 'Assigned', ownerId: actorId, valuePence: null, data: json({ approvalId: approval.id, agentActionId: actionId }) } })
  return { result: { approvalId: approval.id, budgetId: budget.id, taskId: task.id }, outcome: { summary: 'created a governed expense approval, budget review, and owner follow-up without making payment', finance: 'expense approval and budget review recorded', retail: 'owner follow-up assigned' }, eventRecords: [
    { type: 'workspace.record.created', source: 'finance', payload: { module: 'approvals', recordId: approval.id, reference: approval.reference } },
    { type: 'workspace.record.created', source: 'finance', payload: { module: 'budgets', recordId: budget.id, reference: budget.reference } },
    { type: 'workspace.record.created', source: 'retail', payload: { module: 'crm', recordId: task.id, reference: task.reference } },
  ] }
}

async function executeCampaignLaunchWorkflow({ tx, tenantId, actorId, actionId, proposal }: WorkflowContext): Promise<WorkflowExecution> {
  const campaign = proposalFor(proposal, 'marketing.campaign.launch')
  const reference = actionId.slice(-8).toUpperCase()
  const common = { tenantId, createdBy: actorId, updatedBy: actorId }
  const campaignRecord = await tx.workspaceRecord.create({ data: { ...common, workspace: 'marketing', module: 'campaigns', reference: `CMP-${reference}`, name: campaign.input.campaignName, status: 'Approved', ownerId: actorId, valuePence: campaign.estimatedValuePence, data: json({ ...campaign.input, agentActionId: actionId, externallyPublished: false }) } })
  const audience = await tx.workspaceRecord.create({ data: { ...common, workspace: 'retail', module: 'segments', reference: `AUD-${reference}`, name: `${campaign.input.audience} readiness`, status: 'Ready for review', ownerId: actorId, valuePence: null, data: json({ campaignId: campaignRecord.id, agentActionId: actionId }) } })
  const budget = await tx.workspaceRecord.create({ data: { ...common, workspace: 'finance', module: 'budgets', reference: `MKT-${reference}`, name: `${campaign.input.campaignName} budget ceiling`, status: 'Reserved', ownerId: actorId, valuePence: campaign.estimatedValuePence, data: json({ campaignId: campaignRecord.id, agentActionId: actionId, externalSpendMoved: false }) } })
  return { result: { campaignId: campaignRecord.id, audienceId: audience.id, budgetId: budget.id }, outcome: { summary: 'created a governed campaign, audience readiness, and internal budget ceiling without publishing or spending', marketing: 'campaign approved internally', retail: 'audience readiness recorded', finance: 'budget ceiling reserved internally' }, eventRecords: [
    { type: 'workspace.record.created', source: 'marketing', payload: { module: 'campaigns', recordId: campaignRecord.id, reference: campaignRecord.reference } },
    { type: 'workspace.record.created', source: 'retail', payload: { module: 'segments', recordId: audience.id, reference: audience.reference } },
    { type: 'workspace.record.created', source: 'finance', payload: { module: 'budgets', recordId: budget.id, reference: budget.reference } },
  ] }
}

async function executeBudgetReallocationWorkflow({ tx, tenantId, actorId, actionId, proposal }: WorkflowContext): Promise<WorkflowExecution> {
  const budget = proposalFor(proposal, 'finance.budget.reallocation')
  const reference = actionId.slice(-8).toUpperCase()
  const common = { tenantId, createdBy: actorId, updatedBy: actorId }
  const movement = await tx.workspaceRecord.create({ data: { ...common, workspace: 'finance', module: 'budgets', reference: `REALLOC-${reference}`, name: `${budget.input.fromCategory} to ${budget.input.toCategory}`, status: 'Pending review', ownerId: actorId, valuePence: budget.estimatedValuePence, data: json({ ...budget.input, agentActionId: actionId, externalFundsMoved: false }) } })
  const task = await tx.workspaceRecord.create({ data: { ...common, workspace: 'retail', module: 'crm', reference: `BUDGET-${reference}`, name: 'Budget reallocation owner review', status: 'Assigned', ownerId: actorId, valuePence: null, data: json({ movementId: movement.id, agentActionId: actionId }) } })
  return { result: { movementId: movement.id, taskId: task.id }, outcome: { summary: 'recorded a governed internal budget movement and owner review without transferring funds', finance: 'budget movement recorded for review', retail: 'owner review assigned' }, eventRecords: [
    { type: 'workspace.record.created', source: 'finance', payload: { module: 'budgets', recordId: movement.id, reference: movement.reference } },
    { type: 'workspace.record.created', source: 'retail', payload: { module: 'crm', recordId: task.id, reference: task.reference } },
  ] }
}

const buildAdditionalCompensation = (effectsValue: unknown, type: 'expense' | 'campaign' | 'budget') => {
  const effects = record(effectsValue)
  const ids = type === 'expense'
    ? [{ id: String(effects.approvalId || ''), status: 'Cancelled', workspace: 'finance' }, { id: String(effects.budgetId || ''), status: 'Released', workspace: 'finance' }, { id: String(effects.taskId || ''), status: 'Closed', workspace: 'retail' }]
    : type === 'campaign'
      ? [{ id: String(effects.campaignId || ''), status: 'Cancelled', workspace: 'marketing' }, { id: String(effects.audienceId || ''), status: 'Closed', workspace: 'retail' }, { id: String(effects.budgetId || ''), status: 'Released', workspace: 'finance' }]
      : [{ id: String(effects.movementId || ''), status: 'Cancelled', workspace: 'finance' }, { id: String(effects.taskId || ''), status: 'Closed', workspace: 'retail' }]
  if (ids.some((item) => !item.id)) throw Object.assign(new Error('Cannot compensate because expected internal effects are missing'), { status: 409 })
  return { summary: 'compensated internal workflow records; no external payment or publication was reversed', records: ids }
}

const workflowDefinitions: Readonly<Record<string, AgentWorkflowDefinition>> = Object.freeze({
  'inventory.replenishment': {
    kind: 'inventory.replenishment',
    coordinationTemplate: {
      workspaces: ['retail', 'logistics', 'finance'],
      requiredEvidenceFields: ['historicalContext.similarSignals', 'historicalContext.completionRate', 'predictiveSignals.confidence'],
    },
    buildProposal: buildReplenishmentProposal,
    buildCoordinationSummary: (proposal, prediction) => buildCoordinationSummary(proposalFor(proposal, 'inventory.replenishment'), prediction),
    buildSimulationPreview: (proposal) => buildReplenishmentSimulation(proposalFor(proposal, 'inventory.replenishment')),
    execute: executeReplenishmentWorkflow,
    summarizeOutcome: (outcome) => `Retail: ${outcome.inventory}. Logistics: ${outcome.logistics}. Finance: ${outcome.finance}.`,
    assessOutcome: (proposal, execution, confidence) => assessReplenishmentOutcome(proposalFor(proposal, 'inventory.replenishment'), execution, confidence),
    buildCompensation: buildReplenishmentCompensation,
  },
  'finance.receivables.collection': {
    kind: 'finance.receivables.collection',
    coordinationTemplate: {
      workspaces: ['finance', 'retail', 'marketing'],
      requiredEvidenceFields: ['historicalContext.similarSignals', 'historicalContext.completionRate', 'predictiveSignals.confidence'],
    },
    buildProposal: buildReceivableCollectionProposal,
    buildCoordinationSummary: (proposal, prediction) => buildReceivableCoordinationSummary(proposalFor(proposal, 'finance.receivables.collection'), prediction),
    buildSimulationPreview: (proposal) => buildReceivableCollectionSimulation(proposalFor(proposal, 'finance.receivables.collection')),
    execute: executeReceivableCollectionWorkflow,
    summarizeOutcome: (outcome) => `Finance: ${outcome.finance}. Retail: ${outcome.retail}. Marketing: ${outcome.marketing}.`,
    assessOutcome: (proposal, execution, confidence) => assessStandardWorkflowOutcome(proposal, execution, confidence, [
      { source: 'finance', module: 'collections', description: 'Finance collection case was created' },
      { source: 'retail', module: 'crm', description: 'CRM follow-up was created' },
      { source: 'marketing', module: 'automations', description: 'Approved payment reminder was scheduled' },
    ]),
    buildCompensation: buildReceivableCollectionCompensation,
  },
  'logistics.delivery.recovery': {
    kind: 'logistics.delivery.recovery',
    coordinationTemplate: {
      workspaces: ['logistics', 'retail', 'finance'],
      requiredEvidenceFields: ['historicalContext.similarSignals', 'historicalContext.completionRate', 'predictiveSignals.confidence'],
    },
    buildProposal: buildDeliveryRecoveryProposal,
    buildCoordinationSummary: (proposal, prediction) => buildDeliveryRecoveryCoordinationSummary(proposalFor(proposal, 'logistics.delivery.recovery'), prediction),
    buildSimulationPreview: (proposal) => buildDeliveryRecoverySimulation(proposalFor(proposal, 'logistics.delivery.recovery')),
    execute: executeDeliveryRecoveryWorkflow,
    summarizeOutcome: (outcome) => `Logistics: ${outcome.logistics}. Retail: ${outcome.retail}. Finance: ${outcome.finance}.`,
    assessOutcome: (proposal, execution, confidence) => assessStandardWorkflowOutcome(proposal, execution, confidence, [
      { source: 'logistics', module: 'exceptions', description: 'Delivery exception recovery was assigned' },
      { source: 'retail', module: 'service', description: 'Customer service recovery was opened' },
      { source: 'finance', module: 'approvals', description: 'Remedy ceiling was reserved without issuing funds' },
    ]),
    buildCompensation: buildDeliveryRecoveryCompensation,
  },
  'finance.expense.approval': {
    kind: 'finance.expense.approval',
    coordinationTemplate: { workspaces: ['finance', 'retail'], requiredEvidenceFields: ['historicalContext.similarSignals', 'predictiveSignals.confidence'] },
    buildProposal: buildExpenseApprovalProposal,
    buildCoordinationSummary: (proposal, prediction) => buildAdditionalCoordinationSummary(proposalFor(proposal, 'finance.expense.approval'), prediction),
    buildSimulationPreview: (proposal) => buildAdditionalSimulation(proposalFor(proposal, 'finance.expense.approval')),
    execute: executeExpenseApprovalWorkflow,
    summarizeOutcome: (outcome) => `Finance: ${outcome.finance}. Retail: ${outcome.retail}.`,
    assessOutcome: (proposal, execution, confidence) => assessStandardWorkflowOutcome(proposal, execution, confidence, [
      { source: 'finance', module: 'approvals', description: 'Expense approval was recorded' },
      { source: 'finance', module: 'budgets', description: 'Budget review was recorded' },
      { source: 'retail', module: 'crm', description: 'Owner follow-up was assigned' },
    ]),
    buildCompensation: (effects) => buildAdditionalCompensation(effects, 'expense'),
  },
  'marketing.campaign.launch': {
    kind: 'marketing.campaign.launch',
    coordinationTemplate: { workspaces: ['marketing', 'retail', 'finance'], requiredEvidenceFields: ['historicalContext.similarSignals', 'predictiveSignals.confidence'] },
    buildProposal: buildCampaignLaunchProposal,
    buildCoordinationSummary: (proposal, prediction) => buildAdditionalCoordinationSummary(proposalFor(proposal, 'marketing.campaign.launch'), prediction),
    buildSimulationPreview: (proposal) => buildAdditionalSimulation(proposalFor(proposal, 'marketing.campaign.launch')),
    execute: executeCampaignLaunchWorkflow,
    summarizeOutcome: (outcome) => `Marketing: ${outcome.marketing}. Retail: ${outcome.retail}. Finance: ${outcome.finance}.`,
    assessOutcome: (proposal, execution, confidence) => assessStandardWorkflowOutcome(proposal, execution, confidence, [
      { source: 'marketing', module: 'campaigns', description: 'Campaign was approved internally' },
      { source: 'retail', module: 'segments', description: 'Audience readiness was recorded' },
      { source: 'finance', module: 'budgets', description: 'Internal budget ceiling was reserved' },
    ]),
    buildCompensation: (effects) => buildAdditionalCompensation(effects, 'campaign'),
  },
  'finance.budget.reallocation': {
    kind: 'finance.budget.reallocation',
    coordinationTemplate: { workspaces: ['finance', 'retail'], requiredEvidenceFields: ['historicalContext.similarSignals', 'predictiveSignals.confidence'] },
    buildProposal: buildBudgetReallocationProposal,
    buildCoordinationSummary: (proposal, prediction) => buildAdditionalCoordinationSummary(proposalFor(proposal, 'finance.budget.reallocation'), prediction),
    buildSimulationPreview: (proposal) => buildAdditionalSimulation(proposalFor(proposal, 'finance.budget.reallocation')),
    execute: executeBudgetReallocationWorkflow,
    summarizeOutcome: (outcome) => `Finance: ${outcome.finance}. Retail: ${outcome.retail}.`,
    assessOutcome: (proposal, execution, confidence) => assessStandardWorkflowOutcome(proposal, execution, confidence, [
      { source: 'finance', module: 'budgets', description: 'Budget movement was recorded' },
      { source: 'retail', module: 'crm', description: 'Owner review was assigned' },
    ]),
    buildCompensation: (effects) => buildAdditionalCompensation(effects, 'budget'),
  },
})

export const registeredAgentWorkflowKinds = Object.freeze(Object.keys(workflowDefinitions))
export const getAgentWorkflowContract = (kind: string) => {
  const workflow = workflowFor(kind)
  return {
    kind: workflow.kind,
    workspaces: workflow.coordinationTemplate.workspaces,
    requiredEvidenceFields: workflow.coordinationTemplate.requiredEvidenceFields,
  }
}
const workflowFor = (kind: string) => {
  const workflow = workflowDefinitions[kind]
  if (!workflow) throw Object.assign(new Error(`No workflow is registered for ${kind}`), { status: 422 })
  return workflow
}

const evidenceValue = (evidence: Record<string, unknown>, path: string) =>
  path.split('.').reduce<unknown>((current, segment) =>
    current && typeof current === 'object' ? (current as Record<string, unknown>)[segment] : undefined, evidence)

export function assertRequiredWorkflowEvidence(requiredFields: string[], evidence: Record<string, unknown>) {
  const missing = requiredFields.filter((field) => evidenceValue(evidence, field) === undefined)
  if (missing.length) throw Object.assign(new Error(`Workflow evidence is incomplete: ${missing.join(', ')}`), { status: 422 })
}

export const listAgentActions = (tenantId: string, status?: string) =>
  prisma.agentAction.findMany({
    where: { tenantId, ...(status && agentActionStatuses.includes(status as AgentActionStatus) ? { status } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

export async function getAgentIntelligenceSummary(tenantId: string) {
  const [actions, auditEvents] = await Promise.all([
    prisma.agentAction.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.event.findMany({
      where: {
        tenantId,
        type: { in: ['agent.action.proposed', 'agent.action.approved', 'agent.action.rejected', 'agent.action.completed', 'agent.action.outcome.assessed', 'agent.action.execution.reversed'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ])
  const interactions = detectAgentActionInteractions(actions)
  const health = summarizeSystemIntelligenceHealth(actions, interactions)
  return {
    interactions,
    health,
    snapshot: buildIntelligenceSnapshot(actions, interactions, health),
    emergingSignals: buildEmergingSignals(actions, interactions, health),
    auditTrail: buildExecutionAuditTrail(actions, auditEvents),
  }
}

export async function proposeAgentAction(tenantId: string, actorId: string, kind: string, input: Record<string, unknown>, requestId?: string) {
  const workflow = workflowFor(kind)
  const proposal = workflow.buildProposal(input)
  const patternKey = proposal.kind === 'inventory.replenishment'
    ? proposal.input.sku
    : proposal.kind === 'finance.receivables.collection'
      ? proposal.input.invoiceReference
      : proposal.kind === 'logistics.delivery.recovery'
        ? proposal.input.orderReference
        : proposal.kind === 'finance.expense.approval'
          ? proposal.input.description
          : proposal.kind === 'marketing.campaign.launch'
            ? proposal.input.campaignName
            : `${proposal.input.fromCategory}:${proposal.input.toCategory}`
  const source = proposal.kind === 'inventory.replenishment'
    ? { type: 'inventory.threshold.breached', workspace: 'retail', payload: { sku: proposal.input.sku, productName: proposal.input.productName, currentStock: proposal.input.currentStock } }
    : proposal.kind === 'finance.receivables.collection'
      ? { type: 'finance.receivable.overdue', workspace: 'finance', payload: { invoiceReference: proposal.input.invoiceReference, customerName: proposal.input.customerName, daysOverdue: proposal.input.daysOverdue, amountDuePence: proposal.input.amountDuePence } }
      : proposal.kind === 'logistics.delivery.recovery'
        ? { type: 'logistics.delivery.exception', workspace: 'logistics', payload: { orderReference: proposal.input.orderReference, customerName: proposal.input.customerName, issue: proposal.input.issue, promisedDate: proposal.input.promisedDate } }
        : proposal.kind === 'finance.expense.approval'
          ? { type: 'finance.expense.requested', workspace: 'finance', payload: { description: proposal.input.description, requester: proposal.input.requester, amountPence: proposal.input.amountPence } }
          : proposal.kind === 'marketing.campaign.launch'
            ? { type: 'marketing.campaign.requested', workspace: 'marketing', payload: { campaignName: proposal.input.campaignName, audience: proposal.input.audience, budgetPence: proposal.input.budgetPence } }
            : { type: 'finance.budget.reallocation.requested', workspace: 'finance', payload: { fromCategory: proposal.input.fromCategory, toCategory: proposal.input.toCategory, amountPence: proposal.input.amountPence } }
  const [historicalContext, predictiveSignals] = await Promise.all([
    summarizeEventPattern(tenantId, proposal.kind, patternKey),
    predictEventPattern(tenantId, proposal.kind),
  ])
  const evidence = { historicalContext, predictiveSignals }
  assertRequiredWorkflowEvidence(workflow.coordinationTemplate.requiredEvidenceFields, evidence)
  const coordinationSummary = workflow.buildCoordinationSummary(proposal, predictiveSignals)
  const simulationPreview = workflow.buildSimulationPreview(proposal)
  return prisma.$transaction(async (tx) => {
    const sourceEvent = await tx.event.create({
      data: { tenantId, type: source.type, source: source.workspace, payload: json(source.payload) },
    })
    const action = await tx.agentAction.create({
      data: {
        tenantId,
        kind: proposal.kind,
        title: proposal.title,
        summary: proposal.summary,
        rationale: proposal.rationale,
        riskLevel: proposal.riskLevel,
        sourceEventId: sourceEvent.id,
        input: json(proposal.input),
        steps: json(proposal.steps),
        coordinationSummary: json(coordinationSummary),
        historicalContext: json(historicalContext),
        predictiveSignals: json(predictiveSignals),
        simulationPreview: json(simulationPreview),
        estimatedValuePence: proposal.estimatedValuePence,
        proposedBy: actorId,
      },
    })
    const correlation = { actionId: action.id, correlationId: action.id, sourceEventId: sourceEvent.id }
    await tx.event.update({ where: { id: sourceEvent.id }, data: { payload: json({ ...source.payload, ...correlation }) } })
    const proposalEvent = await tx.event.create({
      data: { tenantId, type: 'agent.action.proposed', source: 'intelligence', payload: json({ ...correlation, kind: action.kind, workspaces: coordinationSummary.workspaces, decisionScore: coordinationSummary.decisionScore, patternConfidence: predictiveSignals.confidence, likelyNext: predictiveSignals.likelyNext }) },
    })
    const updated = await tx.agentAction.update({ where: { id: action.id }, data: { trailEventIds: json([sourceEvent.id, proposalEvent.id]) } })
    await tx.workspaceAuditEvent.create({ data: { tenantId, actorId, action: 'agent.action.proposed', workspace: 'intelligence', entityId: action.id, requestId, metadata: json({ kind: action.kind, sourceEventId: sourceEvent.id, decisionScore: coordinationSummary.decisionScore }) } })
    return updated
  })
}

export const proposeReplenishmentAction = (tenantId: string, actorId: string, input: Record<string, unknown>, requestId?: string) =>
  proposeAgentAction(tenantId, actorId, 'inventory.replenishment', input, requestId)

export async function decideAgentAction(tenantId: string, actorId: string, id: string, decision: unknown, requestId?: string) {
  const operation = String(decision) === 'reject' ? 'reject' : String(decision) === 'approve' ? 'approve' : ''
  if (!operation) throw Object.assign(new Error('Decision must be approve or reject'), { status: 400 })
  return prisma.$transaction(async (tx) => {
    const existing = await tx.agentAction.findFirst({ where: { id, tenantId } })
    if (!existing) throw Object.assign(new Error('Agent action not found'), { status: 404 })
    assertAgentActionTransition(existing.status, operation)
    const status = operation === 'approve' ? 'approved' : 'rejected'
    const event = await tx.event.create({ data: { tenantId, type: `agent.action.${status}`, source: 'intelligence', payload: json({ actionId: id, correlationId: id, sourceEventId: existing.sourceEventId, kind: existing.kind, decisionBy: actorId }) } })
    const action = await tx.agentAction.update({ where: { id }, data: { status, approvedBy: actorId, approvedAt: new Date(), trailEventIds: json([...stringArray(existing.trailEventIds), event.id]) } })
    await tx.workspaceAuditEvent.create({ data: { tenantId, actorId, action: `agent.action.${status}`, workspace: 'intelligence', entityId: id, requestId, metadata: json({ kind: action.kind, sourceEventId: existing.sourceEventId }) } })
    return action
  })
}

export async function executeAgentAction(tenantId: string, actorId: string, id: string, requestId?: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.agentAction.findFirst({ where: { id, tenantId } })
    if (!existing) throw Object.assign(new Error('Agent action not found'), { status: 404 })
    assertAgentActionTransition(existing.status, 'execute')
    const priorExecution = await tx.agentActionExecution.findUnique({ where: { actionId: id } })
    if (priorExecution) throw Object.assign(new Error(`Agent action execution is already ${priorExecution.status}`), { status: 409 })
    const workflow = workflowFor(existing.kind)
    const proposal = workflow.buildProposal(existing.input as Record<string, unknown>)
    const claimed = await tx.agentAction.updateMany({ where: { id, tenantId, status: 'approved' }, data: { status: 'executing' } })
    if (claimed.count !== 1) throw Object.assign(new Error('Agent action is already being executed'), { status: 409 })
    const execution = await workflow.execute({ tx, tenantId, actorId, actionId: id, proposal })
    const outcomeSummary = workflow.summarizeOutcome(execution.outcome)
    const storedPrediction = existing.predictiveSignals && typeof existing.predictiveSignals === 'object'
      ? existing.predictiveSignals as Record<string, unknown>
      : {}
    const outcomeAssessment = workflow.assessOutcome(proposal, execution, Number(storedPrediction.confidence || 50))
    const correlation = { actionId: id, correlationId: id, sourceEventId: existing.sourceEventId }
    const recordEvents = await Promise.all(execution.eventRecords.map((event) => tx.event.create({
      data: { tenantId, type: event.type, source: event.source, payload: json({ ...event.payload, ...correlation }) },
    })))
    const completionEvent = await tx.event.create({
      data: { tenantId, type: 'agent.action.completed', source: 'intelligence', payload: json({ ...correlation, kind: existing.kind, result: execution.result, outcome: execution.outcome, outcomeSummary, workspaces: proposal.steps.map((step) => step.workspace), estimatedValuePence: proposal.estimatedValuePence, executedBy: actorId }) },
    })
    const assessmentEvent = await tx.event.create({
      data: { tenantId, type: 'agent.action.outcome.assessed', source: 'intelligence', payload: json({ ...correlation, kind: existing.kind, accuracy: outcomeAssessment.accuracy, predictedConfidence: outcomeAssessment.predictedConfidence, matched: outcomeAssessment.matched, deviations: outcomeAssessment.deviations, financialDeviationPence: outcomeAssessment.financialDeviationPence, economicOutcome: outcomeAssessment.economicOutcome, summary: outcomeAssessment.summary }) },
    })
    const completedSteps = proposal.steps.map((step) => ({ ...step, status: 'completed' as const }))
    const trailEventIds = [...stringArray(existing.trailEventIds), ...recordEvents.map((event) => event.id), completionEvent.id, assessmentEvent.id]
    const action = await tx.agentAction.update({
      where: { id },
      data: { status: 'completed', steps: json(completedSteps), result: json(execution.result), outcomeSummary, outcomeAssessment: json(outcomeAssessment), trailEventIds: json(trailEventIds), executedBy: actorId, executedAt: new Date() },
    })
    await tx.agentActionExecution.create({
      data: {
        tenantId,
        actionId: id,
        status: 'completed',
        effects: json(execution.result),
        executedBy: actorId,
        executedAt: new Date(),
      },
    })
    await tx.workspaceAuditEvent.create({ data: { tenantId, actorId, action: 'agent.action.completed', workspace: 'intelligence', entityId: id, requestId, metadata: json({ ...execution.result, outcome: execution.outcome, outcomeSummary, outcomeAssessment, trailEventIds }) } })
    return action
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
}

export function buildReplenishmentCompensation(effectsValue: unknown) {
  const effects = record(effectsValue)
  const records = [
    { id: String(effects.purchaseOrderId || ''), status: 'Cancelled', workspace: 'retail' },
    { id: String(effects.deliveryId || ''), status: 'Cancelled', workspace: 'logistics' },
    { id: String(effects.billId || ''), status: 'Voided', workspace: 'finance' },
  ]
  if (records.some((item) => !item.id)) throw Object.assign(new Error('Execution effects are incomplete and cannot be safely reversed'), { status: 409 })
  return {
    summary: 'Cancelled the supplier order and inbound booking, and voided the scheduled supplier liability. No external payment was moved.',
    records,
  }
}

export function buildReceivableCollectionCompensation(effectsValue: unknown) {
  const effects = record(effectsValue)
  const records = [
    { id: String(effects.collectionCaseId || ''), status: 'Cancelled', workspace: 'finance' },
    { id: String(effects.followUpId || ''), status: 'Closed', workspace: 'retail' },
    { id: String(effects.reminderId || ''), status: 'Cancelled', workspace: 'marketing' },
  ]
  if (records.some((item) => !item.id)) throw Object.assign(new Error('Collection execution effects are incomplete and cannot be safely reversed'), { status: 409 })
  return {
    summary: 'Cancelled the collection case and scheduled reminder, and closed the CRM follow-up. No customer debit or external message was reversed.',
    records,
  }
}

export function buildDeliveryRecoveryCompensation(effectsValue: unknown) {
  const effects = record(effectsValue)
  const records = [
    { id: String(effects.exceptionId || ''), status: 'Cancelled', workspace: 'logistics' },
    { id: String(effects.serviceCaseId || ''), status: 'Closed', workspace: 'retail' },
    { id: String(effects.reserveId || ''), status: 'Released', workspace: 'finance' },
  ]
  if (records.some((item) => !item.id)) throw Object.assign(new Error('Delivery recovery effects are incomplete and cannot be safely reversed'), { status: 409 })
  return {
    summary: 'Cancelled the delivery recovery, closed the service case, and released the internal remedy reserve. No refund or external payment was moved.',
    records,
  }
}

export async function reverseAgentActionExecution(tenantId: string, actorId: string, id: string, requestId?: string) {
  return prisma.$transaction(async (tx) => {
    const action = await tx.agentAction.findFirst({ where: { id, tenantId } })
    if (!action) throw Object.assign(new Error('Agent action not found'), { status: 404 })
    if (action.status !== 'completed') throw Object.assign(new Error('Only completed agent actions can be reversed'), { status: 409 })
    const execution = await tx.agentActionExecution.findFirst({ where: { actionId: id, tenantId } })
    if (!execution) throw Object.assign(new Error('Execution ledger entry not found'), { status: 404 })
    if (execution.status !== 'completed') throw Object.assign(new Error(`Execution is already ${execution.status}`), { status: 409 })
    const claimed = await tx.agentActionExecution.updateMany({ where: { id: execution.id, status: 'completed' }, data: { status: 'reversing' } })
    if (claimed.count !== 1) throw Object.assign(new Error('Execution reversal is already in progress'), { status: 409 })
    const compensation = workflowFor(action.kind).buildCompensation(execution.effects)
    for (const item of compensation.records) {
      const updated = await tx.workspaceRecord.updateMany({
        where: { id: item.id, tenantId, deletedAt: null },
        data: { status: item.status, updatedBy: actorId, version: { increment: 1 } },
      })
      if (updated.count !== 1) throw Object.assign(new Error(`Cannot reverse missing ${item.workspace} execution record`), { status: 409 })
    }
    const event = await tx.event.create({
      data: { tenantId, type: 'agent.action.execution.reversed', source: 'intelligence', payload: json({ actionId: id, correlationId: id, sourceEventId: action.sourceEventId, compensation, reversedBy: actorId }) },
    })
    await tx.agentActionExecution.update({
      where: { id: execution.id },
      data: { status: 'reversed', compensation: json(compensation), reversedBy: actorId, reversedAt: new Date() },
    })
    await tx.agentAction.update({ where: { id }, data: { trailEventIds: json([...stringArray(action.trailEventIds), event.id]) } })
    await tx.workspaceAuditEvent.create({ data: { tenantId, actorId, action: 'agent.action.execution.reversed', workspace: 'intelligence', entityId: id, requestId, metadata: json(compensation) } })
    return { actionId: id, status: 'reversed', compensation }
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
}

export async function getAgentActionTrail(tenantId: string, id: string) {
  const action = await prisma.agentAction.findFirst({ where: { id, tenantId } })
  if (!action) throw Object.assign(new Error('Agent action not found'), { status: 404 })
  const trailEventIds = stringArray(action.trailEventIds)
  return prisma.event.findMany({
    where: {
      tenantId,
      OR: [
        ...(trailEventIds.length ? [{ id: { in: trailEventIds } }] : []),
        { payload: { path: ['actionId'], equals: id } },
        ...(action.sourceEventId ? [{ id: action.sourceEventId }] : []),
      ],
    },
    orderBy: { createdAt: 'asc' },
  })
}
