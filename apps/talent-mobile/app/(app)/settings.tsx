/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { AIAssistanceToggle } from '../../components/AIAssistanceToggle'
import { BRAND } from '../../lib/brand'

// Real Settings screen — currently just the AI Assistance toggle, the one real global
// preference the app has right now. Respected by every AI surface in this app (onboarding
// welcome on Home, the module hint on every module screen, and the AI Actions tab).
export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <View style={styles.hero}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Control how FoundingOS helps you.</Text>
      </View>
      <AIAssistanceToggle accent={BRAND.accent} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  hero: { marginBottom: 4 },
  title: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#b9c2cf', fontSize: 14, marginTop: 4 },
})
