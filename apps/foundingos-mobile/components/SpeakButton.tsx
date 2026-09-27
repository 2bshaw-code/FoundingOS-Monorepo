/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Pressable, StyleSheet } from 'react-native'
import { setAutoSpeak, speak, stopSpeaking, useSpeech } from '../lib/speech'
import { QuantumText, quantumColors } from './QuantumUI'

export function SpeakButton({ text }: { text: string }) {
  const { speaking } = useSpeech(text)
  if (!text) return null
  return (
    <Pressable accessibilityLabel={speaking ? 'Stop reading' : 'Read aloud'} accessibilityRole="button" hitSlop={8} onPress={() => (speaking ? stopSpeaking() : speak(text))} style={[styles.button, speaking ? styles.on : null]}>
      <QuantumText variant="caption">{speaking ? '■ Stop' : '🔊 Listen'}</QuantumText>
    </Pressable>
  )
}

export function VoiceToggle() {
  const { auto } = useSpeech()
  return (
    <Pressable accessibilityLabel="Speak replies" accessibilityRole="switch" accessibilityState={{ checked: auto }} hitSlop={8} onPress={() => setAutoSpeak(!auto)} style={[styles.button, auto ? styles.on : null]}>
      <QuantumText variant="caption" color={auto ? '#E0F2FE' : quantumColors.neutral300}>{auto ? '🔊 Voice on' : '🔈 Voice off'}</QuantumText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: { alignSelf: 'flex-start', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(148,163,184,0.35)', paddingHorizontal: 10, paddingVertical: 4 },
  on: { borderColor: '#38BDF8', backgroundColor: 'rgba(56,189,248,0.14)' },
})
