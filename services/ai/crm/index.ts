/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AALContext, AALSuggestion } from '../orchestrator/types.ts'
import { buildCustomerProfile, predictChurn, trackSentiment } from './CustomerBrain.ts'
import { detectUnhappyCustomers, generateUpsellSequence, suggestRetentionActions } from './RelationshipManager.ts'
import { autoResolveTicket, draftReply, routeEscalation } from './SupportAgent.ts'
import { fail, ok, type AIContext, type AIResult } from '../types.ts'

export function runCrmEngine(context: AALContext): AALSuggestion {
  const customer = String(context.inputs.customerName ?? context.prompt ?? `${context.brand.name} customer`)
  const customerId = String(context.inputs.customerId ?? customer)
  const profile = buildCustomerProfile(customerId)
  const churn = predictChurn(customerId)
  const sentiment = trackSentiment(customerId)
  const unhappy = detectUnhappyCustomers(context.actorId)
  return {
    id: `crm-${context.brandSlug}-${context.intent}`,
    title: `${context.brand.name} CRM AI`,
    summary: `Build a relationship plan for ${customer}: ${profile.profile} Churn risk is ${churn.risk}; sentiment is ${sentiment.sentiment}.`,
    confidence: 0.9,
    risk: context.intent === 'automate' ? 'medium' : 'low',
    nextActions: [
      ...suggestRetentionActions(customerId),
      generateUpsellSequence(customerId)[0],
      draftReply(String(context.inputs.ticketId ?? `${customerId}-latest-ticket`)),
      `Escalation route: ${routeEscalation(String(context.inputs.ticketId ?? customerId)).route}. Watchlist: ${unhappy.customers.join(', ')}.`,
    ],
    automations: ['Customer summarisation', 'Retention risk scoring', 'Next-best-action queue'],
    dataWrites: [{ target: 'crmActivities', operation: 'create', payload: { customer, brandSlug: context.brandSlug, source: 'aal' } }],
    guardrails: ['Customer data remains inside its brand tenant.', 'Sensitive notes are summarized, not broadcast.'],
  }
}

export async function handleCrmAction(action: string, payload: Record<string, unknown>, ctx: AIContext): Promise<AIResult> {
  if (action === 'customerBrain') return ok(buildCustomerProfile(String(payload.customerId ?? ctx.prompt)))
  if (action === 'predictChurn') return ok(predictChurn(String(payload.customerId ?? ctx.prompt)))
  if (action === 'autoResolveTicket') return ok(autoResolveTicket(String(payload.ticketId ?? ctx.prompt)))
  if (action === 'draftReply') return ok({ reply: draftReply(String(payload.ticketId ?? ctx.prompt)) })
  if (action === 'detectUnhappy') return ok(detectUnhappyCustomers(ctx.tenantId))
  if (action === 'upsellSequence') return ok({ sequence: generateUpsellSequence(String(payload.customerId ?? ctx.prompt)) })
  return fail('Unknown CRM action')
}

export * from './CustomerBrain.ts'
export * from './RelationshipManager.ts'
export * from './SupportAgent.ts'
