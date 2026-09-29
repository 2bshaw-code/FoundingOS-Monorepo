/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// What a live workspace overview shows: the owner's own greeting and their real trading
// figures. The sample business ("Good morning, Bobby", £18.6k revenue) belongs to the demo
// only — a real account must never be shown another business's numbers.

export type OwnerMetrics = { leads?: number; customers?: number; openOrders?: number; messages?: number; pipelineValuePence?: number }

export function greetingFor(now: Date, ownerName?: string | null) {
  const hour = now.getHours()
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const first = (ownerName || '').trim().split(/\s+/)[0] || ''
  return first ? `${part}, ${first}` : part
}

const gbp = (pence: number) => `£${(Math.max(0, pence) / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`

// A brand-new business genuinely has zeros here, and showing them honestly is the point.
export function liveWorkspaceMetrics(metrics: OwnerMetrics | null | undefined) {
  if (!metrics) return null
  const leads = metrics.leads ?? 0
  return [
    { label: 'Pipeline', value: gbp(metrics.pipelineValuePence ?? 0), change: `${leads} open ${leads === 1 ? 'lead' : 'leads'}` },
    { label: 'Customers', value: String(metrics.customers ?? 0), change: 'On your books' },
    { label: 'Open orders', value: String(metrics.openOrders ?? 0), change: 'Awaiting fulfilment' },
    { label: 'Messages', value: String(metrics.messages ?? 0), change: 'Recent conversations' },
  ]
}
