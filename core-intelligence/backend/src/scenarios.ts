/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { Request } from 'express'
import { prisma } from './auth.js'
import { opsRequest } from './core-operations-client.js'

// A Scenario is a founder-authored "what if" comparison. The baseline is always the real
// current Core.Operations numbers at creation time; the projection applies the founder's
// stated assumption to that same real baseline. Nothing is fabricated — only the assumption
// (e.g. "+15% order volume") is hypothetical, and that is labelled as such in `assumptions`.
type OwnerOperationsSlice = {
  orders: Array<{ totalPence: number }>
  invoices: Array<{ totalPence: number; status: string; paidAt: string | null }>
  inventory: Array<{ pricePence: number; stock: number }>
}

type ScenarioAssumptions = {
  revenueChangePct?: number
  orderVolumeChangePct?: number
  expenseChangePct?: number
}

function computeBaseline(data: OwnerOperationsSlice) {
  const revenuePence = (data.orders || []).reduce((sum, order) => sum + order.totalPence, 0)
  const outstandingReceivablesPence = (data.invoices || [])
    .filter((invoice) => invoice.status !== 'paid' && !invoice.paidAt)
    .reduce((sum, invoice) => sum + invoice.totalPence, 0)
  const inventoryValuePence = (data.inventory || []).reduce((sum, item) => sum + item.pricePence * item.stock, 0)
  return { revenuePence, outstandingReceivablesPence, inventoryValuePence, orderCount: (data.orders || []).length }
}

export async function createScenario(req: Request, tenantId: string, actorId: string, name: string, assumptions: ScenarioAssumptions) {
  const data = await opsRequest<OwnerOperationsSlice>(req, '/owner/operations')
  const baseline = computeBaseline(data)
  const revenueFactor = 1 + (assumptions.revenueChangePct || 0) / 100
  const volumeFactor = 1 + (assumptions.orderVolumeChangePct || 0) / 100
  const expenseFactor = 1 + (assumptions.expenseChangePct || 0) / 100
  const projected = {
    revenuePence: Math.round(baseline.revenuePence * revenueFactor),
    orderCount: Math.round(baseline.orderCount * volumeFactor),
    outstandingReceivablesPence: Math.round(baseline.outstandingReceivablesPence * expenseFactor),
    inventoryValuePence: baseline.inventoryValuePence,
  }
  const deltaPence = projected.revenuePence - baseline.revenuePence
  const deltaSummary = `${deltaPence >= 0 ? '+' : ''}£${(deltaPence / 100).toFixed(2)} projected revenue impact against the real current baseline of £${(baseline.revenuePence / 100).toFixed(2)}`
  return prisma.intelligenceScenario.create({
    data: {
      tenantId,
      name,
      assumptions: JSON.parse(JSON.stringify(assumptions ?? {})),
      baselineMetrics: baseline,
      projectedMetrics: projected,
      deltaSummary,
      createdBy: actorId,
    },
  })
}

export const listScenarios = (tenantId: string) => prisma.intelligenceScenario.findMany({
  where: { tenantId },
  orderBy: { createdAt: 'desc' },
  take: 50,
})
