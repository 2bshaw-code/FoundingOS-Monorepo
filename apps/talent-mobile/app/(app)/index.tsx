/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { BRAND, GROWTH_CONSOLE_URL, STARTER_CONSOLE_URL } from '../../lib/brand'
import { logout, getHandoffUrl } from '../../lib/api'

// Real home screen — shows this brand's actual core modules (from packages/config's real
// registry, not a placeholder list) and opens the real live console via a real SSO handoff,
// inside the app (expo-web-browser, an in-app sheet) rather than switching out to Safari.
export default function HomeScreen() {
  async function handleLogout() {
    await logout()
    router.replace('/')
  }

  async function openConsole(consoleUrl: string) {
    const url = await getHandoffUrl(consoleUrl)
    await WebBrowser.openBrowserAsync(url, { controlsColor: BRAND.accent, toolbarColor: '#05060a' })
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{BRAND.name}</Text>
        <Text style={styles.heroSubtitle}>{BRAND.tagline}</Text>
      </View>

      <Pressable style={[styles.tierCard, { borderColor: BRAND.accent }]} onPress={() => openConsole(GROWTH_CONSOLE_URL)}>
        <Text style={styles.tierTitle}>Growth Console</Text>
        <Text style={styles.tierSubtitle}>The full workspace — every module, live.</Text>
      </Pressable>

      <Pressable style={[styles.tierCard, { borderColor: BRAND.accent }]} onPress={() => openConsole(STARTER_CONSOLE_URL)}>
        <Text style={styles.tierTitle}>Starter Console</Text>
        <Text style={styles.tierSubtitle}>A lighter workspace to get going fast.</Text>
      </Pressable>

      <Text style={styles.modulesLabel}>Core modules</Text>
      <View style={styles.moduleGrid}>
        {BRAND.modules.map((module) => (
          <View key={module} style={[styles.moduleChip, { borderColor: BRAND.accent }]}>
            <Text style={styles.moduleChipText}>{module}</Text>
          </View>
        ))}
      </View>

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
  tierCard: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16 },
  tierTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  tierSubtitle: { color: '#b9c2cf', fontSize: 13, marginTop: 4 },
  modulesLabel: { color: '#b9c2cf', fontSize: 13, fontWeight: '600', marginTop: 8 },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moduleChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  moduleChipText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  logoutButton: { marginTop: 12, marginBottom: 40, alignItems: 'center', padding: 14 },
  logoutText: { color: '#ff5470', fontWeight: '700' },
})
