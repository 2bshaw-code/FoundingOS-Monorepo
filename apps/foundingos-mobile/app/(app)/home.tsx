/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, Path, Polygon, Polyline, Text as SvgText } from 'react-native-svg'
import { router } from 'expo-router'
import { BRANDS } from '../../lib/brands'
import { useQuantumStore } from '../../lib/store'
import { enqueueOutboxAction } from '../../lib/outbox-sync'
import { QuantumScreen } from '../../components/QuantumUI'

const KPI_DATA = [
  { label: 'Revenue', value: '£18.6k', change: '+12.4%', color: '#22C55E', points: [42, 47, 45, 54, 58, 66, 74] },
  { label: 'Orders', value: '142', change: '+8.1%', color: '#38BDF8', points: [35, 39, 46, 43, 51, 59, 64] },
  { label: 'Cash collected', value: '£12.4k', change: '+9.7%', color: '#F59E0B', points: [38, 42, 48, 46, 55, 61, 68] },
  { label: 'Risks resolved', value: '87%', change: '+6.4%', color: '#E879F9', points: [44, 47, 52, 57, 61, 66, 73] },
] as const

const PRIORITIES = [
  { id: 'FIN-18', area: 'Finance', title: '3 overdue invoices', impact: '£4,820 delayed', owner: 'Finance', severity: 'High', color: '#FB7185' },
  { id: 'LOG-07', area: 'Logistics', title: 'Delivery exception', impact: 'Customer waiting', owner: 'Samira', severity: 'High', color: '#FB7185' },
  { id: 'RET-22', area: 'Retail', title: 'Low stock cover', impact: '4 days remaining', owner: 'Operations', severity: 'Medium', color: '#FBBF24' },
  { id: 'HR-09', area: 'Workforce', title: 'Offer expires soon', impact: '2 days remaining', owner: 'Ava', severity: 'Medium', color: '#FBBF24' },
] as const

const WORKSPACES = BRANDS.filter((workspace) => workspace.slug !== 'foundingos')
const FILTERS = ['All', 'High', 'Medium'] as const

function MiniTrend({ points, color }: { points: readonly number[]; color: string }) {
  const maximum = Math.max(...points)
  const minimum = Math.min(...points)
  const range = maximum - minimum || 1
  const coordinates = points.map((point, index) => `${(index / (points.length - 1)) * 120},${38 - ((point - minimum) / range) * 32}`).join(' ')
  return <Svg width="100%" height={42} viewBox="0 0 120 42"><Polygon points={`0,42 ${coordinates} 120,42`} fill={color} opacity={0.14} /><Polyline points={coordinates} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></Svg>
}

function DispatchMap() {
  return (
    <Svg width="100%" height={190} viewBox="0 0 360 190">
      <Path d="M-10 42 C72 8 118 88 182 52 S284 18 380 56" stroke="#24364A" strokeWidth={7} fill="none" strokeLinecap="round" />
      <Path d="M22 178 C84 134 122 158 174 106 S276 56 350 18" stroke="#24364A" strokeWidth={7} fill="none" strokeLinecap="round" />
      <Path d="M42 151 C102 122 146 146 191 100 S275 66 326 48" stroke="#38BDF8" strokeWidth={5} fill="none" strokeDasharray="9 7" strokeLinecap="round" />
      <Path d="M191 100 C229 126 255 139 294 135" stroke="#FB7185" strokeWidth={4} fill="none" strokeDasharray="5 6" />
      <Circle cx={42} cy={151} r={7} fill="#07101C" stroke="#22C55E" strokeWidth={4} />
      <Circle cx={191} cy={100} r={8} fill="#07101C" stroke="#38BDF8" strokeWidth={4} />
      <Circle cx={294} cy={135} r={9} fill="#07101C" stroke="#FB7185" strokeWidth={4} />
      <Circle cx={326} cy={48} r={7} fill="#07101C" stroke="#22C55E" strokeWidth={4} />
      <SvgText x={54} y={147} fill="#CBD5E1" fontSize={10} fontWeight="700">Depot</SvgText>
      <SvgText x={203} y={96} fill="#CBD5E1" fontSize={10} fontWeight="700">VAN-04</SvgText>
      <SvgText x={243} y={158} fill="#FB7185" fontSize={10} fontWeight="700">Exception</SvgText>
      <SvgText x={286} y={34} fill="#CBD5E1" fontSize={10} fontWeight="700">Leeds · 16:08</SvgText>
    </Svg>
  )
}

export default function FounderCommandDeck() {
  const role = useQuantumStore((state) => state.role)
  const activeWorkspaceSlug = useQuantumStore((state) => state.activeBrandSlug)
  const setActiveWorkspace = useQuantumStore((state) => state.setActiveBrand)
  const setCommandBarOpen = useQuantumStore((state) => state.setCommandBarOpen)
  const pendingSyncCount = useQuantumStore((state) => state.pendingSyncCount)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [refreshing, setRefreshing] = useState(false)
  const [notice, setNotice] = useState('')
  const priorities = PRIORITIES.filter((item) => filter === 'All' || item.severity === filter)
  const activeWorkspace = BRANDS.find((workspace) => workspace.slug === activeWorkspaceSlug) ?? BRANDS[0]

  const runAction = async (action: string) => {
    await enqueueOutboxAction(`COMMAND_${action.toUpperCase().replaceAll(' ', '_')}`, activeWorkspaceSlug, { action, source: 'founder-command-deck' })
    setNotice(`${action} is ready in the secure action queue.`)
    setTimeout(() => setNotice(''), 3500)
  }

  return (
    <QuantumScreen
      contentStyle={styles.screen}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 700) }} tintColor="#38BDF8" />}
    >
      <View style={styles.commandHeader}>
        <View>
          <Text style={styles.product}>FOUNDINGOS</Text>
          <Text style={styles.title}>Founder Command Deck</Text>
          <Text style={styles.subtitle}>{role} view · Demo environment · Updated now</Text>
        </View>
        <Pressable style={styles.profile}><Text style={styles.profileText}>BS</Text><View style={styles.online} /></Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.workspaceRail}>
        <Pressable style={[styles.workspaceTab, activeWorkspaceSlug === 'foundingos' && styles.workspaceTabActive]} onPress={() => setActiveWorkspace('foundingos')}>
          <Text style={styles.workspaceTabLabel}>Overview</Text>
        </Pressable>
        {WORKSPACES.map((workspace) => (
          <Pressable key={workspace.slug} style={[styles.workspaceTab, activeWorkspaceSlug === workspace.slug && { borderColor: workspace.accent, backgroundColor: `${workspace.accent}18` }]} onPress={() => setActiveWorkspace(workspace.slug)}>
            <View style={[styles.workspaceDot, { backgroundColor: workspace.accent }]} /><Text style={styles.workspaceTabLabel}>{workspace.name.replace(' Workspace', '')}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.executiveBrief}>
        <View style={styles.briefCopy}><Text style={styles.briefEyebrow}>{activeWorkspace.name.toUpperCase()}</Text><Text style={styles.briefTitle}>Revenue is growing. Cash collection and one delivery exception need your attention.</Text><Text style={styles.briefText}>The business is operating normally overall. Resolve the overdue invoices first, then recover the blocked delivery before today’s customer window closes.</Text></View>
        <View style={styles.healthScore}><Text style={styles.healthValue}>82</Text><Text style={styles.healthLabel}>Health score</Text><Text style={styles.healthChange}>+6 this week</Text></View>
      </View>

      {notice ? <View style={styles.notice}><Text style={styles.noticeText}>{notice}</Text></View> : null}

      <View style={styles.commandStrip}>
        <Pressable style={styles.whatsappAction} onPress={() => setCommandBarOpen(true)}><Text style={styles.commandIcon}>●</Text><View><Text style={styles.commandLabel}>Ask FoundingOS</Text><Text style={styles.commandHint}>Type or speak a WhatsApp-style command</Text></View></Pressable>
        {['Create order', 'Collect payment', 'Approve'].map((action) => <Pressable key={action} style={styles.compactAction} onPress={() => runAction(action)}><Text style={styles.compactActionText}>{action}</Text></Pressable>)}
      </View>

      <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>Business performance</Text><Text style={styles.sectionCaption}>Seven-day trend · simulated data</Text></View><Text style={styles.live}>● LIVE</Text></View>
      <View style={styles.kpiGrid}>
        {KPI_DATA.map((metric) => (
          <View key={metric.label} style={[styles.kpiPanel, { borderTopColor: metric.color }]}>
            <View style={styles.rowBetween}><Text style={styles.kpiLabel}>{metric.label}</Text><Text style={[styles.kpiChange, { color: metric.color }]}>{metric.change}</Text></View>
            <Text style={styles.kpiValue}>{metric.value}</Text>
            <MiniTrend points={metric.points} color={metric.color} />
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>Priority ledger</Text><Text style={styles.sectionCaption}>Decisions ranked by business impact</Text></View><View style={styles.filterRow}>{FILTERS.map((value) => <Pressable key={value} style={[styles.filter, filter === value && styles.filterActive]} onPress={() => setFilter(value)}><Text style={[styles.filterText, filter === value && styles.filterTextActive]}>{value}</Text></Pressable>)}</View></View>
        <View style={styles.tableHeader}><Text style={[styles.tableHeading, styles.priorityColumn]}>PRIORITY</Text><Text style={styles.tableHeading}>IMPACT</Text><Text style={styles.tableHeading}>OWNER</Text></View>
        {priorities.map((item) => <Pressable key={item.id} style={styles.tableRow} onPress={() => runAction(`Review ${item.id}`)}><View style={[styles.priorityColumn, styles.priorityCell]}><View style={[styles.severity, { backgroundColor: item.color }]} /><View><Text style={styles.rowTitle}>{item.title}</Text><Text style={styles.rowMeta}>{item.area} · {item.id}</Text></View></View><Text style={styles.rowImpact}>{item.impact}</Text><View><Text style={styles.rowOwner}>{item.owner}</Text><Text style={[styles.rowSeverity, { color: item.color }]}>{item.severity}</Text></View></Pressable>)}
      </View>

      <View style={styles.panel}>
        <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>Logistics command map</Text><Text style={styles.sectionCaption}>3 vehicles reporting · 1 route exception</Text></View><Pressable onPress={() => router.push('/module-detail/logistics/deliveries')}><Text style={styles.openLink}>Open dispatch →</Text></Pressable></View>
        <View style={styles.mapCanvas}><DispatchMap /><View style={styles.mapLegend}><Text style={styles.mapLive}>● Active route</Text><Text style={styles.mapAlert}>● Exception</Text><Text style={styles.mapStop}>● Stop</Text></View></View>
      </View>

      <View style={styles.bottomGrid}>
        <View style={[styles.panel, styles.bottomPanel]}><Text style={styles.sectionTitle}>Approvals</Text>{['Invoice batch · £4,820', 'Campaign · Founder Friday', 'Stock transfer · 18 units'].map((item, index) => <Pressable key={item} style={styles.approvalRow} onPress={() => runAction(`Approve ${item}`)}><Text style={styles.approvalIndex}>0{index + 1}</Text><Text style={styles.approvalText}>{item}</Text><Text style={styles.approvalAction}>Review</Text></Pressable>)}</View>
        <View style={[styles.panel, styles.bottomPanel]}><Text style={styles.sectionTitle}>Live activity</Text>{['Payment received · £912.40', 'Delivery assigned · VAN-07', 'Interview booked · 10:30', 'WhatsApp order · ORD-1054'].map((item, index) => <View key={item} style={styles.activityRow}><View style={[styles.activityDot, { backgroundColor: KPI_DATA[index].color }]} /><View><Text style={styles.activityText}>{item}</Text><Text style={styles.activityTime}>{index * 3 + 1}m ago · Event Feed</Text></View></View>)}</View>
      </View>

      {pendingSyncCount ? <Text style={styles.syncText}>{pendingSyncCount} action(s) waiting for secure sync</Text> : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 110, gap: 14, maxWidth: 1100, width: '100%', alignSelf: 'center' },
  commandHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  product: { color: '#38BDF8', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#F8FAFC', fontSize: 24, lineHeight: 29, fontWeight: '900', letterSpacing: -0.6 },
  subtitle: { color: '#64748B', fontSize: 11, marginTop: 2 },
  profile: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#132236', borderWidth: 1, borderColor: '#28405A' },
  profileText: { color: '#E2E8F0', fontWeight: '900' },
  online: { position: 'absolute', right: -1, bottom: -1, width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#07101C' },
  workspaceRail: { gap: 8, paddingVertical: 2 },
  workspaceTab: { height: 34, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#203247', backgroundColor: '#0B1726' },
  workspaceTabActive: { borderColor: '#38BDF8', backgroundColor: '#0C263A' },
  workspaceDot: { width: 7, height: 7, borderRadius: 4 },
  workspaceTabLabel: { color: '#CBD5E1', fontSize: 11, fontWeight: '800' },
  executiveBrief: { flexDirection: 'row', gap: 16, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: '#25405C', backgroundColor: '#0A1B2D' },
  briefCopy: { flex: 1, gap: 5 },
  briefEyebrow: { color: '#38BDF8', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  briefTitle: { color: '#F8FAFC', fontSize: 17, lineHeight: 22, fontWeight: '900' },
  briefText: { color: '#94A3B8', fontSize: 11, lineHeight: 16 },
  healthScore: { width: 86, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#25405C' },
  healthValue: { color: '#22C55E', fontSize: 34, fontWeight: '900' },
  healthLabel: { color: '#CBD5E1', fontSize: 9, fontWeight: '800' },
  healthChange: { color: '#22C55E', fontSize: 9, marginTop: 3 },
  notice: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#22C55E55', backgroundColor: '#22C55E12' },
  noticeText: { color: '#86EFAC', fontSize: 11, fontWeight: '700' },
  commandStrip: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  whatsappAction: { minWidth: 240, flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, backgroundColor: '#0D2B24', borderWidth: 1, borderColor: '#25D36666' },
  commandIcon: { color: '#25D366', fontSize: 18 },
  commandLabel: { color: '#F8FAFC', fontSize: 12, fontWeight: '900' },
  commandHint: { color: '#7EA397', fontSize: 9 },
  compactAction: { justifyContent: 'center', paddingHorizontal: 14, minHeight: 48, borderRadius: 9, backgroundColor: '#111E2E', borderWidth: 1, borderColor: '#263A50' },
  compactActionText: { color: '#CBD5E1', fontSize: 10, fontWeight: '800' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  sectionTitle: { color: '#F1F5F9', fontSize: 14, fontWeight: '900' },
  sectionCaption: { color: '#64748B', fontSize: 9, marginTop: 2 },
  live: { color: '#22C55E', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  kpiPanel: { minWidth: 150, flexBasis: '47%', flexGrow: 1, padding: 13, borderRadius: 10, borderWidth: 1, borderColor: '#1D3045', borderTopWidth: 3, backgroundColor: '#0B1624' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  kpiLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '700' },
  kpiChange: { fontSize: 10, fontWeight: '900' },
  kpiValue: { color: '#F8FAFC', fontSize: 25, fontWeight: '900', marginTop: 4 },
  panel: { padding: 14, borderRadius: 11, borderWidth: 1, borderColor: '#1D3045', backgroundColor: '#0B1624' },
  filterRow: { flexDirection: 'row', gap: 5 },
  filter: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 6, backgroundColor: '#111E2E' },
  filterActive: { backgroundColor: '#38BDF8' },
  filterText: { color: '#94A3B8', fontSize: 9, fontWeight: '800' },
  filterTextActive: { color: '#06101C' },
  tableHeader: { flexDirection: 'row', paddingVertical: 10, marginTop: 8, borderBottomWidth: 1, borderBottomColor: '#1D3045' },
  tableHeading: { flex: 1, color: '#52667E', fontSize: 8, fontWeight: '900', letterSpacing: .7 },
  priorityColumn: { flex: 1.6 },
  tableRow: { flexDirection: 'row', alignItems: 'center', minHeight: 56, borderBottomWidth: 1, borderBottomColor: '#142538' },
  priorityCell: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  severity: { width: 4, height: 30, borderRadius: 2 },
  rowTitle: { color: '#E2E8F0', fontSize: 10, fontWeight: '800' },
  rowMeta: { color: '#52667E', fontSize: 8, marginTop: 2 },
  rowImpact: { flex: 1, color: '#CBD5E1', fontSize: 9, fontWeight: '700' },
  rowOwner: { color: '#CBD5E1', fontSize: 9, fontWeight: '700' },
  rowSeverity: { fontSize: 8, fontWeight: '900', marginTop: 2 },
  openLink: { color: '#38BDF8', fontSize: 10, fontWeight: '800' },
  mapCanvas: { marginTop: 10, overflow: 'hidden', borderRadius: 9, backgroundColor: '#07101C' },
  mapLegend: { position: 'absolute', left: 10, bottom: 8, flexDirection: 'row', gap: 12, padding: 7, borderRadius: 6, backgroundColor: '#07101CDD' },
  mapLive: { color: '#38BDF8', fontSize: 8, fontWeight: '700' },
  mapAlert: { color: '#FB7185', fontSize: 8, fontWeight: '700' },
  mapStop: { color: '#22C55E', fontSize: 8, fontWeight: '700' },
  bottomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bottomPanel: { flexGrow: 1, flexBasis: '47%', minWidth: 260 },
  approvalRow: { flexDirection: 'row', alignItems: 'center', gap: 9, minHeight: 46, borderBottomWidth: 1, borderBottomColor: '#142538' },
  approvalIndex: { color: '#52667E', fontSize: 9, fontWeight: '900' },
  approvalText: { flex: 1, color: '#CBD5E1', fontSize: 10, fontWeight: '700' },
  approvalAction: { color: '#38BDF8', fontSize: 9, fontWeight: '900' },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 9, minHeight: 46, borderBottomWidth: 1, borderBottomColor: '#142538' },
  activityDot: { width: 7, height: 7, borderRadius: 4 },
  activityText: { color: '#CBD5E1', fontSize: 10, fontWeight: '700' },
  activityTime: { color: '#52667E', fontSize: 8, marginTop: 2 },
  syncText: { color: '#FBBF24', textAlign: 'center', fontSize: 9, fontWeight: '700' },
})
