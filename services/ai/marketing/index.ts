/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AALContext, AALSuggestion } from '../orchestrator/types.ts'
import { generateMultiVariantCampaign } from './AutonomousCampaigns.ts'
import { generateWeeklyMarketingReport, suggestNewCampaigns } from './MarketingDirector.ts'
import { predictAudienceResponse, predictCampaignPerformance } from './PredictiveMarketing.ts'
import { fail, ok, type AIContext, type AIResult } from '../types.ts'

export function runMarketingEngine(context: AALContext): AALSuggestion {
  const campaign = String(context.inputs.campaign ?? context.prompt ?? `${context.brand.name} growth loop`)
  const performance = predictCampaignPerformance(campaign)
  const audience = predictAudienceResponse(String(context.inputs.audienceSegment ?? 'highest intent customers'))
  const variants = generateMultiVariantCampaign(campaign, context.brand)
  const report = generateWeeklyMarketingReport(context.actorId)
  const campaignIdeas = suggestNewCampaigns(context.actorId)
  return {
    id: `marketing-${context.brandSlug}-${context.intent}`,
    title: `${context.brand.name} Marketing AI`,
    summary: `Prioritise ${campaign} with ${performance.projectedLift} projected lift, ${audience.response.toLowerCase()}, and a weekly director view covering ${report.summary}`,
    confidence: 0.88,
    risk: context.intent === 'automate' ? 'medium' : 'low',
    nextActions: [
      'Segment customers by recency, value, and response intent.',
      variants[0],
      campaignIdeas[0],
      'Hold final send behind human approval unless Enterprise automation is enabled.',
    ],
    automations: ['Audience scoring', 'Creative variant drafting', 'Send-time recommendation'],
    dataWrites: [{ target: 'marketingCampaigns', operation: 'queue', payload: { campaign, brandSlug: context.brandSlug, status: 'pending_confirmation' } }],
    guardrails: ['No campaign is sent without consent and unsubscribe compliance.', 'No cross-brand customer data is mixed.'],
  }
}

export async function handleMarketingAction(action: string, payload: Record<string, unknown>, ctx: AIContext): Promise<AIResult> {
  if (action === 'predictCampaign') return ok(predictCampaignPerformance(String(payload.campaignDraft ?? ctx.prompt)))
  if (action === 'autonomousCampaign') return ok({ variants: generateMultiVariantCampaign(String(payload.brief ?? ctx.prompt), ctx.brandTokens) })
  if (action === 'weeklyReport') return ok(generateWeeklyMarketingReport(ctx.tenantId))
  if (action === 'suggestCampaigns') return ok({ suggestions: suggestNewCampaigns(ctx.tenantId) })
  return fail('Unknown marketing action')
}

export * from './AutonomousCampaigns.ts'
export * from './MarketingDirector.ts'
export * from './PredictiveMarketing.ts'
