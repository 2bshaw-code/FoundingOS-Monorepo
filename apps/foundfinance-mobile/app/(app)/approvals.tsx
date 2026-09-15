/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { fetchCashflow, type PendingApproval } from '../../lib/cashflow'
import { getDecisions, recordDecision, getScannedApprovals, type ApprovalDecision, type ScannedApproval } from '../../lib/approvals'
import { BRAND } from '../../lib/brand'

const KIND_ICON: Record<PendingApproval['kind'], string> = { invoice: '🧾', expense: '💳' }

// Real approvals queue — pending invoices/expenses awaiting review, sourced from this brand's
// own deterministic demo-mode feed (GET ${GROWTH_CONSOLE_URL}/api/finance/cashflow) plus any
// receipts scanned on-device via the AI scanner (lib/approvals.ts). There is no real
// payments/AP backend behind FoundFinance's demo mode, so approve/reject records a real,
// persisted, on-device decision — the same honest "action noted" pattern already used by
// module-detail — never a fabricated claim that a payment was made.
export default function ApprovalsScreen() {
  const [items, setItems] = useState<PendingApproval[]>([])
  const [scanned, setScanned] = useState<ScannedApproval[]>([])
  const [decisions, setDecisions] = useState<Record<string, ApprovalDecision>>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const [feed, localDecisions, localScans] = await Promise.all([fetchCashflow(), getDecisions(), getScannedApprovals()])
      if (feed) setItems(feed.pendingApprovals)
      else setError('Could not load approvals. Pull down to try again.')
      setDecisions(localDecisions)
      setScanned(localScans)
    } catch {
      setError('Could not load approvals. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleDecision(id: string, decision: 'approved' | 'rejected') {
    setBusyId(id)
    try {
      const record = await recordDecision(id, decision)
      setDecisions((current) => ({ ...current, [id]: record }))
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  const allItems: PendingApproval[] = [...scanned, ...items]
  const queued = allItems.filter((item) => !decisions[item.id])
  const decided = allItems.filter((item) => decisions[item.id])

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Text style={styles.intro}>Pending review for {BRAND.name} — approvals are recorded locally on this device, not sent to a real payments backend.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {queued.length === 0 ? <Text style={styles.empty}>Nothing waiting on you — all caught up.</Text> : null}

      {queued.map((item) => (
        <View key={item.id} style={[styles.card, { borderColor: BRAND.accent }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.icon}>{KIND_ICON[item.kind]}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.supplier}>{item.supplier}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
            <Text style={[styles.amount, { color: BRAND.accent }]}>${item.amountUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}</Text>
          </View>
          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionButton, styles.rejectButton]}
              disabled={busyId === item.id}
              onPress={() => handleDecision(item.id, 'rejected')}
            >
              <Text style={styles.rejectText}>✕ Reject</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.approveButton]}
              disabled={busyId === item.id}
              onPress={() => handleDecision(item.id, 'approved')}
            >
              <Text style={styles.approveText}>✓ Approve</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {decided.length > 0 ? (
        <>
          <Text style={styles.sectionLabel}>Recently decided</Text>
          {decided.map((item) => {
            const decision = decisions[item.id]
            return (
              <View key={item.id} style={styles.decidedRow}>
                <Text style={styles.decidedSupplier}>{item.supplier}</Text>
                <Text style={decision.decision === 'approved' ? styles.approvedTag : styles.rejectedTag}>
                  {decision.decision === 'approved' ? '✓ Approved' : '✕ Rejected'} (noted locally)
                </Text>
              </View>
            )
          })}
        </>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  intro: { color: '#b9c2cf', fontSize: 13 },
  error: { color: '#ff5470', fontSize: 13 },
  empty: { color: '#b9c2cf', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { fontSize: 22 },
  supplier: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  category: { color: '#b9c2cf', fontSize: 12 },
  amount: { fontSize: 18, fontWeight: '800' },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionButton: { flex: 1, borderRadius: 999, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5 },
  rejectButton: { borderColor: '#ff5470' },
  rejectText: { color: '#ff5470', fontWeight: '700', fontSize: 13 },
  approveButton: { borderColor: '#00CC66' },
  approveText: { color: '#00CC66', fontWeight: '700', fontSize: 13 },
  sectionLabel: { color: '#b9c2cf', fontSize: 13, fontWeight: '600', marginTop: 8 },
  decidedRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1c2430' },
  decidedSupplier: { color: '#b9c2cf', fontSize: 13 },
  approvedTag: { color: '#00CC66', fontSize: 12, fontWeight: '700' },
  rejectedTag: { color: '#ff5470', fontSize: 12, fontWeight: '700' },
})
