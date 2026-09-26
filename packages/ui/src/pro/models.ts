/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Platform-neutral professional models: shared by the web workspaces, SuperDash and the mobile app.
import { BusinessDocument, DocumentKind, DocumentProfile, documentTotals, readDocument } from './documents'
import { addDays, daysBetween, poundsInput, inPeriod, isoDate, numberAt, objectAt, penceFrom, Period, ProRecord, ratio, textAt, todayIso, money } from './shared'

export * from './documents'
export * from './shared'

export const dealStages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']
export const stageProbability: Record<string, number> = { Lead: 10, Qualified: 25, Proposal: 50, Negotiation: 75, Won: 100, Lost: 0 }
export const dealSources = ['Inbound', 'Referral', 'Outbound', 'Website', 'Social', 'Event', 'Partner', 'Existing customer', 'Other']

export type Deal = {
  company: string
  contact: string
  email: string
  phone: string
  amountPence: number
  probability: number
  expectedClose: string
  source: string
  nextStep: string
  nextStepDate: string
  lostReason: string
  closedAt: string
}

export function readDeal(record: ProRecord): Deal {
  const deal = objectAt(record.data?.deal)
  const amount = numberAt(deal.amountPence, penceFrom(record.value))
  return {
    company: textAt(deal.company) || record.secondary,
    contact: textAt(deal.contact),
    email: textAt(deal.email) || record.email || '',
    phone: textAt(deal.phone) || record.phone || '',
    amountPence: Math.round(amount),
    probability: numberAt(deal.probability, stageProbability[record.status] ?? 10),
    expectedClose: isoDate(deal.expectedClose) || isoDate(record.dueDate),
    source: textAt(deal.source),
    nextStep: textAt(deal.nextStep),
    nextStepDate: isoDate(deal.nextStepDate),
    lostReason: textAt(deal.lostReason),
    closedAt: isoDate(deal.closedAt),
  }
}

export const isOpenDeal = (status: string) => status !== 'Won' && status !== 'Lost'


export const campaignObjectives = ['Awareness', 'Traffic', 'Engagement', 'Leads', 'Sales', 'App installs', 'Retention']
export const campaignChannels = ['Email', 'Meta ads', 'Google ads', 'Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'X', 'SEO', 'WhatsApp', 'SMS', 'Print', 'Events', 'Influencer']

export type Campaign = {
  objective: string
  channels: string[]
  startDate: string
  endDate: string
  budgetPence: number
  spendPence: number
  impressions: number
  clicks: number
  leads: number
  conversions: number
  revenuePence: number
  landingUrl: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  audience: string
}

export function readCampaign(record: ProRecord): Campaign {
  const campaign = objectAt(record.data?.campaign)
  const channel = textAt(record.data?.channel)
  return {
    objective: textAt(campaign.objective),
    channels: Array.isArray(campaign.channels) ? campaign.channels.filter((item): item is string => typeof item === 'string') : channel ? [channel] : [],
    startDate: isoDate(campaign.startDate),
    endDate: isoDate(campaign.endDate) || isoDate(record.dueDate),
    budgetPence: Math.round(numberAt(campaign.budgetPence, penceFrom(record.value))),
    spendPence: Math.round(numberAt(campaign.spendPence)),
    impressions: numberAt(campaign.impressions),
    clicks: numberAt(campaign.clicks),
    leads: numberAt(campaign.leads),
    conversions: numberAt(campaign.conversions),
    revenuePence: Math.round(numberAt(campaign.revenuePence)),
    landingUrl: textAt(campaign.landingUrl),
    utmSource: textAt(campaign.utmSource),
    utmMedium: textAt(campaign.utmMedium),
    utmCampaign: textAt(campaign.utmCampaign) || record.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    audience: textAt(campaign.audience),
  }
}

export function campaignMetrics(campaign: Campaign) {
  const { spendPence: spend, impressions, clicks, leads, conversions, revenuePence: revenue, budgetPence: budget } = campaign
  return {
    ctr: ratio(clicks, impressions, 2),
    cpc: clicks ? money(Math.round(spend / clicks)) : '—',
    cpm: impressions ? money(Math.round((spend / impressions) * 1000)) : '—',
    cpl: leads ? money(Math.round(spend / leads)) : '—',
    conversionRate: ratio(conversions, clicks || leads, 2),
    cpa: conversions ? money(Math.round(spend / conversions)) : '—',
    roas: spend ? `${(revenue / spend).toFixed(2)}×` : '—',
    roi: spend ? ratio(revenue - spend, spend, 0) : '—',
    budgetUsed: ratio(spend, budget, 0),
    budgetUsedPct: budget ? Math.min(100, (spend / budget) * 100) : 0,
  }
}

// Built without URL.searchParams so it behaves the same on web and React Native.
export function utmUrl(campaign: Campaign) {
  const raw = campaign.landingUrl.trim()
  if (!raw || /\s/.test(raw)) return ''
  const base = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  const [withoutHash, hash = ''] = base.split('#')
  const [path, query = ''] = withoutHash.split('?')
  const params = query.split('&').filter((pair) => pair && !/^utm_(source|medium|campaign)=/i.test(pair))
  const add = (key: string, value: string) => { if (value) params.push(`${key}=${encodeURIComponent(value)}`) }
  add('utm_source', campaign.utmSource)
  add('utm_medium', campaign.utmMedium)
  add('utm_campaign', campaign.utmCampaign)
  return `${path}${params.length ? `?${params.join('&')}` : ''}${hash ? `#${hash}` : ''}`
}

export type Bucket = { current: number; d30: number; d60: number; d90: number; over: number }
export const emptyBucket = (): Bucket => ({ current: 0, d30: 0, d60: 0, d90: 0, over: 0 })
export const bucketFor = (days: number): keyof Bucket => (days <= 0 ? 'current' : days <= 30 ? 'd30' : days <= 60 ? 'd60' : days <= 90 ? 'd90' : 'over')


export function agedBalances(records: ProRecord[], kind: 'invoice' | 'bill') {
  const today = todayIso()
  const map = new Map<string, Bucket>()
  for (const record of records) {
    const doc = readDocument(record, kind)
    const { balance } = documentTotals(doc)
    if (balance <= 0 || record.status === 'Paid' || record.status === 'Draft') continue
    const name = doc.party.name || 'Unknown'
    const bucket = map.get(name) ?? emptyBucket()
    bucket[bucketFor(daysBetween(doc.dueDate, today))] += balance
    map.set(name, bucket)
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
}


export const expenseDate = (record: ProRecord) => isoDate(record.data?.date) || isoDate(record.dueDate) || isoDate(record.data?.createdAt)
export const expenseVat = (record: ProRecord) => Math.round(numberAt(record.data?.vatPence))


export type Basis = 'accrual' | 'cash'

// P&L and MTD VAT boxes from invoices, bills and approved expenses for a period.
export function financeReport(invoices: ProRecord[], bills: ProRecord[], expenses: ProRecord[], period: Pick<Period, 'from' | 'to'>, basis: Basis) {
  const docs = (records: ProRecord[], kind: 'invoice' | 'bill') => records.filter((record) => record.status !== 'Draft').map((record) => ({ record, doc: readDocument(record, kind) }))
  const sales = docs(invoices, 'invoice')
  const purchases = docs(bills, 'bill')
  const sumDocs = (items: typeof sales) => items.reduce((acc, { doc }) => {
    const totals = documentTotals(doc)
    if (basis === 'accrual') {
      if (inPeriod(doc.issueDate, period)) { acc.net += totals.net; acc.vat += totals.vat; acc.count += 1 }
    } else {
      const paidInPeriod = doc.payments.filter((payment) => inPeriod(payment.date, period)).reduce((sum, payment) => sum + payment.amountPence, 0)
      if (paidInPeriod && totals.total) { const share = paidInPeriod / totals.total; acc.net += Math.round(totals.net * share); acc.vat += Math.round(totals.vat * share); acc.count += 1 }
    }
    return acc
  }, { net: 0, vat: 0, count: 0 })
  const income = sumDocs(sales)
  const cost = sumDocs(purchases)
  const periodExpenses = expenses.filter((record) => inPeriod(expenseDate(record), period))
  const expenseGross = periodExpenses.reduce((sum, record) => sum + penceFrom(record.value), 0)
  const expenseVatTotal = periodExpenses.reduce((sum, record) => sum + expenseVat(record), 0)
  const expenseNet = expenseGross - expenseVatTotal
  const box1 = income.vat
  const box4 = cost.vat + expenseVatTotal
  return {
    income, cost, expenseNet, expenseCount: periodExpenses.length,
    grossProfit: income.net - cost.net,
    netProfit: income.net - cost.net - expenseNet,
    vat: { box1, box2: 0, box3: box1, box4, box5: box1 - box4, box6: Math.round(income.net / 100), box7: Math.round((cost.net + expenseNet) / 100), box8: 0, box9: 0 },
  }
}

export const approvedExpenses = (records: ProRecord[]) => records.filter((record) => ['Approved', 'Reimbursed'].includes(record.status))

export function salesSummary(records: ProRecord[]) {
  const deals = records.map((record) => ({ record, deal: readDeal(record) }))
  const open = deals.filter(({ record }) => isOpenDeal(record.status))
  const won = deals.filter(({ record }) => record.status === 'Won')
  const lost = deals.filter(({ record }) => record.status === 'Lost')
  const today = todayIso()
  return {
    deals, open, won, lost,
    pipeline: open.reduce((sum, { deal }) => sum + deal.amountPence, 0),
    weighted: open.reduce((sum, { deal }) => sum + Math.round((deal.amountPence * deal.probability) / 100), 0),
    wonValue: won.reduce((sum, { deal }) => sum + deal.amountPence, 0),
    winRate: ratio(won.length, won.length + lost.length, 0),
    noNextStep: open.filter(({ deal }) => !deal.nextStep).length,
    overdueNextStep: open.filter(({ deal }) => deal.nextStepDate && deal.nextStepDate < today).length,
    pastClose: open.filter(({ deal }) => deal.expectedClose && deal.expectedClose < today).length,
  }
}

export function campaignSummary(records: ProRecord[]) {
  const campaigns = records.map((record) => ({ record, campaign: readCampaign(record) }))
  const sum = (key: 'budgetPence' | 'spendPence' | 'revenuePence' | 'leads' | 'conversions' | 'clicks' | 'impressions') => campaigns.reduce((total, { campaign }) => total + campaign[key], 0)
  const spend = sum('spendPence')
  const revenue = sum('revenuePence')
  const leads = sum('leads')
  return {
    campaigns, spend, revenue, leads, budget: sum('budgetPence'),
    roas: spend ? `${(revenue / spend).toFixed(2)}×` : '—',
    cpl: leads ? money(Math.round(spend / leads)) : '—',
    ctr: ratio(sum('clicks'), sum('impressions'), 2),
    overspent: campaigns.filter(({ campaign }) => campaign.budgetPence > 0 && campaign.spendPence > campaign.budgetPence).length,
  }
}

// Modules that hold invoices, bills and quotes, and where converted quotes land.
export const DOCUMENT_MODULES: Record<string, DocumentKind> = {
  'finance/invoices': 'invoice', 'finance/bills': 'bill', 'logistics/quotes': 'quote', 'logistics/billing': 'invoice', 'health/billing': 'invoice',
}
export const documentKindFor = (workspace: string, module: string): DocumentKind | undefined => DOCUMENT_MODULES[`${workspace}/${module}`]
export const invoiceTargetFor = (workspace: string): [string, string] => (workspace === 'logistics' ? ['logistics', 'billing'] : ['finance', 'invoices'])

export function documentPatch(kind: DocumentKind, next: BusinessDocument, fallbackName: string) {
  const totals = documentTotals(next)
  return {
    name: (kind === 'bill' ? next.party.name : next.number) || fallbackName,
    valuePence: kind === 'credit-note' ? -totals.total : totals.total,
    data: { document: next, secondary: kind === 'bill' ? `${next.lines[0]?.description || 'Bill'} · bill ${next.number}` : next.party.name, email: next.party.email || undefined, dueDate: next.dueDate } as Record<string, unknown>,
  }
}

export const dealPatch = (deal: Deal) => ({ valuePence: deal.amountPence, data: { deal, secondary: deal.company, email: deal.email || undefined, phone: deal.phone || undefined, dueDate: deal.expectedClose || undefined } as Record<string, unknown> })
export const campaignPatch = (campaign: Campaign) => ({ valuePence: campaign.budgetPence, data: { campaign, channel: campaign.channels[0], dueDate: campaign.endDate || undefined } as Record<string, unknown> })

export function invoiceFromQuote(quote: BusinessDocument, profile: DocumentProfile) {
  const issueDate = todayIso()
  const number = `INV-${Date.now().toString().slice(-6)}`
  const invoice: BusinessDocument = { ...quote, kind: 'invoice', number, issueDate, termsDays: profile.defaultTermsDays, dueDate: addDays(issueDate, profile.defaultTermsDays), payments: [], sentAt: undefined, notes: quote.notes || `From quote ${quote.number}` }
  return { reference: number, name: number, status: 'Draft', valuePence: documentTotals(invoice).total, data: { document: invoice, secondary: invoice.party.name, email: invoice.party.email || undefined, dueDate: invoice.dueDate, sourceQuote: quote.number } as Record<string, unknown> }
}

// Quote embedded on a deal, prefilled from the deal when none has been saved yet.
export const dealQuoteRecord = (record: ProRecord, deal: Deal): ProRecord => ({ ...record, secondary: deal.company, email: deal.email, value: poundsInput(deal.amountPence) })

// Maps a backend workspace record (web production client or mobile API) to a ProRecord.
export type BackendRecord = { id: string; reference: string; name: string; status: string; ownerId?: string | null; valuePence?: number | null; data?: Record<string, unknown> | null; version?: number }
export function proRecordFromBackend(record: BackendRecord): ProRecord {
  const data = (record.data || {}) as Record<string, unknown>
  const text = (value: unknown) => (typeof value === 'string' ? value : '')
  return {
    id: record.reference,
    backendId: record.id,
    version: record.version,
    name: record.name,
    secondary: text(data.secondary),
    value: record.valuePence === null || record.valuePence === undefined ? '' : String(record.valuePence / 100),
    status: record.status,
    owner: record.ownerId || text(data.owner),
    dueDate: text(data.dueDate) || undefined,
    email: text(data.email) || undefined,
    phone: text(data.phone) || undefined,
    data,
  }
}
