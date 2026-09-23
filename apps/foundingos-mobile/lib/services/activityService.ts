/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Activity service contract — the Live Activity screen's event feed and
// emerging-signals panel. Real errors (e.g. a 401 from a signed-out session)
// are left to propagate so the screen's existing CoreOpsApiError handling
// keeps working unchanged.
import { EmergingSignal, PlatformEvent } from '../core-operations-api'
import { useQuantumStore } from '../store'
import { createDemoActivityService } from './activityService.demo'
import { createRealActivityService } from './activityService.real'

export type ActivityFeed = {
  events: PlatformEvent[]
  signals: EmergingSignal[]
}

export interface IActivityService {
  fetchActivity(limit?: number): Promise<ActivityFeed>
}

let demoService: IActivityService | null = null
let realService: IActivityService | null = null

export function getActivityService(): IActivityService {
  if (useQuantumStore.getState().demoMode) {
    if (!demoService) demoService = createDemoActivityService()
    return demoService
  }
  if (!realService) realService = createRealActivityService()
  return realService
}
