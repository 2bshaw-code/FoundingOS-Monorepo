/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { QuantumButton, QuantumCard, QuantumFormField, QuantumNotice, QuantumScreen, QuantumText, QuantumTextInput, quantumSpace, useActiveQuantumTheme } from '../../components/QuantumUI'
import { getMobileQuantumBrandUpliftForDemo } from '../../lib/quantum-brand-uplift'

const demoCompletedKey = (demoId: string) => `fo_demo_completed_${demoId}`

function titleFromDemoId(demoId: string) {
  return demoId.split('-').filter(Boolean).map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ')
}

export default function MobileSurveyScreen() {
  const router = useRouter()
  const { demoId: rawDemoId } = useLocalSearchParams<{ demoId?: string }>()
  const demoId = rawDemoId ?? 'marketing-suite'
  const title = titleFromDemoId(demoId)
  const theme = useActiveQuantumTheme()
  const { brand, uplift } = getMobileQuantumBrandUpliftForDemo(demoId)
  const [ready, setReady] = useState(false)
  const [answer, setAnswer] = useState('')
  const [tone, setTone] = useState<'clear' | 'confusing'>('clear')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    SecureStore.getItemAsync(demoCompletedKey(demoId)).then((completed) => {
      if (completed !== 'true') {
        router.replace(`/demo/${demoId}`)
        return
      }
      setReady(true)
    })
  }, [demoId, router])

  if (!ready) return null

  if (submitted) {
    return (
      <QuantumScreen>
        <QuantumCard accent={brand.accent ?? theme.accent} style={styles.card}>
          <QuantumText variant="h1">Survey submitted</QuantumText>
          <QuantumNotice tone="success">Thanks — your {title} feedback has been saved locally for sync.</QuantumNotice>
          <QuantumButton onPress={() => router.replace('/(app)/home')}>Back to menu</QuantumButton>
        </QuantumCard>
      </QuantumScreen>
    )
  }

  return (
    <QuantumScreen>
      <QuantumCard accent={brand.accent ?? theme.accent} style={styles.card}>
        <QuantumText variant="overline" color={brand.accent ?? theme.accent}>{uplift.icon} Demo complete</QuantumText>
        <QuantumText variant="h1">{title} survey</QuantumText>
        <QuantumNotice>Survey is unlocked because the demo was completed first.</QuantumNotice>
        <QuantumNotice>
          {brand.name} focus: {uplift.surveyRefinements.join(' ')}
        </QuantumNotice>
        <QuantumFormField label="How clear was the demo?">
          <View style={styles.choiceRow}>
            <QuantumButton tone={tone === 'clear' ? 'primary' : 'secondary'} onPress={() => setTone('clear')}>Clear</QuantumButton>
            <QuantumButton tone={tone === 'confusing' ? 'primary' : 'secondary'} onPress={() => setTone('confusing')}>Confusing</QuantumButton>
          </View>
        </QuantumFormField>
        <QuantumFormField label="What should we improve?">
          <QuantumTextInput value={answer} onChangeText={setAnswer} multiline numberOfLines={5} placeholder="Write your feedback..." />
        </QuantumFormField>
        <QuantumButton disabled={!answer.trim()} onPress={() => setSubmitted(true)}>Submit survey</QuantumButton>
      </QuantumCard>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  card: { gap: quantumSpace.md },
  choiceRow: { flexDirection: 'row', gap: quantumSpace.sm },
})
