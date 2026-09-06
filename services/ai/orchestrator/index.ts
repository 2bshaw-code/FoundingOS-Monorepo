/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { checkEntitlement } from '../../packages/modelD/entitlements.ts'
import { enforceUsageLimits, recordAIUsage } from '../../packages/modelD/UsageMeters.ts'
import { eventBus } from '../events/event-bus.ts'
import { runMarketingEngine } from '../marketing/index.ts'
import { isCircuitOpen } from '../models/CircuitBreaker.ts'
import { selectModel } from '../models/ModelSelector.ts'
import { runSalesEngine } from '../sales/index.ts'
import { runCrmEngine } from '../crm/index.ts'
import { runFinanceEngine } from '../finance/index.ts'
import { buildContext } from './context-builder.ts'
import type { AALContext, AALResult, DomainEngine } from './types.ts'

const ENGINES: Record<AALContext['domain'], DomainEngine> = {
  marketing: runMarketingEngine,
  sales: runSalesEngine,
  crm: runCrmEngine,
  finance: runFinanceEngine,
}

export function runAAL(input: Record<string, unknown>): AALResult {
  const context = buildContext(input)
  const events = [
    eventBus.emit({ type: 'context_built', domain: context.domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { tier: context.tier, channel: context.channel } }),
  ]
  const entitlement = checkEntitlement(context.domain, context.intent, context.tier)
  events.push(eventBus.emit({ type: 'entitlement_checked', domain: context.domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { allowed: entitlement.allowed, requiredTier: entitlement.requiredTier ?? '' } }))

  if (!entitlement.allowed) {
    events.push(eventBus.emit({ type: 'guardrail_applied', domain: context.domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { reason: entitlement.reason } }))
    return { ok: false, domain: context.domain, intent: context.intent, brandSlug: context.brandSlug, entitlement, suggestion: null, events, creditSafe: true }
  }

  const usage = enforceUsageLimits(context.actorId, context.domain, context.intent)
  if (!usage.allowed) {
    events.push(eventBus.emit({ type: 'guardrail_applied', domain: context.domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { reason: usage.reason, usage: usage.usage, limit: usage.limit } }))
    return { ok: false, domain: context.domain, intent: context.intent, brandSlug: context.brandSlug, entitlement: { allowed: false, tier: context.tier, requiredTier: context.tier, reason: usage.reason, creditSafe: true }, suggestion: null, events, creditSafe: true }
  }

  const model = selectModel(context.domain, context.intent, context.intent === 'automate' || context.intent === 'approve' ? 'high' : 'medium')
  if (isCircuitOpen(model.model)) {
    const reason = `${model.model} circuit breaker is open.`
    events.push(eventBus.emit({ type: 'guardrail_applied', domain: context.domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { reason } }))
    return { ok: false, domain: context.domain, intent: context.intent, brandSlug: context.brandSlug, entitlement: { allowed: false, tier: context.tier, requiredTier: context.tier, reason, creditSafe: true }, suggestion: null, events, creditSafe: true }
  }

  events.push(eventBus.emit({ type: 'engine_routed', domain: context.domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { engine: context.domain } }))
  recordAIUsage(context.actorId, context.domain, context.intent)
  const suggestion = ENGINES[context.domain](context)
  events.push(eventBus.emit({ type: 'suggestion_generated', domain: context.domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { confidence: suggestion.confidence, risk: suggestion.risk, model: model.model } }))

  return { ok: true, domain: context.domain, intent: context.intent, brandSlug: context.brandSlug, entitlement, suggestion, events, creditSafe: true }
}

export * from './context-builder.ts'
export * from './types.ts'
