'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useMemo, useRef, useState } from 'react'
import { documentTotals, readDocument } from './documents'
import { agedBalances, approvedExpenses, Bucket, campaignMetrics, dealStages, emptyBucket, expenseDate, expenseVat, financeReport, readCampaign, readDeal } from './models'
import { downloadCsv, inPeriod, lastMonths, LoadRecords, money, monthKey, monthLabel, penceFrom, ProRecord, ratio, reportingPeriods, shortMoney } from './shared'

function useSources(loadRecords: LoadRecords, sources: Array<[string, string]>) {
  const [data, setData] = useState<Record<string, ProRecord[]>>({})
  const [missing, setMissing] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const key = sources.map((source) => source.join('/')).join(',')
  const loader = useRef(loadRecords)
  loader.current = loadRecords
  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all(sources.map(([workspace, module]) => loader.current(workspace, module).then((records) => [`${workspace}/${module}`, records] as const).catch(() => [`${workspace}/${module}`, null] as const)))
      .then((results) => {
        if (!active) return
        setData(Object.fromEntries(results.map(([id, records]) => [id, records ?? []])))
        setMissing(results.filter(([, records]) => records === null).map(([id]) => id))
        setLoading(false)
      })
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return { data, missing, loading }
}

function PeriodPicker({ value, onChange }: { value: string; onChange: (key: string) => void }) {
  return <select className="pro-period" value={value} onChange={(event) => onChange(event.target.value)}>{reportingPeriods().map((period) => <option key={period.key} value={period.key}>{period.label}</option>)}</select>
}

const Missing = ({ missing }: { missing: string[] }) => missing.length
  ? <p className="pro-hint">Not included (workspace not on your plan or unavailable): {missing.join(', ')}</p>
  : null

function AgedTable({ title, rows, onExport }: { title: string; rows: Array<[string, Bucket]>; onExport: () => void }) {
  const total = rows.reduce((sum, [, bucket]) => { (Object.keys(bucket) as (keyof Bucket)[]).forEach((key) => { sum[key] += bucket[key] }); return sum }, emptyBucket())
  const rowTotal = (bucket: Bucket) => bucket.current + bucket.d30 + bucket.d60 + bucket.d90 + bucket.over
  return (
    <section className="pro-panel">
      <header className="pro-panel-head"><div><span className="pro-eyebrow">{title}</span><strong>{money(rowTotal(total))} outstanding</strong></div><button type="button" onClick={onExport}>Export CSV</button></header>
      <table className="pro-table">
        <thead><tr><th>Name</th><th className="n">Current</th><th className="n">1–30</th><th className="n">31–60</th><th className="n">61–90</th><th className="n">90+</th><th className="n">Total</th></tr></thead>
        <tbody>
          {rows.map(([name, bucket]) => <tr key={name}><td>{name}</td><td className="n">{money(bucket.current)}</td><td className="n">{money(bucket.d30)}</td><td className="n">{money(bucket.d60)}</td><td className="n">{money(bucket.d90)}</td><td className={`n ${bucket.over ? 'is-danger' : ''}`}>{money(bucket.over)}</td><td className="n"><b>{money(rowTotal(bucket))}</b></td></tr>)}
          {!rows.length && <tr><td colSpan={7}>Nothing outstanding.</td></tr>}
        </tbody>
        {rows.length > 0 && <tfoot><tr><td>Total</td><td className="n">{money(total.current)}</td><td className="n">{money(total.d30)}</td><td className="n">{money(total.d60)}</td><td className="n">{money(total.d90)}</td><td className="n">{money(total.over)}</td><td className="n">{money(rowTotal(total))}</td></tr></tfoot>}
      </table>
    </section>
  )
}

const agedCsv = (name: string, rows: Array<[string, Bucket]>) => downloadCsv(name, [
  ['Name', 'Current', '1-30', '31-60', '61-90', '90+', 'Total'],
  ...rows.map(([party, b]) => [party, ...[b.current, b.d30, b.d60, b.d90, b.over, b.current + b.d30 + b.d60 + b.d90 + b.over].map((p) => (p / 100).toFixed(2))]),
])

export function AgedPanel({ records, kind }: { records: ProRecord[]; kind: 'invoice' | 'bill' }) {
  const rows = useMemo(() => agedBalances(records, kind), [records, kind])
  return <AgedTable title={kind === 'invoice' ? 'Aged receivables' : 'Aged payables'} rows={rows} onExport={() => agedCsv(kind === 'invoice' ? 'aged-receivables.csv' : 'aged-payables.csv', rows)} />
}

export function FinanceReportsPage({ loadRecords }: { loadRecords: LoadRecords }) {
  const { data, missing, loading } = useSources(loadRecords, [['finance', 'invoices'], ['finance', 'bills'], ['finance', 'expenses']])
  const [periodKey, setPeriodKey] = useState('this-quarter')
  const [basis, setBasis] = useState<'accrual' | 'cash'>('accrual')
  const period = reportingPeriods().find((item) => item.key === periodKey) ?? reportingPeriods()[0]
  const invoices = data['finance/invoices'] ?? []
  const bills = data['finance/bills'] ?? []
  const expenses = approvedExpenses(data['finance/expenses'] ?? [])

  const report = useMemo(() => financeReport(invoices, bills, expenses, period, basis), [invoices, bills, expenses, basis, period])

  const exportTransactions = () => {
    const rows: unknown[][] = [['Date', 'Type', 'Number', 'Party', 'Status', 'Net', 'VAT', 'Gross', 'Paid', 'Balance', 'Due']]
    for (const [records, kind] of [[invoices, 'invoice'], [bills, 'bill']] as const) {
      for (const record of records) {
        const doc = readDocument(record, kind)
        const totals = documentTotals(doc)
        if (!inPeriod(doc.issueDate, period)) continue
        rows.push([doc.issueDate, kind === 'invoice' ? 'Sales invoice' : 'Purchase bill', doc.number, doc.party.name, record.status, ...[totals.net, totals.vat, totals.total, totals.paid, totals.balance].map((p) => (p / 100).toFixed(2)), doc.dueDate])
      }
    }
    for (const record of expenses) {
      const date = expenseDate(record)
      if (!inPeriod(date, period)) continue
      const gross = penceFrom(record.value)
      const vat = expenseVat(record)
      rows.push([date, 'Expense', record.id, record.secondary, record.status, ((gross - vat) / 100).toFixed(2), (vat / 100).toFixed(2), (gross / 100).toFixed(2), (gross / 100).toFixed(2), '0.00', ''])
    }
    downloadCsv(`transactions-${period.from}-to-${period.to}.csv`, rows)
  }

  const vatRows: Array<[string, string, number, boolean]> = [
    ['1', 'VAT due on sales and other outputs', report.vat.box1, true],
    ['2', 'VAT due on acquisitions from EU member states', report.vat.box2, true],
    ['3', 'Total VAT due (box 1 + 2)', report.vat.box3, true],
    ['4', 'VAT reclaimed on purchases and other inputs', report.vat.box4, true],
    ['5', 'Net VAT to pay HMRC or reclaim', report.vat.box5, true],
    ['6', 'Total value of sales excluding VAT', report.vat.box6, false],
    ['7', 'Total value of purchases excluding VAT', report.vat.box7, false],
    ['8', 'Total value of supplies to EU (ex VAT)', report.vat.box8, false],
    ['9', 'Total value of acquisitions from EU (ex VAT)', report.vat.box9, false],
  ]

  return (
    <div className="pro-reports">
      <div className="pro-toolbar">
        <PeriodPicker value={periodKey} onChange={setPeriodKey} />
        <div className="pro-toggle" role="group" aria-label="Accounting basis">
          <button type="button" className={basis === 'accrual' ? 'is-selected' : ''} onClick={() => setBasis('accrual')}>Accrual</button>
          <button type="button" className={basis === 'cash' ? 'is-selected' : ''} onClick={() => setBasis('cash')}>Cash</button>
        </div>
        <span className="pro-hint">{period.from} → {period.to}</span>
        <button type="button" onClick={exportTransactions}>Export transactions (CSV)</button>
      </div>
      {loading && <p className="pro-hint">Loading ledger…</p>}
      <Missing missing={missing} />

      <section className="pro-panel">
        <header className="pro-panel-head"><div><span className="pro-eyebrow">Profit &amp; loss · {basis}</span><strong>{money(report.netProfit)} net profit</strong></div>
          <button type="button" onClick={() => downloadCsv(`profit-and-loss-${period.key}.csv`, [['Line', 'Amount'], ['Sales', (report.income.net / 100).toFixed(2)], ['Cost of sales (bills)', (report.cost.net / 100).toFixed(2)], ['Gross profit', (report.grossProfit / 100).toFixed(2)], ['Expenses', (report.expenseNet / 100).toFixed(2)], ['Net profit', (report.netProfit / 100).toFixed(2)]])}>Export CSV</button></header>
        <table className="pro-table pro-statement">
          <tbody>
            <tr><td>Sales <small>{report.income.count} invoices</small></td><td className="n">{money(report.income.net)}</td></tr>
            <tr><td>Cost of sales <small>{report.cost.count} bills</small></td><td className="n">−{money(report.cost.net)}</td></tr>
            <tr className="is-sub"><td>Gross profit <small>{ratio(report.grossProfit, report.income.net)} margin</small></td><td className="n">{money(report.grossProfit)}</td></tr>
            <tr><td>Operating expenses <small>{report.expenseCount} approved</small></td><td className="n">−{money(report.expenseNet)}</td></tr>
            <tr className="is-total"><td>Net profit <small>{ratio(report.netProfit, report.income.net)} margin</small></td><td className="n">{money(report.netProfit)}</td></tr>
          </tbody>
        </table>
      </section>

      <section className="pro-panel">
        <header className="pro-panel-head"><div><span className="pro-eyebrow">VAT return (MTD boxes)</span><strong>{report.vat.box5 >= 0 ? `${money(report.vat.box5)} to pay` : `${money(-report.vat.box5)} to reclaim`}</strong></div>
          <button type="button" onClick={() => downloadCsv(`vat-return-${period.key}.csv`, [['Box', 'Description', 'Value'], ...vatRows.map(([box, label, value, pence]) => [box, label, pence ? (value / 100).toFixed(2) : value])])}>Export CSV</button></header>
        <table className="pro-table">
          <tbody>{vatRows.map(([box, label, value, pence]) => <tr key={box}><td className="pro-box">{box}</td><td>{label}</td><td className="n">{pence ? money(value) : `£${value.toLocaleString('en-GB')}`}</td></tr>)}</tbody>
        </table>
        <p className="pro-hint">Calculated from your invoices, bills and approved expenses on the {basis} basis. Review with your accountant and file through HMRC-recognised MTD software — FoundingOS does not submit returns to HMRC.</p>
      </section>

      <AgedPanel records={invoices} kind="invoice" />
      <AgedPanel records={bills} kind="bill" />
    </div>
  )
}

export function SalesReportsPage({ loadRecords, workspace }: { loadRecords: LoadRecords; workspace: string }) {
  const { data, missing, loading } = useSources(loadRecords, [[workspace, 'sales-pipeline']])
  const deals = (data[`${workspace}/sales-pipeline`] ?? []).map((record) => ({ record, deal: readDeal(record) }))
  const months = lastMonths(6)
  const won = deals.filter(({ record }) => record.status === 'Won')
  const lost = deals.filter(({ record }) => record.status === 'Lost')
  const wonByMonth = months.map((key) => ({ key, value: won.filter(({ deal }) => monthKey(deal.closedAt || '') === key).reduce((sum, { deal }) => sum + deal.amountPence, 0) }))
  const maxMonth = Math.max(1, ...wonByMonth.map((month) => month.value))
  const undatedWins = won.filter(({ deal }) => !deal.closedAt).length
  const group = (by: (item: typeof deals[number]) => string) => {
    const map = new Map<string, { won: number; wonValue: number; lost: number; open: number; openValue: number }>()
    for (const item of deals) {
      const name = by(item) || 'Unassigned'
      const row = map.get(name) ?? { won: 0, wonValue: 0, lost: 0, open: 0, openValue: 0 }
      if (item.record.status === 'Won') { row.won += 1; row.wonValue += item.deal.amountPence } else if (item.record.status === 'Lost') row.lost += 1
      else { row.open += 1; row.openValue += item.deal.amountPence }
      map.set(name, row)
    }
    return [...map.entries()].sort((a, b) => b[1].wonValue - a[1].wonValue)
  }
  const byOwner = group(({ record }) => record.owner)
  const bySource = group(({ deal }) => deal.source)
  const byStage = dealStages.map((stage) => ({ stage, items: deals.filter(({ record }) => record.status === stage) }))
  const lostReasons = [...lost.reduce((map, { deal }) => map.set(deal.lostReason || 'Not recorded', (map.get(deal.lostReason || 'Not recorded') ?? 0) + 1), new Map<string, number>()).entries()].sort((a, b) => b[1] - a[1])
  const GroupTable = ({ title, rows }: { title: string; rows: ReturnType<typeof group> }) => (
    <section className="pro-panel">
      <header className="pro-panel-head"><div><span className="pro-eyebrow">{title}</span></div><button type="button" onClick={() => downloadCsv(`${title.toLowerCase().replace(/\s+/g, '-')}.csv`, [['Name', 'Won', 'Won value', 'Lost', 'Win rate', 'Open', 'Open value'], ...rows.map(([name, row]) => [name, row.won, (row.wonValue / 100).toFixed(2), row.lost, ratio(row.won, row.won + row.lost, 0), row.open, (row.openValue / 100).toFixed(2)])])}>Export CSV</button></header>
      <table className="pro-table"><thead><tr><th>Name</th><th className="n">Won</th><th className="n">Won value</th><th className="n">Win rate</th><th className="n">Open</th><th className="n">Open value</th></tr></thead>
        <tbody>{rows.map(([name, row]) => <tr key={name}><td>{name}</td><td className="n">{row.won}</td><td className="n">{money(row.wonValue)}</td><td className="n">{ratio(row.won, row.won + row.lost, 0)}</td><td className="n">{row.open}</td><td className="n">{money(row.openValue)}</td></tr>)}
          {!rows.length && <tr><td colSpan={6}>No deals yet.</td></tr>}</tbody></table>
    </section>
  )
  return (
    <div className="pro-reports">
      {loading && <p className="pro-hint">Loading pipeline…</p>}
      <Missing missing={missing} />
      <section className="pro-panel">
        <header className="pro-panel-head"><div><span className="pro-eyebrow">Revenue won · last 6 months</span><strong>{money(wonByMonth.reduce((sum, month) => sum + month.value, 0))}</strong></div><span className="pro-badge">All-time won {money(won.reduce((sum, { deal }) => sum + deal.amountPence, 0))} · win rate {ratio(won.length, won.length + lost.length, 0)}</span></header>
        {undatedWins > 0 && <p className="pro-hint">{undatedWins} won deal{undatedWins === 1 ? ' has' : 's have'} no close date, so {undatedWins === 1 ? 'it is' : 'they are'} not charted by month. Use “Mark won” on the deal to date it.</p>}
        <div className="pro-bars">{wonByMonth.map((month) => <div key={month.key}><span>{monthLabel(month.key)}</span><i style={{ width: `${(month.value / maxMonth) * 100}%` }} /><b>{shortMoney(month.value)}</b></div>)}</div>
      </section>
      <section className="pro-panel">
        <header className="pro-panel-head"><div><span className="pro-eyebrow">Pipeline by stage</span></div></header>
        <table className="pro-table"><thead><tr><th>Stage</th><th className="n">Deals</th><th className="n">Value</th><th className="n">Weighted</th></tr></thead>
          <tbody>{byStage.map(({ stage, items }) => <tr key={stage}><td>{stage}</td><td className="n">{items.length}</td><td className="n">{money(items.reduce((sum, { deal }) => sum + deal.amountPence, 0))}</td><td className="n">{money(items.reduce((sum, { deal }) => sum + Math.round((deal.amountPence * deal.probability) / 100), 0))}</td></tr>)}</tbody></table>
      </section>
      <GroupTable title="By salesperson" rows={byOwner} />
      <GroupTable title="By lead source" rows={bySource} />
      {lostReasons.length > 0 && <section className="pro-panel"><header className="pro-panel-head"><div><span className="pro-eyebrow">Lost reasons</span></div></header><ul className="pro-list">{lostReasons.map(([reason, count]) => <li key={reason}><span>{reason}</span><b>{count}</b></li>)}</ul></section>}
    </div>
  )
}

export function MarketingReportsPage({ loadRecords, workspace }: { loadRecords: LoadRecords; workspace: string }) {
  const { data, missing, loading } = useSources(loadRecords, [[workspace, 'campaigns']])
  const campaigns = (data[`${workspace}/campaigns`] ?? []).map((record) => ({ record, campaign: readCampaign(record) }))
  const channels = new Map<string, { spend: number; revenue: number; leads: number; conversions: number; clicks: number; impressions: number }>()
  for (const { campaign } of campaigns) {
    const list = campaign.channels.length ? campaign.channels : ['Unassigned']
    for (const channel of list) {
      const row = channels.get(channel) ?? { spend: 0, revenue: 0, leads: 0, conversions: 0, clicks: 0, impressions: 0 }
      const share = 1 / list.length
      row.spend += campaign.spendPence * share
      row.revenue += campaign.revenuePence * share
      row.leads += campaign.leads * share
      row.conversions += campaign.conversions * share
      row.clicks += campaign.clicks * share
      row.impressions += campaign.impressions * share
      channels.set(channel, row)
    }
  }
  const channelRows = [...channels.entries()].sort((a, b) => b[1].revenue - a[1].revenue)
  const exportCampaigns = () => downloadCsv('campaign-performance.csv', [
    ['Campaign', 'Status', 'Objective', 'Channels', 'Start', 'End', 'Budget', 'Spend', 'Impressions', 'Clicks', 'Leads', 'Conversions', 'Revenue', 'CTR', 'CPL', 'CPA', 'ROAS'],
    ...campaigns.map(({ record, campaign }) => { const m = campaignMetrics(campaign); return [record.name, record.status, campaign.objective, campaign.channels.join('; '), campaign.startDate, campaign.endDate, (campaign.budgetPence / 100).toFixed(2), (campaign.spendPence / 100).toFixed(2), campaign.impressions, campaign.clicks, campaign.leads, campaign.conversions, (campaign.revenuePence / 100).toFixed(2), m.ctr, m.cpl, m.cpa, m.roas] }),
  ])
  return (
    <div className="pro-reports">
      {loading && <p className="pro-hint">Loading campaigns…</p>}
      <Missing missing={missing} />
      <section className="pro-panel">
        <header className="pro-panel-head"><div><span className="pro-eyebrow">Campaign performance</span><strong>{campaigns.length} campaigns</strong></div><button type="button" onClick={exportCampaigns}>Export CSV</button></header>
        <table className="pro-table"><thead><tr><th>Campaign</th><th>Status</th><th className="n">Spend</th><th className="n">Leads</th><th className="n">CPL</th><th className="n">Conv.</th><th className="n">Revenue</th><th className="n">ROAS</th></tr></thead>
          <tbody>{campaigns.map(({ record, campaign }) => { const m = campaignMetrics(campaign); return <tr key={record.id}><td>{record.name}</td><td>{record.status}</td><td className="n">{money(campaign.spendPence)}</td><td className="n">{campaign.leads}</td><td className="n">{m.cpl}</td><td className="n">{campaign.conversions}</td><td className="n">{money(campaign.revenuePence)}</td><td className="n">{m.roas}</td></tr> })}
            {!campaigns.length && <tr><td colSpan={8}>No campaigns yet.</td></tr>}</tbody></table>
      </section>
      <section className="pro-panel">
        <header className="pro-panel-head"><div><span className="pro-eyebrow">Channel attribution</span><strong>Split evenly across each campaign’s channels</strong></div></header>
        <table className="pro-table"><thead><tr><th>Channel</th><th className="n">Spend</th><th className="n">Revenue</th><th className="n">ROAS</th><th className="n">Leads</th><th className="n">CPL</th><th className="n">CTR</th></tr></thead>
          <tbody>{channelRows.map(([channel, row]) => <tr key={channel}><td>{channel}</td><td className="n">{money(Math.round(row.spend))}</td><td className="n">{money(Math.round(row.revenue))}</td><td className="n">{row.spend ? `${(row.revenue / row.spend).toFixed(2)}×` : '—'}</td><td className="n">{Math.round(row.leads)}</td><td className="n">{row.leads ? money(Math.round(row.spend / row.leads)) : '—'}</td><td className="n">{ratio(row.clicks, row.impressions, 2)}</td></tr>)}
            {!channelRows.length && <tr><td colSpan={7}>Add channels and results to your campaigns to see attribution.</td></tr>}</tbody></table>
      </section>
    </div>
  )
}
