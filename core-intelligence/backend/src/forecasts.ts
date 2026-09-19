/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { Request } from 'express'
import { prisma } from './auth.js'
import { opsRequest } from './core-operations-client.js'

// Forecasts are computed from real, live Core.Operations data (orders, invoices, inventory) —
// never hand-authored. The `evidence` field always records the exact source numbers used, so a
// projection can be traced back to real underlying business activity.
type OwnerOperationsSlice = {
  orders: Array<{ totalPence: number; createdAt: string; status: string }>
  invoices: Array<{ totalPence: number; status: string; dueAt: string | null; paidAt: string | null }>
  inventory: Array<{ stock: number; lowStockLevel: number; name: string; sku: string }>
}

const daysBetween = (a: Date, b: Date) => Math.abs(a.getTime() - b.getTime()) / 86_400_000

function forecastRevenue(orders: OwnerOperationsSlice['orders']) {
  const now = new Date()
  const trailing7 = orders.filter((order) => daysBetween(now, new Date(order.createdAt)) <= 7)
  const trailing7Total = trailing7.reduce((sum, order) => sum + order.totalPence, 0)
  const dailyAverage = trailing7Total / 7
  return {
    metric: 'revenue_next_7d',
    horizonDays: 7,
    method: 'trailing_7d_daily_average',
    baselineValue: trailing7Total,
    projectedValue: Math.round(dailyAverage * 7),
    unit: 'pence',
    evidence: { trailing7OrderCount: trailing7.length, trailing7TotalPence: trailing7Total, dailyAveragePence: Math.round(dailyAverage) },
  }
}

function forecastReceivablesAtRisk(invoices: OwnerOperationsSlice['invoices']) {
  const now = new Date()
  const overdueOrDueSoon = invoices.filter((invoice) => {
    if (invoice.status === 'paid' || invoice.paidAt) return false
    if (!invoice.dueAt) return false
    const due = new Date(invoice.dueAt)
    return due < now || daysBetween(now, due) <= 7
  })
  const atRiskTotal = overdueOrDueSoon.reduce((sum, invoice) => sum + invoice.totalPence, 0)
  return {
    metric: 'receivables_at_risk_7d',
    horizonDays: 7,
    method: 'due_date_window',
    baselineValue: invoices.filter((i) => i.status !== 'paid' && !i.paidAt).reduce((sum, i) => sum + i.totalPence, 0),
    projectedValue: atRiskTotal,
    unit: 'pence',
    evidence: { invoicesOverdueOrDueSoon: overdueOrDueSoon.length },
  }
}

function forecastStockoutRisk(inventory: OwnerOperationsSlice['inventory']) {
  const atRisk = inventory.filter((item) => item.stock <= item.lowStockLevel)
  return {
    metric: 'stockout_risk_items',
    horizonDays: 7,
    method: 'low_stock_threshold',
    baselineValue: inventory.length,
    projectedValue: atRisk.length,
    unit: 'items',
    evidence: { skusAtRisk: atRisk.map((item) => ({ sku: item.sku, name: item.name, stock: item.stock, lowStockLevel: item.lowStockLevel })) },
  }
}

export async function computeAndStoreForecasts(req: Request, tenantId: string, actorId: string) {
  const data = await opsRequest<OwnerOperationsSlice>(req, '/owner/operations')
  const computed = [
    forecastRevenue(data.orders || []),
    forecastReceivablesAtRisk(data.invoices || []),
    forecastStockoutRisk(data.inventory || []),
  ]
  const stored = await Promise.all(computed.map((forecast) => prisma.intelligenceForecastSnapshot.create({
    data: { tenantId, generatedBy: actorId, ...forecast },
  })))
  return stored
}

export const listForecasts = (tenantId: string, metric?: string) => prisma.intelligenceForecastSnapshot.findMany({
  where: { tenantId, ...(metric ? { metric } : {}) },
  orderBy: { createdAt: 'desc' },
  take: 50,
})
