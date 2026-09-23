/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real-backend Approvals queue — merges Core.Operations' AgentAction and
// Core.Workforce's WorkforceAction into one normalized, sorted queue. Each
// suite's session is checked and fetched independently and tolerantly — a
// signed-out or unlicensed Core.Workforce account should never blank out
// Core.Operations' governed actions (or vice versa).
import {
  AgentAction,
  AgentActionTrailEvent,
  decideAgentAction,
  executeAgentAction,
  getAgentActionTrail,
  getSession as getCoreOpsSession,
  listAgentActions,
  reverseAgentActionExecution,
} from '../core-operations-api'
import {
  WorkforceAction,
  decideWorkforceAction,
  executeWorkforceAction,
  getSession as getWorkforceSession,
  listWorkforceActions,
  reverseWorkforceActionExecution,
} from '../core-workforce-api'
import { ApprovalsQueueItem, IApprovalsService } from './approvalsService'

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

function numberOrUndefined(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function buildAiPreview(action: AgentAction): ApprovalsQueueItem['aiPreview'] {
  const predictive = record(action.predictiveSignals)
  const historical = record(action.historicalContext)
  const coordination = record(action.coordinationSummary)
  const simulationWorkspaces = record(action.simulationPreview).workspaces
  const simulation = Array.isArray(simulationWorkspaces)
    ? (simulationWorkspaces as Array<Record<string, unknown>>)
        .map((step) => ({
          before: String(step.before ?? ''),
          after: String(step.after ?? ''),
          effect: String(step.effect ?? ''),
          secondOrderEffects: Array.isArray(step.secondOrderEffects) ? (step.secondOrderEffects as string[]) : undefined,
        }))
        .filter((step) => step.before || step.after || step.effect)
    : undefined

  const preview: ApprovalsQueueItem['aiPreview'] = {
    confidence: numberOrUndefined(predictive.confidence),
    reliabilityScore: numberOrUndefined(predictive.reliabilityScore),
    similarSignals: numberOrUndefined(historical.similarSignals),
    completionRate: numberOrUndefined(historical.completionRate),
    decisionScore: numberOrUndefined(coordination.decisionScore),
    scoreExplanation: Array.isArray(coordination.scoreExplanation) ? (coordination.scoreExplanation as string[]) : undefined,
    simulation: simulation && simulation.length > 0 ? simulation : undefined,
  }

  // Only return an object if at least one real field was actually present —
  // an all-undefined preview would render an empty "AI preview" section for
  // no reason.
  const hasAnyField = Object.values(preview).some((value) => value !== undefined)
  return hasAnyField ? preview : undefined
}

function fromAgentAction(action: AgentAction): ApprovalsQueueItem {
  return {
    id: action.id,
    source: 'core_operations',
    title: action.title || action.kind,
    summary: action.summary,
    status: action.status,
    requiresApproval: action.requiresApproval,
    createdAt: action.createdAt,
    estimatedValuePence: action.estimatedValuePence,
    canUndo: action.status === 'completed' && action.execution?.status === 'completed',
    hasEvidenceTrail: true,
    riskLevel: action.riskLevel,
    rationale: action.rationale,
    aiPreview: buildAiPreview(action),
  }
}

function fromWorkforceAction(action: WorkforceAction): ApprovalsQueueItem {
  return {
    id: action.id,
    source: 'core_workforce',
    title: action.title || action.kind,
    summary: action.summary,
    status: action.status,
    requiresApproval: action.requiresApproval,
    createdAt: action.createdAt,
    estimatedValuePence: null,
    canUndo: action.status === 'completed',
    hasEvidenceTrail: false,
  }
}

export function createRealApprovalsService(): IApprovalsService {
  return {
    async fetchQueue() {
      const [coreOpsSession, workforceSession] = await Promise.all([
        getCoreOpsSession().catch(() => null),
        getWorkforceSession().catch(() => null),
      ])

      const [agentActions, workforceActions] = await Promise.all([
        coreOpsSession ? listAgentActions().catch(() => []) : Promise.resolve([]),
        workforceSession ? listWorkforceActions().catch(() => []) : Promise.resolve([]),
      ])

      const items = [...agentActions.map(fromAgentAction), ...workforceActions.map(fromWorkforceAction)].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

      return {
        items,
        coreOperationsConnected: Boolean(coreOpsSession),
        coreWorkforceConnected: Boolean(workforceSession),
      }
    },
    async approve(item) {
      return item.source === 'core_operations' ? decideAgentAction(item.id, 'approve') : decideWorkforceAction(item.id, 'approve')
    },
    async reject(item) {
      return item.source === 'core_operations' ? decideAgentAction(item.id, 'reject') : decideWorkforceAction(item.id, 'reject')
    },
    async execute(item) {
      return item.source === 'core_operations' ? executeAgentAction(item.id) : executeWorkforceAction(item.id)
    },
    async reverse(item) {
      return item.source === 'core_operations' ? reverseAgentActionExecution(item.id) : reverseWorkforceActionExecution(item.id)
    },
    // Returns [] (not an error) for sources without a real trail endpoint yet —
    // callers should show a plain "not yet available" message, never a
    // fabricated one.
    async fetchTrail(item): Promise<AgentActionTrailEvent[]> {
      if (!item.hasEvidenceTrail) return []
      return getAgentActionTrail(item.id).catch(() => [])
    },
  }
}
