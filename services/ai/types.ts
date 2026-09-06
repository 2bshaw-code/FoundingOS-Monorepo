/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AALDomain } from './events/event-bus.ts'
import type { AALContext } from './orchestrator/types.ts'

export type AIDomain = AALDomain

export type AIContext = AALContext & {
  userId: string
  tenantId: string
  brandId: string
  packageTier: string
  packageModelD: { tier: string; capabilities: string[] }
  usageSignals: Record<string, unknown>
  revenueSignals: Record<string, unknown>
  brandTokens: AALContext['brand']
  customerGraph?: Record<string, unknown>
}

export type AIResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  meta?: Record<string, unknown>
}

export function toAIContext(context: AALContext): AIContext {
  return {
    ...context,
    userId: context.actorId,
    tenantId: context.tenantId,
    brandId: context.brandSlug,
    packageTier: context.tier,
    packageModelD: { tier: context.tier, capabilities: context.capabilities },
    usageSignals: context.usageSignals,
    revenueSignals: context.revenueSignals,
    brandTokens: context.brand,
    customerGraph: context.customerGraph,
  }
}

export function ok<T>(data: T, meta: Record<string, unknown> = {}): AIResult<T> {
  return { success: true, data, meta: { creditSafe: true, ...meta } }
}

export function fail(error: string, meta: Record<string, unknown> = {}): AIResult {
  return { success: false, error, meta: { creditSafe: true, ...meta } }
}
