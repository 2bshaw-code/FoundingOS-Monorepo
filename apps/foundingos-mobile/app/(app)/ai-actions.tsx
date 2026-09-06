/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { authedFetch } from '../../lib/api'
import { useAIAssistance } from '../../lib/ai-assistance'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'
import { QuantumButton, QuantumCard, QuantumLoadingScreen, QuantumNotice, QuantumScreen, QuantumText, quantumSpace } from '../../components/QuantumUI'

type Action = { label: string; fetchPath: string | null }

export default function AIActionsScreen() {
  const [aiEnabled] = useAIAssistance()
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ label: string; text: string } | null>(null)
  const [running, setRunning] = useState<string | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const response = await authedFetch('https://console.foundingos.com/api/console/ai-actions')
      if (!response.ok) {
        setError('Could not load AI actions. Your session may have expired.')
        return
      }
      const json = await response.json()
      setActions(json.actions ?? [])
    } catch {
      setError('Could not load AI actions. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function runAction(action: Action) {
    if (!action.fetchPath) {
      setResult({ label: action.label, text: `${action.label} is ready. Open the relevant module to act on it.` })
      return
    }
    setRunning(action.label)
    try {
      const response = await authedFetch(`https://console.foundingos.com${action.fetchPath}`)
      const json = await response.json()
      setResult({ label: action.label, text: JSON.stringify(json, null, 2) })
    } catch {
      setResult({ label: action.label, text: 'Could not run this action right now.' })
    } finally {
      setRunning(null)
    }
  }

  if (loading) return <QuantumLoadingScreen />

  if (!aiEnabled) {
    return (
      <QuantumScreen scroll={false} contentStyle={styles.center}>
        <QuantumCard accent={FOUNDINGOS_ACCENT}>
          <QuantumText variant="h2" align="center">AI Assistance is off</QuantumText>
          <QuantumText align="center">Turn it back on in Settings to use AI actions.</QuantumText>
          <QuantumButton onPress={() => router.push('/(app)/settings')}>Open Settings</QuantumButton>
        </QuantumCard>
      </QuantumScreen>
    )
  }

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}>
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}
      {actions.map((action) => (
        <QuantumCard key={action.label} accent={FOUNDINGOS_ACCENT}>
          <View style={styles.rowBetween}>
            <QuantumText variant="h3">{action.label}</QuantumText>
            <QuantumButton onPress={() => runAction(action)} disabled={running === action.label}>
              {running === action.label ? <ActivityIndicator color="#0A0A0A" /> : 'Run'}
            </QuantumButton>
          </View>
        </QuantumCard>
      ))}
      {result ? (
        <QuantumCard>
          <QuantumText variant="h3">{result.label}</QuantumText>
          <QuantumText variant="caption">{result.text}</QuantumText>
        </QuantumCard>
      ) : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.md },
})
