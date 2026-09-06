/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { StyleSheet, View } from 'react-native'
import { useAIAssistance } from '../lib/ai-assistance'
import { QuantumCard, QuantumText, quantumColors, quantumRadius, quantumSpace } from './QuantumUI'

export function AIAssistanceToggle({ accent }: { accent: string }) {
  const [enabled, setEnabled] = useAIAssistance()
  return (
    <QuantumCard accent={enabled ? accent : undefined}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <QuantumText variant="h3">AI Assistance</QuantumText>
          <QuantumText variant="caption">Onboarding, module hints, Guardian explanations, and contextual help.</QuantumText>
        </View>
        <View style={[styles.switchTrack, { backgroundColor: enabled ? accent : quantumColors.neutral700 }]} onTouchEnd={() => setEnabled(!enabled)}>
          <View style={[styles.knob, enabled ? styles.knobOn : null]} />
        </View>
      </View>
    </QuantumCard>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: quantumSpace.md },
  copy: { flex: 1, gap: quantumSpace.xs },
  switchTrack: { width: 52, height: 28, borderRadius: quantumRadius.pill, padding: 3, justifyContent: 'center' },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: quantumColors.neutral0 },
  knobOn: { alignSelf: 'flex-end' },
})
