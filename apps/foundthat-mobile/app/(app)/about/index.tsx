/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { BRAND } from '../../../lib/brand'
import { AI_SCANNER } from '../../../lib/ai-scanner'
import { QuantumSphere } from '../../../components/QuantumSphere'

const MENU = [
  {
    key: 'scanner',
    icon: '\u25C9',
    title: AI_SCANNER.title,
    subtitle: 'Your paid AI bolt-on \u2014 try it now',
    route: '/(app)/about/scanner',
    highlight: true,
  },
  {
    key: 'story',
    icon: '\u25C8',
    title: 'Our story & mission',
    subtitle: 'Why FoundThat exists',
    route: '/(app)/about/story',
  },
  {
    key: 'whatsapp',
    icon: '\u25EF',
    title: 'Connect your WhatsApp',
    subtitle: 'What we need to go live',
    route: '/(app)/about/whatsapp',
  },
]

// Premium landing hub, not a flat text dump: sphere + title, then a short menu of tappable
// destinations (AI bolt-on demo, story, WhatsApp setup) that each open their own focused
// screen. Mirrors how the rest of this app already navigates (Home -> module-detail).
export default function AboutHubScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <QuantumSphere size={84} accent={BRAND.accent} />
        <Text style={styles.title}>FoundThat</Text>
        <Text style={styles.subtitle}>Part of FoundingOS \u2014 the operating system for message-based businesses.</Text>
      </View>

      <View style={styles.menu}>
        {MENU.map((item) => (
          <Pressable
            key={item.key}
            style={[styles.menuItem, { borderColor: BRAND.accent, shadowColor: BRAND.accent }, item.highlight && { backgroundColor: BRAND.accent }]}
            onPress={() => router.push(item.route as never)}
          >
            <Text style={[styles.menuIcon, { color: item.highlight ? '#071014' : BRAND.accent }]}>{item.icon}</Text>
            <View style={styles.menuBody}>
              <Text style={[styles.menuTitle, item.highlight && styles.menuTitleDark]}>{item.title}</Text>
              <Text style={[styles.menuSubtitle, item.highlight && styles.menuSubtitleDark]}>{item.subtitle}</Text>
            </View>
            <Text style={[styles.menuArrow, { color: item.highlight ? '#071014' : BRAND.accent }]}>{'\u203A'}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942', padding: 20, gap: 24 },
  hero: { alignItems: 'center', gap: 12, marginTop: 12 },
  title: { color: '#ffffff', fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#b9c2cf', fontSize: 14, textAlign: 'center', paddingHorizontal: 16 },
  menu: { gap: 12 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#11161f', borderWidth: 1, borderRadius: 18, padding: 16,
    shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 4,
  },
  menuIcon: { fontSize: 20, width: 24, textAlign: 'center' },
  menuBody: { flex: 1, gap: 2 },
  menuTitle: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  menuTitleDark: { color: '#071014' },
  menuSubtitle: { color: '#b9c2cf', fontSize: 12 },
  menuSubtitleDark: { color: '#0b2a1c' },
  menuArrow: { fontSize: 22, fontWeight: '700' },
})
