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

const METRIC_LABELS = [
  { label: 'Pipeline', change: 'Open leads' },
  { label: 'Customers', change: 'On your books' },
  { label: 'Open orders', change: 'Awaiting fulfilment' },
  { label: 'Messages', change: 'Recent conversations' },
]

// Shown while the figures are still loading, or when they could not be read. Anything is better
// than quietly falling back to the sample business's numbers, which look entirely real.
export const pendingWorkspaceMetrics = () => METRIC_LABELS.map((metric) => ({ ...metric, value: '—' }))

// A brand-new business genuinely has zeros here, and showing them honestly is the point.
export function liveWorkspaceMetrics(metrics: OwnerMetrics | null | undefined) {
  if (!metrics) return pendingWorkspaceMetrics()
  const leads = metrics.leads ?? 0
  return [
    { label: 'Pipeline', value: gbp(metrics.pipelineValuePence ?? 0), change: `${leads} open ${leads === 1 ? 'lead' : 'leads'}` },
    { label: 'Customers', value: String(metrics.customers ?? 0), change: 'On your books' },
    { label: 'Open orders', value: String(metrics.openOrders ?? 0), change: 'Awaiting fulfilment' },
    { label: 'Messages', value: String(metrics.messages ?? 0), change: 'Recent conversations' },
  ]
}
