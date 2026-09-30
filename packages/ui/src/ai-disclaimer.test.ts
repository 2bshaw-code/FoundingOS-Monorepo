import assert from 'node:assert/strict'
import test from 'node:test'
import { AI_AUTOPILOT_DISCLAIMER, AI_DISCLAIMER, AI_DISCLAIMER_LONG } from './ai-disclaimer'

test('every AI warning says plainly that FoundAI can be wrong', () => {
  assert.match(AI_DISCLAIMER, /can make mistakes/)
  assert.match(AI_AUTOPILOT_DISCLAIMER, /can make mistakes/)
  assert.match(AI_DISCLAIMER_LONG, /can be wrong/)
  assert.match(AI_DISCLAIMER_LONG, /not financial, legal or tax advice/)
})

test('AI warnings use plain punctuation with no dashes', () => {
  for (const text of [AI_DISCLAIMER, AI_AUTOPILOT_DISCLAIMER, AI_DISCLAIMER_LONG]) assert.doesNotMatch(text, /[-–—]/)
})
