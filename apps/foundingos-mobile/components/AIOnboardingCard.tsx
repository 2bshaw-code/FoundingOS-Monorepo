/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useAIAssistance, hasSeenOnboarding, markOnboardingSeen } from '../lib/ai-assistance'
import { QuantumButton, QuantumCard, QuantumText, quantumSpace } from './QuantumUI'

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
    <QuantumCard accent={accent}>
      <QuantumText variant="overline" color={accent}>AI onboarding</QuantumText>
      <QuantumText variant="h3">Welcome to {brandName}</QuantumText>
      <QuantumText>{description}</QuantumText>
      <View style={styles.actions}>
        {actionLabel && onDoThisForMe ? (
          <QuantumButton
            onPress={() => {
              onDoThisForMe()
              dismiss()
            }}
          >
            Do this for me — {actionLabel}
          </QuantumButton>
        ) : null}
        <QuantumButton tone="ghost" onPress={dismiss}>Got it</QuantumButton>
      </View>
    </QuantumCard>
  )
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
})
