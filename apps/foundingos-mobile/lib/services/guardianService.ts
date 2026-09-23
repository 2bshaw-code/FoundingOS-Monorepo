/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Guardian service contract — the full AI decision-intelligence breakdown
// (interactions, learning health, economic value snapshot, emerging signals,
// audit trail). Real errors (e.g. a 401 from a signed-out session) are left
// to propagate so the screen's existing CoreOpsApiError handling keeps
// working unchanged.
import { AgentActionIntelligence } from '../core-operations-api'
import { useQuantumStore } from '../store'
import { createDemoGuardianService } from './guardianService.demo'
import { createRealGuardianService } from './guardianService.real'

export interface IGuardianService {
  fetchIntelligence(): Promise<AgentActionIntelligence>
}

let demoService: IGuardianService | null = null
let realService: IGuardianService | null = null

export function getGuardianService(): IGuardianService {
  if (useQuantumStore.getState().demoMode) {
    if (!demoService) demoService = createDemoGuardianService()
    return demoService
  }
  if (!realService) realService = createRealGuardianService()
  return realService
}
