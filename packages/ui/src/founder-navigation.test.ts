import assert from 'node:assert/strict'
import test from 'node:test'
import { founderSections } from './founder-navigation'

test('shared founder navigation includes media and business legal, not client billing', () => {
  assert.deepEqual(founderSections.marketing[0], ['media', 'Media library'])
  assert.deepEqual(founderSections.legal[0], ['business', 'Business legal'])
  for (const key of ['subscriptions', 'privacy', 'markets', 'company']) assert.ok(founderSections.legal.some(([value]) => value === key))
  for (const key of ['legal/matters', 'legal/time-entries', 'legal/invoices', 'legal/overview']) assert.ok(!founderSections.legal.some(([value]) => value === key))
  for (const items of Object.values(founderSections)) assert.equal(new Set(items.map(([key]) => key)).size, items.length)
})
