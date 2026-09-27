/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type PnlRow = { month: string; subscriptions: number; otherIncome: number; revenue: number; costs: number; net: number }
export type ForecastRow = { month: string; revenue: number; costs: number; net: number; cash: number | null }
export type ForecastYear = { label: string; revenue: number; costs: number; net: number; closingMrr: number; closingCash: number | null }
export type Forecast = { rows: ForecastRow[]; years: ForecastYear[]; revenueGrowthPct: number; costGrowthPct: number }

const MAX_REVENUE_GROWTH = 0.1
const MAX_COST_GROWTH = 0.05
const round = (value: number) => Math.round(value * 100) / 100

// Compound monthly growth across the most recent months that have a value, capped so a single
// good month cannot produce an unrealistic projection.
function monthlyGrowth(values: number[], cap: number) {
  const recent = values.filter((value) => value > 0).slice(-6)
  if (recent.length < 2) return 0
  const rate = Math.pow(recent[recent.length - 1] / recent[0], 1 / (recent.length - 1)) - 1
  return Math.min(cap, Math.max(0, rate))
}

const nextMonth = (month: string, offset: number) => {
  const date = new Date(`${month}-01T00:00:00Z`)
  date.setUTCMonth(date.getUTCMonth() + offset)
  return date.toISOString().slice(0, 7)
}

// Projects recurring revenue and costs forward from the last full P&L month. One-off income is
// left out, so the projection only extends what already repeats.
export function forecastPnl(history: PnlRow[], cashGbp: number | null, months = 24): Forecast {
  const last = history[history.length - 1]
  if (!last) return { rows: [], years: [], revenueGrowthPct: 0, costGrowthPct: 0 }
  const revenueGrowth = monthlyGrowth(history.map((row) => row.subscriptions), MAX_REVENUE_GROWTH)
  const costGrowth = monthlyGrowth(history.map((row) => row.costs), MAX_COST_GROWTH)
  let cash = cashGbp
  const rows: ForecastRow[] = Array.from({ length: months }, (_, index) => {
    const revenue = round(last.subscriptions * Math.pow(1 + revenueGrowth, index + 1))
    const costs = round(last.costs * Math.pow(1 + costGrowth, index + 1))
    const net = round(revenue - costs)
    cash = cash === null ? null : round(cash + net)
    return { month: nextMonth(last.month, index + 1), revenue, costs, net, cash }
  })
  const years: ForecastYear[] = []
  for (let start = 0; start < rows.length; start += 12) {
    const slice = rows.slice(start, start + 12)
    const end = slice[slice.length - 1]
    years.push({
      label: `Year ${start / 12 + 1}`,
      revenue: round(slice.reduce((sum, row) => sum + row.revenue, 0)),
      costs: round(slice.reduce((sum, row) => sum + row.costs, 0)),
      net: round(slice.reduce((sum, row) => sum + row.net, 0)),
      closingMrr: end.revenue,
      closingCash: end.cash,
    })
  }
  return { rows, years, revenueGrowthPct: round(revenueGrowth * 100), costGrowthPct: round(costGrowth * 100) }
}
