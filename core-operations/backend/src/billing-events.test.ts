import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isStaleBillingEvent } from './billing-events.js'

test('ignores an older Stripe event after a newer billing change was applied', () => {
  assert.equal(isStaleBillingEvent(100, 200), true)
})

test('applies the same or newer Stripe event, and legacy events without timestamps', () => {
  assert.equal(isStaleBillingEvent(200, 200), false)
  assert.equal(isStaleBillingEvent(300, 200), false)
  assert.equal(isStaleBillingEvent(undefined, 200), false)
  assert.equal(isStaleBillingEvent(300, undefined), false)
})
