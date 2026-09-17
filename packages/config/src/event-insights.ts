/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type FeedEvent = {
  id: string
  type: string
  source: string
  payload: Record<string, unknown> | null
  createdAt: string
}

export type InsightItem = {
  title: string
  detail: string
  confidence: 'high' | 'medium' | 'low'
}

export type EventInsights = {
  predictions: InsightItem[]
  risks: InsightItem[]
  suggestions: InsightItem[]
  anomalies: InsightItem[]
}

function confidenceForRatio(ratio: number): InsightItem['confidence'] {
  if (ratio >= 0.8) return 'high'
  if (ratio >= 0.5) return 'medium'
  return 'low'
}

export function buildEventInsights(events: FeedEvent[]): EventInsights {
  const counts = new Map<string, number>()
  const sourceCounts = new Map<string, number>()

  for (const event of events) {
    counts.set(event.type, (counts.get(event.type) ?? 0) + 1)
    sourceCounts.set(event.source, (sourceCounts.get(event.source) ?? 0) + 1)
  }

  const getCount = (type: string) => counts.get(type) ?? 0
  const shipmentsCreated = getCount('shipment.created')
  const deliveriesCompleted = getCount('delivery.completed')
  const invoicesGenerated = getCount('invoice.generated')
  const paymentsReceived = getCount('payment.received')
  const lowInventory = getCount('inventory.low')
  const timesheetsApproved = getCount('timesheet.approved')
  const payrollRuns = getCount('payroll.run')
  const appointmentsCreated = getCount('appointment.created')
  const medicalBillingGenerated = getCount('medical.billing.generated')

  const predictions: InsightItem[] = []
  const risks: InsightItem[] = []
  const suggestions: InsightItem[] = []
  const anomalies: InsightItem[] = []

  if (shipmentsCreated > 0) {
    const completionRatio = deliveriesCompleted / shipmentsCreated
    predictions.push({
      title: 'Delivery completion projection',
      detail: `${deliveriesCompleted}/${shipmentsCreated} shipments completed in this window (${Math.round(completionRatio * 100)}%).`,
      confidence: confidenceForRatio(completionRatio),
    })
  }

  if (invoicesGenerated > 0) {
    const collectionRatio = paymentsReceived / invoicesGenerated
    predictions.push({
      title: 'Cash collection projection',
      detail: `${paymentsReceived}/${invoicesGenerated} invoices paid in the latest event window (${Math.round(collectionRatio * 100)}%).`,
      confidence: confidenceForRatio(collectionRatio),
    })
  }

  if (lowInventory > 0) {
    risks.push({
      title: 'Inventory risk detected',
      detail: `${lowInventory} inventory.low events were emitted; replenish at-risk SKUs to protect fulfilment SLAs.`,
      confidence: lowInventory > 3 ? 'high' : 'medium',
    })
  }

  if (invoicesGenerated > paymentsReceived) {
    risks.push({
      title: 'Receivables pressure',
      detail: `${invoicesGenerated - paymentsReceived} more invoices were generated than payments received in the same window.`,
      confidence: invoicesGenerated - paymentsReceived > 5 ? 'high' : 'medium',
    })
  }

  if (timesheetsApproved > payrollRuns) {
    suggestions.push({
      title: 'Trigger payroll run',
      detail: `${timesheetsApproved - payrollRuns} approved timesheets are waiting on payroll.run events.`,
      confidence: 'high',
    })
  }

  if (appointmentsCreated > medicalBillingGenerated) {
    suggestions.push({
      title: 'Close billing lag',
      detail: `${appointmentsCreated - medicalBillingGenerated} appointments have no matching medical.billing.generated event yet.`,
      confidence: 'medium',
    })
  }

  if (events.length >= 180) {
    anomalies.push({
      title: 'High event velocity',
      detail: `${events.length} events were captured in the latest sample window (near current cap of 200).`,
      confidence: 'medium',
    })
  }

  const lowCoverageSources = ['retail', 'logistics', 'finance', 'talent', 'health'].filter((source) => (sourceCounts.get(source) ?? 0) === 0)
  if (lowCoverageSources.length > 0) {
    anomalies.push({
      title: 'Source coverage gap',
      detail: `No recent events from: ${lowCoverageSources.join(', ')}.`,
      confidence: 'low',
    })
  }

  if (!predictions.length) {
    predictions.push({
      title: 'Awaiting predictive baseline',
      detail: 'More operational events are needed to generate a reliable short-term forecast.',
      confidence: 'low',
    })
  }
  if (!risks.length) {
    risks.push({
      title: 'No major risks detected',
      detail: 'Current event window does not show critical cross-suite risk spikes.',
      confidence: 'low',
    })
  }
  if (!suggestions.length) {
    suggestions.push({
      title: 'Workflows operating normally',
      detail: 'No immediate intervention is required from the current event sequence.',
      confidence: 'low',
    })
  }
  if (!anomalies.length) {
    anomalies.push({
      title: 'No anomalies flagged',
      detail: 'Event distribution is within expected operating range.',
      confidence: 'low',
    })
  }

  return { predictions, risks, suggestions, anomalies }
}
