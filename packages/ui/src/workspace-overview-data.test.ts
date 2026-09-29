import assert from 'node:assert/strict'
import test from 'node:test'
import { greetingFor, liveWorkspaceMetrics, pendingWorkspaceMetrics } from './workspace-overview-data'

const at = (hour: number) => new Date(2026, 8, 29, hour, 0, 0)

test('greets the real owner by their first name', () => {
  assert.equal(greetingFor(at(9), 'Darren Watts'), 'Good morning, Darren')
})

test('never greets an account with another person name', () => {
  assert.ok(!greetingFor(at(9), 'Darren Watts').includes('Bobby'))
  assert.ok(!greetingFor(at(9), null).includes('Bobby'))
})

test('falls back to a plain greeting when the owner name is unknown', () => {
  for (const value of [null, undefined, '', '   ']) {
    assert.equal(greetingFor(at(9), value as string | null), 'Good morning')
  }
})

test('matches the time of day', () => {
  assert.equal(greetingFor(at(11), 'Ada'), 'Good morning, Ada')
  assert.equal(greetingFor(at(12), 'Ada'), 'Good afternoon, Ada')
  assert.equal(greetingFor(at(17), 'Ada'), 'Good afternoon, Ada')
  assert.equal(greetingFor(at(18), 'Ada'), 'Good evening, Ada')
})

test('a brand new business sees honest zeros, not sample figures', () => {
  const metrics = liveWorkspaceMetrics({ leads: 0, customers: 0, openOrders: 0, messages: 0, pipelineValuePence: 0 })
  assert.deepEqual(metrics?.map((item) => item.value), ['£0', '0', '0', '0'])
  const rendered = JSON.stringify(metrics)
  for (const invented of ['18.6k', '42.8k', '1,284', '8.7%']) {
    assert.ok(!rendered.includes(invented), `must not show the sample figure ${invented}`)
  }
})

test('reports real trading figures in pounds', () => {
  const metrics = liveWorkspaceMetrics({ leads: 3, customers: 12, openOrders: 4, messages: 27, pipelineValuePence: 4280000 })
  assert.deepEqual(metrics?.map((item) => item.value), ['£42,800', '12', '4', '27'])
  assert.equal(metrics?.[0].change, '3 open leads')
})

test('counts a single lead in the singular', () => {
  assert.equal(liveWorkspaceMetrics({ leads: 1, pipelineValuePence: 100 })?.[0].change, '1 open lead')
})

test('treats missing figures as zero rather than blank', () => {
  assert.deepEqual(liveWorkspaceMetrics({})?.map((item) => item.value), ['£0', '0', '0', '0'])
})

test('shows placeholders, never sample figures, when live figures are unavailable', () => {
  for (const missing of [null, undefined]) {
    const metrics = liveWorkspaceMetrics(missing)
    assert.deepEqual(metrics.map((item) => item.value), ['\u2014', '\u2014', '\u2014', '\u2014'])
    assert.deepEqual(metrics.map((item) => item.label), ['Pipeline', 'Customers', 'Open orders', 'Messages'])
  }
})

test('placeholder figures never contain the sample business numbers', () => {
  const rendered = JSON.stringify(pendingWorkspaceMetrics())
  for (const sample of ['18.6k', '42.8k', '1,284']) assert.ok(!rendered.includes(sample))
})
