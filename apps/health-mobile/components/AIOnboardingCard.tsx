/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useAIAssistance, hasSeenOnboarding, markOnboardingSeen } from '../lib/ai-assistance'

// Real "first time on this screen" welcome — child-level clarity, explains what the screen
// does, offers one real "Do this for me" action (real navigation/real function, never
// fabricated). Seen-state is on-device (SecureStore), scoped per brandKey so each brand/
// screen combination is welcomed once, independently.
export function AIOnboardingCard({ accent, brandKey, brandName, description, actionLabel, onDoThisForMe }: { accent: string; brandKey: string; brandName: string; description: string; actionLabel?: string; onDoThisForMe?: () => void }) {
  const [enabled] = useAIAssistance()
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (!enabled) return
    hasSeenOnboarding(brandKey).then(setDismissed)
  }, [enabled, brandKey])

  if (!enabled || dismissed) return null

  const dismiss = () => {
    markOnboardingSeen(brandKey)
    setDismissed(true)
  }

  return (
    <View style={[styles.card, { borderColor: accent }]}>
      <View style={[styles.badge, { backgroundColor: accent }]}><Text style={styles.badgeText}>AI</Text></View>
      <View style={styles.body}>
        <Text style={styles.title}>Welcome to {brandName}!</Text>
        <Text style={styles.text}>{description}</Text>
        <View style={styles.actions}>
          {actionLabel && onDoThisForMe && (
            <Pressable
              style={[styles.cta, { backgroundColor: accent }]}
              onPress={() => {
                onDoThisForMe()
                dismiss()
              }}
            >
              <Text style={styles.ctaText}>Do this for me — {actionLabel}</Text>
            </Pressable>
          )}
          <Pressable style={styles.dismiss} onPress={dismiss}>
            <Text style={styles.dismissText}>Got it, thanks</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: 16, padding: 14, backgroundColor: '#11161f' },
  badge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#071014', fontWeight: '900', fontSize: 11 },
  body: { flex: 1, gap: 8 },
  title: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  text: { color: '#b9c2cf', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  cta: { borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  ctaText: { color: '#071014', fontSize: 12, fontWeight: '700' },
  dismiss: { borderWidth: 1, borderColor: '#242c38', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  dismissText: { color: '#b9c2cf', fontSize: 12 },
})
