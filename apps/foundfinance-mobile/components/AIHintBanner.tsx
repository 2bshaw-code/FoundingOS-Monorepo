/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useAIAssistance } from '../lib/ai-assistance'

// Small, friendly AI hint for the top of a module screen — real recommended action, real
// "Do this for me" (calls straight into the screen's own existing action-tap handler, no
// fabricated automation). Respects the AI Assistance toggle.
export function AIHintBanner({ accent, description, recommendedAction, onDoThisForMe }: { accent: string; description: string; recommendedAction: string; onDoThisForMe: () => void }) {
  const [enabled] = useAIAssistance()
  if (!enabled) return null
  return (
    <View style={[styles.banner, { borderColor: accent }]}>
      <View style={[styles.badge, { backgroundColor: accent }]}><Text style={styles.badgeText}>AI</Text></View>
      <View style={styles.body}>
        <Text style={styles.text}>{description}</Text>
        <Pressable style={[styles.cta, { backgroundColor: accent }]} onPress={onDoThisForMe}>
          <Text style={styles.ctaText}>Do this for me — {recommendedAction}</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: 14, padding: 12, backgroundColor: '#11161f' },
  badge: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#071014', fontWeight: '900', fontSize: 11 },
  body: { flex: 1, gap: 8 },
  text: { color: '#ffffff', fontSize: 13 },
  cta: { alignSelf: 'flex-start', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  ctaText: { color: '#071014', fontSize: 12, fontWeight: '700' },
})
