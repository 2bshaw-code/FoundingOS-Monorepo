/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { View, Text, Pressable, StyleSheet } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { getHandoffUrl } from '../../lib/api'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'

const SUPERDASH_URL = 'https://console.foundingos.com/superdashboard'

// Real access to the real SuperDashboard — cross-brand intelligence, brand performance
// matrix, quantum sync layer, insight heatmap, pulse map, and revenue/upgrade paths, the
// same live page every web admin session sees at console.foundingos.com/superdashboard.
// Opens via the real SSO handoff, in-app (expo-web-browser), so the founder's existing
// session (tester or admin) carries straight in — no separate login.
export default function SuperDashScreen() {
  async function open() {
    const url = await getHandoffUrl(SUPERDASH_URL)
    await WebBrowser.openBrowserAsync(url, { controlsColor: FOUNDINGOS_ACCENT, toolbarColor: '#05060a' })
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>SuperDashboard</Text>
        <Text style={styles.subtitle}>
          Cross-brand intelligence: performance matrix, live sync layer, risk heatmap,
          brand signals, pulse map, and revenue &amp; upgrade paths — all in one real,
          live view.
        </Text>
      </View>

      <Pressable style={[styles.button, { backgroundColor: FOUNDINGOS_ACCENT }]} onPress={open}>
        <Text style={styles.buttonText}>Open SuperDashboard</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05060a', padding: 16, justifyContent: 'center', gap: 20 },
  hero: { alignItems: 'center', gap: 8 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#b9c2cf', fontSize: 14, textAlign: 'center', paddingHorizontal: 12 },
  button: { borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  buttonText: { color: '#071014', fontWeight: '800', fontSize: 15 },
})
