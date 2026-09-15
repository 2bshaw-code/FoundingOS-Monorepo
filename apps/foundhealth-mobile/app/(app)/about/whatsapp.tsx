/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { BRAND } from '../../../lib/brand'

// Short, plain-language steps only — no images, no long paragraphs — kept light and easy
// to use on low-end/low-data devices (this app is Africa-ready).
const WHATSAPP_SETUP_STEPS = [
  'Your WhatsApp Business number (new or existing).',
  'A verified Meta Business Account (Meta\u2019s own requirement, not ours).',
  'Your WhatsApp Business Account ID + access token, added in Settings.',
  'Approve your message templates (we provide ready-made ones).',
  'Go live \u2014 FoundAI reads and replies automatically, with you always able to step in.',
]

export default function WhatsAppSetupScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 16 }}>
      <View style={[styles.card, { borderColor: BRAND.accent, shadowColor: BRAND.accent }]}>
        <Text style={styles.title}>What we need to connect your WhatsApp</Text>
        <View style={styles.setupList}>
          {WHATSAPP_SETUP_STEPS.map((step, index) => (
            <View style={styles.setupRow} key={step}>
              <View style={[styles.setupIndexBadge, { backgroundColor: BRAND.accent }]}>
                <Text style={styles.setupIndexText}>{index + 1}</Text>
              </View>
              <Text style={styles.setupText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  card: {
    backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 18, gap: 14,
    shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 4,
  },
  title: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  setupList: { gap: 12 },
  setupRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  setupIndexBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  setupIndexText: { color: '#071014', fontSize: 12, fontWeight: '800' },
  setupText: { flex: 1, color: '#b9c2cf', fontSize: 13, lineHeight: 19 },
})
