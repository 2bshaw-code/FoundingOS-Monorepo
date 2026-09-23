/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import {
  fetchMessagingConnections,
  fetchMessagingParticipants,
  fetchMessagingReadiness,
  getSession,
  listAgentActions,
  sendMessagingIntelligenceBrief,
} from '../core-operations-api'
import { AutomationOverview, BriefDeliveryResult, IAutomationService } from './automationService'

export function createRealAutomationService(): IAutomationService {
  return {
    async fetchOverview(): Promise<AutomationOverview> {
      const session = await getSession()
      if (!session) return { connected: false, readiness: null, connections: [], participants: [], actions: [] }

      const [readiness, connections, participants, actions] = await Promise.all([
        fetchMessagingReadiness().catch(() => null),
        fetchMessagingConnections().catch(() => []),
        fetchMessagingParticipants().catch(() => []),
        listAgentActions().catch(() => []),
      ])

      return { connected: true, readiness, connections, participants, actions }
    },
    async deliverBrief(participantId, latestActionId): Promise<BriefDeliveryResult> {
      const result = await sendMessagingIntelligenceBrief(participantId, latestActionId)
      return { sent: result.sent }
    },
  }
}
