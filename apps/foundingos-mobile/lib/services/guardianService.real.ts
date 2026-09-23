/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real-backend Guardian — a thin passthrough to core-operations' agent
// action intelligence endpoint.
import { AgentActionIntelligence, fetchAgentActionIntelligence } from '../core-operations-api'
import { IGuardianService } from './guardianService'

export function createRealGuardianService(): IGuardianService {
  return {
    async fetchIntelligence(): Promise<AgentActionIntelligence> {
      return fetchAgentActionIntelligence()
    },
  }
}
