/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, TextInput, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { BRAND } from '../../lib/brand'
import { fetchClinicFeed, type ClinicFeedResponse, type SupplyItem, type EquipmentItem } from '../../lib/clinic-feed'
import { getHealthActions, logRestock } from '../../lib/health-actions'
import { VitalsChart } from '../../components/VitalsChart'

const STATUS_COLOR: Record<string, string> = { good: '#00FF66', watch: '#FFDD00', low: '#ff5470', risk: '#ff5470' }
const STATUS_LABEL: Record<string, string> = { good: 'In stock', watch: 'Watch', low: 'Reorder now', risk: 'At risk' }

// Clinic Vitals — the "vital signs" of the clinic itself, not any one patient: bed/census
// capacity trend, medicine & vaccine stock levels, and cold-chain/equipment temperature and
// uptime. This is the staff-facing operations view every other brand console has (Fleet
// health for FoundLogistics, stock health for FoundRetail) applied to a health clinic.
export default function VitalsScreen() {
  const [feed, setFeed] = useState<ClinicFeedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const [restockingId, setRestockingId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [confirmedId, setConfirmedId] = useState<string | null>(null)
  const [localRestocked, setLocalRestocked] = useState<Record<string, number>>({})

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const [clinicFeed, local] = await Promise.all([fetchClinicFeed(), getHealthActions()])
      if (clinicFeed) {
        setFeed(clinicFeed)
      } else {
        setError('Could not load clinic vitals. Pull down to try again.')
      }
      const totals: Record<string, number> = {}
      for (const r of local.loggedRestocks) totals[r.supplyId] = (totals[r.supplyId] ?? 0) + r.quantity
      setLocalRestocked(totals)
    } catch {
      setError('Could not load clinic vitals. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function effectiveStock(item: SupplyItem): number {
    return item.stock + (localRestocked[item.id] ?? 0)
  }

  async function submitRestock(item: SupplyItem) {
    const quantity = Number(inputValue)
    if (!quantity) return
    await logRestock({ supplyId: item.id, supplyName: item.name, quantity })
    setConfirmedId(item.id)
    setRestockingId(null)
    setInputValue('')
    await load()
    setTimeout(() => setConfirmedId((current) => (current === item.id ? null : current)), 2500)
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  const censusSeries = feed?.queue.censusHistory.map((p) => p.value) ?? []

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 120}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Text style={styles.intro}>Clinic vitals — capacity, supply, and cold-chain status, pull down to refresh.</Text>
      {feed?.disclaimer ? <Text style={styles.disclaimer}>⚠ {feed.disclaimer}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {feed ? (
        <View style={[styles.card, { borderColor: BRAND.accent }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Bed census</Text>
            <Text style={[styles.cardValue, { color: '#33CCFF' }]}>{feed.queue.bedsOccupied}/{feed.queue.bedsTotal}</Text>
          </View>
          <VitalsChart data={censusSeries} color="#33CCFF" width={300} height={100} />
          <Text style={styles.metaLine}>{feed.queue.waitingNow} waiting now · avg wait {feed.queue.avgWaitMinutes} min · {feed.queue.seenToday} seen today</Text>
        </View>
      ) : null}

      <Text style={styles.sectionLabel}>Medicine & vaccine stock</Text>
      {(feed?.supplies ?? []).map((item) => {
        const stock = effectiveStock(item)
        const status = stock <= item.reorderLevel ? 'low' : stock <= item.reorderLevel * 1.5 ? 'watch' : 'good'
        return (
          <View key={item.id} style={[styles.card, { borderColor: BRAND.accent }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}{item.coldChain ? ' ❄️' : ''}</Text>
              <Text style={[styles.cardValue, { color: STATUS_COLOR[status] }]}>{stock} {item.unit}</Text>
            </View>
            <Text style={[styles.statusText, { color: STATUS_COLOR[status] }]}>{STATUS_LABEL[status]} · reorder at {item.reorderLevel}</Text>

            {restockingId === item.id ? (
              <View style={styles.loggingForm}>
                <TextInput
                  style={styles.input}
                  placeholder={`Quantity received (${item.unit})`}
                  placeholderTextColor="#5b6472"
                  keyboardType="numeric"
                  value={inputValue}
                  onChangeText={setInputValue}
                />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable style={[styles.formButton, { backgroundColor: BRAND.accent }]} onPress={() => submitRestock(item)}>
                    <Text style={styles.formButtonText}>Save restock</Text>
                  </Pressable>
                  <Pressable style={styles.formButtonOutline} onPress={() => setRestockingId(null)}>
                    <Text style={styles.formButtonOutlineText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                style={[styles.logButton, { borderColor: BRAND.accent }, confirmedId === item.id && { backgroundColor: BRAND.accent }]}
                onPress={() => setRestockingId(item.id)}
              >
                <Text style={[styles.logButtonText, confirmedId === item.id && { color: '#071014' }]}>
                  {confirmedId === item.id ? '✓ Restock noted' : 'Log a restock'}
                </Text>
              </Pressable>
            )}
          </View>
        )
      })}

      <Text style={styles.sectionLabel}>Cold-chain & equipment</Text>
      {(feed?.equipment ?? []).map((item: EquipmentItem) => (
        <View key={item.id} style={[styles.card, { borderColor: BRAND.accent }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={[styles.cardValue, { color: STATUS_COLOR[item.status] }]}>
              {item.tempC !== null ? `${item.tempC}°C` : `${item.uptimePercent}%`}
            </Text>
          </View>
          {item.tempHistory ? <VitalsChart data={item.tempHistory.map((p) => p.value)} color="#9933FF" width={300} height={80} /> : null}
          <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>{STATUS_LABEL[item.status]} · uptime {item.uptimePercent}%</Text>
        </View>
      ))}

      <Text style={styles.footnote}>Restocks logged here are recorded on this device only and are not yet synced to a live inventory system.</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  intro: { color: '#b9c2cf', fontSize: 13, marginBottom: 2 },
  disclaimer: { color: '#FFDD00', fontSize: 11, marginBottom: 4 },
  error: { color: '#ff5470', fontSize: 13 },
  sectionLabel: { color: '#ffffff', fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 6 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 14, gap: 10, alignItems: 'flex-start' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  cardTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  cardValue: { fontSize: 15, fontWeight: '800' },
  metaLine: { color: '#b9c2cf', fontSize: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },
  logButton: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'stretch', alignItems: 'center' },
  logButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  loggingForm: { gap: 8, alignSelf: 'stretch' },
  input: { backgroundColor: '#0b0e14', borderRadius: 10, borderWidth: 1, borderColor: '#242c38', color: '#ffffff', paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  formButton: { flex: 1, borderRadius: 999, paddingVertical: 10, alignItems: 'center' },
  formButtonText: { color: '#071014', fontWeight: '800', fontSize: 13 },
  formButtonOutline: { flex: 1, borderRadius: 999, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#5b6472' },
  formButtonOutlineText: { color: '#b9c2cf', fontWeight: '700', fontSize: 13 },
  footnote: { color: '#5b6472', fontSize: 11, textAlign: 'center', marginTop: 4, marginBottom: 20 },
})
