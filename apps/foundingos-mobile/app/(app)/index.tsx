/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ScrollView, View, Text, Pressable, StyleSheet, Linking } from 'react-native'
import { router } from 'expo-router'
import { BRANDS } from '../../lib/brands'
import { logout } from '../../lib/api'

// Real dashboard — the brand list every FoundingOS user sees first. Names, colours, and
// taglines match the real web ecosystem exactly (see lib/brands.ts). Tapping a brand opens
// its real, live console in the device browser — this app doesn't yet have native screens for
// each brand's own modules, so it's honest about that rather than faking a screen with no
// real data behind it.
export default function DashboardScreen() {
  async function handleLogout() {
    await logout()
    router.replace('/')
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>One control room for every brand</Text>
        <Text style={styles.heroSubtitle}>Tap a brand to open its real console.</Text>
      </View>

      {BRANDS.map((brand) => (
        <Pressable
          key={brand.slug}
          style={[styles.card, { borderColor: brand.accent }]}
          onPress={() => Linking.openURL(`https://${brand.slug}-console.foundingos.com`)}
        >
          <View style={[styles.dot, { backgroundColor: brand.accent }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{brand.name}</Text>
            <Text style={styles.cardSubtitle}>{brand.tagline}</Text>
          </View>
          <Text style={[styles.arrow, { color: brand.accent }]}>›</Text>
        </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#11161f',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  cardSubtitle: { color: '#b9c2cf', fontSize: 13, marginTop: 2 },
  arrow: { fontSize: 22, fontWeight: '700' },
  logoutButton: { marginTop: 12, marginBottom: 40, alignItems: 'center', padding: 14 },
  logoutText: { color: '#ff5470', fontWeight: '700' },
})
