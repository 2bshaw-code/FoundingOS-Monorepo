/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandSlug } from '../../../packages/config/src/index.ts'
import type { BaseTierName } from '../../../packages/config/src/package-model-d.ts'
import type { AALDomain, AALIntent, AALRiskLevel, AALEvent } from '../events/event-bus.ts'
import type { EntitlementDecision } from '../../packages/modelD/entitlements.ts'

export type AALContext = {
  actorId: string
  brandSlug: BrandSlug
  domain: AALDomain
  intent: AALIntent
  tier: BaseTierName
  locale: string
  channel: 'web' | 'mobile' | 'api'
  prompt: string
  inputs: Record<string, unknown>
  brand: { name: string; accent: string; modules: string[]; tagline: string }
  capabilities: string[]
  tenantId: string
  customerGraph?: Record<string, unknown>
  usageSignals: Record<string, unknown>
  revenueSignals: Record<string, unknown>
}

export type AALSuggestion = {
  id: string
  title: string
  summary: string
  confidence: number
  risk: AALRiskLevel
  nextActions: string[]
  automations: string[]
  dataWrites: Array<{ target: string; operation: 'create' | 'update' | 'queue'; payload: Record<string, unknown> }>
  guardrails: string[]
}

export type AALResult = {
  ok: boolean
  domain: AALDomain
  intent: AALIntent
  brandSlug: BrandSlug
  entitlement: EntitlementDecision
  suggestion: AALSuggestion | null
  events: AALEvent[]
  creditSafe: true
}

export type DomainEngine = (context: AALContext) => AALSuggestion
