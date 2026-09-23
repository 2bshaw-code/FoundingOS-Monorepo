/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Intelligence tab service contract — mirrors Guardian's underlying data
// (core-operations' agent action intelligence) but paired with a `connected`
// flag so the tab can show its own sign-in prompt rather than propagating a
// thrown error.
import { AgentActionIntelligence } from '../core-operations-api'
import { useQuantumStore } from '../store'
import { createDemoIntelligenceService } from './intelligenceService.demo'
import { createRealIntelligenceService } from './intelligenceService.real'

export type IntelligenceOverview = {
  connected: boolean
  summary: AgentActionIntelligence | null
}

export interface IIntelligenceService {
  fetchOverview(): Promise<IntelligenceOverview>
}

let demoService: IIntelligenceService | null = null
let realService: IIntelligenceService | null = null

export function getIntelligenceService(): IIntelligenceService {
  if (useQuantumStore.getState().demoMode) {
    if (!demoService) demoService = createDemoIntelligenceService()
    return demoService
  }
  if (!realService) realService = createRealIntelligenceService()
  return realService
}
