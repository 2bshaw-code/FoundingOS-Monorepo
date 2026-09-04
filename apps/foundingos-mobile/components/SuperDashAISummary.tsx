/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useAIAssistance } from '../lib/ai-assistance'

// Same real computation as the web version (packages/ui/src/superdash/SuperDashAISummary.tsx)
// -- computed entirely from data this screen already fetches and displays below (overview
// brandRows/anomalies, and real Guardian warnings). No new data source, no invented numbers.
export type SuperDashBrandRow = { brand: string; serviceLoad: number; previousServiceLoad: number; status: 'good' | 'watch' | 'risk' }
export type SuperDashAnomaly = { brand: string; signal: string; tone: 'good' | 'watch' | 'risk' }

type WhatMatters = { text: string; investigateLabel: string; investigateHref: string }
export type SuperDashAISummaryData = { dailySummary: string; whatChanged: string | null; whatMatters: WhatMatters | null }

export function computeSuperDashAISummary(brandRows: SuperDashBrandRow[], anomalies: SuperDashAnomaly[], guardianWarnings: string[]): SuperDashAISummaryData {
  const riskCount = brandRows.filter((row) => row.status === 'risk').length
  const watchCount = brandRows.filter((row) => row.status === 'watch').length

  let dailySummary: string
  if (riskCount > 0) {
    const watchNote = watchCount > 0 ? `, and ${watchCount} more worth watching` : ''
    dailySummary = `${riskCount} of ${brandRows.length} brands ${riskCount > 1 ? 'need' : 'needs'} attention right now${watchNote}.`
  } else if (watchCount > 0) {
    dailySummary = `Everything's stable — just ${watchCount} brand${watchCount > 1 ? 's' : ''} worth keeping an eye on.`
  } else {
    dailySummary = `All ${brandRows.length} brands are in great shape today — nothing needs your attention.`
  }

  let whatChanged: string | null = null
  if (brandRows.length > 0) {
    const biggest = brandRows.reduce((a, b) => (Math.abs(b.serviceLoad - b.previousServiceLoad) > Math.abs(a.serviceLoad - a.previousServiceLoad) ? b : a))
    const delta = biggest.serviceLoad - biggest.previousServiceLoad
    if (delta !== 0) {
      const direction = delta > 0 ? 'up' : 'down'
      whatChanged = `${biggest.brand}'s service load is ${direction} ${Math.abs(delta)} (from ${biggest.previousServiceLoad} to ${biggest.serviceLoad}) since the last check.`
    }
  }

  let whatMatters: WhatMatters | null = null
  if (guardianWarnings.length > 0) {
    whatMatters = { text: guardianWarnings[0], investigateLabel: 'Open Guardian', investigateHref: '/(app)/guardian' }
  } else if (anomalies.length > 0) {
    const topAnomaly = anomalies.find((anomaly) => anomaly.tone === 'risk') ?? anomalies[0]
    whatMatters = { text: `${topAnomaly.brand}: ${topAnomaly.signal}`, investigateLabel: 'View anomalies below', investigateHref: '' }
  } else {
    const worstBrand = brandRows.find((row) => row.status === 'risk') ?? brandRows.find((row) => row.status === 'watch')
    if (worstBrand) whatMatters = { text: `${worstBrand.brand} is flagged as ${worstBrand.status} right now.`, investigateLabel: 'View brand rows below', investigateHref: '' }
  }

  return { dailySummary, whatChanged, whatMatters }
}

export function SuperDashAISummary({ brandRows, anomalies, guardianWarnings, accent }: { brandRows: SuperDashBrandRow[]; anomalies: SuperDashAnomaly[]; guardianWarnings: string[]; accent: string }) {
  const [aiEnabled] = useAIAssistance()
  if (!aiEnabled) return null

  const summary = computeSuperDashAISummary(brandRows, anomalies, guardianWarnings)

  return (
    <View style={{ gap: 10 }}>
      <View style={[styles.card, { borderColor: accent }]}>
        <View style={[styles.badge, { backgroundColor: accent }]}><Text style={styles.badgeText}>AI</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Daily summary</Text>
          <Text style={styles.text}>{summary.dailySummary}</Text>
        </View>
      </View>

      {summary.whatChanged && (
        <View style={[styles.card, { borderColor: accent }]}>
          <View style={[styles.badge, { backgroundColor: accent }]}><Text style={styles.badgeText}>AI</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>What changed</Text>
            <Text style={styles.text}>{summary.whatChanged}</Text>
          </View>
        </View>
      )}

      {summary.whatMatters && (
        <View style={[styles.card, { borderColor: accent }]}>
          <View style={[styles.badge, { backgroundColor: accent }]}><Text style={styles.badgeText}>AI</Text></View>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={styles.label}>What matters</Text>
            <Text style={styles.text}>{summary.whatMatters.text}</Text>
            {summary.whatMatters.investigateHref ? (
              <Pressable style={[styles.cta, { backgroundColor: accent }]} onPress={() => router.push(summary.whatMatters!.investigateHref as any)}>
                <Text style={styles.ctaText}>Investigate — {summary.whatMatters.investigateLabel}</Text>
              </Pressable>
            ) : (
              <Text style={styles.hint}>{summary.whatMatters.investigateLabel} ↓</Text>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: 14, padding: 14, backgroundColor: '#11161f' },
  badge: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#071014', fontWeight: '900', fontSize: 11 },
  label: { color: '#b9c2cf', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 },
  text: { color: '#ffffff', fontSize: 14 },
  cta: { alignSelf: 'flex-start', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  ctaText: { color: '#071014', fontSize: 12, fontWeight: '700' },
  hint: { color: '#5b6472', fontSize: 12 },
})
