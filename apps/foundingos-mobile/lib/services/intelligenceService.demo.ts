/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { DEMO_AGENT_INTELLIGENCE } from '../demo-data'
import { IIntelligenceService, IntelligenceOverview } from './intelligenceService'

export function createDemoIntelligenceService(): IIntelligenceService {
  return {
    async fetchOverview(): Promise<IntelligenceOverview> {
      return { connected: true, summary: DEMO_AGENT_INTELLIGENCE }
    },
  }
}
