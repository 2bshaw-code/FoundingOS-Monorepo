import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SCENARIOS, whatsappScenario } from './whatsapp-scenario'

test('base scenario reaches its month-24 target from sourced UK figures', () => {
  const result = whatsappScenario(SCENARIOS.base.inputs)
  assert.equal(result.whatsappBusinesses, 1_692_000)
  assert.equal(result.accountsAt24, 4_230)
  assert.equal(result.months.length, 24)
  const last = result.months[23]
  assert.equal(last.paying, 1_058)
  assert.equal(last.mrrGbp, 1_058 * 45)
  assert.equal(result.illustrativeValuationGbp, 1_058 * 45 * 12 * 6)
  assert.deepEqual(result.milestones.map((row) => row.label), ['Month 6', 'Month 12', 'Month 18', 'Month 24'])
})

test('scenarios are ordered and bad inputs are clamped', () => {
  const [low, mid, high, top] = (['conservative', 'base', 'ambitious', 'breakout'] as const).map((name) => whatsappScenario(SCENARIOS[name].inputs).illustrativeValuationGbp)
  assert.ok(low < mid && mid < high && high < top)
  const clamped = whatsappScenario({ ...SCENARIOS.base.inputs, reachPct: -5, arpuGbp: Number.NaN })
  assert.equal(clamped.accountsAt24, 0)
  assert.equal(clamped.illustrativeValuationGbp, 0)
})
