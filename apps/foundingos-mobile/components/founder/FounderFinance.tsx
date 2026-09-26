/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// SuperDash Finance: FoundingOS's own P&L, costs, cash and runway.
import { useCallback, useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { addFounderLedgerEntry, deleteFounderLedgerEntry, fetchFounderFinance, type FounderFinance } from '../../lib/core-operations-api'
import { QuantumButton, QuantumCard, QuantumNotice, QuantumPill, QuantumSectionHeader, QuantumText, QuantumTextInput, quantumColors, quantumSpace } from '../QuantumUI'

const gbp = (value: number) => `${value < 0 ? '−' : ''}£${Math.abs(value).toLocaleString('en-GB', { maximumFractionDigits: 2 })}`
const monthLabel = (month: string) => new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short' })

export function FounderFinancePanel({ reloadKey }: { reloadKey: number }) {
  const [data, setData] = useState<FounderFinance | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [kind, setKind] = useState<'expense' | 'income' | 'cash'>('expense')
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Hosting & infrastructure')
  const [recurring, setRecurring] = useState(true)

  const load = useCallback(async () => {
    try { setData(await fetchFounderFinance()); setError('') } catch (err: any) { setError(err?.message || 'Could not load finance.') }
  }, [])
  useEffect(() => { void load() }, [load, reloadKey])

  const save = async () => {
    setBusy(true); setError('')
    try {
      await addFounderLedgerEntry({ kind, label, category, amountGbp: Number(amount), recurring: kind !== 'cash' && recurring, date: new Date().toISOString().slice(0, 10) })
      setLabel(''); setAmount('')
      await load()
    } catch (err: any) { setError(err?.message || 'Could not save.') } finally { setBusy(false) }
  }
  const remove = (id: string, name: string) => Alert.alert('Delete entry?', name, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { try { await deleteFounderLedgerEntry(id); await load() } catch (err: any) { setError(err?.message || 'Could not delete.') } } }])
  const maxBar = Math.max(1, ...(data?.pnl.flatMap((row) => [row.revenue, row.costs]) ?? [1]))

  return (
    <View style={styles.wrap}>
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}
      <View style={styles.kpis}>
        <Kpi label="MRR" value={gbp(data?.mrrGbp ?? 0)} sub={`${data?.payingCustomers ?? 0} paying`} />
        <Kpi label="Monthly costs" value={gbp(data?.recurringCostsGbp ?? 0)} sub="recurring" />
        <Kpi label="Profit this month" value={gbp(data?.thisMonth.net ?? 0)} sub={`${gbp(data?.thisMonth.revenue ?? 0)} in`} alert={(data?.thisMonth.net ?? 0) < 0} />
        <Kpi label="Runway" value={data?.runwayMonths == null ? (data && data.monthlyBurnGbp === 0 ? 'Profitable' : '—') : `${data.runwayMonths} mo`} sub={data?.cashGbp == null ? 'add cash balance' : `cash ${gbp(data.cashGbp)}`} alert={data?.runwayMonths != null && data.runwayMonths < 6} />
      </View>

      <QuantumSectionHeader label="Profit & loss · 6 months" />
      <QuantumCard>
        <View style={styles.pnl}>
          {data?.pnl.map((row) => (
            <View key={row.month} style={styles.pnlCol}>
              <View style={styles.pnlBars}>
                <View style={[styles.barIn, { height: `${Math.max(3, (row.revenue / maxBar) * 100)}%` }]} />
                <View style={[styles.barOut, { height: `${Math.max(3, (row.costs / maxBar) * 100)}%` }]} />
              </View>
              <QuantumText variant="caption" color={row.net < 0 ? quantumColors.danger : undefined}>{gbp(Math.round(row.net))}</QuantumText>
              <QuantumText variant="caption" color={quantumColors.neutral300}>{monthLabel(row.month)}</QuantumText>
            </View>
          ))}
        </View>
        <QuantumText variant="caption" color={quantumColors.neutral300}>Green = revenue, red = costs. {data?.note}</QuantumText>
      </QuantumCard>

      <QuantumSectionHeader label="Add to the books" />
      <QuantumCard>
        <View style={styles.pills}>
          <QuantumPill active={kind === 'expense'} onPress={() => setKind('expense')}>Cost</QuantumPill>
          <QuantumPill active={kind === 'income'} onPress={() => setKind('income')}>Income</QuantumPill>
          <QuantumPill active={kind === 'cash'} onPress={() => setKind('cash')}>Cash balance</QuantumPill>
        </View>
        <QuantumTextInput onChangeText={setLabel} placeholder={kind === 'cash' ? 'Business bank account' : kind === 'income' ? 'Setup fee' : 'Vercel Pro'} value={label} />
        <QuantumTextInput keyboardType="decimal-pad" onChangeText={setAmount} placeholder="£ amount" value={amount} />
        {kind === 'expense' ? <View style={styles.pills}>{(data?.categories ?? []).map((item) => <QuantumPill active={category === item} key={item} onPress={() => setCategory(item)}>{item}</QuantumPill>)}</View> : null}
        {kind !== 'cash' ? <View style={styles.pills}><QuantumPill active={recurring} onPress={() => setRecurring(true)}>Every month</QuantumPill><QuantumPill active={!recurring} onPress={() => setRecurring(false)}>One-off</QuantumPill></View> : null}
        <QuantumButton disabled={busy || !label.trim() || !amount} onPress={save}>{busy ? 'Saving…' : 'Save'}</QuantumButton>
      </QuantumCard>

      <QuantumSectionHeader label="Costs by category" />
      <QuantumCard>
        {data?.byCategory.length ? data.byCategory.map((row) => <Row key={row.category} left={row.category} right={gbp(row.monthlyGbp)} />) : <QuantumText variant="caption" color={quantumColors.neutral300}>No costs recorded yet.</QuantumText>}
      </QuantumCard>

      <QuantumSectionHeader label="Top customers" />
      <QuantumCard>
        {data?.topCustomers.length ? data.topCustomers.map((row) => <Row key={row.business} left={`${row.business} · ${row.plan}`} right={`${gbp(row.monthlyGbp)}/mo`} />) : <QuantumText variant="caption" color={quantumColors.neutral300}>No paying customers yet.</QuantumText>}
      </QuantumCard>

      <QuantumSectionHeader label={`Ledger · ${data?.entries.length ?? 0}`} />
      {data?.entries.map((entry) => (
        <QuantumCard key={entry.id}>
          <Row left={entry.label} right={gbp(entry.amountGbp)} />
          <QuantumText variant="caption" color={quantumColors.neutral300}>{entry.date} · {entry.kind === 'cash' ? 'Cash balance' : `${entry.kind === 'income' ? 'Income' : entry.category}${entry.recurring ? ' · monthly' : ''}`}</QuantumText>
          <QuantumButton tone="ghost" onPress={() => remove(entry.id, entry.label)}>Delete</QuantumButton>
        </QuantumCard>
      ))}
    </View>
  )
}

function Kpi({ label, value, sub, alert }: { label: string; value: string; sub: string; alert?: boolean }) {
  return (
    <View style={[styles.kpi, alert ? styles.kpiAlert : null]}>
      <QuantumText variant="caption" color={quantumColors.neutral300}>{label}</QuantumText>
      <QuantumText variant="h3">{value}</QuantumText>
      <QuantumText variant="caption" color={quantumColors.neutral300}>{sub}</QuantumText>
    </View>
  )
}
const Row = ({ left, right }: { left: string; right: string }) => (
  <View style={styles.row}><QuantumText variant="caption" style={styles.flex}>{left}</QuantumText><QuantumText variant="label">{right}</QuantumText></View>
)

const styles = StyleSheet.create({
  wrap: { gap: quantumSpace.sm },
  flex: { flex: 1 },
  kpis: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  kpi: { width: '48%', flexGrow: 1, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)', padding: quantumSpace.md, gap: 2 },
  kpiAlert: { borderColor: '#FBBF24', backgroundColor: 'rgba(251,191,36,0.08)' },
  pnl: { flexDirection: 'row', gap: 6, height: 150, alignItems: 'flex-end' },
  pnlCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 2 },
  pnlBars: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 3, width: '100%', justifyContent: 'center' },
  barIn: { width: 10, backgroundColor: '#26E07F', borderRadius: 3 },
  barOut: { width: 10, backgroundColor: '#FF5470', borderRadius: 3 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
})
