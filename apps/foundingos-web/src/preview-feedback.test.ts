import assert from 'node:assert/strict'
import test from 'node:test'
import { parsePreviewFeedback } from './preview-feedback.js'

const valid = {
  role: 'Potential buyer',
  teamSize: '11–50',
  workspaces: ['Retail', 'Finance'],
  valueScore: 5,
  easeScore: 4,
  purchaseIntent: 'Ready to discuss a pilot',
  mostValuable: 'One connected operating view',
  improvement: 'More import examples',
  followUp: true,
}

test('preview feedback accepts a complete actionable response', () => {
  assert.deepEqual(parsePreviewFeedback(valid), valid)
})

test('preview feedback rejects missing and manipulated answers', () => {
  assert.equal(parsePreviewFeedback({ ...valid, workspaces: [] }), null)
  assert.equal(parsePreviewFeedback({ ...valid, valueScore: 9 }), null)
  assert.equal(parsePreviewFeedback({ ...valid, role: 'Injected role' }), null)
})
