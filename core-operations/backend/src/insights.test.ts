import assert from 'node:assert/strict'
import test from 'node:test'
import type { Prisma } from './generated/prisma/index.js'
import { generateInsightsForEvent, type FeedEvent } from './insights.js'

const event = (type: string, payload: Record<string, unknown> = {}): FeedEvent => ({
  id: `event-${type}`,
  tenantId: 'tenant-1',
  type,
  source: 'messaging_core',
  payload: payload as Prisma.JsonObject,
  createdAt: new Date('2026-09-17T20:00:00Z'),
})

test('turns messaging failures into visible operational risks', () => {
  const actionFailure = generateInsightsForEvent(event('messaging.intent_failed', { intent: 'create_order' }))
  const deliveryFailure = generateInsightsForEvent(event('messaging.delivery_failed', { intent: 'create_order' }))
  assert.equal(actionFailure[0]?.type, 'risk')
  assert.equal(deliveryFailure[0]?.type, 'risk')
  assert.match(String((deliveryFailure[0]?.payload as Record<string, unknown>).detail), /web workspace/)
})

test('turns completed WhatsApp actions into workspace follow-up', () => {
  const order = generateInsightsForEvent(event('messaging.intent_create_order'))
  const delivery = generateInsightsForEvent(event('messaging.intent_mark_delivered'))
  assert.equal(order[0]?.type, 'prediction')
  assert.equal(delivery[0]?.type, 'suggestion')
})

test('flags unknown requests as product-learning opportunities', () => {
  const insights = generateInsightsForEvent(event('messaging.message_received', { intent: 'unknown' }))
  assert.equal(insights[0]?.type, 'suggestion')
  assert.match(String((insights[0]?.payload as Record<string, unknown>).title), /Unrecognized/)
})
