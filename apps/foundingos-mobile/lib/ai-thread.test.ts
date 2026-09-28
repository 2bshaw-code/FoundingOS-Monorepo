import assert from 'node:assert/strict'
import test from 'node:test'
import { packThread, threadStorageKey, unpackThread } from './ai-thread'

const answer = (text: string, extra: Record<string, unknown> = {}) => ({
  answer: text,
  suggestedActions: [],
  citations: [],
  model: 'claude',
  ...extra,
})

const turn = (id: string, question: string, text: string | null, extra?: Record<string, unknown>) => ({
  id,
  question,
  answer: text === null ? null : (answer(text, extra) as any),
})

test('keeps a saved conversation inside the SecureStore value limit', () => {
  const long = 'x'.repeat(4000)
  const thread = Array.from({ length: 20 }, (_, i) => turn(`t${i}`, `question ${i}`, long))
  const packed = packThread(thread)
  assert.ok(new TextEncoder().encode(packed).length <= 2048, 'packed thread must fit SecureStore')
  assert.ok(unpackThread(packed).length >= 1, 'at least the newest turn survives')
})

test('drops the oldest turns rather than the newest', () => {
  const long = 'y'.repeat(600)
  const thread = Array.from({ length: 10 }, (_, i) => turn(`t${i}`, `q${i}`, long))
  const restored = unpackThread(packThread(thread))
  assert.equal(restored.at(-1)?.question, 'q9')
  assert.ok(!restored.some((item) => item.question === 'q0'))
})

test('restores a short conversation in order and intact', () => {
  const thread = [turn('a', 'Who owes me money?', 'Two invoices are overdue.'), turn('b', 'Which one is biggest?', 'Kemi Stores, £400.')]
  const restored = unpackThread(packThread(thread))
  assert.deepEqual(restored.map((item) => item.question), ['Who owes me money?', 'Which one is biggest?'])
  assert.equal(restored[1].answer?.answer, 'Kemi Stores, £400.')
})

test('never stores an unanswered or failed turn', () => {
  const thread = [turn('a', 'done', 'An answer.'), turn('b', 'in flight', null), { ...turn('c', 'failed', null), error: 'timeout' }]
  const restored = unpackThread(packThread(thread))
  assert.deepEqual(restored.map((item) => item.question), ['done'])
})

test('marks a truncated answer so it does not read as a cut-off sentence', () => {
  const restored = unpackThread(packThread([turn('a', 'q', 'z'.repeat(900))]))
  assert.ok(restored[0].answer?.answer.endsWith('…'))
})

test('keeps web sources but caps how many are stored', () => {
  const sources = Array.from({ length: 9 }, (_, i) => ({ title: `Source ${i}`, url: `https://example.com/${i}` }))
  const restored = unpackThread(packThread([turn('a', 'market?', 'Prices are rising.', { webSources: sources })]))
  assert.equal(restored[0].answer?.webSources?.length, 4)
})

test('survives corrupt or empty stored values', () => {
  assert.deepEqual(unpackThread(null), [])
  assert.deepEqual(unpackThread('not json'), [])
  assert.deepEqual(unpackThread('{"not":"an array"}'), [])
  assert.deepEqual(unpackThread('[{"question":"no answer"}]'), [])
})

test('gives each workspace its own conversation under a valid key', () => {
  assert.notEqual(threadStorageKey('finance'), threadStorageKey('sales'))
  assert.equal(threadStorageKey(), threadStorageKey(undefined))
  assert.match(threadStorageKey('core/ops space'), /^[A-Za-z0-9.\-_]+$/)
})
