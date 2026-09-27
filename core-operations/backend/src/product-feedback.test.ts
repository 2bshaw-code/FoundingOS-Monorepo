import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeProductRating, summarizeProductRatings } from './product-feedback.js'

test('normalises a private product rating and rejects invalid scores', () => {
  assert.deepEqual(normalizeProductRating({ score: 4, comment: '  Great  ', surface: 'ios', page: '/app' }), { score: 4, surface: 'ios', comment: 'Great', page: '/app' })
  assert.equal(normalizeProductRating({ score: 5, surface: 'fax' }).surface, 'web')
  assert.equal(normalizeProductRating({ score: 3, comment: 'x'.repeat(2000) }).comment.length, 1000)
  for (const score of [0, 6, 2.5, 'bad', undefined]) assert.throws(() => normalizeProductRating({ score }), /1 to 5/)
})

test('summarises ratings for the founder without counting malformed rows', () => {
  const at = new Date('2026-01-01T00:00:00Z')
  const summary = summarizeProductRatings([
    { id: 'a', tenantId: 't1', metadata: { score: 5, comment: 'Love it' }, createdAt: at },
    { id: 'b', tenantId: 't2', metadata: { score: 2 }, createdAt: at },
    { id: 'c', tenantId: 't2', metadata: { score: 9 }, createdAt: at },
  ], new Map([['t1', 'Shop One']]))
  assert.equal(summary.count, 2)
  assert.equal(summary.average, 3.5)
  assert.equal(summary.recent[0].business, 'Shop One')
  assert.equal(summary.distribution.find((row) => row.score === 2)?.count, 1)
})
