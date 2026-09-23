/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { DEMO_MESSAGING_PARTICIPANTS, DEMO_MESSAGING_READINESS } from '../demo-data'
import { AutomationOverview, BriefDeliveryResult, IAutomationService } from './automationService'

export function createDemoAutomationService(): IAutomationService {
  return {
    async fetchOverview(): Promise<AutomationOverview> {
      return {
        connected: true,
        readiness: DEMO_MESSAGING_READINESS,
        connections: DEMO_MESSAGING_READINESS.activeConnections,
        participants: DEMO_MESSAGING_PARTICIPANTS,
        actions: [],
      }
    },
    async deliverBrief(): Promise<BriefDeliveryResult> {
      // Demo mode never sends a real message — the caller surfaces this as
      // "handed to WhatsApp delivery (demo mode)" rather than a real send.
      return { sent: true }
    },
  }
}
