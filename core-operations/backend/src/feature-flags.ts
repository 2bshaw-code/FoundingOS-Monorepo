/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Phase 34 — structured feature flag evaluation, replacing ad-hoc booleans.
// Kept pure/testable where possible (evaluation, rollout hashing), matching
// this file's siblings (see telemetry.ts, event-feed.ts).
import { prisma } from './auth.js'
import { Prisma } from './generated/prisma/index.js'

export type FeatureFlagRecord = {
  id: string
  key: string
  description: string | null
  enabled: boolean
  environment: string
  rolloutPercent: number
  tenantOverrides: Record<string, boolean>
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}

export class FeatureFlagValidationError extends Error {
  status = 400
  constructor(message: string) {
    super(message)
  }
}

function toRecord(row: {
  id: string
  key: string
  description: string | null
  enabled: boolean
  environment: string
  rolloutPercent: number
  tenantOverrides: Prisma.JsonValue
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}): FeatureFlagRecord {
  const overrides = row.tenantOverrides && typeof row.tenantOverrides === 'object' && !Array.isArray(row.tenantOverrides)
    ? (row.tenantOverrides as Record<string, unknown>)
    : {}
  return {
    ...row,
    tenantOverrides: Object.fromEntries(Object.entries(overrides).map(([tenantId, value]) => [tenantId, Boolean(value)])),
  }
}

/**
 * Deterministic 0-99 "bucket" for a given tenant+flag pair, so the same
 * tenant always gets the same rollout answer for the same flag without
 * needing to persist a per-tenant row for simple percentage rollouts.
 * FNV-1a — small, dependency-free, good-enough distribution for this use.
 */
export function rolloutBucket(tenantId: string, key: string): number {
  let hash = 2166136261
  const input = `${key}:${tenantId}`
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash) % 100
}

/**
 * Evaluates whether a flag is on for a given tenant (or globally, if
 * `tenantId` is omitted). Precedence, highest to lowest:
 * 1. `enabled = false` — the flag's own kill switch always wins.
 * 2. `environment` mismatch — a flag scoped to a different environment
 *    than the caller's is always off there, regardless of rollout/overrides.
 * 3. `tenantOverrides[tenantId]` — an explicit per-tenant exception.
 * 4. `rolloutPercent` — a deterministic percentage of tenants, by hash
 *    bucket. Global (no `tenantId`) evaluation always uses the rollout
 *    percentage directly (100 = on, 0 = off, anything between is treated
 *    as "not universally decided" and defaults to off for a global check).
 */
export function evaluateFeatureFlag(
  flag: Pick<FeatureFlagRecord, 'enabled' | 'environment' | 'rolloutPercent' | 'tenantOverrides' | 'key'>,
  tenantId: string | undefined,
  environment: string,
): boolean {
  if (!flag.enabled) return false
  if (flag.environment !== 'all' && flag.environment !== environment) return false
  if (tenantId && Object.prototype.hasOwnProperty.call(flag.tenantOverrides, tenantId)) return flag.tenantOverrides[tenantId]
  if (!tenantId) return flag.rolloutPercent >= 100
  return rolloutBucket(tenantId, flag.key) < flag.rolloutPercent
}

const KEY_PATTERN = /^[a-z0-9_.]{1,120}$/

export function validateFeatureFlagInput(raw: Record<string, unknown>): {
  description?: string
  enabled: boolean
  environment: string
  rolloutPercent: number
  tenantOverrides: Record<string, boolean>
} {
  const enabled = raw.enabled === undefined ? true : Boolean(raw.enabled)
  const environment = typeof raw.environment === 'string' && raw.environment.trim() ? raw.environment.trim() : 'all'
  const rolloutPercent = raw.rolloutPercent === undefined ? 100 : Number(raw.rolloutPercent)
  if (!Number.isFinite(rolloutPercent) || rolloutPercent < 0 || rolloutPercent > 100) {
    throw new FeatureFlagValidationError('rolloutPercent must be a number between 0 and 100')
  }
  const rawOverrides = raw.tenantOverrides
  const tenantOverrides: Record<string, boolean> = {}
  if (rawOverrides !== undefined) {
    if (typeof rawOverrides !== 'object' || rawOverrides === null || Array.isArray(rawOverrides)) {
      throw new FeatureFlagValidationError('tenantOverrides must be an object of tenantId -> boolean')
    }
    for (const [tenantId, value] of Object.entries(rawOverrides as Record<string, unknown>)) {
      tenantOverrides[tenantId] = Boolean(value)
    }
  }
  return {
    description: typeof raw.description === 'string' ? raw.description : undefined,
    enabled,
    environment,
    rolloutPercent,
    tenantOverrides,
  }
}

export function validateFeatureFlagKey(key: unknown): string {
  const value = String(key || '').trim()
  if (!KEY_PATTERN.test(value)) {
    throw new FeatureFlagValidationError('key must be 1-120 chars of lowercase letters, numbers, "_" and "."')
  }
  return value
}

export async function listFeatureFlags(): Promise<FeatureFlagRecord[]> {
  const rows = await prisma.featureFlag.findMany({ orderBy: { key: 'asc' } })
  return rows.map(toRecord)
}

export async function upsertFeatureFlag(
  key: string,
  input: ReturnType<typeof validateFeatureFlagInput>,
  actorId: string,
): Promise<FeatureFlagRecord> {
  const row = await prisma.featureFlag.upsert({
    where: { key },
    create: {
      key,
      description: input.description,
      enabled: input.enabled,
      environment: input.environment,
      rolloutPercent: input.rolloutPercent,
      tenantOverrides: input.tenantOverrides as Prisma.InputJsonValue,
      createdBy: actorId,
      updatedBy: actorId,
    },
    update: {
      description: input.description,
      enabled: input.enabled,
      environment: input.environment,
      rolloutPercent: input.rolloutPercent,
      tenantOverrides: input.tenantOverrides as Prisma.InputJsonValue,
      updatedBy: actorId,
    },
  })
  return toRecord(row)
}

/** Evaluates a single flag by key for a tenant, defaulting to `false` (fail closed) if the flag doesn't exist. */
export async function isFeatureEnabled(key: string, tenantId: string | undefined, environment = process.env.NODE_ENV || 'development'): Promise<boolean> {
  const flag = await prisma.featureFlag.findUnique({ where: { key } })
  if (!flag) return false
  return evaluateFeatureFlag(toRecord(flag), tenantId, environment)
}
