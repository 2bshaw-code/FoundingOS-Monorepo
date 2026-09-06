/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native'
import { useQuantumStore, OutboxItem } from '../../lib/store'
import { getAllOutboxItems, processOutboxSync } from '../../lib/outbox-sync'
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
  quantumSpace,
  useActiveQuantumTheme,
} from '../../components/QuantumUI'

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

  if (loading) return <QuantumLoadingScreen />

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={syncing} onRefresh={loadData} tintColor={theme.accent} />}>
      <QuantumCard accent={theme.accent}>
        <View style={styles.rowBetween}>
          <View style={styles.flex}>
            <QuantumText variant="overline" color={theme.accent}>
              Offline-first data plane
            </QuantumText>
            <QuantumText variant="h1">SQLite Outbox</QuantumText>
            <QuantumText color={theme.subtextColor}>Pending local actions sync to the server when connectivity is available.</QuantumText>
          </View>
          <QuantumNotice tone={isOnline ? 'success' : 'warning'}>{isOnline ? 'Online' : 'Offline'}</QuantumNotice>
        </View>

        <View style={styles.metricRow}>
          <QuantumMetric label="Pending" value={pendingSyncCount} tone="info" />
          <QuantumMetric label="Synced" value={items.filter((item) => item.status === 'synced').length} tone="good" />
          <QuantumMetric label="Failed" value={items.filter((item) => item.status === 'failed').length} tone="risk" />
        </View>

        {syncResult ? <QuantumNotice tone="success">{syncResult}</QuantumNotice> : null}
        <QuantumButton onPress={handleManualSync} disabled={syncing}>
          {syncing ? <ActivityIndicator color="#05060a" /> : 'Run sync worker'}
        </QuantumButton>
      </QuantumCard>

      <QuantumSectionHeader label="Outbox activity" />
      {items.length === 0 ? (
        <QuantumNotice>No offline actions have been queued yet.</QuantumNotice>
      ) : (
        items.map((item) => {
          const tone = item.status === 'synced' ? 'good' : item.status === 'failed' ? 'risk' : 'watch'
          const statusColor = getSemanticColor(tone)
          return (
            <QuantumCard key={item.id} accent={statusColor}>
              <View style={styles.rowBetween}>
                <QuantumText variant="h3">{item.actionType}</QuantumText>
                <QuantumText variant="caption" color={statusColor}>
                  {item.status.toUpperCase()}
                </QuantumText>
              </View>
              <QuantumText variant="caption" color={theme.subtextColor}>
                {item.brandSlug} · queued {new Date(item.createdAt).toLocaleTimeString()}
              </QuantumText>
              {item.errorMessage ? (
                <QuantumText variant="caption" color={getSemanticColor('risk')}>
                  {item.errorMessage}
                </QuantumText>
              ) : null}
            </QuantumCard>
          )
        })
      )}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.md },
  metricRow: { flexDirection: 'row', gap: quantumSpace.sm },
})
