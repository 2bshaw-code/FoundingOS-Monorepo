/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
import { fetchSuperDashOverview, fetchBrandMetrics, runAALAction, type SuperDashOverview, type BrandMetric } from '../../lib/api'
import { useQuantumStore } from '../../lib/store'
import { BRANDS } from '../../lib/brands'
import { SuperDashAISummary } from '../../components/SuperDashAISummary'
import { QuantumSphere } from '../../components/QuantumSphere'
import { DemoList } from '../../components/DemoList'
import { enqueueOutboxAction } from '../../lib/outbox-sync'
import {
  QuantumButton,
  QuantumCard,
  QuantumLoadingScreen,
  QuantumMetric,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  getSemanticColor,
  quantumColors,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../components/QuantumUI'

const QUICK_ACTIONS = [
  { id: 'collect_payment', label: 'Collect payment', caption: 'Card, mobile money, QR', tone: 'good' as const },
  { id: 'create_order', label: 'Create order', caption: 'Inventory-aware checkout', tone: 'info' as const },
  { id: 'approve_workflow', label: 'Approve workflow', caption: 'Review pending action', tone: 'watch' as const },
  { id: 'send_whatsapp', label: 'WhatsApp update', caption: 'Customer-ready message', tone: 'good' as const },
]

const AAL_ACTIONS = [
  { id: 'weeklyReport', label: 'Marketing director', caption: 'Weekly campaign health' },
  { id: 'prioritizePipeline', label: 'Sales pipeline', caption: 'Prioritise deals' },
  { id: 'detectUnhappy', label: 'CRM sweep', caption: 'Find retention risk' },
  { id: 'cashflowForecast', label: 'Finance forecast', caption: 'Credit-safe cashflow' },
] as const

export default function HomeScreen() {
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const setCommandBarOpen = useQuantumStore((state) => state.setCommandBarOpen)
  const setQuantumWheelOpen = useQuantumStore((state) => state.setQuantumWheelOpen)
  const pendingSyncCount = useQuantumStore((state) => state.pendingSyncCount)
  const lowEndMode = useQuantumStore((state) => state.lowEndMode)
  const theme = useActiveQuantumTheme()
  const activeBrand = BRANDS.find((brand) => brand.slug === activeBrandSlug) ?? BRANDS[0]

  const [overview, setOverview] = useState<SuperDashOverview | null>(null)
  const [metrics, setMetrics] = useState<BrandMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [actionStatus, setActionStatus] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const [overviewData, metricsData] = await Promise.all([fetchSuperDashOverview(), fetchBrandMetrics()])
      setOverview(overviewData)
      setMetrics(metricsData)
    } catch (error) {
      setActionStatus('Live sync is unavailable. Showing cached Quantum shell.')
      console.warn('Unable to load Quantum Superdash data', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleQuickAction = async (type: string) => {
    await enqueueOutboxAction(`QUANTUM_${type.toUpperCase()}`, activeBrandSlug, {
      type,
      source: 'mobile-superdash',
      brandSlug: activeBrandSlug,
    })
    setActionStatus(`${type} queued to the offline outbox.`)
    setTimeout(() => setActionStatus(''), 4000)
  }

  const handleAALAction = async (actionId: string) => {
    const result = await runAALAction(actionId)
    setActionStatus(result.success ? `${actionId} is ready for review.` : `${actionId} blocked: ${result.error}`)
    setTimeout(() => setActionStatus(''), 4000)
  }

  if (loading) return <QuantumLoadingScreen />

  return (
    <QuantumScreen
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.accent} />}
    >
      <QuantumCard accent={theme.accent} style={styles.heroCard}>
        <View style={styles.heroTop}>
          <QuantumSphere size={52} accent={theme.accent} />
          <View style={styles.heroCopy}>
            <QuantumText variant="overline" color={theme.accent}>
              {activeBrand?.name ?? 'FoundingOS'} shell
            </QuantumText>
            <QuantumText variant="h1">Quantum Superdash</QuantumText>
            <QuantumText color={theme.subtextColor}>
              AI signals, offline operations, and WhatsApp actions for the active brand context.
            </QuantumText>
          </View>
        </View>

        <View style={styles.heroActions}>
          <QuantumButton onPress={() => setCommandBarOpen(true)}>Open command bar</QuantumButton>
          <QuantumButton tone="secondary" onPress={() => setQuantumWheelOpen(true)}>
            Switch brand
          </QuantumButton>
        </View>

        {pendingSyncCount > 0 ? (
          <QuantumNotice>{pendingSyncCount} offline action(s) waiting for the sync worker.</QuantumNotice>
        ) : null}
      </QuantumCard>

      {actionStatus ? <QuantumNotice tone={actionStatus.includes('unavailable') ? 'warning' : 'success'}>{actionStatus}</QuantumNotice> : null}

      <QuantumSectionHeader label="Primary actions" />
      <View style={styles.actionGrid}>
        {QUICK_ACTIONS.map((action) => (
          <QuantumCard key={action.id} accent={getSemanticColor(action.tone)} style={styles.actionTile}>
            <QuantumText variant="h3">{action.label}</QuantumText>
            <QuantumText variant="caption" color={theme.subtextColor}>
              {action.caption}
            </QuantumText>
            <QuantumButton tone="ghost" onPress={() => handleQuickAction(action.label)}>
              Queue
            </QuantumButton>
          </QuantumCard>
        ))}
      </View>

      {overview ? (
        <SuperDashAISummary
          brandRows={overview.brandRows}
          anomalies={overview.anomalies}
          guardianWarnings={[]}
          accent={theme.accent}
        />
      ) : null}

      <DemoList />

      <QuantumSectionHeader label="Autonomous AI Layer" />
      <QuantumCard accent={theme.accent} style={styles.aalCard}>
        <QuantumText variant="h3">Mobile AI command center</QuantumText>
        <QuantumText variant="caption" color={theme.subtextColor}>
          Mirrors web Superdash actions with brand context, Package Model D entitlements, usage metering, audit logging, and human approval.
        </QuantumText>
        <View style={styles.actionGrid}>
          {AAL_ACTIONS.map((action) => (
            <QuantumCard key={action.id} accent={theme.accent} style={styles.actionTile}>
              <QuantumText variant="h3">{action.label}</QuantumText>
              <QuantumText variant="caption" color={theme.subtextColor}>
                {action.caption}
              </QuantumText>
              <QuantumButton tone="ghost" onPress={() => handleAALAction(action.id)}>
                Run
              </QuantumButton>
            </QuantumCard>
          ))}
        </View>
      </QuantumCard>

      {overview ? (
        <>
          <QuantumSectionHeader label="Brand performance" />
          {overview.brandRows.map((row) => {
            const toneColor = getSemanticColor(row.status === 'good' ? 'good' : row.status === 'watch' ? 'watch' : 'risk')
            return (
              <QuantumCard key={row.brand} accent={toneColor}>
                <View style={styles.rowBetween}>
                  <QuantumText variant="h3">{row.brand}</QuantumText>
                  <View style={[styles.statusDot, { backgroundColor: toneColor }]} />
                </View>
                <View style={styles.metricRow}>
                  <QuantumMetric label="Marketing" value={`${row.marketing}%`} tone={row.status === 'risk' ? 'risk' : 'good'} />
                  <QuantumMetric label="Accounting" value={`${row.accounting}%`} tone={row.status === 'watch' ? 'watch' : 'good'} />
                </View>
                <QuantumText variant="caption" color={theme.subtextColor}>
                  Service load {row.serviceLoad} vs {row.previousServiceLoad} · {row.messaging} messages
                </QuantumText>
              </QuantumCard>
            )
          })}
        </>
      ) : null}

      <QuantumSectionHeader label="Live engagement" />
      {metrics.map((metric) => (
        <QuantumCard key={metric.brandName}>
          <View style={styles.rowBetween}>
            <QuantumText variant="h3">{metric.brandName}</QuantumText>
            <QuantumText variant="h3" color={theme.accent}>
              {metric.totalEngagement}
            </QuantumText>
          </View>
          <QuantumText variant="caption" color={theme.subtextColor}>
            Anomaly score: {metric.anomalyScore.toFixed(2)}
          </QuantumText>
        </QuantumCard>
      ))}

      {lowEndMode ? (
        <QuantumNotice tone="warning">Low-end mode active: animations, media, and sync cadence are optimized for constrained devices.</QuantumNotice>
      ) : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  heroCard: { gap: quantumSpace.lg },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.lg },
  heroCopy: { flex: 1, gap: quantumSpace.xs },
  heroActions: { flexDirection: 'row', gap: quantumSpace.sm },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.md },
  actionTile: { flexGrow: 1, flexBasis: '47%', minWidth: 148 },
  aalCard: { gap: quantumSpace.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: quantumSpace.md },
  metricRow: {
    flexDirection: 'row',
    gap: quantumSpace.sm,
    padding: quantumSpace.md,
    borderRadius: 12,
    backgroundColor: quantumColors.neutral800,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
})
