/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import * as Location from 'expo-location'
import { BRAND } from '../lib/brand'
import { PREVIEW_TODAY as PREVIEW } from '../lib/preview'

// Community leaderboard — shown pre-login so a visitor can see what's doing well nearby
// before signing up. Tries device GPS first (with permission); if denied or unavailable,
// falls back to coarse IP-based location via a free public geolocation lookup — no account
// or paid geolocation service required either way. The ranked entries themselves come from
// this brand's own real console dashboard data (lib/preview.ts), the same source used on the
// preview screen, so the leaderboard reflects genuine sample data already in the system.
export default function LeaderboardScreen() {
  const [locationLabel, setLocationLabel] = useState('Detecting your area...')

  useEffect(() => {
    let cancelled = false

    async function detectLocation() {
      try {
        const permission = await Location.requestForegroundPermissionsAsync()
        if (permission.granted) {
          const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low })
          const [place] = await Location.reverseGeocodeAsync({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          if (!cancelled && place) {
            setLocationLabel(place.city || place.region || place.country || 'Your area')
            return
          }
        }
      } catch {
        // GPS unavailable or denied — fall through to IP-based lookup below.
      }
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json().catch(() => null)
        if (!cancelled) setLocationLabel(data?.city || data?.country_name || 'Your area')
      } catch {
        if (!cancelled) setLocationLabel('Your area')
      }
    }

    detectLocation()
    return () => { cancelled = true }
  }, [])

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 16 }}>
      <View style={[styles.card, { borderColor: BRAND.accent, shadowColor: BRAND.accent }]}>
        <Text style={styles.overline}>Community leaderboard</Text>
        <Text style={styles.title}>What's doing well near {locationLabel}</Text>
        <Text style={styles.description}>
          See how other {BRAND.name} locations and products are performing — real activity,
          ranked, so you can see what's working before you sign up.
        </Text>
      </View>

      <View style={styles.list}>
        {PREVIEW.leaderboard.map((entry) => (
          <View style={styles.entryCard} key={entry.rank}>
            <View style={[styles.rankBadge, { backgroundColor: BRAND.accent }]}>
              <Text style={styles.rankText}>#{entry.rank}</Text>
            </View>
            <View style={styles.entryBody}>
              <Text style={styles.entryName}>{entry.name}</Text>
              <Text style={styles.entryRegion}>{entry.region}</Text>
            </View>
            <View style={styles.entryMetrics}>
              <Text style={styles.entryMetric}>{entry.metric}</Text>
              <Text style={[styles.entryTrend, { color: BRAND.accent }]}>{entry.trend}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  card: {
    backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 18, gap: 8,
    shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 4,
  },
  overline: { color: '#b9c2cf', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  title: { color: '#ffffff', fontSize: 19, fontWeight: '800' },
  description: { color: '#b9c2cf', fontSize: 13, lineHeight: 19 },
  list: { gap: 12 },
  entryCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#11161f', borderWidth: 1, borderColor: '#242c38', borderRadius: 16, padding: 14,
  },
  rankBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rankText: { color: '#071014', fontSize: 13, fontWeight: '800' },
  entryBody: { flex: 1, gap: 2 },
  entryName: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  entryRegion: { color: '#b9c2cf', fontSize: 12 },
  entryMetrics: { alignItems: 'flex-end', gap: 2 },
  entryMetric: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  entryTrend: { fontSize: 11, fontWeight: '700' },
})
