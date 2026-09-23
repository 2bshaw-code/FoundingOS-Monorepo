/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { fetchAgentActionIntelligence, getSession } from '../core-operations-api'
import { IIntelligenceService, IntelligenceOverview } from './intelligenceService'

export function createRealIntelligenceService(): IIntelligenceService {
  return {
    async fetchOverview(): Promise<IntelligenceOverview> {
      const session = await getSession()
      if (!session) return { connected: false, summary: null }
      const summary = await fetchAgentActionIntelligence().catch(() => null)
      return { connected: true, summary }
    },
  }
}
