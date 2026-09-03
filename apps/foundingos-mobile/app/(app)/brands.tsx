/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { BRANDS } from '../../lib/brands'
import { logout, getHandoffUrl } from '../../lib/api'

// Real founder-facing brand directory — FoundingOS's own app is the founder's aggregated
// reporting console (see the Activity tab for real live cross-brand numbers), not a way to
// browse into each brand's own product. Each brand now has its own dedicated native app for
// that (retail-mobile, crypto-mobile, etc.). Tapping the card body drills into that brand's
// own real activity detail (see app/brand-detail/[slug].tsx); tapping an individual module
// chip opens that brand's real, live module page (e.g. real Inventory/Customers/Orders
// views already built for FoundRetail) via the SSO handoff, in-app.
//
// Route note: this screen lives at app/(app)/brands.tsx rather than app/(app)/index.tsx —
// naming it "index" inside the (app) group previously collided with the top-level
// app/index.tsx login screen (an unnamed group folder contributes no path segment, so both
// resolved to the same "/" route), which silently broke router.replace('/') / dismissTo('/')
// from here since the router considered you already at the destination.
export default function DashboardScreen() {
  async function handleLogout() {
    await logout()
    router.dismissTo('/')
  }

  async function openModule(slug: string, accent: string, module: string) {
    const moduleId = module.toLowerCase().replaceAll(' ', '-')
    const consoleUrl = `https://${slug}-console.foundingos.com/modules/${moduleId}`
    const url = await getHandoffUrl(consoleUrl)
    await WebBrowser.openBrowserAsync(url, { controlsColor: accent, toolbarColor: '#05060a' })
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
        <Pressable
          key={brand.slug}
          style={[styles.card, { borderColor: brand.accent }]}
          onPress={() => router.push(`/brand-detail/${brand.slug}`)}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.dot, { backgroundColor: brand.accent }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{brand.name}</Text>
              <Text style={styles.cardSubtitle}>{brand.tagline}</Text>
            </View>
            <Text style={[styles.arrow, { color: brand.accent }]}>›</Text>
          </View>
          <View style={styles.moduleGrid}>
            {brand.modules.map((module) => (
              <Pressable
                key={module}
                style={[styles.moduleChip, { borderColor: brand.accent }]}
                onPress={() => openModule(brand.slug, brand.accent, module)}
              >
                <Text style={styles.moduleChipText}>{module}</Text>
              </Pressable>
            ))}
          </View>
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
  arrow: { fontSize: 22, fontWeight: '700' },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moduleChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  moduleChipText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  logoutButton: { marginTop: 12, marginBottom: 100, alignItems: 'center', padding: 14 },
  logoutText: { color: '#ff5470', fontWeight: '700' },
})
