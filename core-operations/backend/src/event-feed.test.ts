import assert from 'node:assert/strict'
import test from 'node:test'
import { buildEventQuery, predictPatternOutcomes, summarizePatternEvents } from './event-feed.js'

test('event queries are tenant scoped, indexed dimensions, and bounded', () => {
  const query = buildEventQuery('tenant-1', {
    source: 'retail',
    types: 'inventory.threshold.breached,agent.action.completed',
    actionId: 'action-1',
    since: '2026-01-01T00:00:00.000Z',
    limit: 999,
  })
  assert.equal(query.take, 200)
  assert.deepEqual(query.orderBy, { createdAt: 'desc' })
  assert.deepEqual(query.where, {
    tenantId: 'tenant-1',
    source: 'retail',
    type: { in: ['inventory.threshold.breached', 'agent.action.completed'] },
    createdAt: { gte: new Date('2026-01-01T00:00:00.000Z') },
    AND: [{ payload: { path: ['actionId'], equals: 'action-1' } }],
  })
})

test('historical event patterns produce explainable outcome context', () => {
  const summary = summarizePatternEvents(
    [{ createdAt: new Date(), payload: {} }, { createdAt: new Date(), payload: {} }],
    [{ createdAt: new Date(), payload: {} }],
    [{ createdAt: new Date('2026-09-17T10:00:00.000Z'), payload: { outcome: { summary: 'protected stock availability with no delivery exception' } } }],
  )
  assert.equal(summary.similarSignals, 2)
  assert.equal(summary.completionRate, 100)
  assert.match(summary.narrative, /protected stock availability/)
})

test('predictive patterns combine tenant history with privacy-safe cohort evidence', () => {
  const completed = (tenantId: string) => ({ tenantId, type: 'agent.action.completed', createdAt: new Date(), payload: { kind: 'inventory.replenishment', estimatedValuePence: 78_000 } })
  const prediction = predictPatternOutcomes(
    'inventory.replenishment',
    [completed('tenant-1'), completed('tenant-1')],
    [completed('tenant-2'), completed('tenant-3'), completed('tenant-4')],
  )
  assert.equal(prediction.cohortIncluded, true)
  assert.equal(prediction.cohortTenantCount, 3)
  assert.equal(prediction.evidenceCount, 5)
  assert.equal(prediction.successfulOutcomes, 5)
  assert.equal(prediction.highImpactOutcomeRate, 100)
  assert.ok(prediction.confidence > 50)
  assert.match(prediction.triggerPattern, /inventory threshold breach/)
  assert.match(prediction.likelyNext, /synchronized/)
})

test('predictive patterns suppress cohorts below the anonymity threshold', () => {
  const event = (tenantId: string) => ({ tenantId, type: 'agent.action.rejected', createdAt: new Date(), payload: { kind: 'inventory.replenishment' } })
  const prediction = predictPatternOutcomes('inventory.replenishment', [], [event('tenant-2'), event('tenant-3')])
  assert.equal(prediction.cohortIncluded, false)
  assert.equal(prediction.cohortEvidenceCount, 0)
  assert.equal(prediction.cohortTenantCount, 0)
  assert.match(prediction.basis[1], /withheld/)
})

test('outcome assessments refine confidence without overpowering the base pattern', () => {
  const completed = { tenantId: 'tenant-1', type: 'agent.action.completed', createdAt: new Date(), payload: { kind: 'inventory.replenishment' } }
  const assessed = (accuracy: number) => ({ tenantId: 'tenant-1', type: 'agent.action.outcome.assessed', createdAt: new Date(), payload: { kind: 'inventory.replenishment', accuracy } })
  const prediction = predictPatternOutcomes('inventory.replenishment', [completed, ...Array.from({ length: 10 }, () => assessed(90))], [])
  assert.equal(prediction.assessedOutcomes, 10)
  assert.equal(prediction.averageAccuracy, 90)
  assert.ok(prediction.confidence <= 95)
  assert.equal(prediction.refined, false)
  assert.match(prediction.basis.at(-1) || '', /averaged 90% accuracy/)
})

test('patterns become refined only after sufficient resolved and assessed outcomes', () => {
  const completed = () => ({ tenantId: 'tenant-1', type: 'agent.action.completed', createdAt: new Date(), payload: { kind: 'inventory.replenishment' } })
  const assessed = () => ({ tenantId: 'tenant-1', type: 'agent.action.outcome.assessed', createdAt: new Date(), payload: { kind: 'inventory.replenishment', accuracy: 80 } })
  const prediction = predictPatternOutcomes(
    'inventory.replenishment',
    [...Array.from({ length: 10 }, completed), ...Array.from({ length: 10 }, assessed)],
    [],
  )
  assert.equal(prediction.refined, true)
  assert.equal(prediction.assessedOutcomes, 10)
  assert.ok(prediction.reliabilityScore > 0)
})
