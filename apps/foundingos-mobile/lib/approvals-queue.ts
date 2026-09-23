/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Core.Operations and Core.Workforce are separate backends with separate
// session tokens and separate AgentAction/WorkforceAction record types — but
// to the person approving work, "a governed AI action is waiting on me" is
// one queue, not two. This normalizes both into one shape so the Approvals
// tab can show a single, correctly-sorted decision queue instead of forcing
// founders to check two different tabs for the same kind of decision.
import {
  AgentAction,
  AgentActionStatus,
  AgentActionTrailEvent,
  decideAgentAction,
  executeAgentAction,
  getAgentActionTrail,
  getSession as getCoreOpsSession,
  listAgentActions,
  reverseAgentActionExecution,
} from './core-operations-api'
import {
  WorkforceAction,
  WorkforceActionStatus,
  decideWorkforceAction,
  executeWorkforceAction,
  getSession as getWorkforceSession,
  listWorkforceActions,
  reverseWorkforceActionExecution,
} from './core-workforce-api'

export type ApprovalsQueueSource = 'core_operations' | 'core_workforce'
export type ApprovalsQueueStatus = AgentActionStatus | WorkforceActionStatus

export type ApprovalsQueueItem = {
  id: string
  source: ApprovalsQueueSource
  title: string
  summary: string
  status: ApprovalsQueueStatus
  requiresApproval: boolean
  createdAt: string
  estimatedValuePence?: number | null
  // Undo is only offered once an action is fully executed and not already
  // reversed — Core.Workforce doesn't track a separate execution sub-record
  // the way Core.Operations does, so this is derived per-source rather than
  // relying on one shared field.
  canUndo: boolean
  // Only Core.Operations exposes a per-action audit trail today — surfaced
  // honestly rather than showing an empty/fake trail for Workforce items.
  hasEvidenceTrail: boolean
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

export type ApprovalsQueueResult = {
  items: ApprovalsQueueItem[]
  coreOperationsConnected: boolean
  coreWorkforceConnected: boolean
}

// Each suite's session is checked and fetched independently and tolerantly —
// a signed-out or unlicensed Core.Workforce account should never blank out
// Core.Operations' governed actions (or vice versa).
export async function fetchApprovalsQueue(): Promise<ApprovalsQueueResult> {
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
}

export async function approveQueueItem(item: ApprovalsQueueItem) {
  return item.source === 'core_operations' ? decideAgentAction(item.id, 'approve') : decideWorkforceAction(item.id, 'approve')
}

export async function rejectQueueItem(item: ApprovalsQueueItem) {
  return item.source === 'core_operations' ? decideAgentAction(item.id, 'reject') : decideWorkforceAction(item.id, 'reject')
}

export async function executeQueueItem(item: ApprovalsQueueItem) {
  return item.source === 'core_operations' ? executeAgentAction(item.id) : executeWorkforceAction(item.id)
}

export async function reverseQueueItem(item: ApprovalsQueueItem) {
  return item.source === 'core_operations' ? reverseAgentActionExecution(item.id) : reverseWorkforceActionExecution(item.id)
}

// The offline outbox (lib/outbox-sync.ts) already dispatches on these two
// prefixes to the correct backend — this just picks the right one per item
// instead of workflows.tsx needing to know about both APIs directly.
export function outboxActionType(item: ApprovalsQueueItem, kind: 'APPROVE' | 'REJECT' | 'EXECUTE' | 'REVERSE'): string {
  const prefix = item.source === 'core_operations' ? 'GOVERNED_ACTION' : 'WORKFORCE_ACTION'
  return kind === 'APPROVE' || kind === 'REJECT' ? `${prefix}_DECISION_${kind}` : `${prefix}_${kind}`
}

// Returns [] (not an error) for sources without a real trail endpoint yet —
// callers should show a plain "not yet available" message, never a fabricated one.
export async function fetchQueueItemTrail(item: ApprovalsQueueItem): Promise<AgentActionTrailEvent[]> {
  if (!item.hasEvidenceTrail) return []
  return getAgentActionTrail(item.id).catch(() => [])
}

