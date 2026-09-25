/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Per-module identity for the shared records screen: what a record is called,
// what its fields mean, one line on what the module is for, and the handful of
// numbers that matter for that module. Modules without a profile keep the
// generic layout. Keys are `${workspace}/${moduleId}`, falling back to `${moduleId}`.

export type ModuleKpiTone = 'good' | 'watch' | 'risk' | 'info'
export type ModuleKpi = { label: string; value: string; tone: ModuleKpiTone }
export type ProfileRecord = { status: string; value: string; owner: string; dueDate?: string; quantity?: number; reorderPoint?: number }

export type ModuleProfile = {
  noun: string
  copy: string
  fields: { name: string; secondary: string; value: string; owner: string }
  valueHint: string
  kpis: (records: ProfileRecord[], statuses: string[]) => ModuleKpi[]
}

const amount = (value: string) => Number(value.replace(/[^0-9.]/g, '')) || 0
const gbp = (value: number) => value >= 1_000_000 ? `£${(value / 1_000_000).toFixed(1)}m` : value >= 10_000 ? `£${(value / 1000).toFixed(1)}k` : `£${Math.round(value).toLocaleString('en-GB')}`
const sum = (records: ProfileRecord[]) => records.reduce((total, record) => total + amount(record.value), 0)
const inStatus = (records: ProfileRecord[], ...statuses: string[]) => records.filter((record) => statuses.includes(record.status))
const notIn = (records: ProfileRecord[], ...statuses: string[]) => records.filter((record) => !statuses.includes(record.status))
const pct = (part: number, whole: number) => `${whole ? Math.round((part / whole) * 100) : 0}%`
const overdue = (records: ProfileRecord[]) => {
  const today = new Date().toISOString().slice(0, 10)
  return records.filter((record) => record.dueDate && record.dueDate < today).length
}
const owners = (records: ProfileRecord[]) => new Set(records.map((record) => record.owner).filter(Boolean)).size
const count = (value: number, riskWhenAbove = Number.POSITIVE_INFINITY, watchWhenAbove = Number.POSITIVE_INFINITY): ModuleKpiTone =>
  value > riskWhenAbove ? 'risk' : value > watchWhenAbove ? 'watch' : 'good'
const last = (statuses: string[]) => statuses.at(-1) ?? ''
const first = (statuses: string[]) => statuses[0] ?? ''

const profiles: Record<string, ModuleProfile> = {
  // Core.Operations: sales and customers
  'retail/sales-pipeline': {
    noun: 'deal', copy: 'Track every deal from first conversation to won, and see what is likely to close this month.',
    fields: { name: 'Deal', secondary: 'Company', value: 'Deal value', owner: 'Salesperson' }, valueHint: '£0',
    kpis: (records, statuses) => {
      const won = inStatus(records, last(statuses))
      const open = notIn(records, last(statuses))
      return [
        { label: 'Open pipeline', value: gbp(sum(open)), tone: 'info' },
        { label: 'Won', value: gbp(sum(won)), tone: 'good' },
        { label: 'Win rate', value: pct(won.length, records.length), tone: won.length / Math.max(records.length, 1) >= 0.25 ? 'good' : 'watch' },
        { label: 'Average deal', value: gbp(sum(records) / Math.max(records.length, 1)), tone: 'info' },
      ]
    },
  },
  'retail/orders': {
    noun: 'order', copy: 'Every order from every channel, from placed to picked, packed and delivered.',
    fields: { name: 'Order', secondary: 'Customer', value: 'Order total', owner: 'Handled by' }, valueHint: '£0',
    kpis: (records, statuses) => {
      const open = notIn(records, last(statuses))
      return [
        { label: 'Orders to fulfil', value: String(open.length), tone: count(open.length, 20, 5) },
        { label: 'Order revenue', value: gbp(sum(records)), tone: 'good' },
        { label: 'Average order', value: gbp(sum(records) / Math.max(records.length, 1)), tone: 'info' },
        { label: 'Delivered', value: pct(inStatus(records, last(statuses)).length, records.length), tone: 'good' },
      ]
    },
  },
  'retail/point-of-sale': {
    noun: 'sale', copy: 'Ring up in-store and on-the-go sales, take payment, and close the till.',
    fields: { name: 'Sale', secondary: 'Items', value: 'Total', owner: 'Cashier' }, valueHint: '£0',
    kpis: (records) => {
      const paid = inStatus(records, 'Paid', 'Closed')
      const due = inStatus(records, 'Open basket', 'Payment due')
      return [
        { label: 'Takings', value: gbp(sum(paid)), tone: 'good' },
        { label: 'Transactions', value: String(paid.length), tone: 'info' },
        { label: 'Average basket', value: gbp(sum(paid) / Math.max(paid.length, 1)), tone: 'info' },
        { label: 'Awaiting payment', value: String(due.length), tone: count(due.length, 5, 0) },
      ]
    },
  },
  'retail/crm': {
    noun: 'customer', copy: 'Know every customer: what they bought, when you last spoke, and who needs attention.',
    fields: { name: 'Customer', secondary: 'Contact details', value: 'Lifetime value', owner: 'Account owner' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Customers', value: String(records.length), tone: 'info' },
      { label: 'VIP customers', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
      { label: 'New this period', value: String(inStatus(records, first(statuses)).length), tone: 'info' },
      { label: 'Lifetime value', value: gbp(sum(records)), tone: 'good' },
    ],
  },
  'retail/segments': {
    noun: 'segment', copy: 'Group customers by behaviour so campaigns and offers reach the right people.',
    fields: { name: 'Segment', secondary: 'Rule', value: 'Customers', owner: 'Owner' }, valueHint: 'e.g. 250',
    kpis: (records) => [
      { label: 'Segments', value: String(records.length), tone: 'info' },
      { label: 'Customers covered', value: String(records.reduce((t, r) => t + amount(r.value), 0)), tone: 'info' },
      { label: 'Owners', value: String(owners(records)), tone: 'info' },
    ],
  },
  'retail/loyalty': {
    noun: 'member', copy: 'Reward repeat customers and see who is close to their next reward.',
    fields: { name: 'Member', secondary: 'Tier', value: 'Points', owner: 'Owner' }, valueHint: 'e.g. 1200',
    kpis: (records) => [
      { label: 'Members', value: String(records.length), tone: 'info' },
      { label: 'Points issued', value: String(records.reduce((t, r) => t + amount(r.value), 0)), tone: 'good' },
      { label: 'Average points', value: String(Math.round(records.reduce((t, r) => t + amount(r.value), 0) / Math.max(records.length, 1))), tone: 'info' },
    ],
  },
  'retail/service': {
    noun: 'ticket', copy: 'Every customer issue in one queue, with who owns it and how long it has waited.',
    fields: { name: 'Issue', secondary: 'Customer', value: 'Priority', owner: 'Assigned to' }, valueHint: 'High, Medium or Low',
    kpis: (records, statuses) => {
      const open = notIn(records, last(statuses))
      return [
        { label: 'Open tickets', value: String(open.length), tone: count(open.length, 15, 5) },
        { label: 'Unassigned', value: String(inStatus(records, first(statuses)).length), tone: count(inStatus(records, first(statuses)).length, 3, 0) },
        { label: 'Resolved', value: pct(inStatus(records, last(statuses)).length, records.length), tone: 'good' },
        { label: 'Overdue', value: String(overdue(open)), tone: count(overdue(open), 2, 0) },
      ]
    },
  },
  // Core.Operations: commerce
  'retail/products': {
    noun: 'product', copy: 'Your catalogue: prices, photos and what is selling.',
    fields: { name: 'Product', secondary: 'Category', value: 'Price', owner: 'Buyer' }, valueHint: '£0',
    kpis: (records) => [
      { label: 'Products', value: String(records.length), tone: 'info' },
      { label: 'Average price', value: gbp(sum(records) / Math.max(records.length, 1)), tone: 'info' },
      { label: 'Catalogue value', value: gbp(sum(records)), tone: 'info' },
    ],
  },
  'retail/inventory': {
    noun: 'stock item', copy: 'Stock on hand across locations, what is running low, and what to reorder.',
    fields: { name: 'Item', secondary: 'Location', value: 'Stock value', owner: 'Stock owner' }, valueHint: '£0',
    kpis: (records) => {
      const low = records.filter((record) => record.status === 'Low stock' || (record.quantity !== undefined && record.reorderPoint !== undefined && record.quantity <= record.reorderPoint)).length
      return [
        { label: 'Low stock', value: String(low), tone: count(low, 5, 0) },
        { label: 'Reserved', value: String(inStatus(records, 'Reserved').length), tone: 'watch' },
        { label: 'Stock value', value: gbp(sum(records)), tone: 'info' },
        { label: 'Items tracked', value: String(records.length), tone: 'info' },
      ]
    },
  },
  'retail/promotions': {
    noun: 'promotion', copy: 'Discounts and offers, when they run, and what they earned.',
    fields: { name: 'Promotion', secondary: 'Offer', value: 'Revenue', owner: 'Owner' }, valueHint: '£0',
    kpis: (records) => [
      { label: 'Live now', value: String(inStatus(records, 'Live').length), tone: 'good' },
      { label: 'Scheduled', value: String(inStatus(records, 'Scheduled').length), tone: 'info' },
      { label: 'Promotion revenue', value: gbp(sum(records)), tone: 'good' },
    ],
  },
  'retail/channels': {
    noun: 'channel', copy: 'Where you sell: shop, WhatsApp, marketplaces and social, side by side.',
    fields: { name: 'Channel', secondary: 'Type', value: 'Revenue', owner: 'Owner' }, valueHint: '£0',
    kpis: (records) => [
      { label: 'Channels', value: String(records.length), tone: 'info' },
      { label: 'Channel revenue', value: gbp(sum(records)), tone: 'good' },
    ],
  },
  'retail/production-orders': {
    noun: 'production order', copy: 'What you are making, where it is on the line, and what passed quality checks.',
    fields: { name: 'Production order', secondary: 'Product', value: 'Cost', owner: 'Supervisor' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'In production', value: String(inStatus(records, 'In production').length), tone: 'info' },
      { label: 'At quality check', value: String(inStatus(records, 'Quality check').length), tone: 'watch' },
      { label: 'Completed', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
      { label: 'Late', value: String(overdue(notIn(records, last(statuses)))), tone: count(overdue(notIn(records, last(statuses))), 2, 0) },
    ],
  },
  'retail/boms': {
    noun: 'bill of materials', copy: 'The parts and quantities that go into each product you make.',
    fields: { name: 'Product', secondary: 'Components', value: 'Unit cost', owner: 'Owner' }, valueHint: '£0',
    kpis: (records) => [
      { label: 'Bills of materials', value: String(records.length), tone: 'info' },
      { label: 'Average unit cost', value: gbp(sum(records) / Math.max(records.length, 1)), tone: 'info' },
    ],
  },
  'retail/purchasing': {
    noun: 'purchase order', copy: 'Buy stock from suppliers, approve spend, and track deliveries in.',
    fields: { name: 'Purchase order', secondary: 'Supplier', value: 'Order total', owner: 'Buyer' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Awaiting approval', value: String(inStatus(records, first(statuses)).length), tone: count(inStatus(records, first(statuses)).length, 5, 0) },
      { label: 'On order', value: gbp(sum(inStatus(records, 'Approved', 'Ordered'))), tone: 'info' },
      { label: 'Received', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
      { label: 'Late deliveries', value: String(overdue(notIn(records, last(statuses)))), tone: count(overdue(notIn(records, last(statuses))), 2, 0) },
    ],
  },
  'retail/suppliers': {
    noun: 'supplier', copy: 'Who you buy from, what you spend with them, and how reliable they are.',
    fields: { name: 'Supplier', secondary: 'Supplies', value: 'Annual spend', owner: 'Relationship owner' }, valueHint: '£0',
    kpis: (records) => [
      { label: 'Suppliers', value: String(records.length), tone: 'info' },
      { label: 'Total spend', value: gbp(sum(records)), tone: 'info' },
      { label: 'Largest supplier', value: gbp(Math.max(0, ...records.map((r) => amount(r.value)))), tone: 'info' },
    ],
  },
  'retail/fulfilment': {
    noun: 'shipment', copy: 'Pick, pack and dispatch: what is waiting, what is packed, and what has gone out.',
    fields: { name: 'Shipment', secondary: 'Destination', value: 'Order value', owner: 'Packer' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Waiting to pick', value: String(inStatus(records, first(statuses)).length), tone: count(inStatus(records, first(statuses)).length, 15, 5) },
      { label: 'Packed', value: String(inStatus(records, 'Packed').length), tone: 'info' },
      { label: 'Dispatched', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
      { label: 'Late', value: String(overdue(notIn(records, last(statuses)))), tone: count(overdue(notIn(records, last(statuses))), 2, 0) },
    ],
  },
  'retail/returns': {
    noun: 'return', copy: 'Returns and refunds, from request to money back.',
    fields: { name: 'Return', secondary: 'Reason', value: 'Refund amount', owner: 'Handled by' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Open returns', value: String(notIn(records, last(statuses)).length), tone: count(notIn(records, last(statuses)).length, 10, 3) },
      { label: 'Refunded', value: gbp(sum(inStatus(records, last(statuses)))), tone: 'watch' },
      { label: 'Awaiting approval', value: String(inStatus(records, first(statuses)).length), tone: 'info' },
    ],
  },
  payments: {
    noun: 'payment', copy: 'Money in and out, from pending to reconciled with the bank.',
    fields: { name: 'Payment', secondary: 'Payer or payee', value: 'Amount', owner: 'Approver' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Pending', value: gbp(sum(inStatus(records, first(statuses)))), tone: 'watch' },
      { label: 'Paid', value: gbp(sum(inStatus(records, 'Paid', last(statuses)))), tone: 'good' },
      { label: 'Reconciled', value: pct(inStatus(records, last(statuses)).length, records.length), tone: 'good' },
    ],
  },
  // Marketing (Core.Operations)
  campaigns: {
    noun: 'campaign', copy: 'Plan, launch and measure campaigns across WhatsApp, email and social.',
    fields: { name: 'Campaign', secondary: 'Channel', value: 'Budget', owner: 'Owner' }, valueHint: '£0',
    kpis: (records) => [
      { label: 'Live campaigns', value: String(inStatus(records, 'Live').length), tone: 'good' },
      { label: 'Scheduled', value: String(inStatus(records, 'Scheduled').length), tone: 'info' },
      { label: 'Budget committed', value: gbp(sum(notIn(records, 'Draft'))), tone: 'info' },
      { label: 'Drafts', value: String(inStatus(records, 'Draft').length), tone: 'watch' },
    ],
  },
  content: {
    noun: 'content piece', copy: 'Brief FoundAI on what you are promoting and it drafts the copy, ready for approval.',
    fields: { name: 'Headline', secondary: 'Format', value: 'Call to action', owner: 'Author' }, valueHint: 'e.g. Shop now',
    kpis: (records, statuses) => [
      { label: 'Ideas', value: String(inStatus(records, first(statuses)).length), tone: 'info' },
      { label: 'Awaiting approval', value: String(inStatus(records, 'Draft').length), tone: 'watch' },
      { label: 'Published', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
    ],
  },
  'marketing/audiences': {
    noun: 'audience', copy: 'The groups you market to, built from your own first-party customer data.',
    fields: { name: 'Audience', secondary: 'Definition', value: 'Size', owner: 'Owner' }, valueHint: 'e.g. 1500',
    kpis: (records) => [
      { label: 'Audiences', value: String(records.length), tone: 'info' },
      { label: 'Total reach', value: String(records.reduce((t, r) => t + amount(r.value), 0)), tone: 'good' },
    ],
  },
  'marketing/segments': {
    noun: 'segment', copy: 'Rules that sort customers automatically, so every message lands with the right people.',
    fields: { name: 'Segment', secondary: 'Rule', value: 'Customers', owner: 'Owner' }, valueHint: 'e.g. 250',
    kpis: (records) => [
      { label: 'Segments', value: String(records.length), tone: 'info' },
      { label: 'Customers covered', value: String(records.reduce((t, r) => t + amount(r.value), 0)), tone: 'info' },
    ],
  },
  'marketing/leads': {
    noun: 'lead', copy: 'Every enquiry from every channel, nurtured until it is ready for sales.',
    fields: { name: 'Lead', secondary: 'Source', value: 'Potential value', owner: 'Owner' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'New leads', value: String(inStatus(records, first(statuses)).length), tone: 'info' },
      { label: 'Qualified', value: String(inStatus(records, 'Qualified').length), tone: 'good' },
      { label: 'Conversion rate', value: pct(inStatus(records, last(statuses)).length, records.length), tone: 'good' },
      { label: 'Pipeline value', value: gbp(sum(notIn(records, last(statuses)))), tone: 'info' },
    ],
  },
  'marketing/channels': {
    noun: 'channel', copy: 'Connected publishing channels and how each one performs.',
    fields: { name: 'Channel', secondary: 'Account', value: 'Reach', owner: 'Owner' }, valueHint: 'e.g. 5000',
    kpis: (records) => [
      { label: 'Channels', value: String(records.length), tone: 'info' },
      { label: 'Total reach', value: String(records.reduce((t, r) => t + amount(r.value), 0)), tone: 'good' },
    ],
  },
  'marketing/journeys': {
    noun: 'journey', copy: 'Automated message sequences that move customers from first touch to repeat purchase.',
    fields: { name: 'Journey', secondary: 'Trigger', value: 'Customers enrolled', owner: 'Owner' }, valueHint: 'e.g. 300',
    kpis: (records) => [
      { label: 'Active journeys', value: String(inStatus(records, 'Active').length), tone: 'good' },
      { label: 'Paused', value: String(inStatus(records, 'Paused').length), tone: 'watch' },
      { label: 'Customers enrolled', value: String(records.reduce((t, r) => t + amount(r.value), 0)), tone: 'info' },
    ],
  },
  'marketing/brand-studio': {
    noun: 'brand asset', copy: 'Logos, colours, fonts and templates that keep every document and message on-brand.',
    fields: { name: 'Asset', secondary: 'Type', value: 'Usage', owner: 'Owner' }, valueHint: 'e.g. Invoices',
    kpis: (records) => [{ label: 'Brand assets', value: String(records.length), tone: 'info' }],
  },
  // Commerce Pro (finance)
  'finance/invoices': {
    noun: 'invoice', copy: 'Bill customers, chase what is overdue, and see cash coming in.',
    fields: { name: 'Invoice', secondary: 'Customer', value: 'Amount', owner: 'Issued by' }, valueHint: '£0',
    kpis: (records) => [
      { label: 'Outstanding', value: gbp(sum(inStatus(records, 'Sent', 'Overdue'))), tone: 'watch' },
      { label: 'Overdue', value: gbp(sum(inStatus(records, 'Overdue'))), tone: inStatus(records, 'Overdue').length ? 'risk' : 'good' },
      { label: 'Paid', value: gbp(sum(inStatus(records, 'Paid'))), tone: 'good' },
      { label: 'Drafts', value: String(inStatus(records, 'Draft').length), tone: 'info' },
    ],
  },
  'finance/bills': {
    noun: 'bill', copy: 'Supplier bills, approved and scheduled so nothing is paid late or twice.',
    fields: { name: 'Bill', secondary: 'Supplier', value: 'Amount', owner: 'Approver' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'To approve', value: gbp(sum(inStatus(records, first(statuses)))), tone: 'watch' },
      { label: 'Scheduled', value: gbp(sum(inStatus(records, 'Scheduled'))), tone: 'info' },
      { label: 'Paid', value: gbp(sum(inStatus(records, last(statuses)))), tone: 'good' },
      { label: 'Due date passed', value: String(overdue(notIn(records, last(statuses)))), tone: count(overdue(notIn(records, last(statuses))), 1, 0) },
    ],
  },
  'finance/banking': {
    noun: 'account', copy: 'Bank and mobile money balances in one view.',
    fields: { name: 'Account', secondary: 'Provider', value: 'Balance', owner: 'Owner' }, valueHint: '£0',
    kpis: (records) => [
      { label: 'Accounts', value: String(records.length), tone: 'info' },
      { label: 'Total balance', value: gbp(sum(records)), tone: 'good' },
    ],
  },
  'finance/reconciliation': {
    noun: 'transaction', copy: 'Match bank lines to invoices and bills, so your books are always right.',
    fields: { name: 'Transaction', secondary: 'Bank line', value: 'Amount', owner: 'Reviewer' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Unmatched', value: String(inStatus(records, first(statuses)).length), tone: count(inStatus(records, first(statuses)).length, 10, 0) },
      { label: 'Suggested matches', value: String(inStatus(records, 'Suggested').length), tone: 'info' },
      { label: 'Reconciled', value: pct(inStatus(records, 'Matched', last(statuses)).length, records.length), tone: 'good' },
    ],
  },
  'finance/expenses': {
    noun: 'expense', copy: 'Team spending, receipts and reimbursements, approved in one place.',
    fields: { name: 'Expense', secondary: 'Category', value: 'Amount', owner: 'Submitted by' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Awaiting review', value: gbp(sum(inStatus(records, first(statuses), 'Review'))), tone: 'watch' },
      { label: 'Approved', value: gbp(sum(inStatus(records, 'Approved'))), tone: 'info' },
      { label: 'Reimbursed', value: gbp(sum(inStatus(records, last(statuses)))), tone: 'good' },
    ],
  },
  'finance/budgets': {
    noun: 'budget', copy: 'Budgets by team and project, and how much of each has been spent.',
    fields: { name: 'Budget', secondary: 'Team or project', value: 'Budget amount', owner: 'Budget holder' }, valueHint: '£0',
    kpis: (records) => [
      { label: 'Budgets', value: String(records.length), tone: 'info' },
      { label: 'Total budgeted', value: gbp(sum(records)), tone: 'info' },
    ],
  },
  'finance/tax': {
    noun: 'tax return', copy: 'VAT and tax filings, deadlines and what is owed.',
    fields: { name: 'Filing', secondary: 'Period', value: 'Amount owed', owner: 'Preparer' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Filings open', value: String(notIn(records, last(statuses)).length), tone: 'watch' },
      { label: 'Tax owed', value: gbp(sum(notIn(records, last(statuses)))), tone: 'watch' },
      { label: 'Past deadline', value: String(overdue(notIn(records, last(statuses)))), tone: count(overdue(notIn(records, last(statuses))), 0, 0) },
    ],
  },
  'finance/approvals': {
    noun: 'approval', copy: 'Spend and payment approvals, with who needs to sign off next.',
    fields: { name: 'Request', secondary: 'Requested by', value: 'Amount', owner: 'Approver' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Waiting on you', value: String(inStatus(records, first(statuses), 'Review').length), tone: count(inStatus(records, first(statuses), 'Review').length, 5, 0) },
      { label: 'Value waiting', value: gbp(sum(inStatus(records, first(statuses), 'Review'))), tone: 'watch' },
      { label: 'Approved', value: String(inStatus(records, 'Approved', last(statuses)).length), tone: 'good' },
    ],
  },
  // Core.Workforce
  'talent/candidates': {
    noun: 'candidate', copy: 'Everyone applying to work with you, from application to offer.',
    fields: { name: 'Candidate', secondary: 'Role applied for', value: 'Expected salary', owner: 'Recruiter' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'In pipeline', value: String(records.length), tone: 'info' },
      { label: 'Interviewing', value: String(inStatus(records, 'Interview').length), tone: 'info' },
      { label: 'At offer', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
      { label: 'Need screening', value: String(inStatus(records, first(statuses)).length), tone: count(inStatus(records, first(statuses)).length, 10, 3) },
    ],
  },
  'talent/jobs': {
    noun: 'job', copy: 'Open roles, who is hiring for them, and how close each is to being filled.',
    fields: { name: 'Job title', secondary: 'Team and location', value: 'Salary', owner: 'Hiring manager' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Open roles', value: String(inStatus(records, 'Open', 'Interviewing').length), tone: 'info' },
      { label: 'Filled', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
      { label: 'Hiring budget', value: gbp(sum(notIn(records, last(statuses)))), tone: 'info' },
    ],
  },
  'talent/interviews': {
    noun: 'interview', copy: 'Every interview on the calendar, with feedback and decisions.',
    fields: { name: 'Candidate', secondary: 'Role', value: 'Score', owner: 'Interviewer' }, valueHint: 'e.g. 4/5',
    kpis: (records, statuses) => [
      { label: 'Upcoming', value: String(inStatus(records, first(statuses), 'Confirmed').length), tone: 'info' },
      { label: 'Awaiting decision', value: String(inStatus(records, 'Complete').length), tone: 'watch' },
      { label: 'Decided', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
    ],
  },
  'talent/offers': {
    noun: 'offer', copy: 'Job offers sent, accepted, and handed over to onboarding.',
    fields: { name: 'Candidate', secondary: 'Role', value: 'Salary offered', owner: 'Hiring manager' }, valueHint: '£0',
    kpis: (records) => [
      { label: 'Offers out', value: String(inStatus(records, 'Sent').length), tone: 'watch' },
      { label: 'Accepted', value: String(inStatus(records, 'Accepted', 'Onboarding').length), tone: 'good' },
      { label: 'Acceptance rate', value: pct(inStatus(records, 'Accepted', 'Onboarding').length, notIn(records, 'Draft').length), tone: 'good' },
    ],
  },
  'talent/onboarding': {
    noun: 'new starter', copy: 'Get new starters set up: documents, equipment, training and first-week plans.',
    fields: { name: 'New starter', secondary: 'Role', value: 'Start date', owner: 'Buddy' }, valueHint: 'e.g. 1 Oct',
    kpis: (records, statuses) => [
      { label: 'Starting soon', value: String(inStatus(records, first(statuses)).length), tone: 'info' },
      { label: 'In progress', value: String(notIn(records, first(statuses), last(statuses)).length), tone: 'watch' },
      { label: 'Fully onboarded', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
      { label: 'Overdue tasks', value: String(overdue(notIn(records, last(statuses)))), tone: count(overdue(notIn(records, last(statuses))), 2, 0) },
    ],
  },
  'talent/people': {
    noun: 'person', copy: 'Everyone in your team, their role, and who they report to.',
    fields: { name: 'Name', secondary: 'Role', value: 'Salary', owner: 'Manager' }, valueHint: '£0',
    kpis: (records) => [
      { label: 'Headcount', value: String(records.length), tone: 'info' },
      { label: 'Managers', value: String(owners(records)), tone: 'info' },
      { label: 'Annual payroll', value: gbp(sum(records)), tone: 'info' },
    ],
  },
  'talent/performance': {
    noun: 'review', copy: 'Reviews, goals and feedback, so everyone knows how they are doing.',
    fields: { name: 'Person', secondary: 'Review cycle', value: 'Rating', owner: 'Reviewer' }, valueHint: 'e.g. 4/5',
    kpis: (records, statuses) => [
      { label: 'Reviews due', value: String(notIn(records, last(statuses)).length), tone: 'watch' },
      { label: 'Completed', value: pct(inStatus(records, last(statuses)).length, records.length), tone: 'good' },
      { label: 'Overdue', value: String(overdue(notIn(records, last(statuses)))), tone: count(overdue(notIn(records, last(statuses))), 2, 0) },
    ],
  },
  'talent/time-off': {
    noun: 'time-off request', copy: 'Holiday and leave requests, approvals, and who is off when.',
    fields: { name: 'Person', secondary: 'Dates', value: 'Days', owner: 'Approver' }, valueHint: 'e.g. 3',
    kpis: (records, statuses) => [
      { label: 'To approve', value: String(inStatus(records, first(statuses), 'Review').length), tone: count(inStatus(records, first(statuses), 'Review').length, 5, 0) },
      { label: 'Approved', value: String(inStatus(records, 'Approved').length), tone: 'good' },
      { label: 'Days booked', value: String(records.reduce((t, r) => t + amount(r.value), 0)), tone: 'info' },
    ],
  },
  'talent/learning': {
    noun: 'course', copy: 'Training and certifications, and who has completed what.',
    fields: { name: 'Course', secondary: 'Assigned to', value: 'Hours', owner: 'Owner' }, valueHint: 'e.g. 4',
    kpis: (records, statuses) => [
      { label: 'In progress', value: String(notIn(records, first(statuses), last(statuses)).length), tone: 'info' },
      { label: 'Completed', value: pct(inStatus(records, last(statuses)).length, records.length), tone: 'good' },
      { label: 'Training hours', value: String(records.reduce((t, r) => t + amount(r.value), 0)), tone: 'info' },
    ],
  },
  'talent/payroll': {
    noun: 'pay run', copy: 'Prepare, review and approve pay runs before money goes out.',
    fields: { name: 'Pay run', secondary: 'Period', value: 'Gross pay', owner: 'Approver' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Awaiting approval', value: gbp(sum(inStatus(records, first(statuses), 'Review'))), tone: 'watch' },
      { label: 'Approved', value: gbp(sum(inStatus(records, 'Approved'))), tone: 'info' },
      { label: 'Paid', value: gbp(sum(inStatus(records, last(statuses)))), tone: 'good' },
    ],
  },
  'talent/engagement': {
    noun: 'survey', copy: 'Pulse surveys and feedback that show how the team is feeling.',
    fields: { name: 'Survey', secondary: 'Audience', value: 'Score', owner: 'Owner' }, valueHint: 'e.g. 78',
    kpis: (records) => [
      { label: 'Surveys', value: String(records.length), tone: 'info' },
      { label: 'Average score', value: String(Math.round(records.reduce((t, r) => t + amount(r.value), 0) / Math.max(records.length, 1))), tone: 'info' },
    ],
  },
  // Core.Intelligence
  'intelligence/signals': {
    noun: 'signal', copy: 'Early warnings and opportunities spotted across sales, stock, cash and people.',
    fields: { name: 'Signal', secondary: 'Source', value: 'Impact', owner: 'Reviewer' }, valueHint: '£0 or High',
    kpis: (records, statuses) => [
      { label: 'New signals', value: String(inStatus(records, first(statuses)).length), tone: count(inStatus(records, first(statuses)).length, 10, 0) },
      { label: 'Awaiting review', value: String(inStatus(records, 'Enriched').length), tone: 'watch' },
      { label: 'Resolved', value: pct(inStatus(records, last(statuses)).length, records.length), tone: 'good' },
      { label: 'Impact tracked', value: gbp(sum(records)), tone: 'info' },
    ],
  },
  'intelligence/risks': {
    noun: 'risk', copy: 'Business risks ranked by exposure, with owners and mitigation plans.',
    fields: { name: 'Risk', secondary: 'Area', value: 'Exposure', owner: 'Risk owner' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Open risks', value: String(notIn(records, last(statuses)).length), tone: count(notIn(records, last(statuses)).length, 5, 0) },
      { label: 'Exposure', value: gbp(sum(notIn(records, last(statuses)))), tone: 'risk' },
      { label: 'Being mitigated', value: String(inStatus(records, 'Mitigating').length), tone: 'watch' },
      { label: 'Resolved', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
    ],
  },
  'intelligence/recommendations': {
    noun: 'recommendation', copy: 'Suggested actions from FoundAI, with the value each one is expected to deliver.',
    fields: { name: 'Recommendation', secondary: 'Reason', value: 'Expected value', owner: 'Decision owner' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Waiting for decision', value: String(inStatus(records, first(statuses), 'Review').length), tone: 'watch' },
      { label: 'Value on the table', value: gbp(sum(inStatus(records, first(statuses), 'Review'))), tone: 'info' },
      { label: 'Executed', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
      { label: 'Value delivered', value: gbp(sum(inStatus(records, last(statuses)))), tone: 'good' },
    ],
  },
  'intelligence/forecasts': {
    noun: 'forecast', copy: 'Forward-looking forecasts for revenue, demand, cash and hiring.',
    fields: { name: 'Forecast', secondary: 'Horizon', value: 'Forecast value', owner: 'Owner' }, valueHint: '£0',
    kpis: (records) => [
      { label: 'Forecasts', value: String(records.length), tone: 'info' },
      { label: 'Total forecast', value: gbp(sum(records)), tone: 'info' },
    ],
  },
  'intelligence/scenarios': {
    noun: 'scenario', copy: 'What-if plans: see the effect of price, hiring or stock changes before you commit.',
    fields: { name: 'Scenario', secondary: 'Assumption', value: 'Projected impact', owner: 'Owner' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Scenarios', value: String(records.length), tone: 'info' },
      { label: 'Under review', value: String(inStatus(records, 'Review').length), tone: 'watch' },
      { label: 'Adopted', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
    ],
  },
  'intelligence/anomalies': {
    noun: 'anomaly', copy: 'Unusual changes in sales, stock, payments or activity, flagged as they happen.',
    fields: { name: 'Anomaly', secondary: 'Where it happened', value: 'Impact', owner: 'Investigator' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'New', value: String(inStatus(records, first(statuses)).length), tone: count(inStatus(records, first(statuses)).length, 3, 0) },
      { label: 'Investigating', value: String(inStatus(records, 'Investigating').length), tone: 'watch' },
      { label: 'Resolved', value: pct(inStatus(records, last(statuses)).length, records.length), tone: 'good' },
    ],
  },
  'intelligence/workflows': {
    noun: 'AI workflow', copy: 'Automated, approval-gated actions that FoundAI can run on your behalf.',
    fields: { name: 'Workflow', secondary: 'Trigger', value: 'Value delivered', owner: 'Owner' }, valueHint: '£0',
    kpis: (records, statuses) => [
      { label: 'Workflows', value: String(records.length), tone: 'info' },
      { label: 'Live', value: String(inStatus(records, last(statuses)).length), tone: 'good' },
      { label: 'Value delivered', value: gbp(sum(records)), tone: 'good' },
    ],
  },
  'intelligence/models': {
    noun: 'model', copy: 'The forecasting and scoring models behind every insight, with their accuracy.',
    fields: { name: 'Model', secondary: 'Purpose', value: 'Accuracy', owner: 'Owner' }, valueHint: 'e.g. 92%',
    kpis: (records) => [{ label: 'Models', value: String(records.length), tone: 'info' }],
  },
  'intelligence/data-sources': {
    noun: 'data source', copy: 'Everything feeding FoundingOS intelligence, and how fresh each source is.',
    fields: { name: 'Source', secondary: 'Type', value: 'Records', owner: 'Owner' }, valueHint: 'e.g. 12000',
    kpis: (records) => [
      { label: 'Sources connected', value: String(records.length), tone: 'info' },
      { label: 'Records ingested', value: String(records.reduce((t, r) => t + amount(r.value), 0)), tone: 'info' },
    ],
  },
}

profiles['retail/campaigns'] = profiles.campaigns
profiles['retail/content'] = profiles.content

export function getModuleProfile(workspace: string, moduleId: string): ModuleProfile | undefined {
  return profiles[`${workspace}/${moduleId}`] ?? profiles[moduleId]
}

