/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useAIAssistance } from '../lib/ai-assistance'

// Global "AI Assistance: On/Off" switch — lives on the Settings screen. Turning this off
// hides onboarding welcomes, module hints, Guardian explanations, and the AI helper tab's
// guidance everywhere in this app; turning it back on restores all of it immediately.
export function AIAssistanceToggle({ accent }: { accent: string }) {
  const [enabled, setEnabled] = useAIAssistance()
  return (
    <Pressable style={styles.row} onPress={() => setEnabled(!enabled)}>
      <View style={styles.labels}>
        <Text style={styles.label}>AI Assistance</Text>
        <Text style={styles.sub}>Onboarding welcomes, module hints, Guardian explanations, and AI helpers</Text>
      </View>
      <View style={[styles.switchTrack, { backgroundColor: enabled ? accent : '#242c38' }]}>
        <View style={[styles.knob, enabled && styles.knobOn]} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#11161f', borderRadius: 16, padding: 16, gap: 12 },
  labels: { flex: 1 },
  label: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  sub: { color: '#b9c2cf', fontSize: 12, marginTop: 4 },
  switchTrack: { width: 52, height: 28, borderRadius: 999, padding: 3, justifyContent: 'center' },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#ffffff' },
  knobOn: { alignSelf: 'flex-end' },
})
