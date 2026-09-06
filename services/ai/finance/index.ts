/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AALContext, AALSuggestion } from '../orchestrator/types.ts'
import { detectSubscriptionChurnRisk, generateRecoverySequence, predictPaymentFailure, suggestPricingAdjustments } from './BillingBrain.ts'
import { autoCategorizeTransaction, detectAnomaly, generateCashflowForecast, generateMonthlyReport } from './FinancialController.ts'
import { generateBoardSummary, predictRevenueTrend, suggestUsageBasedAdjustments } from './RevenueIntelligence.ts'
import { fail, ok, type AIContext, type AIResult } from '../types.ts'

export function runFinanceEngine(context: AALContext): AALSuggestion {
  const invoiceId = String(context.inputs.invoiceId ?? context.prompt ?? 'pending finance item')
  const tenantId = String(context.inputs.tenantId ?? context.actorId)
  const transactionId = String(context.inputs.transactionId ?? invoiceId)
  const category = autoCategorizeTransaction(transactionId)
  const anomaly = detectAnomaly(transactionId)
  const paymentRisk = predictPaymentFailure(invoiceId)
  const cashflow = generateCashflowForecast(tenantId)
  const revenue = predictRevenueTrend(tenantId)
  return {
    id: `finance-${context.brandSlug}-${context.intent}`,
    title: `${context.brand.name} Finance AI`,
    summary: `Review ${invoiceId}: ${category.category} suggested, anomaly=${anomaly.anomaly}, payment risk=${paymentRisk.risk}, cashflow=${cashflow.forecast}, revenue trend=${revenue.trend}.`,
    confidence: 0.84,
    risk: context.intent === 'approve' || context.intent === 'automate' ? 'high' : 'medium',
    nextActions: [
      'Verify supplier, amount, due date, and approval authority.',
      'Recommend pay/hold/escalate without auto-spending funds.',
      'Log reconciliation evidence before marking paid.',
      suggestPricingAdjustments(String(context.inputs.planId ?? 'current-plan')).suggestion,
      suggestUsageBasedAdjustments(tenantId).adjustments[0],
    ],
    automations: ['Receipt extraction', 'Cashflow impact forecast', generateBoardSummary(tenantId).summary, detectSubscriptionChurnRisk(String(context.inputs.subscriptionId ?? 'active-subscription')).signal],
    dataWrites: [{ target: 'financeApprovals', operation: 'queue', payload: { invoiceId, brandSlug: context.brandSlug, status: 'requires_human_approval' } }],
    guardrails: ['Credit safe: no payment, lending, or financial approval is executed without human confirmation.', 'Finance AI never fabricates balances or settlement status.'],
  }
}

export async function handleFinanceAction(action: string, payload: Record<string, unknown>, ctx: AIContext): Promise<AIResult> {
  if (action === 'monthlyReport') return ok(generateMonthlyReport(ctx.tenantId))
  if (action === 'cashflowForecast') return ok(generateCashflowForecast(ctx.tenantId))
  if (action === 'predictPaymentFailure') return ok(predictPaymentFailure(String(payload.invoiceId ?? ctx.prompt)))
  if (action === 'recoverySequence') return ok({ steps: generateRecoverySequence(String(payload.customerId ?? ctx.prompt)) })
  if (action === 'revenueTrend') return ok(predictRevenueTrend(ctx.tenantId))
  if (action === 'boardSummary') return ok(generateBoardSummary(ctx.tenantId))
  return fail('Unknown finance action')
}

export * from './BillingBrain.ts'
export * from './FinancialController.ts'
export * from './RevenueIntelligence.ts'
