/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Founder SuperDash: run FoundingOS itself — subscriptions, revenue, upgrade
// requests, platform health, growth, plus FoundingOS's own Finance and Marketing tabs.
import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
import { FounderFinancePanel } from '../../components/founder/FounderFinance'
import { FounderMarketingPanel } from '../../components/founder/FounderMarketing'
import { FinanceReport, MarketingReport, SalesReport } from '../../components/pro/ProReports'
import { router } from 'expo-router'
import { FounderOverview, fetchFounderOverview, founderEnableWorkspaces } from '../../lib/core-operations-api'
import { QuantumButton, QuantumCard, QuantumNotice, QuantumPill, QuantumScreen, QuantumSectionHeader, QuantumText, quantumColors, quantumSpace } from '../../components/QuantumUI'

const gbp = (value: number) => `£${value.toLocaleString('en-GB', { maximumFractionDigits: 2 })}`
const ago = (iso: string | null) => {
  if (!iso) return 'never'
  const minutes = Math.round((Date.now() - Date.parse(iso)) / 60000)
  if (minutes < 60) return `${Math.max(minutes, 0)}m ago`
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`
  return `${Math.round(minutes / 1440)}d ago`
}
const title = (slug: string) => slug.charAt(0).toUpperCase() + slug.slice(1)

function Kpi({ label, value, sub, alert }: { label: string; value: string; sub: string; alert?: boolean }) {
  return (
    <View style={[styles.kpi, alert ? styles.kpiAlert : null]}>
      <QuantumText variant="caption" color={quantumColors.neutral300}>{label}</QuantumText>
      <QuantumText variant="h2">{value}</QuantumText>
      <QuantumText variant="caption" color={quantumColors.neutral300}>{sub}</QuantumText>
    </View>
  )
}

function Health({ ok, warn, label, detail }: { ok: boolean; warn?: boolean; label: string; detail: string }) {
  const color = ok ? '#24C47A' : warn ? '#FBBF24' : '#F87171'
  return (
    <View style={styles.healthRow}>
      <View style={[styles.healthDot, { backgroundColor: color }]} />
      <QuantumText variant="caption" style={styles.flex}>{label}</QuantumText>
      <QuantumText variant="caption" color={quantumColors.neutral300}>{detail}</QuantumText>
    </View>
  )
}

export default function SuperDashScreen() {
  const [data, setData] = useState<FounderOverview | null>(null)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [busy, setBusy] = useState('')
  const [tab, setTab] = useState<'business' | 'finance' | 'sales' | 'marketing'>('business')
  const [reloadKey, setReloadKey] = useState(0)

  const load = useCallback(async () => {
    try {
      setData(await fetchFounderOverview())
      setError('')
    } catch (err: any) {
      setError(err?.status === 403 ? 'SuperDash is only available on the founder account.' : err?.message || 'Could not load SuperDash.')
    }
  }, [])
  useEffect(() => { void load() }, [load])

  const enable = async (tenantId: string, workspaces: string[]) => {
    setBusy(tenantId)
    try {
      await founderEnableWorkspaces(tenantId, workspaces)
      await load()
    } catch (err: any) {
      setError(err?.message || 'Could not switch workspaces on.')
    } finally {
      setBusy('')
    }
  }

  const s = data?.subscriptions
  const f = data?.finance
  const m = data?.monitoring
  const pending = data?.upgradeRequests.filter((request) => request.pending.length) ?? []
  const maxSignups = Math.max(1, ...(s?.signupsByDay.map((day) => day.count) ?? [1]))

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} tintColor="#38BDF8" onRefresh={async () => { setRefreshing(true); setReloadKey((key) => key + 1); await load(); setRefreshing(false) }} />}>
      <View style={styles.head}>
        <QuantumText variant="overline" color="#38BDF8">FoundingOS · Founder</QuantumText>
        <QuantumText variant="h1">SuperDash</QuantumText>
        <QuantumText variant="caption" color={quantumColors.neutral300}>{data ? `Updated ${ago(data.generatedAt)} · pull to refresh` : 'Loading…'}</QuantumText>
      </View>
      <View style={styles.links}>
        <QuantumPill active={tab === 'business'} onPress={() => setTab('business')}>Business</QuantumPill>
        <QuantumPill active={tab === 'finance'} onPress={() => setTab('finance')}>Finance</QuantumPill>
        <QuantumPill active={tab === 'sales'} onPress={() => setTab('sales')}>Sales</QuantumPill>
        <QuantumPill active={tab === 'marketing'} onPress={() => setTab('marketing')}>Marketing</QuantumPill>
      </View>
      {tab === 'finance' ? <>
        <FounderFinancePanel reloadKey={reloadKey} />
        <QuantumSectionHeader label="Invoices, VAT & aged debt" />
        <View style={styles.proLinks}>
          <QuantumButton tone="secondary" onPress={() => router.push('/workspace/finance/invoices')}>Invoices</QuantumButton>
          <QuantumButton tone="secondary" onPress={() => router.push('/workspace/finance/bills')}>Bills</QuantumButton>
        </View>
        <FinanceReport accent={PRO_ACCENT} refreshKey={reloadKey} />
      </> : null}
      {tab === 'sales' ? <>
        <View style={styles.proLinks}>
          <QuantumButton tone="secondary" onPress={() => router.push('/workspace/retail/sales-pipeline')}>Deals & quotes</QuantumButton>
        </View>
        <SalesReport accent={PRO_ACCENT} refreshKey={reloadKey} workspace="retail" />
      </> : null}
      {tab === 'marketing' ? <>
        <FounderMarketingPanel reloadKey={reloadKey} />
        <QuantumSectionHeader label="Campaign ROI & attribution" />
        <View style={styles.proLinks}>
          <QuantumButton tone="secondary" onPress={() => router.push('/workspace/marketing/campaigns')}>Campaigns</QuantumButton>
        </View>
        <MarketingReport accent={PRO_ACCENT} refreshKey={reloadKey} />
      </> : null}
      {tab === 'business' ? <>
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}

      <View style={styles.kpis}>
        <Kpi label="MRR" value={gbp(f?.mrrGbp ?? 0)} sub={`ARR ${gbp(f?.arrGbp ?? 0)}`} />
        <Kpi label="Customers" value={String(s?.customers ?? 0)} sub={`${s?.paying ?? 0} paying · ${s?.free ?? 0} free`} />
        <Kpi label="New sign-ups" value={String(s?.new7d ?? 0)} sub={`7 days · ${s?.new30d ?? 0} in 30`} />
        <Kpi label="Upgrade requests" value={String(pending.length)} sub="waiting for you" alert={pending.length > 0} />
      </View>

      <QuantumSectionHeader label="Upgrade requests" />
      <QuantumCard>
        {pending.length ? pending.map((request) => (
          <View key={request.id} style={styles.requestRow}>
            <View style={styles.flex}>
              <QuantumText variant="label">{request.business}</QuantumText>
              <QuantumText variant="caption" color={quantumColors.neutral300}>{request.ownerEmail} · {ago(request.createdAt)}</QuantumText>
              <QuantumText variant="caption">Wants {request.pending.map(title).join(', ')}</QuantumText>
            </View>
            <QuantumButton disabled={busy === request.tenantId} onPress={() => enable(request.tenantId, request.pending)}>{busy === request.tenantId ? '…' : 'Switch on'}</QuantumButton>
          </View>
        )) : <QuantumText variant="caption" color={quantumColors.neutral300}>No pending requests.</QuantumText>}
      </QuantumCard>

      <QuantumSectionHeader label="Platform health" />
      <QuantumCard>
        <Health ok={Boolean(m?.apiOk)} label="API & database" detail={m ? `${m.dbLatencyMs} ms` : '…'} />
        <Health ok={Boolean(m?.aiConfigured)} label="FoundAI (Claude)" detail={`${m?.aiRequests24h ?? 0} / 24h`} />
        <Health ok={Boolean(m?.lastAutopilotRunAt)} warn label="Autopilot" detail={`${m?.autopilotActions24h ?? 0} / 24h · ${ago(m?.lastAutopilotRunAt ?? null)}`} />
        <Health ok={Boolean(m?.emailConfigured)} warn label="Email sending" detail={m?.emailConfigured ? 'connected' : 'not set up'} />
        <Health ok={Boolean(f?.billingLive)} warn label="Stripe billing" detail={f?.billingLive ? 'live' : 'not connected'} />
        <Health ok={!m?.integrationsFailing.length} label="Customer integrations" detail={`${m?.integrationsConnected ?? 0} ok · ${m?.integrationsFailing.length ?? 0} failing`} />
      </QuantumCard>

      <QuantumSectionHeader label="Revenue by plan" />
      <QuantumCard>
        {s?.byPlan.map((row) => (
          <View key={row.plan} style={styles.tableRow}>
            <QuantumText variant="caption" style={styles.flex}>{row.name}</QuantumText>
            <QuantumText variant="caption" color={quantumColors.neutral300}>{row.customers} customers</QuantumText>
            <QuantumText variant="label" style={styles.amount}>{gbp(row.mrrGbp)}</QuantumText>
          </View>
        ))}
        {f?.boltOns.map((row) => (
          <View key={row.workspace} style={styles.tableRow}>
            <QuantumText variant="caption" style={styles.flex}>+ {title(row.workspace)} bolt-on</QuantumText>
            <QuantumText variant="caption" color={quantumColors.neutral300}>{row.customers}</QuantumText>
            <QuantumText variant="label" style={styles.amount}>{gbp(row.mrrGbp)}</QuantumText>
          </View>
        ))}
        <QuantumText variant="caption" color={quantumColors.neutral300}>{f?.note}</QuantumText>
      </QuantumCard>

      <QuantumSectionHeader label="Sign-ups · last 14 days" />
      <QuantumCard>
        <View style={styles.bars}>
          {s?.signupsByDay.map((day) => <View key={day.date} style={[styles.bar, { height: `${Math.max(4, (day.count / maxSignups) * 100)}%` }]} />)}
        </View>
        <View style={styles.chips}>
          {s?.workspaceAdoption.map((row) => <View key={row.workspace} style={styles.chip}><QuantumText variant="caption">{title(row.workspace)} · {row.customers}</QuantumText></View>)}
        </View>
      </QuantumCard>

      <QuantumSectionHeader label={`Customers · ${data?.tenants.length ?? 0}`} />
      {data?.tenants.map((tenant) => (
        <QuantumCard key={tenant.tenantId}>
          <View style={styles.tableRow}>
            <QuantumText variant="label" style={styles.flex}>{tenant.businessName}</QuantumText>
            <QuantumText variant="label" color="#38BDF8">{gbp(tenant.monthlyValueGbp)}/mo</QuantumText>
          </View>
          <QuantumText variant="caption" color={quantumColors.neutral300}>{tenant.ownerEmail} · {tenant.planName} · {tenant.seats} seat{tenant.seats === 1 ? '' : 's'}</QuantumText>
          <QuantumText variant="caption">{tenant.workspaces.map(title).join(', ') || 'No workspaces'}</QuantumText>
          <QuantumText variant="caption" color={quantumColors.neutral300}>Joined {ago(tenant.createdAt)} · active {ago(tenant.lastActiveAt)}</QuantumText>
        </QuantumCard>
      ))}
      </> : null}
    </QuantumScreen>
  )
}

const PRO_ACCENT = '#38bdf8'

const styles = StyleSheet.create({
  head: { gap: 2 },
  flex: { flex: 1 },
  kpis: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  kpi: { width: '48%', flexGrow: 1, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)', padding: quantumSpace.md, gap: 2 },
  kpiAlert: { borderColor: '#FBBF24', backgroundColor: 'rgba(251,191,36,0.08)' },
  links: { flexDirection: 'row', gap: quantumSpace.xs },
  requestRow: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm, paddingVertical: 6 },
  healthRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  healthDot: { width: 9, height: 9, borderRadius: 5 },
  proLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  tableRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
  amount: { minWidth: 64, textAlign: 'right' },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 90 },
  bar: { flex: 1, backgroundColor: '#38BDF8', borderRadius: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: quantumSpace.sm },
  chip: { borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 10, paddingVertical: 4 },
})
