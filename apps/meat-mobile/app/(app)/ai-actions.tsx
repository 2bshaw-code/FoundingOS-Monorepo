/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { authedFetch } from '../../lib/api'
import { BRAND, GROWTH_CONSOLE_URL } from '../../lib/brand'

type Action = { label: string; fetchPath: string | null }

// Real NATIVE AI Actions screen — no browser, no WebView. Lists this brand's real quick
// actions (GET ${GROWTH_CONSOLE_URL}/api/console/ai-actions) — tapping a data-backed action
// calls that real endpoint and shows the actual JSON returned.
export default function AIActionsScreen() {
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
      const response = await authedFetch(`${GROWTH_CONSOLE_URL}/api/console/ai-actions`)
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
      const response = await authedFetch(`${GROWTH_CONSOLE_URL}${action.fetchPath}`)
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
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {actions.map((action) => (
        <Pressable
          key={action.label}
          style={[styles.actionCard, { borderColor: BRAND.accent }]}
          onPress={() => runAction(action)}
          disabled={running === action.label}
        >
          <Text style={styles.actionLabel}>{action.label}</Text>
          {running === action.label ? <ActivityIndicator color={BRAND.accent} /> : <Text style={[styles.actionArrow, { color: BRAND.accent }]}>›</Text>}
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
