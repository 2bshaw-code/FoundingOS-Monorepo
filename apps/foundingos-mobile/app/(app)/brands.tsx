/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { BRANDS } from '../../lib/brands'
import { logout } from '../../lib/api'

// Real founder-facing brand directory — FoundingOS's own app is the founder's aggregated
// reporting console (see the Activity tab for real live cross-brand numbers), not a way to
// browse into each brand's own product. Each brand now has its own dedicated native app for
// that (retail-mobile, crypto-mobile, etc.), so this screen stays informational: real name,
// tagline, and core modules per brand, matching packages/config/src/index.ts exactly.
export default function DashboardScreen() {
  async function handleLogout() {
    await logout()
    router.replace('/')
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>One control room for every brand</Text>
        <Text style={styles.heroSubtitle}>
          See every brand at a glance. Each brand has its own app for day-to-day work.
        </Text>
      </View>

      {BRANDS.map((brand) => (
        <View key={brand.slug} style={[styles.card, { borderColor: brand.accent }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.dot, { backgroundColor: brand.accent }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{brand.name}</Text>
              <Text style={styles.cardSubtitle}>{brand.tagline}</Text>
            </View>
          </View>
          <View style={styles.moduleGrid}>
            {brand.modules.map((module) => (
              <View key={module} style={[styles.moduleChip, { borderColor: brand.accent }]}>
                <Text style={styles.moduleChipText}>{module}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05060a' },
  hero: { marginBottom: 8 },
  heroTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  heroSubtitle: { color: '#b9c2cf', fontSize: 14, marginTop: 4 },
  card: {
    gap: 12,
    backgroundColor: '#11161f',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  cardSubtitle: { color: '#b9c2cf', fontSize: 13, marginTop: 2 },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moduleChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  moduleChipText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  logoutButton: { marginTop: 12, marginBottom: 40, alignItems: 'center', padding: 14 },
  logoutText: { color: '#ff5470', fontWeight: '700' },
})
