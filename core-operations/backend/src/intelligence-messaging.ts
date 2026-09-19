/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ActionInteraction, EmergingSignal, ExecutionAuditEntry, IntelligenceSnapshot, SystemIntelligenceHealth } from './agent-actions.js'

type MessagingAction = {
  id: string
  title: string
  status: string
  summary: string
  rationale: string
  riskLevel: string
  estimatedValuePence: number | null
  input?: unknown
  steps?: unknown
  coordinationSummary: unknown
  historicalContext: unknown
  predictiveSignals: unknown
  simulationPreview: unknown
  outcomeAssessment: unknown
}

type IntelligenceSummary = {
  interactions: ActionInteraction[]
  health: SystemIntelligenceHealth
  emergingSignals: EmergingSignal[]
  snapshot: IntelligenceSnapshot
  auditTrail: ExecutionAuditEntry[]
}

const record = (value: unknown): Record<string, any> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, any> : {}
const money = (pence: number | null) => pence === null
  ? 'n/a'
  : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100)
const limit = (text: string, maximum = 980) => text.length <= maximum ? text : `${text.slice(0, maximum - 1).trimEnd()}…`

export function buildIntelligenceBrief(summary: IntelligenceSummary, action?: MessagingAction | null) {
  const signal = summary.emergingSignals[0]
  const interaction = summary.interactions.find((item) => action && item.actionIds.includes(action.id)) ?? summary.interactions[0]
  const lines = [
    'FOUNDINGOS | DECISION BRIEF',
    signal ? `1 SIGNAL\n${signal.title}: ${signal.summary}` : '1 SIGNAL\nNo emerging risk has crossed its evidence threshold.',
    `2 PROVEN VALUE\n${money(summary.snapshot.economicValue.cashGovernedPence)} governed; ${summary.snapshot.economicValue.inventoryUnitsProtected} units protected; ~${summary.snapshot.economicValue.estimatedOperatorMinutesSaved} operator minutes estimated saved.`,
    summary.snapshot.totalAssessedOutcomes
      ? `3 MEASURED LEARNING\n${summary.snapshot.recentAccuracyTrend.current}% accuracy across ${summary.snapshot.totalAssessedOutcomes} assessed outcomes; ${summary.snapshot.learningMomentum.score}/100 momentum.`
      : '3 MEASURED LEARNING\nNo assessed outcomes yet. Confidence is an estimate until execution outcomes are measured.',
  ]
  if (action) {
    const prediction = record(action.predictiveSignals)
    const coordination = record(action.coordinationSummary)
    const workspaceCount = Array.isArray(action.steps)
      ? new Set(action.steps.map((step) => String(record(step).workspace || '')).filter(Boolean)).size
      : Number(coordination.workspaceCount || 0)
    lines.push(`4 DECISION\n${action.title}`)
    lines.push(`IMPACT\n${money(action.estimatedValuePence)} internal cash commitment | ${workspaceCount} workspaces | ${action.riskLevel} risk`)
    lines.push(`EVIDENCE\n${Number(prediction.confidence || 0)}% confidence | ${Number(prediction.reliabilityScore || 0)}% reliable | ${Number(prediction.assessedOutcomes || 0)} outcomes`)
    if (interaction) lines.push(`WATCH\n${interaction.summary}`)
    const next = action.status === 'approved' ? 'EXECUTE' : action.status === 'completed' ? 'UNDO' : 'APPROVE or REJECT'
    lines.push(`NEXT\nReply ${next}. Ask WHY, IMPACT, ALTERNATIVES, or MORE.\nRef: ${action.id}`)
  } else {
    lines.push('Reply SNAPSHOT for the latest learning summary. Open FoundingOS for full evidence.')
  }
  lines.push('GOVERNANCE\nAdvisory only. APPROVE never executes. EXECUTE creates internal records only.')
  return limit(lines.join('\n'))
}

export function explainActionForMessaging(action: MessagingAction, detail: 'why' | 'impact' | 'alternatives' | 'more', summary: IntelligenceSummary) {
  const prediction = record(action.predictiveSignals)
  const coordination = record(action.coordinationSummary)
  const history = record(action.historicalContext)
  const simulation = record(action.simulationPreview)
  const comparison = record(simulation.comparison)
  const interaction = summary.interactions.find((item) => item.actionIds.includes(action.id))
  if (detail === 'impact') {
    const input = record(action.input)
    const economicOutcome = record(record(action.outcomeAssessment).economicOutcome)
    const workspaces = Array.isArray(action.steps) ? new Set(action.steps.map((step) => String(record(step).workspace || '')).filter(Boolean)).size : Number(coordination.workspaceCount || 0)
    return limit([
      `${action.title} | IMPACT`,
      `BEFORE: ${Number(input.currentStock || 0)} units remain; stockout exposure is unresolved.`,
      `AFTER: ${Number(input.reorderQuantity || 0)} units governed across ${workspaces} workspaces for ${money(action.estimatedValuePence)}.`,
      `MEASURED: ${money(Number(economicOutcome.cashGovernedPence || 0))} governed; ${Number(economicOutcome.inventoryUnitsProtected || 0)} units protected; ~${Number(economicOutcome.estimatedOperatorMinutesSaved || 0)} minutes saved on this completed outcome.`,
      `SYSTEM VALUE: ${money(summary.snapshot.economicValue.cashGovernedPence)} governed across ${summary.snapshot.economicValue.measuredOutcomes} measured outcomes; ${summary.snapshot.economicValue.riskReducedActions} risks reduced.`,
      `MARGIN: ${summary.snapshot.economicValue.marginProtectedPence === null ? 'Not measured — selling-price evidence is required.' : `${money(summary.snapshot.economicValue.marginProtectedPence)} protected from recorded cost and price evidence.`}`,
      `CONFIDENCE: ${Number(prediction.confidence || 0)}%; reliability ${Number(prediction.reliabilityScore || 0)}%. No external payment is moved.`,
    ].join('\n'))
  }
  if (detail === 'alternatives') {
    return limit([
      `${action.title} — approve vs reject`,
      `APPROVE: ${Array.isArray(comparison.approve) ? comparison.approve[0] : 'Coordinate the proposed workspaces.'}`,
      `REJECT: ${Array.isArray(comparison.reject) ? comparison.reject[0] : 'Preserve resources but leave the operating risk unresolved.'}`,
      String(comparison.predictedDelta || 'Open FoundingOS to review the complete read-only comparison.'),
      'No action has been executed.',
    ].join('\n'))
  }
  if (detail === 'more') {
    return limit([
      `${action.title} — evidence`,
      `${Number(history.similarSignals || 0)} similar signals; ${Number(history.completionRate || 0)}% prior completion.`,
      `${Number(prediction.averageAccuracy || 0)}% measured accuracy; ${Number(prediction.reliabilityScore || 0)}% pattern reliability.`,
      interaction ? `Related: ${interaction.summary}` : 'No material related-decision overlap detected.',
      `Audit: ${summary.auditTrail.filter((entry) => entry.actionId === action.id).length} lifecycle events. Full trail: ${action.id}`,
    ].join('\n'))
  }
  return limit([
    `${action.title} was surfaced because:`,
    ...(Array.isArray(coordination.scoreExplanation) ? coordination.scoreExplanation.slice(0, 4).map((item) => `• ${item}`) : [`• ${action.rationale}`]),
    interaction ? `• ${interaction.summary}` : '',
    `Evidence: ${Number(prediction.assessedOutcomes || 0)} assessed outcomes at ${Number(prediction.reliabilityScore || 0)}% reliability.`,
    'Advisory only. Explicit approval is required.',
  ].filter(Boolean).join('\n'))
}
