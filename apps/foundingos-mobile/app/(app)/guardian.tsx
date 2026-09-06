/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { fetchGuardianStatus, type GuardianStatus } from '../../lib/api'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'
import { explainGuardianWarning } from '../../lib/guardian-ai'
import { useAIAssistance } from '../../lib/ai-assistance'
import { QuantumButton, QuantumCard, QuantumLoadingScreen, QuantumNotice, QuantumScreen, QuantumSectionHeader, QuantumText, getSemanticColor, quantumSpace } from '../../components/QuantumUI'

export default function GuardianScreen() {
  const [aiEnabled] = useAIAssistance()
  const [status, setStatus] = useState<GuardianStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const data = await fetchGuardianStatus()
      if (!data) setError('Guardian requires an admin session.')
      setStatus(data)
    } catch {
      setError('Could not load Guardian. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) return <QuantumLoadingScreen />

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}>
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}
      {status ? (
        <>
          <QuantumNotice tone={status.hasIssues ? 'danger' : 'success'}>
            {status.hasIssues ? 'Guardian detected an issue. Review required.' : 'Guardian all clear.'}
          </QuantumNotice>

          <QuantumSectionHeader label="Survey feed warnings" />
          {status.surveyWarnings.length === 0 ? (
            <QuantumNotice>No warnings. Every category has submissions and every route is responding.</QuantumNotice>
          ) : (
            status.surveyWarnings.map((warning) => {
              const info = aiEnabled ? explainGuardianWarning(warning) : null
              return (
                <QuantumCard key={warning} accent={getSemanticColor('risk')}>
                  {info ? (
                    <View style={styles.aiHint}>
                      <QuantumText variant="overline" color={FOUNDINGOS_ACCENT}>AI</QuantumText>
                      <QuantumText><QuantumText variant="caption">What I noticed: </QuantumText>{info.whatINoticed}</QuantumText>
                      <QuantumText><QuantumText variant="caption">Why it matters: </QuantumText>{info.whyItMatters}</QuantumText>
                      <QuantumText><QuantumText variant="caption">What you can do: </QuantumText>{info.whatYouCanDo}</QuantumText>
                      <QuantumButton onPress={() => router.push('/(app)/superdash')}>Investigate — {info.investigateLabel}</QuantumButton>
                    </View>
                  ) : (
                    <QuantumText>{warning}</QuantumText>
                  )}
                </QuantumCard>
              )
            })
          )}

          <QuantumSectionHeader label="Core enforcement" />
          {status.coreEnforcement.map((item) => (
            <QuantumCard key={item} accent={FOUNDINGOS_ACCENT}>
              <QuantumText>{item}</QuantumText>
            </QuantumCard>
          ))}
        </>
      ) : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  aiHint: { gap: quantumSpace.sm },
})
