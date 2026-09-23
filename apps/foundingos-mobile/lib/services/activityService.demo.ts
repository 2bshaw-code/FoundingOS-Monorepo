/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Demo-mode Activity feed — canned events + the shared emerging-signals
// dataset (also used by Guardian/Intelligence, see lib/demo-data.ts).
import { DEMO_AGENT_INTELLIGENCE, DEMO_EVENTS } from '../demo-data'
import { ActivityFeed, IActivityService } from './activityService'

export function createDemoActivityService(): IActivityService {
  return {
    async fetchActivity(): Promise<ActivityFeed> {
      return { events: DEMO_EVENTS, signals: DEMO_AGENT_INTELLIGENCE.emergingSignals }
    },
  }
}
