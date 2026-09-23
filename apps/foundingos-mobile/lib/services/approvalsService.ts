/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Approvals (Governed Actions) service contract. Core.Operations and
// Core.Workforce are separate backends with separate AgentAction/
// WorkforceAction record types, but to the person approving work "a governed
// AI action is waiting on me" is one queue, not two — this interface is the
// single seam screens (workflows.tsx, home.tsx via lib/approvals-queue.ts)
// depend on, whether the data comes from one merged live queue or the demo
// dataset.
import { AgentActionStatus, AgentActionTrailEvent } from '../core-operations-api'
import { WorkforceActionStatus } from '../core-workforce-api'
import { useQuantumStore } from '../store'
import { createDemoApprovalsService } from './approvalsService.demo'
import { createRealApprovalsService } from './approvalsService.real'

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
  // AI Action Preview fields — real fields already computed by
  // core-operations' agent-actions.ts (predictiveSignals.confidence/
  // reliabilityScore, historicalContext.similarSignals/completionRate,
  // simulationPreview before/after/effects, coordinationSummary's decision
  // score breakdown). All optional/undefined for Core.Workforce items,
  // which don't compute this evidence yet — the UI must degrade honestly
  // rather than fabricate a score.
  riskLevel?: string
  rationale?: string
  aiPreview?: {
    confidence?: number
    reliabilityScore?: number
    similarSignals?: number
    completionRate?: number
    decisionScore?: number
    scoreExplanation?: string[]
    simulation?: Array<{ before: string; after: string; effect: string; secondOrderEffects?: string[] }>
  }
}

export type ApprovalsQueueResult = {
  items: ApprovalsQueueItem[]
  coreOperationsConnected: boolean
  coreWorkforceConnected: boolean
}

export interface IApprovalsService {
  fetchQueue(): Promise<ApprovalsQueueResult>
  approve(item: ApprovalsQueueItem): Promise<unknown>
  reject(item: ApprovalsQueueItem): Promise<unknown>
  execute(item: ApprovalsQueueItem): Promise<unknown>
  reverse(item: ApprovalsQueueItem): Promise<unknown>
  fetchTrail(item: ApprovalsQueueItem): Promise<AgentActionTrailEvent[]>
}

// The offline outbox (lib/outbox-sync.ts) already dispatches on these two
// prefixes to the correct backend — this just picks the right one per item
// instead of screens needing to know about both APIs directly. Pure/stateless,
// so it lives here rather than in either implementation.
export function outboxActionType(item: ApprovalsQueueItem, kind: 'APPROVE' | 'REJECT' | 'EXECUTE' | 'REVERSE'): string {
  const prefix = item.source === 'core_operations' ? 'GOVERNED_ACTION' : 'WORKFORCE_ACTION'
  return kind === 'APPROVE' || kind === 'REJECT' ? `${prefix}_DECISION_${kind}` : `${prefix}_${kind}`
}

let demoService: IApprovalsService | null = null
let realService: IApprovalsService | null = null

export function getApprovalsService(): IApprovalsService {
  if (useQuantumStore.getState().demoMode) {
    if (!demoService) demoService = createDemoApprovalsService()
    return demoService
  }
  if (!realService) realService = createRealApprovalsService()
  return realService
}
