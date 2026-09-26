/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real finance, sales and marketing reports for the app and SuperDash — the
// same calculations as the web reports (@foundingos/ui/pro/models).
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import {
  agedBalances, approvedExpenses, campaignSummary, dealStages, financeReport, money, ratio, readCampaign, reportingPeriods, salesSummary,
  type Basis, type Bucket, type ProRecord,
} from '@foundingos/ui/pro/models'
import { QuantumCard, QuantumNotice, QuantumPill, QuantumText, quantumColors, quantumSpace } from '../QuantumUI'
import { ProRow } from './ProSheet'
import { loadProRecords } from '../../lib/pro-records'

type Sources = Record<string, ProRecord[]>

export function useProSources(sources: Array<[string, string]>, refreshKey = 0) {
  const key = sources.map((pair) => pair.join('/')).join(',')
  const [data, setData] = useState<Sources>({})
  const [missing, setMissing] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const load = useCallback(async () => {
    setLoading(true)
    const pairs = key.split(',').map((item) => item.split('/') as [string, string])
    const results = await Promise.allSettled(pairs.map(([workspace, module]) => loadProRecords(workspace, module)))
    const next: Sources = {}
    const gaps: string[] = []
    results.forEach((result, index) => {
      const id = pairs[index].join('/')
      if (result.status === 'fulfilled') next[id] = result.value
      else gaps.push(id)
    })
    setData(next)
    setMissing(gaps)
    setLoading(false)
  }, [key])
  useEffect(() => { void load() }, [load, refreshKey])
  return { data, missing, loading }
}

function Heading({ children, accent }: { children: string; accent: string }) {
  return <QuantumText variant="overline" color={accent}>{children}</QuantumText>
}

function Missing({ missing }: { missing: string[] }) {
  if (!missing.length) return null
  return <QuantumNotice tone="warning">{`Not included (workspace not on your plan or unavailable): ${missing.join(', ')}`}</QuantumNotice>
}

function AgedCard({ title, rows, accent }: { title: string; rows: Array<[string, Bucket]>; accent: string }) {
  const total = rows.reduce((acc, [, bucket]) => ({ current: acc.current + bucket.current, d30: acc.d30 + bucket.d30, d60: acc.d60 + bucket.d60, d90: acc.d90 + bucket.d90, over: acc.over + bucket.over }), { current: 0, d30: 0, d60: 0, d90: 0, over: 0 })
  const all = total.current + total.d30 + total.d60 + total.d90 + total.over
  return (
    <QuantumCard accent={accent} style={styles.card}>
      <Heading accent={accent}>{title}</Heading>
      <ProRow strong label="Outstanding" value={money(all)} />
      <ProRow label="Not yet due" value={money(total.current)} />
      <ProRow label="1–30 days overdue" value={money(total.d30)} tone={total.d30 ? quantumColors.warning : undefined} />
      <ProRow label="31–60 days" value={money(total.d60)} tone={total.d60 ? quantumColors.warning : undefined} />
      <ProRow label="61–90 days" value={money(total.d90)} tone={total.d90 ? quantumColors.danger : undefined} />
      <ProRow label="Over 90 days" value={money(total.over)} tone={total.over ? quantumColors.danger : undefined} />
      {rows.slice(0, 6).map(([name, bucket]) => {
        const owed = bucket.current + bucket.d30 + bucket.d60 + bucket.d90 + bucket.over
        return <ProRow key={name} label={`· ${name}`} value={money(owed)} />
      })}
    </QuantumCard>
  )
}

export function FinanceReport({ accent, refreshKey }: { accent: string; refreshKey?: number }) {
  const { data, missing, loading } = useProSources([['finance', 'invoices'], ['finance', 'bills'], ['finance', 'expenses']], refreshKey)
  const periods = useMemo(() => reportingPeriods(), [])
  const [periodKey, setPeriodKey] = useState('this-quarter')
  const [basis, setBasis] = useState<Basis>('accrual')
  const period = periods.find((item) => item.key === periodKey) ?? periods[0]
  const invoices = data['finance/invoices'] ?? []
  const bills = data['finance/bills'] ?? []
  const expenses = useMemo(() => approvedExpenses(data['finance/expenses'] ?? []), [data])
  const report = useMemo(() => financeReport(invoices, bills, expenses, period, basis), [invoices, bills, expenses, period, basis])
  const receivables = useMemo(() => agedBalances(invoices, 'invoice'), [invoices])
  const payables = useMemo(() => agedBalances(bills, 'bill'), [bills])
  if (loading) return <ActivityIndicator color={accent} />
  const vat = report.vat
  return (
    <View style={styles.stack}>
      <Missing missing={missing} />
      <View style={styles.pills}>
        {periods.map((item) => <QuantumPill key={item.key} active={item.key === periodKey} accent={accent} onPress={() => setPeriodKey(item.key)}>{item.label}</QuantumPill>)}
      </View>
      <View style={styles.pills}>
        <QuantumPill active={basis === 'accrual'} accent={accent} onPress={() => setBasis('accrual')}>Accrual</QuantumPill>
        <QuantumPill active={basis === 'cash'} accent={accent} onPress={() => setBasis('cash')}>Cash</QuantumPill>
      </View>
      <QuantumCard accent={accent} style={styles.card}>
        <Heading accent={accent}>{`Profit & loss · ${period.from} to ${period.to}`}</Heading>
        <ProRow label={`Sales (${report.income.count} invoices, net)`} value={money(report.income.net)} />
        <ProRow label={`Cost of sales (${report.cost.count} bills, net)`} value={`−${money(report.cost.net)}`} />
        <ProRow strong label="Gross profit" value={money(report.grossProfit)} />
        <ProRow label={`Expenses (${report.expenseCount}, net)`} value={`−${money(report.expenseNet)}`} />
        <ProRow strong label="Net profit" value={money(report.netProfit)} tone={report.netProfit >= 0 ? quantumColors.success : quantumColors.danger} />
        <ProRow label="Gross margin" value={ratio(report.grossProfit, report.income.net)} />
      </QuantumCard>
      <QuantumCard accent={accent} style={styles.card}>
        <Heading accent={accent}>VAT return (MTD boxes)</Heading>
        <ProRow label="1 · VAT due on sales" value={money(vat.box1)} />
        <ProRow label="2 · VAT due on EU acquisitions" value={money(vat.box2)} />
        <ProRow label="3 · Total VAT due" value={money(vat.box3)} />
        <ProRow label="4 · VAT reclaimed on purchases" value={money(vat.box4)} />
        <ProRow strong label={vat.box5 >= 0 ? '5 · Net VAT to pay HMRC' : '5 · Net VAT to reclaim'} value={money(Math.abs(vat.box5))} tone={vat.box5 >= 0 ? quantumColors.warning : quantumColors.success} />
        <ProRow label="6 · Total sales ex VAT (£)" value={vat.box6.toLocaleString('en-GB')} />
        <ProRow label="7 · Total purchases ex VAT (£)" value={vat.box7.toLocaleString('en-GB')} />
        <ProRow label="8 · Supplies to EU (£)" value={String(vat.box8)} />
        <ProRow label="9 · Acquisitions from EU (£)" value={String(vat.box9)} />
        <QuantumText variant="caption" color={quantumColors.neutral300}>Check with your accountant before filing.</QuantumText>
      </QuantumCard>
      <AgedCard accent={accent} rows={receivables} title="Aged receivables (customers owe you)" />
      <AgedCard accent={accent} rows={payables} title="Aged payables (you owe suppliers)" />
    </View>
  )
}

export function SalesSummaryCard({ records, accent }: { records: ProRecord[]; accent: string }) {
  const summary = useMemo(() => salesSummary(records), [records])
  return (
    <QuantumCard accent={accent} style={styles.card}>
      <Heading accent={accent}>Pipeline forecast</Heading>
      <ProRow label={`Open pipeline (${summary.open.length})`} value={money(summary.pipeline)} />
      <ProRow strong label="Weighted forecast" value={money(summary.weighted)} />
      <ProRow label={`Won (${summary.won.length})`} value={money(summary.wonValue)} tone={quantumColors.success} />
      <ProRow label="Win rate" value={summary.winRate} />
      {summary.noNextStep ? <ProRow label="Open deals with no next step" value={String(summary.noNextStep)} tone={quantumColors.warning} /> : null}
      {summary.overdueNextStep ? <ProRow label="Next step overdue" value={String(summary.overdueNextStep)} tone={quantumColors.danger} /> : null}
      {summary.pastClose ? <ProRow label="Past expected close" value={String(summary.pastClose)} tone={quantumColors.danger} /> : null}
    </QuantumCard>
  )
}

export function SalesReport({ workspace = 'retail', accent, refreshKey }: { workspace?: string; accent: string; refreshKey?: number }) {
  const { data, missing, loading } = useProSources([[workspace, 'sales-pipeline']], refreshKey)
  const records = useMemo(() => data[`${workspace}/sales-pipeline`] ?? [], [data, workspace])
  const summary = useMemo(() => salesSummary(records), [records])
  const bySource = useMemo(() => {
    const map = new Map<string, { won: number; count: number }>()
    for (const { record, deal } of summary.deals) {
      const key = deal.source || 'Unknown'
      const entry = map.get(key) ?? { won: 0, count: 0 }
      entry.count += 1
      if (record.status === 'Won') entry.won += deal.amountPence
      map.set(key, entry)
    }
    return [...map.entries()].sort((a, b) => b[1].won - a[1].won)
  }, [summary])
  if (loading) return <ActivityIndicator color={accent} />
  return (
    <View style={styles.stack}>
      <Missing missing={missing} />
      <SalesSummaryCard accent={accent} records={records} />
      <QuantumCard accent={accent} style={styles.card}>
        <Heading accent={accent}>By stage</Heading>
        {dealStages.map((stage) => {
          const deals = summary.deals.filter(({ record }) => record.status === stage)
          return <ProRow key={stage} label={`${stage} (${deals.length})`} value={money(deals.reduce((sum, { deal }) => sum + deal.amountPence, 0))} />
        })}
      </QuantumCard>
      <QuantumCard accent={accent} style={styles.card}>
        <Heading accent={accent}>Won revenue by source</Heading>
        {bySource.length ? bySource.map(([source, entry]) => <ProRow key={source} label={`${source} (${entry.count} deals)`} value={money(entry.won)} />) : <QuantumText variant="caption">No deals yet.</QuantumText>}
      </QuantumCard>
      {summary.lost.length ? (
        <QuantumCard accent={accent} style={styles.card}>
          <Heading accent={accent}>Recent lost reasons</Heading>
          {summary.lost.slice(0, 6).map(({ record, deal }) => <ProRow key={record.id} label={deal.company || record.name} value={deal.lostReason || '—'} />)}
        </QuantumCard>
      ) : null}
    </View>
  )
}

export function CampaignSummaryCard({ records, accent }: { records: ProRecord[]; accent: string }) {
  const summary = useMemo(() => campaignSummary(records), [records])
  return (
    <QuantumCard accent={accent} style={styles.card}>
      <Heading accent={accent}>Campaign portfolio</Heading>
      <ProRow label="Budget" value={money(summary.budget)} />
      <ProRow label="Spend" value={money(summary.spend)} />
      <ProRow strong label="Attributed revenue" value={money(summary.revenue)} tone={quantumColors.success} />
      <ProRow label="ROAS" value={summary.roas} />
      <ProRow label={`Leads (${summary.leads})`} value={`CPL ${summary.cpl}`} />
      <ProRow label="CTR" value={summary.ctr} />
      {summary.overspent ? <ProRow label="Over budget" value={String(summary.overspent)} tone={quantumColors.danger} /> : null}
    </QuantumCard>
  )
}

export function MarketingReport({ accent, refreshKey }: { accent: string; refreshKey?: number }) {
  const { data, missing, loading } = useProSources([['marketing', 'campaigns']], refreshKey)
  const records = useMemo(() => data['marketing/campaigns'] ?? [], [data])
  const byChannel = useMemo(() => {
    const map = new Map<string, { spend: number; revenue: number; leads: number }>()
    for (const record of records) {
      const campaign = readCampaign(record)
      const channels = campaign.channels.length ? campaign.channels : ['Unassigned']
      for (const channel of channels) {
        const entry = map.get(channel) ?? { spend: 0, revenue: 0, leads: 0 }
        entry.spend += Math.round(campaign.spendPence / channels.length)
        entry.revenue += Math.round(campaign.revenuePence / channels.length)
        entry.leads += campaign.leads / channels.length
        map.set(channel, entry)
      }
    }
    return [...map.entries()].sort((a, b) => b[1].revenue - a[1].revenue)
  }, [records])
  if (loading) return <ActivityIndicator color={accent} />
  return (
    <View style={styles.stack}>
      <Missing missing={missing} />
      <CampaignSummaryCard accent={accent} records={records} />
      <QuantumCard accent={accent} style={styles.card}>
        <Heading accent={accent}>Attribution by channel</Heading>
        {byChannel.length ? byChannel.map(([channel, entry]) => (
          <ProRow key={channel} label={`${channel} · ${Math.round(entry.leads)} leads`} value={`${money(entry.revenue)} · ${entry.spend ? `${(entry.revenue / entry.spend).toFixed(2)}×` : '—'}`} />
        )) : <QuantumText variant="caption">No campaigns yet.</QuantumText>}
        <QuantumText variant="caption" color={quantumColors.neutral300}>Multi-channel campaigns are split evenly across their channels.</QuantumText>
      </QuantumCard>
    </View>
  )
}

const styles = StyleSheet.create({
  stack: { gap: quantumSpace.md },
  card: { gap: 2 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.xs },
})
