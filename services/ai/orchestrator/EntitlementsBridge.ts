/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { checkEntitlement } from '../../packages/modelD/entitlements.ts'
import type { AIDomain, AIContext } from '../types.ts'
import type { AALIntent } from '../events/event-bus.ts'

const ACTION_INTENT: Record<string, AALIntent> = {
  predictCampaign: 'forecast',
  autonomousCampaign: 'automate',
  weeklyReport: 'forecast',
  suggestCampaigns: 'recommend',
  scoreLead: 'analyse',
  prioritizePipeline: 'recommend',
  draftProposal: 'draft',
  draftFollowUp: 'draft',
  predictDeal: 'forecast',
  dealStrategy: 'forecast',
  customerBrain: 'analyse',
  predictChurn: 'forecast',
  autoResolveTicket: 'automate',
  draftReply: 'draft',
  detectUnhappy: 'analyse',
  upsellSequence: 'recommend',
  monthlyReport: 'analyse',
  cashflowForecast: 'forecast',
  predictPaymentFailure: 'forecast',
  recoverySequence: 'recommend',
  revenueTrend: 'forecast',
  boardSummary: 'forecast',
}

export async function enforceEntitlements(ctx: AIContext, domain: AIDomain, mode: string): Promise<void> {
  const decision = checkEntitlement(domain, ACTION_INTENT[mode] ?? (mode as AALIntent), ctx.tier)
  if (!decision.allowed) {
    throw new Error(decision.reason)
  }
}
