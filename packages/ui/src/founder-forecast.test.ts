import assert from 'node:assert/strict'
import { test } from 'node:test'
import { forecastPnl, type PnlRow } from './founder-forecast'

const row = (month: string, subscriptions: number, costs: number): PnlRow => ({ month, subscriptions, otherIncome: 0, revenue: subscriptions, costs, net: subscriptions - costs })

test('projects 24 months split into two years from the recent trend', () => {
  const history = [row('2026-07', 100, 50), row('2026-08', 110, 50), row('2026-09', 121, 50)]
  const forecast = forecastPnl(history, 1000)
  assert.equal(forecast.rows.length, 24)
  assert.equal(forecast.rows[0].month, '2026-10')
  assert.equal(forecast.rows[23].month, '2028-09')
  assert.equal(forecast.revenueGrowthPct, 10)
  assert.equal(forecast.costGrowthPct, 0)
  assert.deepEqual(forecast.years.map((year) => year.label), ['Year 1', 'Year 2'])
  assert.ok(forecast.years[1].revenue > forecast.years[0].revenue)
  assert.equal(forecast.years[1].closingCash, forecast.rows[23].cash)
})

test('caps growth and stays flat without enough history', () => {
  assert.equal(forecastPnl([row('2026-08', 10, 5), row('2026-09', 100, 5)], null).revenueGrowthPct, 10)
  const flat = forecastPnl([row('2026-09', 50, 20)], null)
  assert.equal(flat.revenueGrowthPct, 0)
  assert.equal(flat.rows[11].revenue, 50)
  assert.equal(flat.years[0].closingCash, null)
})
