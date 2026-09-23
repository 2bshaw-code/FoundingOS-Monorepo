/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Optional per-module KPI strip for the generic workspace/module screen.
// Sales Pipeline (app/(app)/crm.tsx) has its own bespoke KPI row because it
// uses a dedicated backend model; every other module reads generic
// WorkspaceRecord data, so instead of writing N bespoke screens we register
// one small, cheap-to-compute KPI calculator per high-value module here. Any
// workspace/module without an entry just renders the plain record list.
import { WorkspaceRecordDTO } from './core-operations-api'

export type KpiTone = 'good' | 'watch' | 'risk' | 'info'
export type Kpi = { label: string; value: string; tone: KpiTone }

type KpiCalculator = (records: WorkspaceRecordDTO[]) => Kpi[]

function money(pence: number): string {
  return `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

function sumValue(records: WorkspaceRecordDTO[]): number {
  return records.reduce((sum, record) => sum + (record.valuePence ?? 0), 0)
}

function countByStatus(records: WorkspaceRecordDTO[], status: string): number {
  return records.filter((record) => record.status === status).length
}

const registry: Record<string, KpiCalculator> = {
  'retail/products': (records) => {
    const withPhoto = records.filter((record) => Array.isArray(record.data?.images) && (record.data!.images as unknown[]).length > 0).length
    return [
      { label: 'Total products', value: String(records.length), tone: 'info' },
      { label: 'With photo', value: String(withPhoto), tone: withPhoto === records.length && records.length > 0 ? 'good' : 'watch' },
      { label: 'Catalogue value', value: money(sumValue(records)), tone: 'info' },
    ]
  },
  'retail/inventory': (records) => {
    const low = countByStatus(records, 'Low stock')
    return [
      { label: 'Low stock', value: String(low), tone: low > 0 ? 'risk' : 'good' },
      { label: 'Reserved', value: String(countByStatus(records, 'Reserved')), tone: 'watch' },
      { label: 'Total SKUs', value: String(records.length), tone: 'info' },
    ]
  },
  'retail/orders': (records) => {
    const open = records.filter((record) => record.status !== 'Delivered').length
    return [
      { label: 'Open orders', value: String(open), tone: open > 0 ? 'watch' : 'good' },
      { label: 'Order value', value: money(sumValue(records)), tone: 'info' },
      { label: 'Delivered', value: String(countByStatus(records, 'Delivered')), tone: 'good' },
    ]
  },
  'retail/point-of-sale': (records) => {
    const paid = records.filter((record) => record.status === 'Paid' || record.status === 'Closed')
    return [
      { label: 'Open baskets', value: String(countByStatus(records, 'Open basket')), tone: 'watch' },
      { label: 'Takings today', value: money(sumValue(paid)), tone: 'good' },
      { label: 'Transactions', value: String(records.length), tone: 'info' },
    ]
  },
  'retail/purchasing': (records) => {
    const awaiting = records.filter((record) => record.status === 'Draft' || record.status === 'Approved').length
    return [
      { label: 'Awaiting order', value: String(awaiting), tone: awaiting > 0 ? 'watch' : 'good' },
      { label: 'Committed spend', value: money(sumValue(records)), tone: 'info' },
      { label: 'Received', value: String(countByStatus(records, 'Received')), tone: 'good' },
    ]
  },
  'retail/fulfilment': (records) => {
    const queued = countByStatus(records, 'Queued')
    return [
      { label: 'Queued', value: String(queued), tone: queued > 0 ? 'watch' : 'good' },
      { label: 'Dispatched', value: String(countByStatus(records, 'Dispatched')), tone: 'good' },
      { label: 'Total orders', value: String(records.length), tone: 'info' },
    ]
  },
  'finance/invoices': (records) => {
    const overdue = countByStatus(records, 'Overdue')
    const outstanding = sumValue(records.filter((record) => record.status !== 'Paid'))
    return [
      { label: 'Overdue', value: String(overdue), tone: overdue > 0 ? 'risk' : 'good' },
      { label: 'Outstanding', value: money(outstanding), tone: 'watch' },
      { label: 'Paid', value: money(sumValue(records.filter((record) => record.status === 'Paid'))), tone: 'good' },
    ]
  },
  'finance/bills': (records) => {
    const scheduled = countByStatus(records, 'Scheduled')
    return [
      { label: 'Scheduled', value: String(scheduled), tone: 'watch' },
      { label: 'Owed', value: money(sumValue(records.filter((record) => record.status !== 'Paid'))), tone: 'info' },
      { label: 'Paid', value: money(sumValue(records.filter((record) => record.status === 'Paid'))), tone: 'good' },
    ]
  },
  'finance/expenses': (records) => {
    const review = countByStatus(records, 'Review')
    return [
      { label: 'In review', value: String(review), tone: review > 0 ? 'watch' : 'good' },
      { label: 'Reimbursed', value: money(sumValue(records.filter((record) => record.status === 'Reimbursed'))), tone: 'good' },
      { label: 'Total claims', value: String(records.length), tone: 'info' },
    ]
  },
  'marketing/campaigns': (records) => {
    const live = countByStatus(records, 'Live')
    return [
      { label: 'Live now', value: String(live), tone: 'good' },
      { label: 'Scheduled', value: String(countByStatus(records, 'Scheduled')), tone: 'info' },
      { label: 'Total campaigns', value: String(records.length), tone: 'info' },
    ]
  },
  'marketing/leads': (records) => {
    const qualified = countByStatus(records, 'Qualified')
    return [
      { label: 'Qualified', value: String(qualified), tone: 'good' },
      { label: 'Converted', value: String(countByStatus(records, 'Converted')), tone: 'good' },
      { label: 'Total leads', value: String(records.length), tone: 'info' },
    ]
  },
  'talent/candidates': (records) => {
    const interviewing = countByStatus(records, 'Interview')
    return [
      { label: 'Interviewing', value: String(interviewing), tone: 'watch' },
      { label: 'Offers out', value: String(countByStatus(records, 'Offer')), tone: 'good' },
      { label: 'Total candidates', value: String(records.length), tone: 'info' },
    ]
  },
  'talent/time-off': (records) => {
    const pending = countByStatus(records, 'Requested') + countByStatus(records, 'Review')
    return [
      { label: 'Needs approval', value: String(pending), tone: pending > 0 ? 'watch' : 'good' },
      { label: 'Approved', value: String(countByStatus(records, 'Approved')), tone: 'good' },
      { label: 'Total requests', value: String(records.length), tone: 'info' },
    ]
  },
  'logistics/deliveries': (records) => {
    const outForDelivery = countByStatus(records, 'Out for delivery')
    return [
      { label: 'Out for delivery', value: String(outForDelivery), tone: 'watch' },
      { label: 'Delivered', value: String(countByStatus(records, 'Delivered')), tone: 'good' },
      { label: 'Total deliveries', value: String(records.length), tone: 'info' },
    ]
  },
  'logistics/exceptions': (records) => {
    const open = countByStatus(records, 'Open')
    return [
      { label: 'Open exceptions', value: String(open), tone: open > 0 ? 'risk' : 'good' },
      { label: 'Resolved', value: String(countByStatus(records, 'Resolved')), tone: 'good' },
      { label: 'Total exceptions', value: String(records.length), tone: 'info' },
    ]
  },
}

export function getModuleKpis(workspaceSlug: string, moduleId: string, records: WorkspaceRecordDTO[]): Kpi[] | null {
  const calculator = registry[`${workspaceSlug}/${moduleId}`]
  return calculator ? calculator(records) : null
}
