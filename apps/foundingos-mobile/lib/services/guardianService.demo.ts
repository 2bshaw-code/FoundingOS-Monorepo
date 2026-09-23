/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Demo-mode Guardian — the shared canned intelligence dataset (also used by
// Activity/Intelligence, see lib/demo-data.ts).
import { AgentActionIntelligence } from '../core-operations-api'
import { DEMO_AGENT_INTELLIGENCE } from '../demo-data'
import { IGuardianService } from './guardianService'

export function createDemoGuardianService(): IGuardianService {
  return {
    async fetchIntelligence(): Promise<AgentActionIntelligence> {
      return DEMO_AGENT_INTELLIGENCE
    },
  }
}
