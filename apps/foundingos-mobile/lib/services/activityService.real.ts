/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real-backend Activity feed — combines the raw platform event feed with the
// emerging-signals slice of core-operations' agent action intelligence.
import { fetchAgentActionIntelligence, fetchEventFeed } from '../core-operations-api'
import { ActivityFeed, IActivityService } from './activityService'

export function createRealActivityService(): IActivityService {
  return {
    async fetchActivity(limit = 60): Promise<ActivityFeed> {
      const [events, intelligence] = await Promise.all([fetchEventFeed(limit), fetchAgentActionIntelligence()])
      return { events, signals: intelligence.emergingSignals }
    },
  }
}
