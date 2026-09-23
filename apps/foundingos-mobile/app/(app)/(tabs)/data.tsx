/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native'
import { useQuantumStore, OutboxItem } from '../../../lib/store'
import { getAllOutboxItems, processOutboxSync } from '../../../lib/outbox-sync'
import {
  QuantumButton,
  QuantumCard,
  QuantumEmptyState,
  QuantumMetric,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumSkeletonList,
  QuantumText,
  getSemanticColor,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../../components/QuantumUI'

function formatQueuedTime(value: number) {
  return new Date(value).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })
}

export default function DataScreen() {
  const isOnline = useQuantumStore((state) => state.isOnline)
  const pendingSyncCount = useQuantumStore((state) => state.pendingSyncCount)
  const theme = useActiveQuantumTheme()
  const [items, setItems] = useState<OutboxItem[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState('')

  const loadData = useCallback(async () => {
    try {
      const allItems = await getAllOutboxItems()
      setItems(allItems)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleManualSync = async () => {
    setSyncing(true)
    const { synced, failed } = await processOutboxSync()
    setSyncing(false)
    setSyncResult(`Synced ${synced} · Failed ${failed}`)
    await loadData()
  }

  const pendingItems = useMemo(() => items.filter((item) => item.status === 'pending' || item.status === 'failed'), [items])
  const syncedItems = useMemo(() => items.filter((item) => item.status === 'synced'), [items])
  const failedItems = useMemo(() => items.filter((item) => item.status === 'failed'), [items])
  const latestFailure = failedItems[0]

  if (loading) {
    return (
      <QuantumScreen>
        <QuantumText variant="overline" color={theme.accent}>Offline-first data plane</QuantumText>
        <QuantumSkeletonList count={3} />
      </QuantumScreen>
    )
  }

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={syncing} onRefresh={loadData} tintColor={theme.accent} />}>
      <QuantumCard accent={theme.accent}>
        <View style={styles.rowBetween}>
          <View style={styles.flex}>
            <QuantumText variant="overline" color={theme.accent}>Offline-first data plane</QuantumText>
            <QuantumText variant="h1">Data & Offline Outbox</QuantumText>
            <QuantumText color={theme.subtextColor}>Track what is waiting to sync, what already landed, and what needs manual attention.</QuantumText>
          </View>
          <QuantumNotice tone={isOnline ? 'success' : 'warning'}>{isOnline ? 'Online' : 'Offline'}</QuantumNotice>
        </View>

        <View style={styles.metricRow}>
          <QuantumMetric label="Pending" value={pendingSyncCount} tone="info" />
          <QuantumMetric label="Synced" value={syncedItems.length} tone="good" />
          <QuantumMetric label="Failed" value={failedItems.length} tone="risk" />
        </View>

        {syncResult ? <QuantumNotice tone={failedItems.length ? 'warning' : 'success'}>{syncResult}</QuantumNotice> : null}
        <QuantumButton onPress={handleManualSync} disabled={syncing}>
          {syncing ? <ActivityIndicator color="#05060a" /> : 'Run sync worker'}
        </QuantumButton>
      </QuantumCard>

      <QuantumCard accent={failedItems.length ? '#FF5470' : theme.accent}>
        <QuantumText variant="h3">Conflict surface</QuantumText>
        {latestFailure ? (
          <>
            <QuantumText>{latestFailure.actionType} is blocked and needs a retry.</QuantumText>
            <QuantumText variant="caption" color={getSemanticColor('risk')}>
              {latestFailure.errorMessage || 'The last sync attempt failed without a detailed server message.'}
            </QuantumText>
          </>
        ) : (
          <QuantumNotice tone="success">No failed syncs are waiting for manual intervention.</QuantumNotice>
        )}
      </QuantumCard>

      <QuantumSectionHeader label="Needs sync" />
      {pendingItems.length === 0 ? (
        <QuantumEmptyState glyph="✓" title="Nothing waiting to sync" subtitle="Offline actions queued on this device will show up here." />
      ) : (
        pendingItems.map((item) => {
          const tone = item.status === 'failed' ? 'risk' : 'watch'
          const statusColor = getSemanticColor(tone)
          return (
            <QuantumCard key={item.id} accent={statusColor}>
              <View style={styles.rowBetween}>
                <QuantumText variant="h3" style={styles.flex}>{item.actionType}</QuantumText>
                <QuantumText variant="caption" color={statusColor}>{item.status.toUpperCase()}</QuantumText>
              </View>
              <QuantumText variant="caption" color={theme.subtextColor}>{item.brandSlug} · queued {formatQueuedTime(item.createdAt)}</QuantumText>
              {item.errorMessage ? <QuantumText variant="caption" color={getSemanticColor('risk')}>{item.errorMessage}</QuantumText> : null}
            </QuantumCard>
          )
        })
      )}

      <QuantumSectionHeader label="Synced ledger" />
      {syncedItems.length === 0 ? (
        <QuantumEmptyState glyph="◇" title="No synced actions yet" subtitle="Actions that finish syncing to the server will be recorded here." />
      ) : (
        syncedItems.slice(0, 12).map((item) => (
          <QuantumCard key={item.id} accent={getSemanticColor('good')}>
            <View style={styles.rowBetween}>
              <QuantumText variant="h3" style={styles.flex}>{item.actionType}</QuantumText>
              <QuantumText variant="caption" color={getSemanticColor('good')}>SYNCED</QuantumText>
            </View>
            <QuantumText variant="caption" color={theme.subtextColor}>{item.brandSlug} · {formatQueuedTime(item.createdAt)}</QuantumText>
          </QuantumCard>
        ))
      )}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.md },
  metricRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
})
