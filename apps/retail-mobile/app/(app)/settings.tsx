/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { AIAssistanceToggle } from '../../components/AIAssistanceToggle'
import { BRAND } from '../../lib/brand'

// Real Settings screen — currently just the AI Assistance toggle, the one real global
// preference the app has right now. Respected by every AI surface in this app (onboarding
// welcome on Home, the module hint on every module screen, and the AI Actions tab).
// Short, plain-language steps only — no images, no long paragraphs — kept light and easy
// to use on low-end/low-data devices (this app is Africa-ready).
const WHATSAPP_SETUP_STEPS = [
  'Your WhatsApp Business number (new or existing).',
  'A verified Meta Business Account (Meta\u2019s own requirement, not ours).',
  'Your WhatsApp Business Account ID + access token, added here in Settings.',
  'Approve your message templates (we provide ready-made ones).',
  'Go live \u2014 FoundAI reads and replies automatically, with you always able to step in.',
]

export default function SettingsScreen() {
  const [setupOpen, setSetupOpen] = useState(false)
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <View style={styles.hero}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Control how FoundingOS helps you.</Text>
      </View>
      <AIAssistanceToggle accent={BRAND.accent} />

      <Pressable style={[styles.aboutLink, { borderColor: BRAND.accent }]} onPress={() => setSetupOpen((open) => !open)}>
        <Text style={[styles.aboutLinkText, { color: BRAND.accent }]}>
          {setupOpen ? 'Hide what we need to connect WhatsApp' : 'What we need to connect your WhatsApp'}
        </Text>
      </Pressable>
      {setupOpen ? (
        <View style={styles.setupList}>
          {WHATSAPP_SETUP_STEPS.map((step, index) => (
            <View style={styles.setupRow} key={step}>
              <Text style={[styles.setupIndex, { color: BRAND.accent }]}>{index + 1}</Text>
              <Text style={styles.setupText}>{step}</Text>
            </View>
          ))}
        </View>
      ) : null}
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
  setupList: { gap: 8 },
  setupRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  setupIndex: { fontSize: 13, fontWeight: '700' },
  setupText: { flex: 1, color: '#b9c2cf', fontSize: 13, lineHeight: 18 },
})
