/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, RefreshControl, Pressable, TextInput, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { authedFetch } from '../../lib/api'
import { BRAND, GROWTH_CONSOLE_URL } from '../../lib/brand'

// Real Distribution screen — books shipments into FoundLogistics (our internal carrier) via
// this brand's own /api/distribution, and tracks them on a real map (react-native-maps —
// Apple Maps on iOS, no API key). Mirrors the console's Distribution module 1:1.

const TRANSPORT_TYPES = ['chilled', 'standard', 'fragile']
const ORIGIN = { label: 'Workforce.Health central pharmacy store — Manchester', lat: 53.4808, lng: -2.2426 }

type RateOption = { optionName: string; estimatedCost: number; estimatedHours: number; reliabilityScore: number; recommended: boolean }
type Shipment = {
  id: string
  reference: string
  transportType: string
  status: string
  destinationName: string
  destinationLat: number | null
  destinationLng: number | null
  eta: string | null
}

export default function DistributionScreen() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [rateOptions, setRateOptions] = useState<RateOption[]>([])
  const [form, setForm] = useState({
    reference: '',
    destinationName: '',
    destinationAddress: '',
    destinationLat: '',
    destinationLng: '',
    transportType: TRANSPORT_TYPES[0] as string,
    weightKg: '1',
  })

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const res = await authedFetch(`${GROWTH_CONSOLE_URL}/api/distribution`)
      if (res.ok) {
        const data = await res.json()
        setShipments(data.shipments ?? [])
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const bookShipment = async () => {
    const destLat = Number(form.destinationLat)
    const destLng = Number(form.destinationLng)
    if (!form.reference || !form.destinationName || !form.destinationAddress || !Number.isFinite(destLat) || !Number.isFinite(destLng)) {
      Alert.alert('Missing info', 'Reference, destination name/address and a valid destination lat/lng are required.')
      return
    }
    const res = await authedFetch(`${GROWTH_CONSOLE_URL}/api/distribution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference: form.reference,
        transportType: form.transportType,
        originAddress: ORIGIN.label,
        origin: { lat: ORIGIN.lat, lng: ORIGIN.lng },
        destinationName: form.destinationName,
        destinationAddress: form.destinationAddress,
        destination: { lat: destLat, lng: destLng },
        weightKg: Number(form.weightKg) || 1,
      }),
    })
    const result = await res.json().catch(() => null)
    if (result?.quotes) setRateOptions(result.quotes)
    setForm({ reference: '', destinationName: '', destinationAddress: '', destinationLat: '', destinationLng: '', transportType: TRANSPORT_TYPES[0], weightKg: '1' })
    load(true)
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  const stopsWithCoords = shipments.filter((s) => s.destinationLat != null && s.destinationLng != null)
  const region = { latitude: ORIGIN.lat, longitude: ORIGIN.lng, latitudeDelta: 0.6, longitudeDelta: 0.6 }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Distribution</Text>
        <Text style={styles.heroSubtitle}>Book shipments with Operations.Logistics and track them to delivery.</Text>
      </View>

      <View style={styles.mapCard}>
        <MapView style={styles.map} initialRegion={region}>
          <Marker coordinate={{ latitude: ORIGIN.lat, longitude: ORIGIN.lng }} title={ORIGIN.label} pinColor="#2563eb" />
          {stopsWithCoords.map((s) => (
            <Marker
              key={s.id}
              coordinate={{ latitude: s.destinationLat as number, longitude: s.destinationLng as number }}
              title={s.destinationName}
              description={s.reference}
              pinColor="#f59e0b"
            />
          ))}
        </MapView>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Book a shipment</Text>
        <TextInput style={styles.input} placeholder="Order reference" placeholderTextColor="#5b6472" value={form.reference} onChangeText={(v) => setForm({ ...form, reference: v })} />
        <TextInput style={styles.input} placeholder="Destination (customer name)" placeholderTextColor="#5b6472" value={form.destinationName} onChangeText={(v) => setForm({ ...form, destinationName: v })} />
        <TextInput style={styles.input} placeholder="Destination address" placeholderTextColor="#5b6472" value={form.destinationAddress} onChangeText={(v) => setForm({ ...form, destinationAddress: v })} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Dest. lat" placeholderTextColor="#5b6472" keyboardType="numeric" value={form.destinationLat} onChangeText={(v) => setForm({ ...form, destinationLat: v })} />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Dest. lng" placeholderTextColor="#5b6472" keyboardType="numeric" value={form.destinationLng} onChangeText={(v) => setForm({ ...form, destinationLng: v })} />
        </View>
        <View style={styles.transportRow}>
          {TRANSPORT_TYPES.map((t) => (
            <Pressable
              key={t}
              onPress={() => setForm({ ...form, transportType: t })}
              style={[styles.transportChip, { borderColor: BRAND.accent, backgroundColor: form.transportType === t ? BRAND.accent : 'transparent' }]}
            >
              <Text style={{ color: form.transportType === t ? '#0b0e14' : '#ffffff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' }}>{t}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput style={styles.input} placeholder="Weight (kg)" placeholderTextColor="#5b6472" keyboardType="numeric" value={form.weightKg} onChangeText={(v) => setForm({ ...form, weightKg: v })} />
        <Pressable style={[styles.bookButton, { backgroundColor: BRAND.accent }]} onPress={bookShipment}>
          <Text style={styles.bookButtonText}>Get AI rate & book</Text>
        </Pressable>

        {rateOptions.length > 0 && (
          <View style={{ marginTop: 10, gap: 4 }}>
            {rateOptions.map((o) => (
              <Text key={o.optionName} style={styles.rateLine}>
                {o.recommended ? '★ ' : ''}
                {o.optionName} · £{o.estimatedCost} · {o.estimatedHours}h · {Math.round(o.reliabilityScore * 100)}% reliable
              </Text>
            ))}
          </View>
        )}
      </View>

      <Text style={styles.modulesLabel}>Shipments</Text>
      {shipments.length === 0 ? (
        <Text style={styles.empty}>No shipments booked yet.</Text>
      ) : (
        shipments.map((s) => (
          <View key={s.id} style={styles.shipmentCard}>
            <Text style={styles.shipmentTitle}>
              {s.reference} — {s.destinationName}
            </Text>
            <Text style={styles.shipmentSubtitle}>
              {s.transportType} · {s.status.replaceAll('_', ' ')}{s.eta ? ` · ETA ${new Date(s.eta).toLocaleString()}` : ''}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  hero: { marginBottom: 4 },
  heroTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  heroSubtitle: { color: '#b9c2cf', fontSize: 14, marginTop: 4 },
  empty: { color: '#b9c2cf', fontSize: 14 },
  mapCard: { height: 220, borderRadius: 16, overflow: 'hidden' },
  map: { width: '100%', height: '100%' },
  formCard: { backgroundColor: '#11161f', borderRadius: 16, padding: 14, gap: 8 },
  formTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  input: { backgroundColor: '#0b0e14', borderWidth: 1, borderColor: '#242c38', borderRadius: 10, padding: 10, color: '#ffffff', fontSize: 13 },
  transportRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  transportChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  bookButton: { borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  bookButtonText: { color: '#0b0e14', fontWeight: '800', fontSize: 14 },
  rateLine: { color: '#b9c2cf', fontSize: 12 },
  modulesLabel: { color: '#b9c2cf', fontSize: 13, fontWeight: '600', marginTop: 4 },
  shipmentCard: { backgroundColor: '#11161f', borderRadius: 12, padding: 12 },
  shipmentTitle: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  shipmentSubtitle: { color: '#b9c2cf', fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
})
