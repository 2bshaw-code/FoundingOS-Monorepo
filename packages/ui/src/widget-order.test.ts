import assert from 'node:assert/strict'
import { test } from 'node:test'
import { applyWidgetOrder, moveWidget, widgetOrderKey } from './widget-order'

test('applies a saved order, drops unknown ids and appends new cards', () => {
  assert.deepEqual(applyWidgetOrder(['a', 'b', 'c'], ['c', 'x', 'a', 'c']), ['c', 'a', 'b'])
  assert.deepEqual(applyWidgetOrder(['a', 'b'], 'broken'), ['a', 'b'])
})

test('moves a card one place and ignores moves past the ends', () => {
  assert.deepEqual(moveWidget(['a', 'b', 'c'], 'b', -1), ['b', 'a', 'c'])
  assert.deepEqual(moveWidget(['a', 'b', 'c'], 'c', 1), ['a', 'b', 'c'])
  assert.deepEqual(moveWidget(['a', 'b'], 'z', 1), ['a', 'b'])
})

test('builds storage-safe per-user keys', () => {
  assert.equal(widgetOrderKey('retail', 'Bob@Shop.com'), 'foundingos-layout-retail-bob_shop.com')
  assert.match(widgetOrderKey('home', null), /^[A-Za-z0-9._-]+$/)
})
