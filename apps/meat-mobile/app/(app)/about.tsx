/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { BRAND } from '../../lib/brand'
import { QuantumSphere } from '../../components/QuantumSphere'

const SECTIONS = [
  {
    icon: '\u25C8',
    label: 'Our story',
    text: 'FoundingOS started with a simple observation: growing businesses hit the same wall \u2014 too many disconnected tools, no single source of truth, and no time left to actually run the business. We built one platform that connects every brand, every console, and every workflow.',
  },
  {
    icon: '\u2727',
    label: 'Our mission',
    text: 'Give every operator one connected system and one guide who knows exactly what they need \u2014 whether that is retail staff, meat suppliers, recruiters, finance teams, or founders.',
  },
  {
    icon: '\u25EF',
    label: 'Built for WhatsApp-first businesses',
    text: 'FoundMeat is designed around how message-based businesses actually operate \u2014 offline-friendly, mobile-first, and ready for teams anywhere in the world.',
  },
  {
    icon: '\u2726',
    label: 'Meet FoundAI',
    text: 'FoundAI handles onboarding, setup, training, workflows, tasks, and questions instantly \u2014 for FoundMeat and every other brand in FoundingOS.',
  },
]

// Mirrors the web /about page (packages/ui/src/index.tsx) — same story/mission/how-we-work
// copy as FoundingOS Quantum, framed for FoundMeat. Uses the same Quantum sphere + glow-card
// visual language as the rest of the app (see app/index.tsx, QuantumSphere) rather than a flat
// text dump, while staying light: no images, no video, no heavy animation loops.
export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 16 }}>
      <View style={styles.hero}>
        <QuantumSphere size={72} accent={BRAND.accent} />
        <Text style={styles.title}>About FoundMeat</Text>
        <Text style={styles.subtitle}>Part of FoundingOS — the operating system for message-based businesses.</Text>
      </View>

      <View style={[styles.taglineCard, { borderColor: BRAND.accent, shadowColor: BRAND.accent }]}>
        <Text style={styles.taglineText}>
          FoundMeat is one of the connected brands inside FoundingOS. Supply chain clarity, cut to order.
        </Text>
      </View>

      {SECTIONS.map((section) => (
        <View key={section.label} style={[styles.card, { borderColor: BRAND.accent, shadowColor: BRAND.accent }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardIcon, { color: BRAND.accent }]}>{section.icon}</Text>
            <Text style={[styles.cardLabel, { color: BRAND.accent }]}>{section.label}</Text>
          </View>
          <Text style={styles.cardText}>{section.text}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  hero: { alignItems: 'center', gap: 10, marginBottom: 4 },
  title: { color: '#ffffff', fontSize: 22, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#b9c2cf', fontSize: 14, textAlign: 'center', paddingHorizontal: 12 },
  taglineCard: {
    backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16,
    shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 4,
  },
  taglineText: { color: '#dfe6ee', fontSize: 14, lineHeight: 20 },
  card: {
    backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 8,
    shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardIcon: { fontSize: 16 },
  cardLabel: { fontSize: 14, fontWeight: '800' },
  cardText: { color: '#b9c2cf', fontSize: 13, lineHeight: 19 },
})
