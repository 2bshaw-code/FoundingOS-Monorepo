/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import assert from 'node:assert/strict'
import test from 'node:test'
import { createTelemetryRateLimiter, parseTelemetryBatch, summarizeTelemetryEvents, validateTelemetryEvent } from './telemetry.js'

test('validateTelemetryEvent accepts a well-formed event and normalizes optional fields', () => {
  const event = validateTelemetryEvent({
    suite: 'core_operations',
    name: 'order.created',
    actorType: 'user',
    actorId: 'user-1',
    occurredAt: '2026-01-01T00:00:00.000Z',
    properties: { orderId: 'order-1' },
  })
  assert.equal(event.suite, 'core_operations')
  assert.equal(event.name, 'order.created')
  assert.equal(event.actorType, 'user')
  assert.equal(event.actorId, 'user-1')
  assert.deepEqual(event.properties, { orderId: 'order-1' })
})

test('validateTelemetryEvent defaults occurredAt and properties when omitted', () => {
  const before = Date.now()
  const event = validateTelemetryEvent({ suite: 'platform', name: 'user.login', actorType: 'system' })
  assert.ok(event.occurredAt.getTime() >= before)
  assert.deepEqual(event.properties, {})
  assert.equal(event.tenantId, undefined)
})

test('validateTelemetryEvent rejects an unknown suite', () => {
  assert.throws(() => validateTelemetryEvent({ suite: 'meat_scraper', name: 'x', actorType: 'system' }), /Unknown suite/)
})

test('validateTelemetryEvent rejects an unknown actorType', () => {
  assert.throws(() => validateTelemetryEvent({ suite: 'platform', name: 'x', actorType: 'robot' }), /Unknown actorType/)
})

test('validateTelemetryEvent rejects a missing event name', () => {
  assert.throws(() => validateTelemetryEvent({ suite: 'platform', name: '', actorType: 'system' }), /Event name is required/)
})

test('validateTelemetryEvent rejects non-object properties', () => {
  assert.throws(() => validateTelemetryEvent({ suite: 'platform', name: 'x', actorType: 'system', properties: 'nope' }), /properties must be a JSON object/)
  assert.throws(() => validateTelemetryEvent({ suite: 'platform', name: 'x', actorType: 'system', properties: ['nope'] }), /properties must be a JSON object/)
})

test('parseTelemetryBatch accepts a single event or an { events: [] } batch', () => {
  const single = parseTelemetryBatch({ suite: 'platform', name: 'user.login', actorType: 'user' })
  assert.equal(single.length, 1)
  const batch = parseTelemetryBatch({
    events: [
      { suite: 'platform', name: 'user.login', actorType: 'user' },
      { suite: 'core_workforce', name: 'applicant.created', actorType: 'user' },
    ],
  })
  assert.equal(batch.length, 2)
})

test('parseTelemetryBatch rejects an empty batch and an oversized batch', () => {
  assert.throws(() => parseTelemetryBatch({ events: [] }), /At least one event is required/)
  const oversized = { events: Array.from({ length: 101 }, () => ({ suite: 'platform', name: 'x', actorType: 'system' })) }
  assert.throws(() => parseTelemetryBatch(oversized), /Batch too large/)
})

test('createTelemetryRateLimiter allows up to max requests per window, then rejects', () => {
  const limiter = createTelemetryRateLimiter(60_000, 3)
  assert.equal(limiter('tenant-1').allowed, true)
  assert.equal(limiter('tenant-1').allowed, true)
  assert.equal(limiter('tenant-1').allowed, true)
  assert.equal(limiter('tenant-1').allowed, false)
  // A different key has its own independent bucket.
  assert.equal(limiter('tenant-2').allowed, true)
})

test('summarizeTelemetryEvents counts by suite/name/tenant and classifies errors/offline events', () => {
  const now = new Date('2026-01-01T00:00:00Z')
  const events = [
    { tenantId: 'tenant-a', suite: 'core_operations', name: 'record.created', occurredAt: now, properties: {} },
    { tenantId: 'tenant-a', suite: 'core_operations', name: 'record.created', occurredAt: now, properties: {} },
    { tenantId: 'tenant-b', suite: 'platform', name: 'mobile.sync_error', occurredAt: now, properties: {} },
    { tenantId: 'tenant-b', suite: 'platform', name: 'mobile.approve', occurredAt: now, properties: { outcome: 'failure' } },
    { tenantId: null, suite: 'platform', name: 'mobile.offline_queue_flush', occurredAt: now, properties: {} },
  ]
  const summary = summarizeTelemetryEvents(events)
  assert.equal(summary.totalEvents, 5)
  assert.equal(summary.errorCount, 2) // name match + outcome match
  assert.equal(summary.errorRate, 0.4)
  assert.equal(summary.offlineEventCount, 1)
  assert.deepEqual(summary.bySuite, [
    { suite: 'platform', count: 3 },
    { suite: 'core_operations', count: 2 },
  ])
  assert.deepEqual(summary.byTenant, [
    { tenantId: 'tenant-a', count: 2 },
    { tenantId: 'tenant-b', count: 2 },
  ])
  // Events with no tenantId are excluded from byTenant but still counted in totalEvents.
  assert.equal(summary.byTenant.reduce((sum, entry) => sum + entry.count, 0), 4)
})

test('summarizeTelemetryEvents handles an empty event list without dividing by zero', () => {
  const summary = summarizeTelemetryEvents([])
  assert.equal(summary.totalEvents, 0)
  assert.equal(summary.errorRate, 0)
  assert.deepEqual(summary.recent, [])
})

