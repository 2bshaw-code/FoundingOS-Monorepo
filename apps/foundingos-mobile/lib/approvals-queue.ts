/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Thin backward-compatible facade over lib/services/approvalsService.ts —
// screens (workflows.tsx, home.tsx) keep importing the same named functions
// and types they always have, while the actual demo/real switching now lives
// behind the IApprovalsService factory alongside every other domain.
import { AgentActionTrailEvent } from './core-operations-api'
import { getApprovalsService, outboxActionType as sharedOutboxActionType } from './services/approvalsService'
import type {
  ApprovalsQueueItem,
  ApprovalsQueueResult,
  ApprovalsQueueSource,
  ApprovalsQueueStatus,
} from './services/approvalsService'

export type { ApprovalsQueueItem, ApprovalsQueueResult, ApprovalsQueueSource, ApprovalsQueueStatus }

export async function fetchApprovalsQueue(): Promise<ApprovalsQueueResult> {
  return getApprovalsService().fetchQueue()
}

export async function approveQueueItem(item: ApprovalsQueueItem) {
  return getApprovalsService().approve(item)
}

export async function rejectQueueItem(item: ApprovalsQueueItem) {
  return getApprovalsService().reject(item)
}

export async function executeQueueItem(item: ApprovalsQueueItem) {
  return getApprovalsService().execute(item)
}

export async function reverseQueueItem(item: ApprovalsQueueItem) {
  return getApprovalsService().reverse(item)
}

export const outboxActionType = sharedOutboxActionType

export async function fetchQueueItemTrail(item: ApprovalsQueueItem): Promise<AgentActionTrailEvent[]> {
  return getApprovalsService().fetchTrail(item)
}
