/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { BRAND } from '../../lib/brand'

// Mirrors the web /about page (packages/ui/src/index.tsx) — same story/mission/how-we-work
// copy as FoundingOS Quantum, framed for FoundFinance. Kept plain-text, no images/animation,
// so it stays light and easy to use on low-end/low-data devices.
export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <View style={styles.hero}>
        <Text style={styles.title}>About FoundFinance</Text>
        <Text style={styles.subtitle}>Part of FoundingOS — the operating system for message-based businesses.</Text>
      </View>

      <Text style={styles.body}>
        FoundFinance is one of the connected brands inside FoundingOS. Cashflow clarity, every day.
      </Text>

      <View style={[styles.card, { borderColor: BRAND.accent }]}>
        <Text style={[styles.cardLabel, { color: BRAND.accent }]}>Our story</Text>
        <Text style={styles.cardText}>
          FoundingOS started with a simple observation: growing businesses hit the same wall — too many disconnected tools, no single source of truth, and no time left to actually run the business. We built one platform that connects every brand, every console, and every workflow.
        </Text>
      </View>

      <View style={[styles.card, { borderColor: BRAND.accent }]}>
        <Text style={[styles.cardLabel, { color: BRAND.accent }]}>Our mission</Text>
        <Text style={styles.cardText}>
          Give every operator one connected system and one guide who knows exactly what they need — whether that's retail staff, meat suppliers, recruiters, finance teams, or founders.
        </Text>
      </View>

      <View style={[styles.card, { borderColor: BRAND.accent }]}>
        <Text style={[styles.cardLabel, { color: BRAND.accent }]}>Built for WhatsApp-first businesses</Text>
        <Text style={styles.cardText}>
          FoundFinance is designed around how message-based businesses actually operate — offline-friendly, mobile-first, and ready for teams anywhere in the world.
        </Text>
      </View>

      <View style={[styles.card, { borderColor: BRAND.accent }]}>
        <Text style={[styles.cardLabel, { color: BRAND.accent }]}>Meet FoundAI</Text>
        <Text style={styles.cardText}>
          FoundAI handles onboarding, setup, training, workflows, tasks, and questions instantly — for FoundFinance and every other brand in FoundingOS.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  hero: { marginBottom: 4 },
  title: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#b9c2cf', fontSize: 14, marginTop: 4 },
  body: { color: '#dfe6ee', fontSize: 14, lineHeight: 20 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 14, padding: 16, gap: 6 },
  cardLabel: { fontSize: 13, fontWeight: '700' },
  cardText: { color: '#b9c2cf', fontSize: 13, lineHeight: 19 },
})
