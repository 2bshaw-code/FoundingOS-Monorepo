/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { View, Text, Pressable, ScrollView, ActivityIndicator, StyleSheet, Linking } from 'react-native'
import { router } from 'expo-router'
import { getToken } from '../lib/api'
import { BRAND } from '../lib/brand'
import { PREVIEW_TODAY as PREVIEW } from '../lib/preview'
import { QuantumSphere } from '../components/QuantumSphere'

// Public pre-login preview — the first thing anyone sees, no account needed. Shows this
// brand's own real highlights, a real AI-engineered insight, and a link to the community
// leaderboard (see lib/preview.ts, sourced from this brand's actual console dashboard data)
// so a visitor can see exactly what they'd be signing up for before creating an account.
// Ends in two real actions: Sign in (existing tester/admin accounts) or Request access via
// WhatsApp (there is no public self-serve signup endpoint yet, so this is a real WhatsApp
// deep link to the FoundingOS team, consistent with this whole product being WhatsApp-first).
// If a session already exists, skips straight past this screen.
export default function PreviewScreen() {
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    getToken().then((token) => {
      if (token) router.replace('/(app)/home')
      setCheckingSession(false)
    })
  }, [])

  if (checkingSession) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 48, gap: 20 }}>
      <View style={styles.hero}>
        <QuantumSphere size={72} accent={BRAND.accent} />
        <Text style={styles.title}>{BRAND.name}</Text>
        <Text style={styles.subtitle}>{PREVIEW.heroLabel}</Text>
      </View>

      <View style={[styles.hookCard, { borderColor: BRAND.accent, shadowColor: BRAND.accent }]}>
        <Text style={styles.hookText}>{PREVIEW.hook}</Text>
      </View>

      <View style={[styles.insightCard, { borderColor: BRAND.accent }]}>
        <Text style={styles.insightLabel}>Quantum AI</Text>
        <Text style={styles.insightText}>{PREVIEW.insight}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{PREVIEW.sectionLabel}</Text>
        <View style={styles.list}>
          {PREVIEW.items.map((item) => (
            <View style={styles.itemCard} key={item.title}>
              <View style={[styles.itemTag, { backgroundColor: BRAND.accent }]}>
                <Text style={styles.itemTagText}>{item.tag}</Text>
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemMeta}>{item.meta}</Text>
            </View>
          ))}
        </View>
      </View>

      <Pressable style={[styles.leaderboardLink, { borderColor: BRAND.accent }]} onPress={() => router.push('/leaderboard')}>
        <Text style={[styles.leaderboardLinkText, { color: BRAND.accent }]}>See what's doing well near you ›</Text>
      </Pressable>

      <View style={styles.ctaGroup}>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: BRAND.accent, shadowColor: BRAND.accent }]}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.primaryButtonText}>Sign in</Text>
        </Pressable>
        <Pressable
          style={[styles.secondaryButton, { borderColor: BRAND.accent }]}
          onPress={() => Linking.openURL(`https://wa.me/447700000000?text=${encodeURIComponent(`I'd like access to ${BRAND.name}`)}`)}
        >
          <Text style={[styles.secondaryButtonText, { color: BRAND.accent }]}>Request access on WhatsApp</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  hero: { alignItems: 'center', gap: 10 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#b9c2cf', fontSize: 14, textAlign: 'center', paddingHorizontal: 12 },
  hookCard: {
    backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16,
    shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 5,
  },
  hookText: { color: '#ffffff', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  insightCard: {
    backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 6,
  },
  insightLabel: { color: '#b9c2cf', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  insightText: { color: '#ffffff', fontSize: 13, lineHeight: 19 },
  section: { gap: 12 },
  sectionLabel: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  list: { gap: 12 },
  itemCard: {
    backgroundColor: '#11161f', borderWidth: 1, borderColor: '#242c38', borderRadius: 16, padding: 16, gap: 6,
  },
  itemTag: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 2 },
  itemTagText: { color: '#071014', fontSize: 11, fontWeight: '800' },
  itemTitle: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  itemMeta: { color: '#b9c2cf', fontSize: 13 },
  leaderboardLink: { borderWidth: 1.5, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  leaderboardLinkText: { fontWeight: '800', fontSize: 14 },
  ctaGroup: { gap: 12, marginTop: 8, marginBottom: 24 },
  primaryButton: {
    borderRadius: 999, paddingVertical: 16, alignItems: 'center',
    shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  primaryButtonText: { color: '#071014', fontWeight: '800', fontSize: 16 },
  secondaryButton: { borderRadius: 999, borderWidth: 1.5, paddingVertical: 15, alignItems: 'center' },
  secondaryButtonText: { fontWeight: '800', fontSize: 15 },
})
