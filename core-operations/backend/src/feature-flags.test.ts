/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluateFeatureFlag, rolloutBucket, validateFeatureFlagInput, validateFeatureFlagKey } from './feature-flags.js'

test('validateFeatureFlagKey accepts a well-formed key and rejects malformed ones', () => {
  assert.equal(validateFeatureFlagKey('core_operations.advanced_marketing'), 'core_operations.advanced_marketing')
  assert.throws(() => validateFeatureFlagKey('Bad Key!'), /key must be/)
  assert.throws(() => validateFeatureFlagKey(''), /key must be/)
})

test('validateFeatureFlagInput applies defaults when fields are omitted', () => {
  const input = validateFeatureFlagInput({})
  assert.equal(input.enabled, true)
  assert.equal(input.environment, 'all')
  assert.equal(input.rolloutPercent, 100)
  assert.deepEqual(input.tenantOverrides, {})
})

test('validateFeatureFlagInput rejects an out-of-range rolloutPercent', () => {
  assert.throws(() => validateFeatureFlagInput({ rolloutPercent: 150 }), /rolloutPercent/)
  assert.throws(() => validateFeatureFlagInput({ rolloutPercent: -1 }), /rolloutPercent/)
})

test('validateFeatureFlagInput rejects a non-object tenantOverrides', () => {
  assert.throws(() => validateFeatureFlagInput({ tenantOverrides: 'nope' }), /tenantOverrides/)
})

test('validateFeatureFlagInput coerces tenantOverrides values to booleans', () => {
  const input = validateFeatureFlagInput({ tenantOverrides: { 'tenant-1': 1, 'tenant-2': 0 } })
  assert.deepEqual(input.tenantOverrides, { 'tenant-1': true, 'tenant-2': false })
})

test('evaluateFeatureFlag: enabled=false always wins regardless of rollout/overrides', () => {
  const flag = { key: 'k', enabled: false, environment: 'all', rolloutPercent: 100, tenantOverrides: { 'tenant-1': true } }
  assert.equal(evaluateFeatureFlag(flag, 'tenant-1', 'production'), false)
})

test('evaluateFeatureFlag: environment mismatch is always off', () => {
  const flag = { key: 'k', enabled: true, environment: 'staging', rolloutPercent: 100, tenantOverrides: {} }
  assert.equal(evaluateFeatureFlag(flag, 'tenant-1', 'production'), false)
  assert.equal(evaluateFeatureFlag(flag, 'tenant-1', 'staging'), true)
})

test('evaluateFeatureFlag: a tenant override wins over the rollout percentage', () => {
  const flag = { key: 'k', enabled: true, environment: 'all', rolloutPercent: 0, tenantOverrides: { 'tenant-1': true } }
  assert.equal(evaluateFeatureFlag(flag, 'tenant-1', 'production'), true)
  assert.equal(evaluateFeatureFlag(flag, 'tenant-2', 'production'), false)
})

test('evaluateFeatureFlag: global (no tenantId) evaluation requires rolloutPercent >= 100', () => {
  const flag = { key: 'k', enabled: true, environment: 'all', rolloutPercent: 99, tenantOverrides: {} }
  assert.equal(evaluateFeatureFlag(flag, undefined, 'production'), false)
  assert.equal(evaluateFeatureFlag({ ...flag, rolloutPercent: 100 }, undefined, 'production'), true)
})

test('rolloutBucket is deterministic for the same tenantId+key and spread across 0-99', () => {
  const a = rolloutBucket('tenant-1', 'k')
  const b = rolloutBucket('tenant-1', 'k')
  assert.equal(a, b)
  assert.ok(a >= 0 && a < 100)
})

test('evaluateFeatureFlag: percentage rollout is deterministic per tenant', () => {
  const flag = { key: 'rollout-flag', enabled: true, environment: 'all', rolloutPercent: 50, tenantOverrides: {} }
  const first = evaluateFeatureFlag(flag, 'tenant-42', 'production')
  const second = evaluateFeatureFlag(flag, 'tenant-42', 'production')
  assert.equal(first, second)
})
