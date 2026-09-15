/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { AIAssistanceToggle } from '../../components/AIAssistanceToggle'
import { BRAND } from '../../lib/brand'

// Real Settings screen — the AI Assistance toggle plus links out to the About hub's own
// dedicated WhatsApp connection screen (app/(app)/about/whatsapp.tsx), which now owns that
// content so it isn't duplicated in two places.
export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 120}}>
      <View style={styles.hero}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Control how FoundingOS helps you.</Text>
      </View>
      <AIAssistanceToggle accent={BRAND.accent} />

      <Pressable style={[styles.aboutLink, { borderColor: BRAND.accent }]} onPress={() => router.push('/(app)/about/whatsapp')}>
        <Text style={[styles.aboutLinkText, { color: BRAND.accent }]}>What we need to connect your WhatsApp</Text>
      </Pressable>
      <Pressable style={[styles.aboutLink, { borderColor: BRAND.accent }]} onPress={() => router.push('/(app)/about')}>
        <Text style={[styles.aboutLinkText, { color: BRAND.accent }]}>About {BRAND.name}</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  hero: { marginBottom: 4 },
  title: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#b9c2cf', fontSize: 14, marginTop: 4 },
  aboutLink: { borderWidth: 1, borderRadius: 12, padding: 14, alignItems: 'center' },
  aboutLinkText: { fontSize: 14, fontWeight: '700' },
})
