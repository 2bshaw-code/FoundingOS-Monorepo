/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Thin backward-compatible facade over lib/services/approvalsService.ts —
// screens (workflows.tsx, home.tsx) keep importing the same named functions
// and types they always have, while the actual demo/real switching now lives
// behind the IApprovalsService factory alongside every other domain.
import { AgentActionTrailEvent } from './core-operations-api'
import { hapticError, hapticSuccess, hapticWarning } from './haptics'
import { syncApprovalsWidget } from './live-approvals-widget'
import { notifyNewApprovals } from './notifications'
import { getApprovalsService, outboxActionType as sharedOutboxActionType } from './services/approvalsService'
import type {
  ApprovalsQueueItem,
  ApprovalsQueueResult,
  ApprovalsQueueSource,
  ApprovalsQueueStatus,
} from './services/approvalsService'

export type { ApprovalsQueueItem, ApprovalsQueueResult, ApprovalsQueueSource, ApprovalsQueueStatus }

// Fires an actionable local notification for any items in the fetched queue
// that are newly awaiting a decision — every screen that reads the queue
// (workflows.tsx, home.tsx) goes through this one function, so this is the
// single place that needs to know about it rather than every call site.
export async function fetchApprovalsQueue(): Promise<ApprovalsQueueResult> {
  const result = await getApprovalsService().fetchQueue()
  void notifyNewApprovals(result.items)
  syncApprovalsWidget(result.items)
  return result
}

// Haptics live at this one facade (not scattered across every screen that
// calls approve/reject/execute) so every Guardian/Approvals surface — Today,
// Approvals tab, Guardian, workflows.tsx — gets the same tactile confirmation
// for free, and stays consistent if the outcome semantics ever change. Errors
// are re-thrown untouched so callers' existing try/catch + optimistic-UI
// rollback logic (see workflows.tsx's run()) keeps working exactly as before.
export async function approveQueueItem(item: ApprovalsQueueItem) {
  try {
    const result = await getApprovalsService().approve(item)
    hapticSuccess()
    return result
  } catch (err) {
    hapticError()
    throw err
  }
}

export async function rejectQueueItem(item: ApprovalsQueueItem) {
  try {
    const result = await getApprovalsService().reject(item)
    hapticWarning()
    return result
  } catch (err) {
    hapticError()
    throw err
  }
}

export async function executeQueueItem(item: ApprovalsQueueItem) {
  try {
    const result = await getApprovalsService().execute(item)
    hapticSuccess()
    return result
  } catch (err) {
    hapticError()
    throw err
  }
}

export async function reverseQueueItem(item: ApprovalsQueueItem) {
  return getApprovalsService().reverse(item)
}

export const outboxActionType = sharedOutboxActionType

export async function fetchQueueItemTrail(item: ApprovalsQueueItem): Promise<AgentActionTrailEvent[]> {
  return getApprovalsService().fetchTrail(item)
}
