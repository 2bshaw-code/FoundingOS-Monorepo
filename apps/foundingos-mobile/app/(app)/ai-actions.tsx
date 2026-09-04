/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { authedFetch } from '../../lib/api'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'
import { useAIAssistance } from '../../lib/ai-assistance'

type Action = { label: string; fetchPath: string | null }

// Real NATIVE AI Actions screen — no browser, no WebView. Lists this app's real quick
// actions (from GET /api/console/ai-actions, backed by foundingos-console's own
// brand-config.ts quickActions list) — tapping a data-backed action (fetchPath set) calls
// that real endpoint and shows the actual JSON returned, in plain language; a purely
// informational action just confirms what it does (no fabricated LLM response).
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
      setResult({ label: action.label, text: `${action.label} is ready — open the relevant module to act on it.` })
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={FOUNDINGOS_ACCENT} />
      </View>
    )
  }

  if (!aiEnabled) {
    return (
      <View style={styles.center}>
        <Text style={styles.disabledTitle}>AI Assistance is turned off</Text>
        <Text style={styles.disabledText}>Turn it back on in Settings to use AI actions.</Text>
        <Pressable style={[styles.settingsLink, { borderColor: FOUNDINGOS_ACCENT }]} onPress={() => router.push('/(app)/settings')}>
          <Text style={[styles.settingsLinkText, { color: FOUNDINGOS_ACCENT }]}>Open Settings</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {actions.map((action) => (
        <Pressable
          key={action.label}
          style={[styles.actionCard, { borderColor: FOUNDINGOS_ACCENT }]}
          onPress={() => runAction(action)}
          disabled={running === action.label}
        >
          <Text style={styles.actionLabel}>{action.label}</Text>
          {running === action.label ? <ActivityIndicator color={FOUNDINGOS_ACCENT} /> : <Text style={[styles.actionArrow, { color: FOUNDINGOS_ACCENT }]}>›</Text>}
        </Pressable>
      ))}

      {result ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>{result.label}</Text>
          <Text style={styles.resultText}>{result.text}</Text>
        </View>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  error: { color: '#ff5470', fontSize: 13 },
  disabledTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  disabledText: { color: '#b9c2cf', fontSize: 13, marginBottom: 16, textAlign: 'center' },
  settingsLink: { borderWidth: 1, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 18 },
  settingsLinkText: { fontSize: 13, fontWeight: '700' },
  actionCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#11161f', borderWidth: 1, borderRadius: 14, padding: 16,
  },
  actionLabel: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  actionArrow: { fontSize: 20, fontWeight: '700' },
  resultCard: { backgroundColor: '#11161f', borderRadius: 12, padding: 14, marginTop: 8 },
  resultLabel: { color: '#ffffff', fontSize: 14, fontWeight: '700', marginBottom: 6 },
  resultText: { color: '#b9c2cf', fontSize: 12, fontFamily: 'monospace' },
})
