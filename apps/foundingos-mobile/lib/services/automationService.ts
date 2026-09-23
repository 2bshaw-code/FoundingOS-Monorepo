/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Automation tab service contract — messaging channel readiness, active
// connections, authorized participants, and actionable agent actions, plus
// the intelligence-brief delivery mutation.
import { AgentAction, MessagingChannelConnection, MessagingParticipant, MessagingReadiness } from '../core-operations-api'
import { useQuantumStore } from '../store'
import { createDemoAutomationService } from './automationService.demo'
import { createRealAutomationService } from './automationService.real'

export type AutomationOverview = {
  connected: boolean
  readiness: MessagingReadiness | null
  connections: MessagingChannelConnection[]
  participants: MessagingParticipant[]
  actions: AgentAction[]
}

export type BriefDeliveryResult = { sent: boolean }

export interface IAutomationService {
  fetchOverview(): Promise<AutomationOverview>
  deliverBrief(participantId: string, latestActionId?: string): Promise<BriefDeliveryResult>
}

let demoService: IAutomationService | null = null
let realService: IAutomationService | null = null

export function getAutomationService(): IAutomationService {
  if (useQuantumStore.getState().demoMode) {
    if (!demoService) demoService = createDemoAutomationService()
    return demoService
  }
  if (!realService) realService = createRealAutomationService()
  return realService
}
