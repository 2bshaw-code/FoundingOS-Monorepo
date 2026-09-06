/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AALDomain, AALIntent } from '../events/event-bus.ts'
import { handleCrmAction } from '../crm/index.ts'
import { eventBus } from '../events/event-bus.ts'
import { recordAIAudit } from '../events/AuditLog.ts'
import { handleFinanceAction } from '../finance/index.ts'
import { handleMarketingAction } from '../marketing/index.ts'
import { getPrompt } from '../models/PromptRegistry.ts'
import { handleSalesAction } from '../sales/index.ts'
import { toAIContext, type AIResult } from '../types.ts'
import { canRunAIDomain, getAISettings } from '../settings/index.ts'
import { enforceEntitlements as enforceAIEntitlements } from './EntitlementsBridge.ts'
import { buildContext } from './context-builder.ts'
import { runAAL } from './index.ts'
import { enforceUsageLimits, recordAIUsage } from '../../packages/modelD/UsageMeters.ts'

export function routeRequest(domain: AALDomain, action: AALIntent, payload: Record<string, unknown>, context: Record<string, unknown> = {}) {
  return runAAL({ ...payload, ...context, domain, intent: action })
}

export async function routeAIRequest(domain: AALDomain, action: string, payload: Record<string, unknown>, context: ReturnType<typeof buildContext>): Promise<AIResult> {
  const aiContext = toAIContext(context)
  const settings = getAISettings(aiContext.tenantId)
  if (!canRunAIDomain(aiContext.tenantId, domain)) {
    const error = `${domain} AI is disabled for this tenant.`
    recordAIAudit({ domain, action, tenantId: aiContext.tenantId, userId: aiContext.userId, outcome: 'blocked', message: error })
    eventBus.emit({ type: 'guardrail_applied', domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { action, reason: error } })
    return { success: false, error, meta: { creditSafe: true } }
  }

  if (action.toLowerCase().includes('autonomous') && !settings.autonomousEnabled) {
    const error = 'Autonomous AI modes are disabled until explicitly enabled for this tenant.'
    recordAIAudit({ domain, action, tenantId: aiContext.tenantId, userId: aiContext.userId, outcome: 'blocked', message: error })
    eventBus.emit({ type: 'guardrail_applied', domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { action, reason: error } })
    return { success: false, error, meta: { creditSafe: true } }
  }

  try {
    await enforceAIEntitlements(aiContext, domain, action)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI entitlement check failed.'
    recordAIAudit({ domain, action, tenantId: aiContext.tenantId, userId: aiContext.userId, outcome: 'blocked', message })
    eventBus.emit({ type: 'guardrail_applied', domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { action, reason: message } })
    return { success: false, error: message, meta: { creditSafe: true } }
  }

  const usage = enforceUsageLimits(aiContext.tenantId, domain, action)
  if (!usage.allowed) {
    recordAIAudit({ domain, action, tenantId: aiContext.tenantId, userId: aiContext.userId, outcome: 'blocked', message: usage.reason })
    eventBus.emit({ type: 'guardrail_applied', domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { action, reason: usage.reason, usage: usage.usage, limit: usage.limit } })
    return { success: false, error: usage.reason, meta: { creditSafe: true, usage } }
  }

  eventBus.emit({ type: 'engine_routed', domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { action, prompt: getPrompt(domain, action) } })
  recordAIUsage(aiContext.tenantId, domain, action)

  let result: AIResult
  if (domain === 'marketing') result = await handleMarketingAction(action, payload, aiContext)
  else if (domain === 'sales') result = await handleSalesAction(action, payload, aiContext)
  else if (domain === 'crm') result = await handleCrmAction(action, payload, aiContext)
  else if (domain === 'finance') result = await handleFinanceAction(action, payload, aiContext)
  else result = { success: false, error: 'Unknown domain', meta: { creditSafe: true } }

  recordAIAudit({ domain, action, tenantId: aiContext.tenantId, userId: aiContext.userId, outcome: result.success ? 'success' : 'error', message: result.error })
  eventBus.emit({ type: result.success ? 'action_completed' : 'action_failed', domain, brandSlug: context.brandSlug, actorId: context.actorId, metadata: { action, outcome: result.success ? 'success' : 'error' } })
  return result
}

export function enforceEntitlements(packageModelD: unknown, domain: AALDomain, action: AALIntent) {
  return buildContext({ tier: packageModelD, domain, intent: action }).capabilities.includes(`${domain}:${action}`)
}

export { selectModel } from '../models/ModelSelector.ts'

export function execute(domainEngine: (context: ReturnType<typeof buildContext>) => unknown, action: AALIntent, payload: Record<string, unknown>) {
  return domainEngine(buildContext({ ...payload, intent: action }))
}
