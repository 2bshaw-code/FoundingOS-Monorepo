/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AALContext, AALSuggestion } from '../orchestrator/types.ts'
import { detectRiskSignals, predictDealProbability, recommendDealStrategy } from './DealIntelligence.ts'
import { detectStalledDeals, prioritizePipeline, scoreLead, suggestNextActions } from './PipelineManager.ts'
import { draftFollowUp, draftProposal } from './SalesRep.ts'
import { fail, ok, type AIContext, type AIResult } from '../types.ts'

export function runSalesEngine(context: AALContext): AALSuggestion {
  const deal = String(context.inputs.dealName ?? context.prompt ?? `${context.brand.name} opportunity`)
  const lead = scoreLead(String(context.inputs.leadId ?? deal))
  const probability = predictDealProbability(deal)
  const strategy = recommendDealStrategy(deal)
  const riskSignals = detectRiskSignals(deal)
  const stalled = detectStalledDeals(String(context.inputs.pipelineId ?? `${context.brandSlug}-pipeline`))
  return {
    id: `sales-${context.brandSlug}-${context.intent}`,
    title: `${context.brand.name} Sales AI`,
    summary: `Score ${deal} at ${lead.score}/100 with ${Math.round(probability.probability * 100)}% probability, then apply: ${strategy.strategy}`,
    confidence: 0.86,
    risk: context.intent === 'forecast' ? 'medium' : 'low',
    nextActions: [
      ...suggestNextActions(deal),
      draftFollowUp(deal),
      `Risk check: ${riskSignals.risks.join(', ')}. Stalled signals: ${stalled.stalled.join(', ')}.`,
    ],
    automations: ['Lead scoring', 'Pipeline prioritisation', draftProposal(deal)],
    dataWrites: [{ target: 'salesPipeline', operation: 'update', payload: { deal, brandSlug: context.brandSlug, stage: 'ai_prioritised' } }],
    guardrails: ['No revenue is counted until signed or paid.', 'No credit promise is generated automatically.'],
  }
}

export async function handleSalesAction(action: string, payload: Record<string, unknown>, ctx: AIContext): Promise<AIResult> {
  if (action === 'scoreLead') return ok(scoreLead(String(payload.leadId ?? ctx.prompt)))
  if (action === 'prioritizePipeline') return ok(prioritizePipeline(String(payload.pipelineId ?? `${ctx.brandSlug}-pipeline`)))
  if (action === 'draftProposal') return ok({ proposalText: draftProposal(String(payload.dealId ?? ctx.prompt)) })
  if (action === 'draftFollowUp') return ok({ message: draftFollowUp(String(payload.dealId ?? ctx.prompt)) })
  if (action === 'predictDeal') return ok(predictDealProbability(String(payload.dealId ?? ctx.prompt)))
  if (action === 'dealStrategy') return ok(recommendDealStrategy(String(payload.dealId ?? ctx.prompt)))
  return fail('Unknown sales action')
}

export * from './DealIntelligence.ts'
export * from './PipelineManager.ts'
export * from './SalesRep.ts'
